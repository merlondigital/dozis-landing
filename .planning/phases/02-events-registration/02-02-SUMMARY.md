---
phase: 02-events-registration
plan: 02
subsystem: admin-ui
tags: [admin, event-management, forms, crud-ui, date-fns, hungarian-locale]

requires:
  - phase: 02-events-registration
    plan: 01
    provides: "Server Actions (createEvent, updateEvent, deleteEvent, getEventById), Zod schemas, GENRE_OPTIONS"
provides:
  - "Admin event list page at /app/admin/events"
  - "Create event page at /app/admin/events/new"
  - "Edit event page at /app/admin/events/[id]/edit"
  - "Shared EventForm component for create/edit modes"
  - "EventList component with Hungarian date formatting and genre badges"
  - "Updated admin dashboard with event stats"
affects: [02-03, 03-checkin-loyalty]

tech-stack:
  added: [date-fns@4.1.0]
  patterns: [shared-form-component, optimistic-delete, genre-badge-colors]

key-files:
  created:
    - components/admin/event-form.tsx
    - components/admin/event-list.tsx
    - app/app/admin/events/page.tsx
    - app/app/admin/events/new/page.tsx
    - app/app/admin/events/[id]/edit/page.tsx
    - app/app/admin/events/[id]/edit/not-found.tsx
  modified:
    - app/app/admin/page.tsx
    - src/lib/events/actions.ts
    - package.json

key-decisions:
  - "Used native datetime-local input instead of a date picker library for simplicity"
  - "Genre tags as toggle buttons with colored badges rather than multi-select dropdown"
  - "Optimistic delete with rollback on error for instant UI feedback"
  - "Added getAllEvents server action for admin view (includes past events, ordered DESC)"

patterns-established:
  - "EventForm shared component pattern: mode prop toggles between create/edit, initialData for pre-fill"
  - "Genre badge color mapping: static Record<string, string> with Tailwind color classes per genre"
  - "Admin page pattern: Server Component fetches data, passes to client component for interactivity"

requirements-completed: [EVNT-01, EVNT-02, EVNT-03]

duration: 3min
completed: 2026-03-29
---

# Phase 2 Plan 02: Admin Event Management UI Summary

**Admin CRUD UI for events: shared form component with genre tag badges, event list with Hungarian dates, create/edit/delete pages under /app/admin/events/*

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-29T16:14:16Z
- **Completed:** 2026-03-29T16:17:30Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Shared EventForm component handles both create and edit modes with genre tag checkboxes (colored badges per genre)
- EventList component with Hungarian date formatting via date-fns, optimistic delete with confirmation
- Admin event list page fetches ALL events (including past) via new getAllEvents action
- Create event page with full form at /app/admin/events/new
- Edit event page with pre-filled form at /app/admin/events/[id]/edit (parses genreTags from comma-string)
- Updated admin dashboard with active event count stats and navigation card
- Custom not-found page for missing event in edit flow

## Task Commits

Each task was committed atomically:

1. **Task 1: Event form component and admin event list** - `3fa631e` (feat)
2. **Task 2: Admin event pages (list, create, edit) and updated admin dashboard** - `81e1714` (feat)

## Files Created/Modified
- `components/admin/event-form.tsx` - Shared create/edit form with genre checkboxes, validation, server action calls
- `components/admin/event-list.tsx` - Event cards with Hungarian date, genre badges, delete with confirmation
- `app/app/admin/events/page.tsx` - Server component: fetches all events, renders EventList
- `app/app/admin/events/new/page.tsx` - Renders EventForm in create mode
- `app/app/admin/events/[id]/edit/page.tsx` - Fetches event by ID, renders EventForm in edit mode
- `app/app/admin/events/[id]/edit/not-found.tsx` - Custom not-found UI for missing events
- `app/app/admin/page.tsx` - Updated dashboard with event stats and navigation
- `src/lib/events/actions.ts` - Added getAllEvents server action
- `package.json` - Added date-fns dependency

## Decisions Made
- Native `datetime-local` input for date picker (no extra library needed for this use case)
- Genre tags as clickable toggle buttons with colored badge preview (not dropdown)
- Optimistic UI pattern for delete: remove from list immediately, rollback on server error
- Added `getAllEvents` to actions.ts (Rule 2: admin needs all events including past, `getUpcomingEvents` only returns future)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing] Added getAllEvents server action**
- **Found during:** Task 1 (event list component)
- **Issue:** `getUpcomingEvents` filters to future events only; admin list needs ALL events including past
- **Fix:** Added `getAllEvents()` to actions.ts that returns all events ordered by date DESC
- **Files modified:** src/lib/events/actions.ts
- **Committed in:** 3fa631e (Task 1 commit)

**2. [Rule 2 - Missing] Added not-found.tsx for edit page**
- **Found during:** Task 2 (edit page)
- **Issue:** Plan specified showing "Esemeny nem talalhato" for missing events but no custom not-found page
- **Fix:** Created not-found.tsx using Next.js notFound() convention for proper 404 handling
- **Files modified:** app/app/admin/events/[id]/edit/not-found.tsx
- **Committed in:** 81e1714 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 2 - missing critical functionality)
**Impact on plan:** Both additions improve completeness. No scope creep.

## Issues Encountered
None.

## Known Stubs
None - all components are wired to real server actions and database queries.

## Next Phase Readiness
- Admin event CRUD complete, ready for Plan 03 (user-facing event list + registration + QR display)
- EventForm and EventList patterns established for reuse
- Genre badge color mapping can be shared across user-facing components

## Self-Check: PASSED

All 9 files verified on disk. Both task commits (3fa631e, 81e1714) found in git log.

---
*Phase: 02-events-registration*
*Completed: 2026-03-29*
