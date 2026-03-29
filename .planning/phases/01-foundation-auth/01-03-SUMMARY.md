---
phase: 01-foundation-auth
plan: 03
subsystem: auth-ui
tags: [better-auth, email-otp, shadcn-ui, next.js-middleware, tailwind, hungarian-ui, dozis-branding]

# Dependency graph
requires:
  - phase: 01-foundation-auth/01
    provides: Next.js App Router scaffold, Tailwind CSS with DOZIS theme, shadcn/ui config
  - phase: 01-foundation-auth/02
    provides: better-auth server with email-otp plugin, auth client (sendVerificationOtp, verifyEmail, signOut, useSession), server-side session utilities (getSession, requireAdmin, requireProfile, maskEmail)
provides:
  - Login page at /app/login with two-step email/OTP flow
  - OTP form with 6-digit input boxes, auto-focus, paste support, auto-submit
  - Registration form at /app/register with lastName, firstName, birthYear, address fields
  - Server action for profile update (sets profileCompleted via Drizzle)
  - Next.js middleware protecting /app/* routes with session cookie check
  - App shell with header (DOZIS branding, admin link, sign out)
  - Admin layout with requireAdmin role guard at /app/admin/*
  - Dashboard page with profile completion redirect
affects: [02-events-registration, 03-checkin-loyalty-admin, 04-branding-ux]

# Tech tracking
tech-stack:
  added: [@radix-ui/react-label, @radix-ui/react-slot]
  patterns: [shadcn/ui component usage (Button, Input, Card, Label), Next.js middleware for route protection, Server Actions for profile mutations, Drizzle direct update for input:false fields]

key-files:
  created: [components/auth/login-form.tsx, components/auth/otp-form.tsx, components/auth/register-form.tsx, app/app/login/page.tsx, app/app/register/page.tsx, app/app/register/actions.ts, middleware.ts, components/app/app-shell.tsx, components/app/app-header.tsx, app/app/admin/layout.tsx, app/app/admin/page.tsx, components/ui/button.tsx, components/ui/input.tsx, components/ui/card.tsx, components/ui/label.tsx]
  modified: [app/app/layout.tsx, app/app/page.tsx, package.json, package-lock.json]

key-decisions:
  - "Used Server Action + Drizzle for profile update instead of better-auth client updateUser (profileCompleted has input:false, cannot be set via client API)"
  - "Used verifyEmail from auth-client (actual export name) rather than verifyOtp (plan used incorrect name)"
  - "Inline maskEmail in OTP form (client-side) rather than importing server-side maskEmail utility to avoid client/server boundary issue"

patterns-established:
  - "Auth form components: 'use client' in components/auth/, used by page.tsx wrappers"
  - "Server Actions for mutations: app/app/register/actions.ts pattern for form submissions"
  - "App shell pattern: layout.tsx (server) -> AppShell (client) -> AppHeader (client) for session-aware UI"
  - "Route protection: middleware.ts for fast cookie check, layout.tsx for full session validation, page.tsx for role/profile checks"

requirements-completed: [AUTH-04, AUTH-05]

# Metrics
duration: 6min
completed: 2026-03-29
---

# Phase 01 Plan 03: Auth UI & Route Protection Summary

**Login page with email/OTP two-step flow, registration form with profile completion, Next.js middleware protecting /app/* routes, admin layout with role guard, and DOZIS-branded dark theme UI in Hungarian**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-29T15:29:35Z
- **Completed:** 2026-03-29T15:35:41Z
- **Tasks:** 2 of 2 auto tasks completed (Task 3 is checkpoint:human-verify, pending)
- **Files modified:** 19

## Accomplishments
- Login page at /app/login with two-step flow: email input then 6-digit OTP code entry with auto-focus, paste support, and auto-submit
- Registration form at /app/register collecting lastName, firstName, birthYear, address with client-side validation and server action profile update
- Next.js middleware protecting all /app/* routes with session cookie check and callbackUrl preservation
- Admin layout at /app/admin with requireAdmin role guard blocking regular users
- Dashboard page redirecting new users to registration, showing greeting for returning users
- All UI text in Hungarian with DOZIS dark theme (amber accents, zinc backgrounds, Anton/Montserrat fonts)

## Task Commits

Each task was committed atomically:

1. **Task 1: Login page + registration form components** - `8e3eb35` (feat)
2. **Task 2: Auth middleware + admin protection + dashboard shell** - `ec6817d` (feat)
3. **Task 3: Verify complete auth flow end-to-end** - Pending human verification

## Files Created/Modified
- `components/auth/login-form.tsx` - Email input form with sendVerificationOtp call
- `components/auth/otp-form.tsx` - 6-digit OTP input with auto-focus, paste, auto-submit, masked email display
- `components/auth/register-form.tsx` - Profile form (lastName, firstName, birthYear, address) with client validation
- `app/app/login/page.tsx` - Two-step login page (email -> OTP) with session redirect
- `app/app/register/page.tsx` - Server component wrapper checking session and profileCompleted
- `app/app/register/actions.ts` - Server action for profile update via Drizzle (sets profileCompleted)
- `middleware.ts` - Route protection for /app/* with session cookie check and callbackUrl
- `components/app/app-shell.tsx` - App wrapper with header and main content area
- `components/app/app-header.tsx` - Header with DOZIS branding, admin link, sign out button
- `app/app/layout.tsx` - Session check and AppShell rendering
- `app/app/page.tsx` - Dashboard with profile redirect and placeholder feature cards
- `app/app/admin/layout.tsx` - Admin role guard via requireAdmin
- `app/app/admin/page.tsx` - Admin dashboard placeholder
- `components/ui/button.tsx` - shadcn/ui Button component
- `components/ui/input.tsx` - shadcn/ui Input component
- `components/ui/card.tsx` - shadcn/ui Card component
- `components/ui/label.tsx` - shadcn/ui Label component
- `package.json` - Added shadcn/ui dependencies (@radix-ui/react-label, @radix-ui/react-slot)

## Decisions Made
- Used Server Action + Drizzle direct update for profile registration instead of better-auth's client-side `updateUser` -- the `profileCompleted` field has `input: false` in the auth config, preventing it from being set via the client API. Drizzle bypasses this restriction server-side.
- Used `verifyEmail` (the actual auth-client export) rather than `verifyOtp` (plan referenced an incorrect method name)
- Implemented `maskEmail` inline in the OTP form component to avoid importing the server-side utility across the client/server boundary

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Used correct auth-client export name verifyEmail instead of verifyOtp**
- **Found during:** Task 1 (OTP form creation)
- **Issue:** Plan specified `verifyOtp` but auth-client.ts exports `verifyEmail` from `authClient.emailOtp`
- **Fix:** Used `verifyEmail` in otp-form.tsx
- **Files modified:** components/auth/otp-form.tsx
- **Verification:** TypeScript compiles cleanly
- **Committed in:** 8e3eb35

**2. [Rule 3 - Blocking] Used Drizzle direct update instead of better-auth updateUser for profile**
- **Found during:** Task 1 (register form creation)
- **Issue:** `authClient.updateUser()` doesn't accept `profileCompleted` because it has `input: false` in better-auth config. TypeScript error TS2353.
- **Fix:** Created server action using Drizzle ORM to update user table directly, bypassing better-auth's input restriction
- **Files modified:** app/app/register/actions.ts, components/auth/register-form.tsx
- **Verification:** TypeScript compiles cleanly, profileCompleted is set server-side
- **Committed in:** 8e3eb35

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes were necessary for correct operation. The Drizzle approach is actually more secure (server-side only). No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## Known Stubs

- `app/app/page.tsx:30,34` - "Hamarosan..." placeholder for Esemenyek and Husegprogram cards (intentional, Phase 2 and 3 will implement these features)
- `app/app/admin/page.tsx:8` - "Esemeny- es vendegkezeles - hamarosan." placeholder (intentional, Phase 3 will implement admin features)

## Checkpoint Status

**Task 3 (checkpoint:human-verify)** is pending human verification. The full auth flow needs end-to-end testing:
1. Visit /app -> redirects to /app/login
2. Enter email, receive OTP, enter code
3. New user sees registration form at /app/register
4. After profile completion, redirected to /app dashboard
5. Admin role check on /app/admin
6. Sign out via header button

**Prerequisites for verification:**
- RESEND_API_KEY set in `.dev.vars`
- D1 database created locally: `wrangler d1 create dozis-db --location=weur`
- Migrations applied: `npm run db:migrate:local`

## User Setup Required
- Resend domain setup (SPF/DKIM/DMARC for dozis.hu) needed before OTP emails deliver
- D1 database must be created and migrations applied for auth to work
- BETTER_AUTH_SECRET must be set in `.dev.vars`

## Next Phase Readiness
- Complete auth UI and route protection ready for Phase 2 (Events + Registration)
- Auth flow needs human verification (Task 3 checkpoint pending)
- Dashboard placeholder cards ready to be replaced with real event and loyalty data
- Admin layout ready for event management UI in Phase 3

## Self-Check: PASSED

All 15 created files verified present. Both task commits (8e3eb35, ec6817d) verified in git log. TypeScript compiles cleanly (npx tsc --noEmit exits 0).

---
*Phase: 01-foundation-auth*
*Completed: 2026-03-29*
