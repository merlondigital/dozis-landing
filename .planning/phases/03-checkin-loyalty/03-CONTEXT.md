# Phase 3: Check-In, Loyalty & Admin Dashboard - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Admin QR code scanning for event check-in, attendance verification with visual/audio feedback, loyalty tracking (5th event free cycle), and admin guest management dashboard. This phase does NOT include branding polish, mobile responsiveness fixes, or offline QR support (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### QR Scanner (Admin)
- **D-01:** Use html5-qrcode library for camera-based QR scanning (per CLAUDE.md recommendation — battle-tested, ZXing decoder, works on iOS Safari + Chrome Android)
- **D-02:** Scanner page at `/app/admin/events/[id]/scan` — scoped to a specific event
- **D-03:** Camera selection: prefer back camera (environment facing), with toggle button for front camera
- **D-04:** Continuous scan mode: after successful scan, auto-ready for next scan (no manual restart)
- **D-05:** Scanner UI: full-viewport camera feed with overlay frame, result banner at top

### Check-In Feedback
- **D-06:** Green banner + success sound for valid check-in (attendee name shown)
- **D-07:** Red banner + error sound for invalid/duplicate/unknown QR codes (reason shown)
- **D-08:** Feedback stays visible for 3 seconds, then auto-dismiss, scanner re-activates
- **D-09:** Audio: use Web Audio API tone generation (no mp3 files needed) — 800Hz beep for success, 200Hz buzz for error
- **D-10:** Vibration API on error: `navigator.vibrate(200)` for tactile feedback on mobile

### Check-In Data Model
- **D-11:** Add `checkedInAt` (nullable datetime) and `checkedInBy` (nullable userId) columns to registration table
- **D-12:** UNIQUE constraint on (eventId, userId) already prevents duplicates — check-in just updates `checkedInAt` on existing registration
- **D-13:** If QR token is valid but registration not found (edge case: cancelled), return "Nincs regisztráció" error
- **D-14:** If `checkedInAt` is already set, return "Már becsekkolva" duplicate error

### Manual Code Entry (Fallback)
- **D-15:** Text input below scanner for manual QR token entry (admin types or pastes the token)
- **D-16:** Same validation logic as scanner — verify HMAC, check registration, update check-in
- **D-17:** Search by guest name/email as additional fallback — shows matching registrations with manual check-in button

### Loyalty System
- **D-18:** `attendanceCount` field on user table (integer, starts at 0)
- **D-19:** Increment `attendanceCount` on every successful check-in (in same transaction)
- **D-20:** When attendanceCount reaches 4, the NEXT registration is auto-marked as `isFree: true` (the 5th event is free)
- **D-21:** After the free event check-in, reset attendanceCount to 0 (new cycle)
- **D-22:** Loyalty display: progress bar with icons/dots showing X/5 progress, "Következő ingyenes!" label when at 4/5
- **D-23:** Loyalty section on user dashboard (app/page.tsx) — prominent card showing progress

### Admin Guest Management
- **D-24:** Guest list page at `/app/admin/events/[id]/guests` — table with registered guests
- **D-25:** Columns: Name, Email, Registration date, Status (registered/checked-in), Check-in time
- **D-26:** Search/filter by name or email (client-side filtering for v1 — event attendance unlikely to exceed 200)
- **D-27:** Manual check-in button per guest row (for walk-ins or scanner failures)
- **D-28:** Stats header: Total registered, Checked in, No-shows, Check-in rate percentage

### Admin Event Dashboard Enhancement
- **D-29:** Admin event list shows registration count and check-in count per event
- **D-30:** Event card in admin has quick links: "Szkenner", "Vendéglista", "Szerkesztés"

### Claude's Discretion
- Exact html5-qrcode configuration (fps, qrbox size, aspect ratio)
- Drizzle migration approach for new columns
- Whether to use optimistic UI updates for check-in
- Sound duration and volume
- Pagination on guest list (unlikely needed for v1 scale)

</decisions>

<canonical_refs>
## Canonical References

### Project Specs
- `.planning/PROJECT.md` — Core value (5th event free), constraints
- `.planning/REQUIREMENTS.md` — CHKN-01 through CHKN-04, LOYL-01 through LOYL-03, ADMN-01 through ADMN-03
- `.planning/ROADMAP.md` — Phase 3 success criteria

### Phase 1+2 Outputs
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Auth decisions
- `.planning/phases/02-events-registration/02-CONTEXT.md` — Event + registration decisions
- `src/db/schema.ts` — Current schema (user, session, account, verification, event, registration)
- `src/lib/events/actions.ts` — Server Actions (event CRUD, registration)
- `src/lib/events/qr.ts` — HMAC QR token generation + verification
- `src/lib/auth-utils.ts` — getSession, requireAdmin

### External Docs (for researcher)
- html5-qrcode — Camera QR scanning, configuration, multi-camera support
- Web Audio API — Programmatic sound generation (no audio files)
- Vibration API — Mobile haptic feedback

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/events/qr.ts` — `verifyQrToken()` already verifies HMAC tokens — reuse for check-in
- `src/lib/events/actions.ts` — `getUserRegistration()`, `getEventById()` — reuse for check-in lookups
- `components/admin/event-list.tsx` — Enhance with registration/check-in counts
- `app/app/admin/events/[id]/edit/page.tsx` — Pattern for dynamic admin event routes
- All shadcn/ui components from Phase 1+2

### New Components Needed
- QR scanner wrapper (html5-qrcode → React hook/component)
- Check-in feedback banner (animated green/red)
- Loyalty progress card (X/5 display)
- Guest list table with search
- Manual code entry form

### Schema Changes
- `registration` table: add `checkedInAt`, `checkedInBy` columns
- `user` table: add `attendanceCount` column

</code_context>

<deferred>
## Deferred Ideas
- Real-time guest list updates (WebSocket/SSE) — v2
- Batch check-in (select multiple, check all) — v2
- Export guest list CSV — v2
- Attendance leaderboard — v2 (ENGM-01 streaks)
- Push notification on check-in confirmation — v2 (PLAT-02)
</deferred>

---

*Phase: 03-checkin-loyalty*
*Context gathered: 2026-03-29*
*Mode: auto*
