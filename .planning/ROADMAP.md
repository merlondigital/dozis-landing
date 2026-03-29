# Roadmap: DOZIS Event App

## Overview

Transform the existing DOZIS landing page repo into a full event management app where guests register for events, receive QR codes, get checked in by admins, and earn every 5th event free. Four phases: lay the infrastructure and auth foundation, build the event + registration flow, complete the admin check-in and loyalty loop, then apply the DOZIS branding and UX polish across the board.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation & Auth** - Infrastructure setup (Next.js, D1, Drizzle, Resend) and email OTP authentication with admin middleware
- [ ] **Phase 2: Events & Registration** - Event CRUD for admins, event listing for users, registration with QR code generation
- [ ] **Phase 3: Check-In, Loyalty & Admin Dashboard** - QR scanner, attendance verification, loyalty tracking, and admin guest management
- [ ] **Phase 4: Branding & UX Polish** - DOZIS visual identity, mobile-first responsive design, Hungarian UI, offline QR support

## Phase Details

### Phase 1: Foundation & Auth
**Goal**: Users can authenticate via email OTP and the full-stack infrastructure is operational
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04, AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05
**Success Criteria** (what must be TRUE):
  1. A user can enter their email, receive a 6-digit OTP code via Resend, and log in to the app
  2. A logged-in user stays logged in after closing and reopening the browser
  3. An admin-listed email gets access to admin routes; a regular user is blocked from admin routes
  4. Next.js API routes respond on Cloudflare Workers via @opennextjs/cloudflare with D1 database connected and Drizzle migrations applied
  5. OTP codes expire after 5 minutes and brute-force attempts are rate-limited
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Next.js App Router scaffold with Tailwind + shadcn/ui + Drizzle schema + D1 config
- [x] 01-02-PLAN.md — better-auth server with email-otp plugin + Resend OTP email + auth client
- [x] 01-03-PLAN.md — Auth UI (login/OTP/registration pages) + middleware + admin protection

### Phase 2: Events & Registration
**Goal**: Users can discover events and register to receive a scannable QR code
**Depends on**: Phase 1
**Requirements**: EVNT-01, EVNT-02, EVNT-03, EVNT-04, EVNT-05, REGN-01, REGN-02, REGN-03, REGN-04
**Success Criteria** (what must be TRUE):
  1. An admin can create, edit, and delete events with full details (name, date, venue, genre tags)
  2. A user sees upcoming events with the next event highlighted
  3. A user can tap to register for an event and immediately sees their unique QR code
  4. A user can view their QR code full-screen with maximum contrast (white background)
  5. A user cannot register twice for the same event
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Event + registration Drizzle schema, Zod validation, HMAC QR signing, Server Actions
- [ ] 02-02-PLAN.md — Admin event CRUD UI (list, create, edit, delete pages)
- [ ] 02-03-PLAN.md — User event listing, detail page, registration flow, QR code display, dashboard update

### Phase 3: Check-In, Loyalty & Admin Dashboard
**Goal**: Admins can verify attendance via QR scan, users earn loyalty progress, and admins have full guest oversight
**Depends on**: Phase 2
**Requirements**: CHKN-01, CHKN-02, CHKN-03, CHKN-04, LOYL-01, LOYL-02, LOYL-03, ADMN-01, ADMN-02, ADMN-03
**Success Criteria** (what must be TRUE):
  1. An admin can scan a QR code with their phone camera and see clear green/red feedback with audio confirmation
  2. A duplicate check-in is rejected at the database level and shows an error to the admin
  3. An admin can manually enter a code when the scanner fails
  4. A user sees their attendance count and progress toward the next free event (X/5 display)
  5. After 4 verified check-ins, the user's 5th event registration is automatically marked as free and the counter resets
  6. An admin can view the guest list per event (registered vs checked-in), search by name/email, and see attendance analytics
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD
- [ ] 03-03: TBD

### Phase 4: Branding & UX Polish
**Goal**: The app looks and feels like DOZIS with full mobile-first Hungarian UI
**Depends on**: Phase 3
**Requirements**: INFR-05, UX-01, UX-02, UX-03
**Success Criteria** (what must be TRUE):
  1. The app uses the DOZIS visual identity: dark theme, amber/blue accent colors, Anton/Montserrat fonts, spray-paint aesthetic
  2. All UI elements have 44px+ touch targets and the layout is mobile-first responsive
  3. The entire interface is in Hungarian with no English UI text visible to users
  4. The QR code display works offline (cached locally, viewable without network)
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Auth | 3/3 | Complete | 2026-03-29 |
| 2. Events & Registration | 0/3 | Planning complete | - |
| 3. Check-In, Loyalty & Admin Dashboard | 0/3 | Not started | - |
| 4. Branding & UX Polish | 0/2 | Not started | - |
