# Requirements: DOZIS. Event App

**Defined:** 2026-03-29
**Core Value:** A vendeg QR koddal igazolhatja jelenletet az eventen, es az 5. latogatasa ingyenes.

## v1 Requirements

### Authentication

- [x] **AUTH-01**: User can register and log in with email OTP (6-digit code via Resend)
- [x] **AUTH-02**: OTP expires after 5 minutes, max 5 attempts per email per 15 minutes
- [x] **AUTH-03**: Session persists via HttpOnly JWT cookie across browser refresh
- [x] **AUTH-04**: Admin users identified by email allowlist in environment variables
- [x] **AUTH-05**: Admin middleware protects admin-only API routes and pages

### Events

- [x] **EVNT-01**: Admin can create event (name, date, time, venue, description, genre tags)
- [x] **EVNT-02**: Admin can edit existing event details
- [x] **EVNT-03**: Admin can delete event
- [ ] **EVNT-04**: User sees upcoming events list with next event highlighted
- [ ] **EVNT-05**: User sees event detail page (date, venue, lineup, genre)

### Registration & QR

- [ ] **REGN-01**: User can register for an upcoming event (one-tap after login)
- [x] **REGN-02**: HMAC-signed QR code generated on registration (registration+event+user IDs)
- [ ] **REGN-03**: User can view QR code full-screen with white background and max contrast
- [x] **REGN-04**: Duplicate registration prevented (one registration per user per event)

### Check-In

- [ ] **CHKN-01**: Admin can scan QR code via mobile camera to check in attendee
- [ ] **CHKN-02**: Clear visual+audio feedback on scan (green=success, red=invalid/duplicate)
- [x] **CHKN-03**: Duplicate check-in prevented at database level (UNIQUE constraint)
- [x] **CHKN-04**: Admin has manual code input fallback for scanning issues

### Loyalty

- [x] **LOYL-01**: User sees attendance count and progress toward free event (X/5)
- [x] **LOYL-02**: After 4 verified check-ins, 5th registration is auto-marked as free
- [x] **LOYL-03**: Loyalty counter resets after free event (new cycle starts at 0)

### Admin Dashboard

- [x] **ADMN-01**: Admin sees guest list per event (registered vs checked-in)
- [x] **ADMN-02**: Admin can search guests by name or email
- [x] **ADMN-03**: Admin sees basic event analytics (registered count, checked-in count, no-show rate)

### Infrastructure

- [x] **INFR-01**: Cloudflare Workers + D1 database with Drizzle ORM
- [x] **INFR-02**: Next.js API routes and Server Actions for data mutations
- [x] **INFR-03**: @opennextjs/cloudflare adapter for Workers deployment
- [x] **INFR-04**: Resend email integration with custom domain (SPF/DKIM/DMARC)
- [x] **INFR-05**: DOZIS branding (dark theme, amber/blue, Anton/Montserrat, spray-paint aesthetic)

### UX

- [x] **UX-01**: Mobile-first responsive design (44px+ touch targets)
- [x] **UX-02**: Hungarian language UI throughout
- [x] **UX-03**: QR display works offline (cached in localStorage/service worker)

## v2 Requirements

### Payments

- **PAY-01**: Online ticket purchase via Stripe
- **PAY-02**: Free event auto-applied as discount at checkout

### Engagement

- **ENGM-01**: Attendance streaks (consecutive events counter)
- **ENGM-02**: Loyalty celebration animation (confetti on 5th event unlock)
- **ENGM-03**: Past event gallery/memories (admin uploads photos)
- **ENGM-04**: Share event via Web Share API

### Platform

- **PLAT-01**: PWA installable (manifest + service worker)
- **PLAT-02**: Push notifications for event reminders
- **PLAT-03**: Apple/Google Wallet pass generation

## Out of Scope

| Feature | Reason |
|---------|--------|
| Payment/ticketing | Massive complexity (Stripe, refunds, tax). v1 = free registration, pay at door |
| SMS OTP | Cost + complexity. Email OTP via Resend is free and sufficient |
| Social login (Google/Instagram) | OAuth complexity, GDPR. Email OTP simpler |
| Multi-language | Hungarian audience only. One language = half the strings |
| Chat/messaging | Community lives on Instagram/Telegram already |
| User profiles (bio/photo) | Not a social network. Name + email is enough |
| Push notifications | FCM/APNs setup, low grant rates on web. Instagram for announcements |
| Tiered loyalty (Bronze/Silver/Gold) | Over-engineered. Simple 5th-free model is clear |
| Admin invitation system | Fixed 3-person team. Email allowlist in env |
| Dynamic/rotating QR codes | Overkill for trusted community. Static + one-time validation sufficient |
| Native mobile app | PWA covers all needs. No app store overhead |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete |
| AUTH-04 | Phase 1 | Complete |
| AUTH-05 | Phase 1 | Complete |
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| INFR-03 | Phase 1 | Complete |
| INFR-04 | Phase 1 | Complete |
| EVNT-01 | Phase 2 | Complete |
| EVNT-02 | Phase 2 | Complete |
| EVNT-03 | Phase 2 | Complete |
| EVNT-04 | Phase 2 | Pending |
| EVNT-05 | Phase 2 | Pending |
| REGN-01 | Phase 2 | Pending |
| REGN-02 | Phase 2 | Complete |
| REGN-03 | Phase 2 | Pending |
| REGN-04 | Phase 2 | Complete |
| CHKN-01 | Phase 3 | Pending |
| CHKN-02 | Phase 3 | Pending |
| CHKN-03 | Phase 3 | Complete |
| CHKN-04 | Phase 3 | Complete |
| LOYL-01 | Phase 3 | Complete |
| LOYL-02 | Phase 3 | Complete |
| LOYL-03 | Phase 3 | Complete |
| ADMN-01 | Phase 3 | Complete |
| ADMN-02 | Phase 3 | Complete |
| ADMN-03 | Phase 3 | Complete |
| INFR-05 | Phase 4 | Complete |
| UX-01 | Phase 4 | Complete |
| UX-02 | Phase 4 | Complete |
| UX-03 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 32 total
- Mapped to phases: 32
- Unmapped: 0

---
*Requirements defined: 2026-03-29*
*Last updated: 2026-03-29 after roadmap creation*
