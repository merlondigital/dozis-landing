# Phase 2: Events & Registration - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Event management for admins (create, edit, delete events) and event discovery + registration for users. Users see upcoming events, register with one tap, and receive a unique QR code for check-in. This phase does NOT include QR scanning, check-in, loyalty tracking, or admin guest management (Phase 3).

</domain>

<decisions>
## Implementation Decisions

### Event Data Model
- **D-01:** Event table with fields: id, name, date (datetime), venue, description, genreTags (comma-separated string), imageUrl (optional), capacity (optional), createdBy (admin userId), createdAt, updatedAt
- **D-02:** Genre tags are predefined enum values stored as comma-separated string: "UK Garage", "Club Trance", "Tech House", "Deep House", "Afro House", "Bouncy" — from PROJECT.md context
- **D-03:** Registration table: id, eventId, userId, qrToken (HMAC-signed), status (registered/cancelled), isFree (boolean for loyalty), createdAt
- **D-04:** UNIQUE constraint on (eventId, userId) to prevent duplicate registration (REGN-04)
- **D-05:** Venue defaults to "DOPAMIN, Budapest" (from PROJECT.md) — editable per event

### Event Listing UI
- **D-06:** Card-based layout for event listing — each card shows: event name, date, venue, genre tags as colored badges, optional poster image
- **D-07:** Next upcoming event highlighted as a larger hero card at the top of the listing (per EVNT-04 "next event highlighted")
- **D-08:** Events sorted chronologically — upcoming events first, past events below with "Korábbi események" section header
- **D-09:** Empty state: "Jelenleg nincs közelgő esemény" with DOZIS branding

### Event Detail Page
- **D-10:** Event detail page at `/app/events/[id]` shows full info: name, date/time, venue, description, genre tags, lineup (if any)
- **D-11:** Registration button prominent on detail page — "Regisztráció" in amber
- **D-12:** If already registered, show QR code instead of registration button

### QR Code Generation
- **D-13:** QR code encodes an HMAC-signed token: `{registrationId}:{eventId}:{userId}:{hmacSignature}` (per REGN-02)
- **D-14:** HMAC uses BETTER_AUTH_SECRET as signing key — no additional secret needed
- **D-15:** QR code generated client-side using qrcode.react (per CLAUDE.md tech stack recommendation)
- **D-16:** Full-screen QR display: white background, maximum contrast, event name + date shown above QR, "Mutasd meg a bejáratnál" instruction below (per REGN-03)

### Registration Flow
- **D-17:** One-tap registration: user taps "Regisztráció" → instant registration → shows QR code (per REGN-01)
- **D-18:** No capacity limits in v1 — all events accept unlimited registrations
- **D-19:** Registration creates DB record + generates HMAC-signed QR token in a single Server Action
- **D-20:** Cancel registration: user can cancel before the event — deletes registration record, invalidates QR token

### Admin Event CRUD
- **D-21:** Admin event list at `/app/admin/events` — table/list view with edit/delete actions
- **D-22:** Create event form at `/app/admin/events/new` — all fields, genre tags as multi-select checkboxes
- **D-23:** Edit event at `/app/admin/events/[id]/edit` — same form, pre-filled
- **D-24:** Delete event: hard delete with AlertDialog confirmation ("Biztosan törlöd?"), cascades to registrations
- **D-25:** Only admins can access `/app/admin/events/*` routes (existing admin middleware from Phase 1)

### Claude's Discretion
- Server Action vs Route Handler choice for registration mutation
- Exact HMAC token format and encoding
- Pagination approach if event list grows (simple for v1 — unlikely to need it)
- Image upload/URL handling for event posters
- Date picker component choice for admin form

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `.planning/PROJECT.md` — Core value, constraints, admin list (POLOSAI, PETRUS, DAVE)
- `.planning/REQUIREMENTS.md` — EVNT-01 through EVNT-05, REGN-01 through REGN-04
- `.planning/ROADMAP.md` — Phase 2 success criteria

### Phase 1 Outputs
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Stack decisions, auth flow, styling decisions
- `.planning/phases/01-foundation-auth/01-01-SUMMARY.md` — Project scaffold details
- `.planning/phases/01-foundation-auth/01-02-SUMMARY.md` — Auth engine details
- `.planning/phases/01-foundation-auth/01-03-SUMMARY.md` — Auth UI details

### Tech Stack
- `CLAUDE.md` — qrcode.react recommendation, Drizzle patterns, Zod validation
- `src/db/schema.ts` — Existing Drizzle schema (user, session, account, verification tables)
- `src/lib/auth-utils.ts` — getSession, requireAdmin utilities

### External Docs (for researcher)
- qrcode.react — QR code SVG rendering in React
- Drizzle ORM — D1 schema, relations, migrations
- shadcn/ui — Card, Table, Dialog, AlertDialog, Select components
- Web Crypto API — HMAC-SHA256 for QR token signing (available in Workers runtime)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/button.tsx` — shadcn/ui Button (installed in Phase 1)
- `components/ui/card.tsx` — shadcn/ui Card (installed in Phase 1)
- `components/ui/input.tsx` — shadcn/ui Input (installed in Phase 1)
- `components/ui/label.tsx` — shadcn/ui Label (installed in Phase 1)
- `src/lib/auth-utils.ts` — getSession(), requireAdmin(), requireProfile()
- `src/lib/auth-client.ts` — useSession() for client-side auth state
- `src/db/index.ts` — getDb(d1) helper for Drizzle + D1
- `src/db/schema.ts` — Base schema to extend with event + registration tables
- `app/app/admin/layout.tsx` — Admin role guard (reuse for event admin pages)

### Established Patterns
- Server Components for data fetching (app/app/page.tsx, app/app/admin/*)
- Client Components for interactivity (components/auth/*, components/app/*)
- Server Actions for mutations (app/app/register/actions.ts)
- Tailwind + DOZIS theme tokens (dozis-amber, dozis-navy, dozis-blue)
- shadcn/ui components with DOZIS dark theme customization

### Integration Points
- `/app/events/[id]` — New route for event detail
- `/app/admin/events/*` — New admin routes (inside existing admin layout)
- `src/db/schema.ts` — Add event + registration tables
- `middleware.ts` — Already protects /app/* routes, no changes needed
- Dashboard (`app/app/page.tsx`) — Replace placeholder cards with real event data

</code_context>

<specifics>
## Specific Ideas

- Event cards should feel like party invitations — dark background, amber highlights, genre tags as colorful badges
- QR code full-screen should feel like showing a ticket at the door — clean, no distractions, large QR
- Admin event form should be functional, not fancy — form fields, save button, done
- "Mutasd meg a bejáratnál" = "Show this at the entrance" — instruction below QR code
- Genre tags color coding: each genre gets a distinct color badge (amber, blue, purple, green, etc.)

</specifics>

<deferred>
## Deferred Ideas

- Event poster image upload via Vercel Blob or Cloudflare R2 — v1 uses URL input only
- Event capacity limits and waitlist — out of scope for v1
- Event categories/filtering — only when event count warrants it
- Share event via Web Share API — v2 (ENGM-04)
- Past event gallery with admin-uploaded photos — v2 (ENGM-03)

</deferred>

---

*Phase: 02-events-registration*
*Context gathered: 2026-03-29*
*Mode: auto (all gray areas auto-resolved with recommended defaults)*
