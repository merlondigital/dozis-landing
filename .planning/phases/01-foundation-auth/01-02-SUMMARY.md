---
phase: 01-foundation-auth
plan: 02
subsystem: auth
tags: [better-auth, email-otp, resend, cloudflare-d1, drizzle, next.js, rate-limiting]

# Dependency graph
requires:
  - phase: 01-foundation-auth/01
    provides: Next.js App Router scaffold, Drizzle schema (user, session, account, verification), D1 database binding
provides:
  - better-auth server instance with email-otp plugin and rate limiting
  - Resend OTP email sender with DOZIS branded HTML template in Hungarian
  - Next.js catch-all API route at /api/auth/* delegating to better-auth
  - React auth client with emailOtp methods (sendVerificationOtp, verifyEmail, signIn.emailOtp)
  - Server-side session utilities (getSession, requireAdmin, requireProfile)
  - maskEmail utility for partially masked email display
  - Typed CloudflareEnv augmentation (DB, RESEND_API_KEY, BETTER_AUTH_SECRET, ADMIN_EMAILS)
affects: [01-foundation-auth/03, 02-events-registration, 03-checkin-loyalty-admin]

# Tech tracking
tech-stack:
  added: [resend]
  patterns: [per-request auth instance via getCloudflareContext(), toNextJsHandler for Next.js route delegation, nextCookies plugin for proper cookie handling, emailOTP plugin with allowedAttempts + rateLimit for AUTH-02 compliance]

key-files:
  created: [src/lib/auth.ts, src/lib/auth-client.ts, src/lib/auth-utils.ts, src/lib/email.ts, src/env.ts, app/api/auth/[...all]/route.ts]
  modified: [package.json, package-lock.json]

key-decisions:
  - "Used toNextJsHandler + nextCookies from better-auth/next-js for proper Next.js integration instead of raw handler delegation"
  - "Used emailOTP plugin's built-in allowedAttempts (5) + rateLimit (5 sends/15min) for AUTH-02 compliance"
  - "Augmented global CloudflareEnv interface instead of creating separate type for Cloudflare bindings"
  - "Created per-request auth instance via getCloudflareContext() (sync overload) for Cloudflare env access"

patterns-established:
  - "Auth instance creation: createAuth(env) called per-request to access Cloudflare bindings"
  - "CloudflareEnv augmentation: declare global interface in src/env.ts, import for side-effect"
  - "Server-side session access: getSession() using auth.api.getSession with Next.js headers()"
  - "Client auth: authClient.emailOtp.sendVerificationOtp/verifyEmail for OTP flow"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, INFR-04]

# Metrics
duration: 5min
completed: 2026-03-29
---

# Phase 01 Plan 02: Auth Engine Summary

**better-auth server with email-otp plugin, Resend DOZIS-branded OTP emails, per-email rate limiting (5 attempts/15min), and React auth client with session utilities**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-29T15:19:31Z
- **Completed:** 2026-03-29T15:25:09Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Configured better-auth server with email-otp plugin (6-digit OTP, 5-min expiry, 30-day sessions) and drizzle adapter for D1
- AUTH-02 rate limiting enforced via emailOTP plugin: 5 allowed verification attempts per OTP + 5 OTP send requests per email per 15-minute window
- DOZIS-branded Hungarian OTP email template with dark theme, amber accents, and prominent code display via Resend
- React auth client with emailOTPClient plugin providing sendVerificationOtp, verifyEmail, signIn.emailOtp, useSession, signOut
- Server-side utilities: getSession, requireAdmin, requireProfile, maskEmail

## Task Commits

Each task was committed atomically:

1. **Task 1: better-auth server config + Resend OTP email + rate limiting** - `0b3f884` (feat)
2. **Task 2: Auth client + session utilities** - `8e139ce` (feat)

## Files Created/Modified
- `src/lib/auth.ts` - better-auth server instance with email-otp plugin, drizzle adapter, rate limiting, user additionalFields
- `src/lib/auth-client.ts` - React auth client with emailOTPClient plugin, re-exports useSession/signOut/OTP methods
- `src/lib/auth-utils.ts` - Server-side getSession, requireAdmin, requireProfile, maskEmail utilities
- `src/lib/email.ts` - Resend OTP email sender with DOZIS-branded HTML template in Hungarian
- `src/env.ts` - Global CloudflareEnv interface augmentation (DB, RESEND_API_KEY, BETTER_AUTH_SECRET, ADMIN_EMAILS)
- `app/api/auth/[...all]/route.ts` - Next.js catch-all API route with per-request auth via getCloudflareContext
- `package.json` - Added resend dependency
- `package-lock.json` - Updated lockfile

## Decisions Made
- Used `toNextJsHandler` + `nextCookies` from `better-auth/next-js` for proper Next.js cookie integration instead of raw handler delegation — nextCookies ensures set-cookie headers are properly forwarded through Next.js cookie API
- Used emailOTP plugin's built-in `allowedAttempts: 5` and `rateLimit: { window: 900, max: 5 }` for AUTH-02 compliance — the plugin natively supports per-path rate limiting, no custom middleware needed
- Used `getCloudflareContext()` sync overload (not async) — the sync version works in route handlers and avoids unnecessary async wrapper
- Augmented the global `CloudflareEnv` interface from @opennextjs/cloudflare rather than creating a separate type — this integrates cleanly with getCloudflareContext's return type

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed auth route handler pattern for per-request env access**
- **Found during:** Task 1 (API route creation)
- **Issue:** Plan suggested passing auth object directly to toNextJsHandler, but auth instance must be created per-request to access Cloudflare env bindings
- **Fix:** Created handleAuthRequest function that calls getCloudflareContext() + createAuth() per-request, passed as function to toNextJsHandler
- **Files modified:** app/api/auth/[...all]/route.ts
- **Verification:** TypeScript compiles cleanly
- **Committed in:** 0b3f884

**2. [Rule 2 - Missing Critical] Added nextCookies plugin for Next.js cookie handling**
- **Found during:** Task 1 (better-auth server config)
- **Issue:** Plan didn't include nextCookies plugin — without it, set-cookie headers from better-auth won't be properly forwarded through Next.js cookie API, breaking session persistence
- **Fix:** Added `nextCookies()` plugin to better-auth config and `toNextJsHandler` for route export
- **Files modified:** src/lib/auth.ts, app/api/auth/[...all]/route.ts
- **Verification:** TypeScript compiles cleanly, better-auth docs confirm nextCookies is required for Next.js
- **Committed in:** 0b3f884

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical)
**Impact on plan:** Both fixes essential for correct auth operation on Next.js. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## Known Stubs
None - all code is fully wired and functional (pending Resend domain setup for actual email delivery).

## User Setup Required
- Resend domain setup (SPF/DKIM/DMARC for dozis.hu) needed before OTP emails deliver
- `wrangler secret put RESEND_API_KEY` with the Resend API key
- `wrangler secret put BETTER_AUTH_SECRET` with a random secret
- `BETTER_AUTH_URL` env var needs to be set to the production URL

## Next Phase Readiness
- Auth engine complete, ready for login/registration UI (Plan 03)
- Auth client exports all methods needed for OTP flow UI
- Server-side session utilities ready for middleware and Server Components
- D1 database + Drizzle schema from Plan 01 ready for auth operations

## Self-Check: PASSED

All 6 created files verified present. All 2 task commits verified in git log.

---
*Phase: 01-foundation-auth*
*Completed: 2026-03-29*
