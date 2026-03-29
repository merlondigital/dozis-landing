# Phase 1: Foundation & Auth - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Full-stack infrastructure setup and email OTP authentication. Users can register via email OTP, complete a mandatory profile form on first login, and access the app. Admin users are identified by a role field in the database. The entire app runs on Next.js with @opennextjs/cloudflare adapter on Cloudflare Workers + D1.

</domain>

<decisions>
## Implementation Decisions

### Stack (CRITICAL CHANGE from original plan)
- **D-01:** Next.js App Router with @opennextjs/cloudflare adapter replaces the original Vite + Hono stack
- **D-02:** File-system routing replaces React Router; Server Actions replace Hono API routes for mutations; Next.js API Routes (`/api/*`) for better-auth and webhooks
- **D-03:** D1, Drizzle ORM, better-auth (email-otp plugin), and Resend remain unchanged
- **D-04:** TypeScript throughout (full TSX) — no JSX legacy code
- **D-05:** PWA compatible (manifest.json, service worker basics in Phase 1, full offline support in later phases)

### App <-> Landing Page Integration
- **D-06:** Single project, route-based: `/` = landing page, `/app/*` = authenticated app, `/api/*` = API routes
- **D-07:** Landing page components migrated from JSX/CSS Modules to TSX/Tailwind during Phase 1 setup
- **D-08:** One wrangler.jsonc, one Next.js config, one deploy

### Auth Flow UX
- **D-09:** Single-page login at `/app/login`: Step 1 = email input, Step 2 = 6-digit OTP code entry
- **D-10:** No separate registration page — new users auto-created on first OTP verification
- **D-11:** After first login, new users see a mandatory registration form: lastName, firstName, birthYear, address — all required, cannot proceed without completing
- **D-12:** Returning users go directly to `/app/` (dashboard)
- **D-13:** Admin users (role=admin in D1) see admin panel at `/app/admin`
- **D-14:** "Új kód kérése" (resend OTP) button on the code entry step
- **D-15:** Email partially masked on OTP step (m***@gmail.com)

### Session & Security
- **D-16:** Session duration: 30 days (HttpOnly cookie)
- **D-17:** OTP: 6-digit code, 5-minute expiry, max 5 attempts per email per 15 minutes (per REQUIREMENTS AUTH-02)
- **D-18:** Redirect to original target URL after login (default: `/app/`)

### Admin Management
- **D-19:** Admin identified by `role` field in users table (D1), not environment variable
- **D-20:** Initial admin users seeded via migration or manual D1 insert (POLOSAI, PETRUS, DAVE emails)
- **D-21:** Admin middleware on `/app/admin/*` routes and admin API endpoints

### Styling
- **D-22:** Tailwind CSS + shadcn/ui component library
- **D-23:** DOZIS theme: dark mode default, amber + blue accents, zinc backgrounds
- **D-24:** Anton (display) + Montserrat (body) fonts via next/font
- **D-25:** shadcn/ui customized with DOZIS CSS variables (full branding polish in Phase 4)

### OTP Email
- **D-26:** Minimally branded HTML email: DOZIS logo, dark background, amber accent, 6-digit code prominently displayed
- **D-27:** Hungarian text: "A belépési kódod:", 5-minute expiry note, "Ha nem te kérted, hagyd figyelmen kívül"
- **D-28:** Resend API key stored as wrangler secret (RESEND_API_KEY)

### Claude's Discretion
- Database schema details (table structure, indexes, constraints) — follow Drizzle + D1 best practices
- Next.js + @opennextjs/cloudflare configuration specifics
- better-auth integration patterns with Next.js App Router
- shadcn/ui component selection and customization approach
- PWA manifest and service worker implementation details

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `.planning/PROJECT.md` — Project vision, constraints, key decisions
- `.planning/REQUIREMENTS.md` — AUTH-01 through AUTH-05, INFR-01 through INFR-04
- `.planning/ROADMAP.md` — Phase 1 success criteria and requirement mapping

### Stack Research
- `CLAUDE.md` — Technology stack recommendations (NOTE: stack changed from Vite+Hono to Next.js, but D1/Drizzle/better-auth/Resend recommendations still apply)

### External Docs (for researcher)
- @opennextjs/cloudflare docs — Next.js on Cloudflare Workers setup
- better-auth email-otp plugin — OTP configuration with Next.js
- better-auth + Cloudflare D1 — D1 adapter setup
- shadcn/ui — Component installation with Next.js
- Drizzle ORM + D1 — Schema and migration setup

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/DozisLogo/` — DOZIS logo component (needs JSX→TSX migration)
- `src/components/GrainOverlay/` — Grain texture overlay (DOZIS aesthetic, reuse in app)
- `src/components/SwirlingBg/` — Animated background (reuse selectively)
- `src/styles/variables.css` — DOZIS color values (reference for Tailwind config)
- `src/hooks/useScrollReveal.js` — Scroll animation hook (landing only)

### Established Patterns
- Current app is pure client-side React 19 + Vite 8
- CSS Modules for styling (will migrate to Tailwind)
- No backend, no auth, no database — all greenfield for Phase 1

### Integration Points
- Landing page at `/` must continue working after Next.js migration
- `public/` directory assets (images, fonts) carry over
- Existing `index.html` entry replaced by Next.js `app/layout.tsx`

</code_context>

<specifics>
## Specific Ideas

- Login flow mockup: single page with step animation (email → OTP code boxes)
- Email partially masked on OTP step for security feel
- Registration form after first login — feels like onboarding, not a separate signup process
- DOZIS branded OTP email (dark + amber, not generic white template)
- Resend API key already available: `re_XXhs7nG1_JJctyfxRy9DYeSihUenAFBW6`

</specifics>

<deferred>
## Deferred Ideas

- Full PWA offline support (service worker caching, offline QR display) — Phase 3-4
- DOZIS spray-paint aesthetic and full branding polish — Phase 4
- Landing page visual migration to match app design system — Phase 4

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-auth*
*Context gathered: 2026-03-29*
