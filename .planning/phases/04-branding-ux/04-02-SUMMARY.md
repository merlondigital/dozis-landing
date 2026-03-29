---
phase: 04-branding-ux
plan: 02
subsystem: ui
tags: [gdpr, legal, privacy, cookies, terms, hungarian, footer]

# Dependency graph
requires:
  - phase: 01-foundation-auth
    provides: middleware.ts auth route protection, app-shell layout
provides:
  - "Hungarian GDPR privacy policy page at /legal/privacy"
  - "Cookie policy page at /legal/cookies"
  - "Terms of service (ASZF) page at /legal/terms"
  - "Legal layout with DOZIS branding"
  - "App footer with legal links on all app pages"
  - "Landing page footer with legal links"
  - "Public /legal/* route access in middleware"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Legal page layout with shared cross-links footer"
    - "AppShell flex-col with sticky footer pattern"

key-files:
  created:
    - app/legal/layout.tsx
    - app/legal/privacy/page.tsx
    - app/legal/cookies/page.tsx
    - app/legal/terms/page.tsx
    - components/app/app-footer.tsx
  modified:
    - middleware.ts
    - components/app/app-shell.tsx
    - components/landing/footer.tsx

key-decisions:
  - "Natural person (termeszetes szemely) as data controller with placeholder fields"
  - "No cookie banner needed — only essential cookies (ePrivacy Art 5(3) exemption)"
  - "AppShell uses flex-col layout for sticky footer positioning"

patterns-established:
  - "Legal pages: server components with static Hungarian content, shared layout"
  - "Footer pattern: AppFooter in AppShell for all /app/* pages"

requirements-completed: [INFR-05]

# Metrics
duration: 4min
completed: 2026-03-29
---

# Phase 04 Plan 02: Legal Pages Summary

**Hungarian GDPR legal pages (privacy, cookies, ASZF) with natural person data controller, app footer, and public route access**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-29T19:46:08Z
- **Completed:** 2026-03-29T19:50:57Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Three Hungarian GDPR-compliant legal pages (privacy policy, cookie policy, terms of service) at /legal/* routes
- Privacy policy identifies natural person as data controller with placeholder fields for real data
- Cookie policy documents only essential session cookies, explains why no cookie banner needed
- Terms of service covers event registration, QR codes, loyalty program, Hungarian law jurisdiction
- App footer with legal links on every app page via AppShell
- Landing page footer updated with legal page links

## Task Commits

Each task was committed atomically:

1. **Task 1: Legal pages layout, privacy policy, cookie policy, and terms of service** - `bbf7932` (feat)
2. **Task 2: App footer with legal links + landing page footer update** - `ac2945c` (feat)

## Files Created/Modified
- `app/legal/layout.tsx` - Shared legal page layout with DOZIS branding, nav, cross-links
- `app/legal/privacy/page.tsx` - Adatvedelmi Tajekoztato (GDPR Privacy Policy)
- `app/legal/cookies/page.tsx` - Cookie (Suti) Szabalyzat
- `app/legal/terms/page.tsx` - Altalanos Szerzodesi Feltetelek (ASZF)
- `components/app/app-footer.tsx` - Footer component with 3 legal links for app pages
- `middleware.ts` - Added /legal to public route bypass
- `components/app/app-shell.tsx` - Imported AppFooter, flex-col layout for sticky footer
- `components/landing/footer.tsx` - Added legal links row with dot separators

## Decisions Made
- Used natural person (termeszetes szemely) as data controller with placeholder fields ([Teljes Nev], [Email cim], [Lakcim]) — user fills in real data before launch
- No cookie banner — only strictly necessary cookies used (ePrivacy Directive Article 5(3) exemption)
- AppShell changed to flex-col layout to support sticky footer without extra CSS

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

- `app/legal/privacy/page.tsx` lines 33-35 — `[Teljes Nev]`, `[Email cim]`, `[Lakcim]` placeholder for data controller personal details (intentional, user must fill before launch)
- `app/legal/terms/page.tsx` lines 25-27 — Same placeholders for service provider details (intentional, same reason)

These stubs are intentional: the data controller is a natural person whose real name and address must be provided by the project owner. They do not block the plan's goal.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required. User must replace data controller placeholder fields with real data before production launch.

## Next Phase Readiness
- Legal compliance pages complete, accessible without auth
- Footer links wired into all app pages and landing page
- Ready for Phase 04 Plan 03 (remaining branding/UX polish)

## Self-Check: PASSED

All 8 files verified present. Both task commits (bbf7932, ac2945c) verified in git log.

---
*Phase: 04-branding-ux*
*Completed: 2026-03-29*
