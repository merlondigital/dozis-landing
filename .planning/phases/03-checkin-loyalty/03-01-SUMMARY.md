---
phase: 03-checkin-loyalty
plan: 01
subsystem: database, api
tags: [drizzle, d1, server-actions, check-in, loyalty, hmac, qr]

# Dependency graph
requires:
  - phase: 02-events-registration
    provides: "registration + event schema, QR token HMAC signing/verification, Server Actions pattern"
provides:
  - "checkedInBy column on registration table"
  - "attendanceCount column on user table"
  - "checkInByToken Server Action with HMAC verification and loyalty logic"
  - "manualCheckInByRegistrationId Server Action for fallback check-in"
  - "getEventGuests query helper (joined registration+user data)"
  - "getEventStats query helper (registered/checked-in/no-show counts)"
  - "getUserLoyalty query helper (attendance progress 0-4)"
  - "getEventRegistrationCounts query helper (bulk counts)"
  - "registerForEvent auto-marks isFree=true when attendanceCount >= 4"
affects: [03-02, 03-03, 04-branding-ux]

# Tech tracking
tech-stack:
  added: []
  patterns: ["shared performCheckIn helper for DRY check-in logic", "loyalty cycle: increment on check-in, reset on free event, auto-mark at registration"]

key-files:
  created:
    - src/lib/checkin/actions.ts
    - src/lib/checkin/queries.ts
    - migrations/0002_checkin_loyalty.sql
  modified:
    - src/db/schema.ts
    - src/lib/events/actions.ts
    - migrations/meta/_journal.json
    - migrations/meta/0002_snapshot.json

key-decisions:
  - "Shared performCheckIn helper to DRY QR and manual check-in flows"
  - "Loyalty isFree marking happens at registration time (not check-in), counter reset happens at free event check-in"

patterns-established:
  - "Check-in module at src/lib/checkin/ separate from events module"
  - "Loyalty cycle: attendanceCount 0-4, isFree set at registration when count >= 4, reset to 0 on free check-in"

requirements-completed: [CHKN-03, LOYL-02, LOYL-03]

# Metrics
duration: 4min
completed: 2026-03-29
---

# Phase 3 Plan 01: Check-In Data Layer Summary

**Check-in Server Actions with HMAC QR verification, loyalty cycle (increment/free-mark/reset), and admin query helpers for guest list and analytics**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-29T19:17:52Z
- **Completed:** 2026-03-29T19:21:54Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Schema migration adding `checkedInBy` (admin reference) to registration and `attendanceCount` (loyalty counter) to user table
- Full check-in Server Actions: HMAC-verified QR check-in and manual fallback, with duplicate/cancelled rejection
- Complete loyalty cycle: increment on check-in, auto-mark isFree at registration when count >= 4, reset to 0 on free event check-in
- Query helpers for guest list (joined data), event stats (registered/checked-in/no-show), user loyalty progress, and bulk registration counts

## Task Commits

Each task was committed atomically:

1. **Task 1: Schema migration** - `314b085` (feat)
2. **Task 2: Check-in actions + query helpers + registerForEvent loyalty** - `493a12e` (feat)

## Files Created/Modified
- `src/db/schema.ts` - Added checkedInBy on registration, attendanceCount on user
- `migrations/0002_checkin_loyalty.sql` - ALTER TABLE for new columns
- `migrations/meta/_journal.json` - Updated migration journal
- `migrations/meta/0002_snapshot.json` - Migration snapshot
- `src/lib/checkin/actions.ts` - checkInByToken, manualCheckInByRegistrationId with loyalty logic
- `src/lib/checkin/queries.ts` - getEventGuests, getEventStats, getUserLoyalty, getEventRegistrationCounts
- `src/lib/events/actions.ts` - registerForEvent now checks attendanceCount >= 4 and sets isFree=true

## Decisions Made
- **Shared performCheckIn helper**: Both QR and manual check-in use the same core logic to avoid duplication and ensure consistent loyalty handling
- **Loyalty marking at registration time**: isFree is set when the user registers (checking attendanceCount >= 4), not at check-in time. The counter reset happens at check-in of the free event.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All Server Actions and query helpers are exported and ready for UI consumption
- Plan 03-02 (QR scanner page) can import checkInByToken and manualCheckInByRegistrationId
- Plan 03-03 (guest list, loyalty card) can import getEventGuests, getEventStats, getUserLoyalty, getEventRegistrationCounts

## Self-Check: PASSED

All 6 files verified present. Both task commits (314b085, 493a12e) verified in git log.

---
*Phase: 03-checkin-loyalty*
*Completed: 2026-03-29*
