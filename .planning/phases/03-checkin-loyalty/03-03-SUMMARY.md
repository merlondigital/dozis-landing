---
phase: 03-checkin-loyalty
plan: 03
subsystem: ui, admin, loyalty
tags: [guest-list, loyalty-card, admin-events, search, manual-checkin]

# Dependency graph
requires:
  - phase: 03-checkin-loyalty
    plan: 01
    provides: "getEventGuests, getEventStats, getUserLoyalty, getEventRegistrationCounts, manualCheckInByRegistrationId"
provides:
  - "Guest list page at /app/admin/events/[id]/guests with stats, search, manual check-in"
  - "Loyalty progress card (5-dot visual with next-free indicator)"
  - "Enhanced admin event list with registration/check-in counts and quick links"
affects: [04-branding-ux]

# Tech tracking
tech-stack:
  added: []
  patterns: ["client-side search filtering with useState", "Map-to-plain-object serialization at Server/Client boundary"]

key-files:
  created:
    - components/admin/guest-list.tsx
    - components/loyalty/loyalty-card.tsx
    - app/app/admin/events/[id]/guests/page.tsx
  modified:
    - components/admin/event-list.tsx
    - app/app/page.tsx
    - app/app/admin/events/page.tsx

key-decisions:
  - "Map serialized to plain Record<string, {registered, checkedIn}> at server/client boundary for EventList counts prop"
  - "Admin dashboard not modified beyond existing events link (scanner/guest links are per-event in event list)"

patterns-established:
  - "Stats header pattern: grid of stat cards with icon + label + value"
  - "Client-side table filtering with search input"

requirements-completed: [ADMN-01, ADMN-02, ADMN-03, LOYL-01, CHKN-04]

# Metrics
duration: 3min
completed: 2026-03-29
---

# Phase 3 Plan 03: Guest List, Loyalty Card & Admin Event List Summary

**Admin guest management page with stats/search/manual-checkin, user loyalty 5-dot progress card, admin event list with per-event counts and quick links (Szkenner/Vendeglista/Szerkesztes)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-29T19:26:54Z
- **Completed:** 2026-03-29T19:30:46Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Guest list page at /app/admin/events/[id]/guests with 4-stat header (registered, checked-in, no-shows, check-in rate), search by name/email, table with all columns, manual check-in button with optimistic update, INGYENES badge for free registrations
- Loyalty card component showing 5-dot cycle progress, filled amber dots for completed events, gift icon on 5th dot, "Kovetkezo ingyenes!" label at 4/5, encouragement text at 0/5
- User dashboard loyalty placeholder replaced with real LoyaltyCard fed by getUserLoyalty
- Admin event list enhanced with per-event registration/check-in count line and 4 action buttons: Szkenner, Vendeglista, Szerkesztes, Torles (all with lucide-react icons)
- Admin events page fetches bulk counts via getEventRegistrationCounts and passes as serialized object

## Task Commits

Each task was committed atomically:

1. **Task 1: Guest list page** - `1cd4930` (feat)
2. **Task 2: Loyalty card + enhanced event list + dashboard updates** - `4273008` (feat)

## Files Created/Modified
- `components/admin/guest-list.tsx` - Client component: stats header, search, guest table, manual check-in
- `app/app/admin/events/[id]/guests/page.tsx` - Server component: admin-gated guest list page route
- `components/loyalty/loyalty-card.tsx` - Server component: 5-dot loyalty progress with next-free indicator
- `components/admin/event-list.tsx` - Enhanced with counts prop and 4 quick-link buttons (Szkenner, Vendeglista, Szerkesztes, Torles)
- `app/app/page.tsx` - Replaced loyalty placeholder with real LoyaltyCard, added getUserLoyalty call
- `app/app/admin/events/page.tsx` - Added getEventRegistrationCounts call, passes counts to EventList

## Decisions Made
- **Map serialization at boundary**: getEventRegistrationCounts returns a Map, serialized to Record<string, ...> before passing to client EventList component
- **Admin dashboard unchanged**: Scanner and guest links are per-event in the event list, no additional dashboard modifications needed

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None - all components receive real data from query helpers created in Plan 01.

## Next Phase Readiness
- Phase 3 UI is complete: QR scanner (Plan 02), guest list (Plan 03), loyalty card (Plan 03) all wired to data layer (Plan 01)
- Phase 4 (Branding & UX Polish) can proceed to style all new components with DOZIS visual identity

## Self-Check: PASSED
