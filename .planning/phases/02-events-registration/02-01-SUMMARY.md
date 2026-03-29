---
phase: 02-events-registration
plan: 01
subsystem: database
tags: [drizzle, zod, hmac, qr-token, server-actions, d1, sqlite]

requires:
  - phase: 01-foundation-auth
    provides: "User table, auth utilities (getSession, requireAdmin), CloudflareEnv types"
provides:
  - "Event and registration Drizzle schema tables"
  - "D1 migration for event + registration tables"
  - "Zod validation schemas for event CRUD"
  - "HMAC-SHA256 QR token generation and verification"
  - "Server Actions: createEvent, updateEvent, deleteEvent, registerForEvent, cancelRegistration"
  - "Query helpers: getUpcomingEvents, getEventById, getUserRegistration"
affects: [02-02, 02-03, 03-checkin-loyalty]

tech-stack:
  added: [zod@4.3.6]
  patterns: [hmac-qr-tokens, server-action-mutations, drizzle-schema-extension]

key-files:
  created:
    - src/lib/events/qr.ts
    - src/lib/events/actions.ts
    - src/lib/events/validation.ts
    - migrations/0001_daily_spectrum.sql
  modified:
    - src/db/schema.ts
    - package.json

key-decisions:
  - "Used crypto.subtle.verify() for timing-safe HMAC comparison instead of === string comparison"
  - "QR token format: registrationId:eventId:userId:hmacHex using BETTER_AUTH_SECRET as key"
  - "Drizzle unique() constraint on (eventId, userId) for duplicate registration prevention"

patterns-established:
  - "Event Server Action pattern: requireAdmin/getSession -> validate -> getCloudflareContext -> getDb -> query -> revalidatePath"
  - "QR token signing: HMAC-SHA256 via Web Crypto API, timing-safe verify"

requirements-completed: [EVNT-01, EVNT-02, EVNT-03, REGN-02, REGN-04]

duration: 4min
completed: 2026-03-29
---

# Phase 2 Plan 01: Events + Registration Data Layer Summary

**Drizzle event/registration schema with HMAC-signed QR tokens, Zod validation, and 8 Server Actions for full event CRUD and registration lifecycle**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-29T16:06:18Z
- **Completed:** 2026-03-29T16:10:13Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Event and registration tables added to Drizzle schema with UNIQUE constraint preventing duplicate registrations
- HMAC-SHA256 QR token generation and timing-safe verification using Web Crypto API
- 5 Server Actions (createEvent, updateEvent, deleteEvent, registerForEvent, cancelRegistration) with proper auth checks
- 3 query helpers (getUpcomingEvents, getEventById, getUserRegistration) for UI consumption
- Zod v4 validation schemas with Hungarian error messages for event creation/editing
- D1 migration SQL generated for both new tables

## Task Commits

Each task was committed atomically:

1. **Task 1: Event + Registration Drizzle schema, migration, and validation** - `38d9442` (feat)
2. **Task 2: QR token HMAC signing and Server Actions for event CRUD + registration** - `8238e46` (feat)

## Files Created/Modified
- `src/db/schema.ts` - Extended with event and registration table definitions
- `src/lib/events/validation.ts` - Zod schemas for createEvent and updateEvent inputs
- `src/lib/events/qr.ts` - HMAC-SHA256 QR token generation and timing-safe verification
- `src/lib/events/actions.ts` - 5 Server Actions + 3 query helpers with auth checks
- `migrations/0001_daily_spectrum.sql` - D1 migration for event and registration tables
- `package.json` - Added zod dependency

## Decisions Made
- Used `crypto.subtle.verify()` for timing-safe HMAC comparison (flagged by plan checker as security requirement)
- QR token format `registrationId:eventId:userId:hmacHex` -- compact, parseable, HMAC-signed with BETTER_AUTH_SECRET
- Registration deletion (not soft-delete via status change) for cancelRegistration per D-20 specification
- Drizzle `unique()` constraint API (array-based v2 syntax) for composite unique constraint

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed timing-safe HMAC comparison**
- **Found during:** Task 2 (QR token implementation)
- **Issue:** Plan code sample used `===` string comparison for HMAC verification which leaks timing information
- **Fix:** Used `crypto.subtle.verify()` which is inherently timing-safe
- **Files modified:** src/lib/events/qr.ts
- **Verification:** TypeScript compiles cleanly, uses Web Crypto API verify method
- **Committed in:** 8238e46 (Task 2 commit)

**2. [Rule 3 - Blocking] Fixed Uint8Array BufferSource type incompatibility**
- **Found during:** Task 2 (QR token implementation)
- **Issue:** TypeScript strict mode rejects Uint8Array as BufferSource due to SharedArrayBuffer incompatibility
- **Fix:** Added explicit `as BufferSource` type assertions for crypto.subtle.verify arguments
- **Files modified:** src/lib/events/qr.ts
- **Verification:** `npx tsc --noEmit` passes cleanly
- **Committed in:** 8238e46 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes essential for security and compilation. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Data layer complete, ready for Plan 02 (admin event management UI) and Plan 03 (user registration UI + QR display)
- All Server Actions exported and callable from React components
- Migration SQL ready for `wrangler d1 migrations apply`

## Self-Check: PASSED

All 6 created files verified on disk. Both task commits (38d9442, 8238e46) found in git log.

---
*Phase: 02-events-registration*
*Completed: 2026-03-29*
