# Domain Pitfalls

**Domain:** Event check-in / QR / loyalty app on Cloudflare edge stack
**Project:** DOZIS. Event App
**Researched:** 2026-03-29
**Updated:** Stack alignment with better-auth + Drizzle ORM recommendations

---

## Critical Pitfalls

Mistakes that cause rewrites, data loss, or broken core flows.

---

### Pitfall 1: QR Code Unreadable on Dark DOZIS UI

**What goes wrong:** The DOZIS brand uses deep navy (`#0a1628`) and black (`#000000`) backgrounds with amber (`#d4a017`) accents. Developers style the QR code to match the brand (amber modules on dark background, or dark modules on dark background). Most QR scanners expect dark modules on a light background. Inverted or low-contrast QR codes fail on older Android devices, budget phones, and many third-party scanner apps. At a dark club venue with dim lighting, screen glare compounds the problem.

**Why it happens:** Design-first thinking overrides scanning reliability. The branding constraints push toward dark-on-dark presentation. Developers test on their own high-end phones in bright office lighting and never discover the issue.

**Consequences:** Guests queue at the door unable to check in. Admins resort to manual name lookup, destroying the speed advantage of QR scanning. First impression of the app is "broken."

**Prevention:**
- QR display screen MUST use a white/light background island for the QR code, regardless of surrounding UI darkness. Minimum quiet zone of 4 modules around the code.
- QR modules must be black/very dark on white background. Never use amber-on-navy or any branded color scheme for the actual QR pattern.
- Render QR at minimum 200x200 CSS pixels (not device pixels). For event scanning at arm's length (~30cm), target 250x250px minimum.
- Force maximum screen brightness via the Screen Wake Lock API (`navigator.wakeLock.request('screen')`) when displaying the QR view.
- Test on at least 3 budget Android devices (Samsung Galaxy A series, Xiaomi Redmi) in dim lighting before launch.
- Add a contrast ratio check: QR foreground-to-background must exceed 7:1 (WCAG AAA).

**Detection:** Users reporting "QR won't scan" at first event. Admin needing to fall back to manual check-in.

**Phase:** Must be addressed in the QR display implementation phase. Non-negotiable for MVP.

---

### Pitfall 2: QR Code Screenshot Sharing / Forgery

**What goes wrong:** User screenshots their QR code and sends it to a friend. Friend shows the screenshot at the door, gets checked in. Original user also shows up -- one registration, two entries. Or worse: someone reverse-engineers the QR payload format and generates valid QR codes without registering.

**Why it happens:** Static QR codes with predictable payloads (e.g., `registration_id=UUID`) are trivially copyable. A screenshot is pixel-identical to the original display.

**Consequences:** Attendance tracking becomes unreliable. The loyalty counter (5th event free) inflates incorrectly. Venue capacity tracking is wrong. Trust in the system erodes.

**Prevention:**
- **HMAC-signed QR tokens:** The QR payload is HMAC-SHA256(registrationId + eventId + userId, QR_SECRET). Cannot be fabricated without the server secret.
- **Server-side single-use validation:** On scan, mark registration as `checked_in = true`. Second scan returns "already checked in."
- **Do NOT implement rotating/dynamic QR codes for v1.** The complexity is not worth it for a 200-person event. Single-use server validation is sufficient.
- **Admin UI must clearly show "already checked in" state** so the door person knows it's a duplicate, not a system error.
- **QR payload is opaque.** No user emails, names, or event details in the QR. Just `dozis:{hmac-token}`.

**Detection:** Multiple check-in attempts for the same registration. Attendance count exceeding registration count.

**Phase:** Auth + QR generation phase. The signing mechanism must be designed before any QR code is generated.

---

### Pitfall 3: OTP Brute Force via Session Rotation

**What goes wrong:** Attacker requests OTP for a target email. Tries 3 codes, gets rate-limited. Requests a new OTP (which creates a new session/attempt counter). Tries 3 more codes. Repeats.

**Why it happens:** Rate limiting is often tied to the OTP attempt counter per session/code, not per email address globally.

**Consequences:** Account takeover. Attacker gains access to any user's account including admin accounts (since admins use the same OTP flow).

**Mitigation via better-auth:** Better Auth's email-otp plugin has built-in protections:
- `allowedAttempts: 3` -- max 3 verification attempts per OTP before invalidation
- `expiresIn: 300` -- 5-minute expiry
- Prevents OTP reuse via race condition (atomic invalidation, added in v1.5.6)

**Remaining risk:** Better Auth rate-limits per OTP instance, not per email globally. An attacker can still request new OTPs repeatedly.

**Additional prevention needed:**
- Add Worker-level rate limiting on the OTP generation endpoint: max 3 OTPs per email per 15-minute window. Implement via D1 query (`SELECT COUNT(*) FROM verification WHERE identifier=? AND createdAt > ?`) or a simple KV counter.
- Use `crypto.getRandomValues()` for OTP generation (better-auth does this by default).
- Log all OTP generation and verification attempts.

**Phase:** Auth implementation phase. Add rate limiting middleware on top of better-auth.

---

### Pitfall 4: D1 Single-Writer Bottleneck During Event Check-In Rush

**What goes wrong:** 150 people arrive in a 30-minute window. Each check-in triggers a write. D1 has a single-writer model. If writes involve complex transactions, latency increases and check-ins start timing out.

**Why it happens:** Developers treat D1 like a traditional SQL database and write complex transactional queries. D1's single-writer model means all writes globally serialize through one point.

**Consequences:** 5-10 second delays at check-in during peak arrival. Queue builds at the door.

**Prevention:**
- Keep check-in writes minimal: single UPDATE statement (`UPDATE registrations SET checked_in=true, checked_in_at=? WHERE qr_token=? AND checked_in=false`).
- Use optimistic concurrency: the `AND checked_in=false` clause means affected rows = 0 on duplicate scan. No error, just return "already checked in."
- Do NOT compute loyalty count in the check-in write path. Loyalty count is a read-time derived query.
- D1 location: create database in European region (`wrangler d1 create --location=weur`). Budapest is closest to Western Europe region.
- Benchmark: test 100 concurrent check-in writes before the first event. If latency exceeds 500ms, simplify further.

**Detection:** Check-in response times >1 second during load testing. D1 "overloaded" errors in Worker logs.

**Phase:** Database schema phase AND check-in API phase.

---

### Pitfall 5: Resend Email Landing in Spam -- OTP Never Arrives

**What goes wrong:** User registers, requests OTP. Email goes to spam or never arrives. User can't log in. For a nightlife audience (18-30, often using Gmail/iCloud), spam filtering is aggressive and they won't check spam folders.

**Why it happens:** New sending domains have zero reputation. Without proper SPF/DKIM/DMARC setup, emails are flagged. Sending from `onboarding@resend.dev` (test sender) will definitely hit spam.

**Consequences:** Users cannot authenticate at all. The entire app is unusable. At a live event, there's no fallback.

**Prevention:**
- **Before any code:** Set up custom sending domain (e.g., `mail.dozis.hu`) with SPF, DKIM, and DMARC records via Resend dashboard.
- **Warm up the domain** 1-2 weeks before launch: send test emails to team's Gmail/iCloud/Outlook accounts.
- **Email content for spam filters:**
  - Clear `From` name: `DOZIS.` (not `noreply`)
  - Short, text-focused. No heavy HTML, no images, no marketing language.
  - Subject: `DOZIS. belepesi kod: 123456` (OTP in subject for quick access)
  - Include plain text part alongside HTML.
- **Resend rate limit:** 2 req/sec default. For 200-person event, ~0.1 emails/sec. Well within limits. But handle bursts via fire-and-forget (no await in sendVerificationOTP callback).
- **Fallback UX:** Show "Check spam folder" message after 30 seconds. "Resend" button with 60-second cooldown.
- **Never use `onboarding@resend.dev`** in production.

**Detection:** Track delivery via Resend dashboard. Alert if bounce rate exceeds 5%.

**Phase:** Email/auth infrastructure setup phase. Must be validated BEFORE the event app goes live.

---

### Pitfall 6: Better Auth D1 Binding Initialization Error

**What goes wrong:** Developer creates the better-auth instance at module level (outside request handler). D1 binding doesn't exist at module load time on Workers. Auth fails with cryptic "binding not found" or "D1 is not defined" errors on every request.

**Why it happens:** Better Auth examples often show a global `const auth = betterAuth({...})` pattern. This works on Node.js but fails on Cloudflare Workers where bindings are per-request.

**Consequences:** Auth is completely broken. No login, no sign-up, nothing works.

**Prevention:**
- **Create auth instance per request** inside Hono route handler or middleware:
  ```typescript
  authRoutes.all('/**', async (c) => {
    const auth = createAuth(c.env);  // factory function
    return auth.handler(c.req.raw);
  });
  ```
- Add `nodejs_compat` compatibility flag to `wrangler.jsonc` (required for better-auth's AsyncLocalStorage).
- Test with `wrangler dev` (not just Vite dev server) to catch binding issues early.

**Detection:** "binding not found" errors in Worker logs. Auth endpoints returning 500 on every request.

**Phase:** Auth implementation phase. First thing to validate when integrating better-auth.

---

## Moderate Pitfalls

---

### Pitfall 7: Camera Permission Denied -- Admin Scanner Breaks

**What goes wrong:** Admin opens the scanner page. Browser prompts for camera access. Admin taps "Deny" or previously denied. Scanner shows blank screen. Non-technical admin (DJ running the door) can't fix it.

**Prevention:**
- Pre-permission UI screen explaining why camera is needed, with clear CTA.
- On `NotAllowedError`: show step-by-step guide for Safari iOS / Chrome Android.
- **Manual fallback:** Text input field where admin can type a short alphanumeric code (first 8 chars of QR token). This is the escape hatch.
- HTTPS required (Cloudflare handles this). Test on actual HTTPS URLs, not just localhost.
- html5-qrcode works on iOS Safari 15.1+ and all modern Android browsers.

**Detection:** Admin reports "scanner doesn't work." Blank camera view.

**Phase:** Admin scanner phase. Fallback text input in the same sprint as the scanner.

---

### Pitfall 8: D1 Migration Failures in Production

**What goes wrong:** Developer writes migration with `BEGIN TRANSACTION` or `DROP COLUMN`. Works locally. Fails in production D1.

**Prevention:**
- **Never use `BEGIN TRANSACTION` in D1 migrations.** D1 handles transactions internally.
- **Additive-only migrations for v1:** Add columns (nullable), add tables, add indexes. Never rename or drop.
- **Better Auth migration note:** Better Auth creates its own tables on first request. Ensure the D1 database exists before first deploy.
- **Drizzle Kit generates migrations.** Review them before applying. Remove any `BEGIN/COMMIT` if generated.
- Test every migration against remote D1 staging before production.

**Detection:** `wrangler d1 migrations apply` errors. Schema mismatch errors in Worker logs.

**Phase:** Database design phase.

---

### Pitfall 9: Session Revocation Gap

**What goes wrong:** Better Auth sessions are stored in D1. But if a compromised account needs immediate lockout, there's a propagation delay (D1 read replicas may serve stale session data for a brief window).

**Prevention:**
- Better Auth supports session revocation via `auth.api.revokeSession()` and `auth.api.revokeSessions()`.
- For admin accounts (3 people): validate session on every admin action with a fresh D1 read.
- Set session expiry to 30 days (default). Short enough for abandoned sessions, long enough for convenience.
- For critical security events: rotate the `QR_SECRET` to invalidate all existing QR tokens if fraud detected.

**Detection:** Inability to lock out a compromised account during testing.

**Phase:** Auth architecture phase.

---

### Pitfall 10: Loyalty Counter Race Condition -- Double Credit

**What goes wrong:** Admin scans QR. System reads count (3 events). Records check-in (now 4). But QR scanned again 500ms later. Second request reads stale count, writes duplicate.

**Prevention:**
- **UNIQUE constraint on (user_id, event_id) in registrations table.** Database prevents duplicate check-ins. Second UPDATE affects 0 rows.
- **Use `WHERE checked_in = false` in the UPDATE.** Idempotent -- second scan sees `checked_in = true`, returns "already checked in."
- **Loyalty count is read-time:** `SELECT COUNT(*) FROM registrations WHERE user_id=? AND checked_in=true`. Immune to duplicate inserts.
- **Admin UI:** Show "already checked in" toast on duplicate scan. This is normal, not an error.

**Detection:** Users with duplicate check-in records (shouldn't happen with UNIQUE constraint).

**Phase:** Database schema + check-in API phase.

---

### Pitfall 11: Offline/Poor Connectivity at Venue

**What goes wrong:** DOPAMIN venue (basement club) has poor cellular reception. Admin's phone has intermittent connectivity. QR scan API call times out.

**Prevention:**
- **Optimistic check-in UX:** Show "Checking in..." immediately, send request in background. Green checkmark optimistically.
- **Pre-fetch guest list:** When admin opens scanner for an event, download registration list. Validate QR locally for instant feedback, confirm server-side async.
- **Timeout handling:** 5-second fetch timeout, not browser default (30s). On timeout: "Connectivity issue, retrying."
- **Service Worker cache:** Cache scanner page shell for offline loading.

**Detection:** Check-in "stuck" during venue sound check.

**Phase:** Admin scanner phase. Build alongside scanner, not as retrofit.

---

## Minor Pitfalls

---

### Pitfall 12: Workers Free Plan 10ms CPU Limit

**What goes wrong:** HMAC verification + D1 query + JSON serialization exceeds 10ms CPU on free plan.

**Prevention:**
- Use **Workers Paid plan** ($5/month) for production. Free plan is development-only.
- I/O operations (D1, fetch) do NOT count toward CPU time. Only JS execution does.

**Phase:** Infrastructure setup phase.

---

### Pitfall 13: Mobile Dark Mode Breaking QR Readability

**What goes wrong:** System dark mode applies additional filters to the QR display area. White background gets dimmed/inverted.

**Prevention:**
- Apply `color-scheme: light` to QR container.
- Force `background: #FFFFFF !important` and `filter: none !important`.
- Test with iOS Smart Invert and Android Force Dark Mode.

**Phase:** QR display UI phase.

---

### Pitfall 14: Resend 2 req/sec Rate Limit During Mass Registration

**What goes wrong:** 50 people register simultaneously after Instagram story share. Resend returns 429 for requests 3-50.

**Prevention:**
- **Fire-and-forget pattern** in better-auth callback (no await). Requests are naturally staggered.
- Client-side: debounce "Send OTP" button, 60-second cooldown after request.
- At DOZIS scale (50 concurrent max): unlikely to hit 2/sec consistently, but handle 429 with exponential backoff if it happens.
- For v2: consider Cloudflare Queues for email delivery.

**Phase:** Email infrastructure phase.

---

### Pitfall 15: Admin List Hardcoded in Code

**What goes wrong:** Admin email changes, requires code change + redeploy.

**Prevention:**
- Store `ADMIN_EMAILS` as Cloudflare Workers environment variable or secret.
- Update via `wrangler secret put ADMIN_EMAILS` without code change.
- Format: comma-separated.

**Phase:** Auth implementation phase.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation | Severity |
|-------------|---------------|------------|----------|
| Infrastructure setup | Free plan CPU limits (#12) | Workers Paid plan ($5/mo) | Medium |
| Domain/email setup | OTP emails in spam (#5) | Custom domain + SPF/DKIM/DMARC + warmup | Critical |
| Database schema | Missing UNIQUE constraint on check-ins (#10) | Add (user_id, event_id) unique from day 1 | Critical |
| Database schema | Migration using BEGIN TRANSACTION (#8) | Never use transactions in migration files | High |
| Auth implementation | Better Auth D1 binding error (#6) | Per-request auth instance factory | Critical |
| Auth implementation | OTP brute force (#3) | better-auth built-in + additional rate limiting | High |
| QR generation | Predictable QR payloads (#2) | HMAC-signed opaque tokens | Critical |
| QR display UI | QR unreadable on dark theme (#1) | White island, forced brightness | Critical |
| QR display UI | Dark mode filters (#13) | Explicit color-scheme override | Medium |
| Admin scanner | Camera permission denied (#7) | Manual code input fallback | High |
| Admin scanner | No connectivity at venue (#11) | Optimistic UX + pre-fetch | High |
| Check-in API | D1 write bottleneck (#4) | Minimal single-statement writes | High |
| Check-in API | Duplicate scan race condition (#10) | UNIQUE constraint + WHERE checked_in=false | Critical |
| Email sending | Resend rate limit (#14) | Fire-and-forget, client debounce | Medium |
| Admin management | Hardcoded admin list (#15) | Workers env vars | Low |

---

## Summary Priority Matrix

**Block launch if not addressed:**
1. QR readability on dark UI (#1)
2. QR forgery prevention (#2)
3. OTP brute force protection (#3)
4. Email deliverability setup (#5)
5. Better Auth D1 binding pattern (#6)
6. Duplicate check-in prevention (#10)

**Address before first event:**
7. Camera permission fallback (#7)
8. D1 write performance under load (#4)
9. Session revocation mechanism (#9)
10. Venue connectivity resilience (#11)

**Address during development:**
11. Migration discipline (#8)
12. CPU limit awareness (#12)
13. Dark mode QR protection (#13)
14. Email rate limiting (#14)
15. Admin list in env vars (#15)

---

## Sources

- [Cloudflare D1 Limits](https://developers.cloudflare.com/d1/platform/limits/)
- [Cloudflare D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Better Auth Email OTP Plugin](https://better-auth.com/docs/plugins/email-otp)
- [Better Auth on Cloudflare - Hono](https://hono.dev/examples/better-auth-on-cloudflare)
- [Better Auth + CF Workers Integration](https://medium.com/@senioro.valentino/better-auth-cloudflare-workers-the-integration-guide-nobody-wrote-8480331d805f)
- [Resend Sending Limits](https://resend.com/docs/knowledge-base/resend-sending-limits)
- [Resend Domain Setup](https://resend.com/docs/dashboard/domains/introduction)
- [OWASP Blocking Brute Force Attacks](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)
- [QR Code Legibility Best Practices](https://qrcodekit.com/guides/best-practices-for-qr-code-legibility/)
- [getUserMedia() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [html5-qrcode GitHub](https://github.com/mebjas/html5-qrcode)
- [Race Conditions - PortSwigger](https://portswigger.net/web-security/race-conditions)
