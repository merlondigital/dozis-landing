# Feature Landscape

**Domain:** Event management + QR check-in + loyalty app (small DJ collective)
**Researched:** 2026-03-28
**Overall confidence:** HIGH

## Table Stakes

Features users expect from an event check-in app. Missing any of these = product feels broken or amateur.

### User-Facing

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Email OTP login (passwordless) | 56% of users abandon registration with complex auth. No password = no friction. Industry standard for event apps. | Medium | 6-digit code, 5-min expiry. Auto-focus next input on mobile. `inputmode="numeric"` for OTP field. |
| Event listing (upcoming) | Users need to know what's next. Single source of truth. | Low | Card-based layout: date, venue, lineup, genre tags. One "next event" hero + list of future events. |
| Event registration (one-tap) | Core flow. User taps "Regisztracio" and gets their ticket. Must be frictionless. | Low | Single button after login. No form fields beyond auth. Confirmation screen with QR immediately. |
| QR code generation per registration | This IS the ticket. Every attendee needs a unique, scannable QR per event. | Medium | Generate on registration, store server-side. Encode: `{registrationId}:{eventId}:{userId}:{hmac}`. Min 2x2cm render, high contrast, quiet zone. |
| QR display on mobile (full-screen) | Attendee shows phone at door. Must work in dark venue, bright sunlight, cracked screens. | Low | Full-screen mode, max brightness prompt, white background, large QR. No nav chrome covering it. |
| Admin QR scanning | Admin scans = check-in confirmed. Must be fast (under 2 seconds per scan). | High | Camera API access, real-time decode. Clear visual/audio feedback: green flash + sound for success, red + vibrate for duplicate/invalid. |
| Duplicate scan prevention | One QR = one entry. Sharing screenshots must not grant access. Industry standard security. | Medium | Server-side one-time validation. Mark as "used" on first scan. Immediate "Already checked in" feedback on re-scan with attendee name + check-in time shown. |
| Attendance history (user) | User sees their past events. Builds sense of belonging and tracks loyalty progress. | Low | Simple list: event name, date, venue. Sorted by date descending. |
| Loyalty progress indicator | The core value prop. "3/5 events attended - 2 more until free!" Must be prominent. | Low | Visual progress bar/stamps on dashboard. Show count clearly. Auto-calculate from attendance records. |
| Admin event CRUD | Admins create/edit/delete events. Basic content management. | Medium | Form: name, date, time, venue, description, lineup, genre tags, capacity (optional). |
| Admin attendance list | Admin sees who showed up per event. Real-time during event. | Low | List with name, email, check-in time. Search/filter. Real-time count: "47/120 checked in". |
| Mobile-first responsive design | 95%+ usage will be on phones at venues. Desktop is secondary. | Medium | Touch targets min 44x44px. One-handed operation. Works on both iOS Safari and Android Chrome. |
| DOZIS branding | This is a community app, not generic SaaS. The brand IS the product. | Medium | Dark theme, amber/blue accents, Anton/Montserrat fonts, spray-paint aesthetic per project constraints. |
| Hungarian UI | Target audience is Budapest locals. English would alienate. | Low | All user-facing strings in Hungarian. Admin can also be Hungarian (same 3 people). |

### Admin-Facing

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Guest list per event | Admin needs to see who registered (pre-event) and who showed up (during/post). | Low | Two states: "Registered" vs "Checked in". Sortable, searchable. |
| Guest search | Admin needs to find specific attendees across all events. | Low | Search by name, email. Show attendance count and loyalty status. |
| Basic event analytics | How many registered vs showed up? No-show rate? | Low | Simple counts per event. Conversion: registered -> checked in. Trend over events. |

## Differentiators

Features that set DOZIS apart from generic event platforms. Not expected, but create "wow" and community loyalty.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| "5th event free" auto-reward | THE killer feature. Automatic loyalty that rewards regulars. No punch cards to lose, no codes to remember. | Medium | After 4 verified check-ins, 5th registration auto-marked as "free". Reset counter. Clear visual celebration when unlocked. Consider: does counter reset after reward or accumulate forever? Recommend: reset to 0, start new cycle. |
| Loyalty celebration moment | When user hits their 5th event: confetti animation, special screen, "DOZIS. VIP" badge for the night. Makes it feel special, not transactional. | Low | One-time animation on the reward event's registration. Shareable moment ("Screenshot & share!"). |
| Add to Apple Wallet / Google Wallet | QR ticket lives in the phone's native wallet. No need to open the app at the venue. Lock screen access. | High | Requires `.pkpass` generation (Apple) and Google Wallet API. PassKit or similar service. Consider v2 -- significant complexity for small gain when PWA works fine. |
| Event countdown / "next event" hero | Homepage shows countdown to next event with lineup art. Builds anticipation. | Low | Dynamic hero section. Auto-updates when event passes. Shows "No upcoming events" gracefully. |
| Admin real-time dashboard during event | Live check-in feed during the event. See names flowing in. Creates excitement for the crew. | Medium | WebSocket or polling for live updates. Check-in count animating up. Last 5 check-ins shown. Peak arrival time chart (post-event). |
| Attendance streaks | "You've been to 3 events in a row!" Gamification without over-engineering. | Low | Simple consecutive attendance counter. Badge or flame icon next to streak. Resets on miss. |
| Past event gallery/memories | After event: photo, recap, "You were here" badge. Builds nostalgia and community. | Medium | Admin uploads 1-2 photos post-event. User sees it in their history. Optional -- nice for community feel. |
| PWA installable | "Add to Home Screen" prompt. App-like experience without app store overhead. No download barrier. | Low | Service worker + manifest.json. Works for both iOS and Android. Offline access to QR codes (critical for venues with bad signal). |
| Offline QR display | User's QR code viewable even without network. Critical for underground venues with no signal. | Medium | Cache QR code data in service worker / localStorage on registration. Render client-side from cached data. |
| Share event with friends | "Share" button generating a link or Instagram story-friendly image. Organic growth for the collective. | Low | Web Share API on mobile. Fallback: copy link. Optional: generate branded share image (v2). |

## Anti-Features

Features to explicitly NOT build. Each would add complexity without proportional value for a 3-admin, small-community app.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Payment / ticketing system | Out of scope for v1. Adds massive complexity: Stripe integration, refunds, receipts, tax compliance, PCI. The "5th free" model doesn't need payments -- events are either paid at door or free. | Handle payments externally (cash at door, separate payment link). Add in v2 if validated. |
| Push notifications | Requires FCM/APNs setup, notification permissions (low grant rates on web), backend infrastructure. Over-engineered for a collective with ~50-200 regulars. | Instagram/social media for event announcements. Email reminder for registered users (simple, v2). |
| Social login (Google/Instagram) | OAuth complexity, privacy policy requirements, GDPR consent flows. Email OTP is simpler and equally effective. | Email OTP only. Single auth path = simpler code, simpler UX. |
| Multi-language (EN/HU) | Double the content, translation management, language detection. Audience is Budapest locals. | Hungarian only. English code/comments per project convention. |
| SMS OTP | SMS gateway costs, phone number validation, international formatting. Email is free (Resend) and sufficient. | Email OTP via Resend. Users check email on the same phone. |
| User profiles with bio/photo | This is not a social network. Users don't need to "express themselves" -- they need to check in. | Name + email from OTP registration. That's it. |
| Chat / messaging | Community chat belongs on Instagram/Telegram/Discord where it already exists. Building chat = months of work. | Link to existing DOZIS social channels. |
| Advanced analytics / BI dashboard | 3 admins don't need Mixpanel-level analytics. Simple counts are enough. | Event-level stats: registered, checked-in, no-show rate. Total loyalty members. That's sufficient. |
| Tiered loyalty (Bronze/Silver/Gold) | Over-engineered for the simple "5th free" model. Tiers need reward differentiation, which needs more benefits to offer. | Single loyalty track: attend 5, get 1 free. Simple, clear, no confusion. |
| Admin invitation system | Fixed team of 3 (POLOSAI, PETRUS, DAVE). No org growth planned. | Hardcoded admin email list in env vars. Same OTP flow, admin flag check. |
| Waitlists / capacity management | Small venue events (DOPAMIN). If it's full, they'll announce it on Instagram. No need for automated waitlists. | Optional capacity field on event. Show "Full" badge when reached. No waitlist queue. |
| Seat selection / table booking | Irrelevant for standing electronic music events. | Not applicable to this domain. |
| Dynamic/rotating QR codes | Refreshing QR every N seconds prevents screenshots but adds massive complexity. For a trusted community of ~100 regulars, it's overkill. | Static QR per registration + one-time server-side validation is sufficient. Flag duplicates clearly. |
| NFT / blockchain ticketing | Buzzword tech with no real value for a small community event. Adds complexity, confuses users. | Standard QR codes. They work. |
| Native mobile app (iOS/Android) | App store review, dual codebase, update distribution. PWA covers all needs for this use case. | PWA with service worker. Installable, offline-capable, no store needed. |
| CRM / marketing automation | Mailchimp integration, drip campaigns, segmentation -- all overkill for 3 admins who know their regulars by name. | Export guest list to CSV if needed. Manual outreach via existing channels. |

## Feature Dependencies

```
Email OTP Auth
  |-> Event Registration
  |     |-> QR Code Generation
  |     |     |-> QR Display (mobile)
  |     |     |-> Admin QR Scanning
  |     |     |     |-> Attendance Recording
  |     |     |           |-> Loyalty Progress Tracking
  |     |     |           |     |-> "5th Free" Auto-Reward
  |     |     |           |-> Attendance History (user view)
  |     |     |           |-> Admin Attendance List
  |     |     |-> Offline QR Display (cached)
  |     |-> Add to Wallet (v2)
  |
  |-> Admin Auth (same OTP, admin flag)
        |-> Event CRUD
        |-> Guest Management
        |-> Real-time Dashboard
```

Key dependency chain: **Auth -> Registration -> QR -> Scan -> Attendance -> Loyalty**

This is the critical path. Every feature in the chain must work before downstream features make sense.

## MVP Recommendation

### Phase 1: Core Flow (must ship first)
1. **Email OTP auth** -- gate for everything
2. **Event listing** (upcoming events) -- what's next
3. **Event registration + QR generation** -- the ticket
4. **QR display (full-screen mobile)** -- show at door
5. **Admin QR scanning + check-in** -- validate at door
6. **Duplicate scan prevention** -- security baseline
7. **DOZIS branding + Hungarian UI** -- it's not DOZIS without the brand

### Phase 2: Loyalty + History
8. **Attendance history** (user view) -- see past events
9. **Loyalty progress indicator** -- "X/5 until free"
10. **"5th event free" auto-reward** -- the value prop
11. **Admin attendance list + guest search** -- management basics

### Phase 3: Polish + Differentiators
12. **PWA installable** -- "add to home screen"
13. **Offline QR display** -- works underground
14. **Event countdown hero** -- anticipation builder
15. **Loyalty celebration moment** -- confetti on 5th event
16. **Share event** -- organic growth

### Defer to v2
- Apple/Google Wallet integration
- Payment system
- Push notifications / email reminders
- Past event gallery
- Advanced admin analytics
- Social login options

## Sources

- [Top QR Code Check-In Systems 2026](https://joinit.com/blog/top-qr-code-check-in-systems)
- [QR Code Event Check-In Guide 2025 - EventX](https://eventx.io/blog/qr-code-event-check-in-faster-onsite-experiences-2025-guide)
- [10 Event Check-In Apps 2026 - Eventify](https://eventify.io/blog/event-check-in-app)
- [Stamp Me Loyalty Platform](https://www.stampme.com/)
- [Loopy Loyalty](https://loopyloyalty.com/)
- [Event Management App UX Trends 2025](https://vocal.media/01/event-management-app-ui-ux-trends-that-are-winning-in-2025)
- [How to Develop an Event App - Eastern Peak](https://easternpeak.com/blog/how-to-develop-an-event-app-a-step-by-step-guide/)
- [Passwordless UX - NN/g](https://www.nngroup.com/articles/passwordless-accounts/)
- [Login/Signup UX Guide 2025 - Authgear](https://www.authgear.com/post/login-signup-ux-guide)
- [Passwordless Impact on Conversion - OwnID](https://www.ownid.com/blog/the-impact-on-user-experience-and-conversion-rates)
- [Prevent Duplicate Entry & Ticket Fraud - Dreamcast](https://godreamcast.com/blog/solution/in-person-event/prevent-duplicate-event-entry-ticket-fraud/)
- [QR Code Ticket Security - QRCodeChimp](https://www.qrcodechimp.com/qr-codes-for-event-tickets-with-validation/)
- [Gamification in Loyalty Programs for Night Clubs - FesteaPay](https://festeapay.com/en/blog/gamification-in-loyalty-programs-for-night-clubs/)
- [Building Fan Loyalty with Gamification - FanZone](https://www.fanzone.me/blog/building-fan-loyalty-at-live-events-with-gamification-and-loyalty-platforms)
- [Apple/Google Wallet Passes - PassKit](https://passkit.com/)
- [Wallet Passes iOS Integration - Medium](https://medium.com/norsys-octogone/wallet-passes-in-mobile-applications-part-1-ios-integration-c49b139a721e)
- [Event Attendance Tracking - Fielddrive](https://www.fielddrive.com/blog/event-attendance-tracker-methods)
- [Feature Creep Prevention - Designli](https://designli.co/blog/what-is-feature-creep-and-how-to-avoid-it)
- [MVP Scope and Overengineering - FasterCapital](https://fastercapital.com/content/Define-MVP-scope--How-to-Define-Your-MVP-Scope-and-Avoid-Overengineering.html)
