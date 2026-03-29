# Research Summary: DOZIS Event App

**Domain:** Event management with QR check-in and loyalty program
**Researched:** 2026-03-29
**Overall confidence:** HIGH

## Executive Summary

The DOZIS event app is a well-scoped product for a small Budapest electronic music collective (~100-300 users). The Cloudflare ecosystem (Workers + D1 + Pages/Assets) is an excellent fit for this scale -- generous free tiers, zero cold starts, edge-global by default, and a maturing full-stack development experience via the Cloudflare Vite plugin (GA since April 2025).

The 2025-2026 Cloudflare full-stack pattern has converged on a clear standard: **Hono (API) + Drizzle ORM (D1) + React SPA (Vite) + @cloudflare/vite-plugin (build/deploy)**, all in a single Worker. This is documented by Cloudflare themselves, endorsed in their tutorials, and used by the community. Every library in this stack is actively maintained, well-documented, and has first-class Cloudflare support.

For auth, **better-auth** (v1.5.6) is the recommended choice over custom JWT implementation. It has native D1 support, an email-OTP plugin with built-in rate limiting and race condition prevention, Hono integration documented on hono.dev, and reduces auth code from ~300-500 lines to ~50 lines of configuration. The critical pattern on Workers is creating the auth instance per-request (not globally) due to D1 binding lifecycle.

The QR ecosystem is mature and stable: **qrcode.react** (1.3-1.9M weekly downloads) for generation and **html5-qrcode** (887K weekly downloads) for scanning. Both are battle-tested. The primary risk is not technical but environmental -- QR readability in a dark club venue requires careful contrast management and testing on budget devices.

## Key Findings

**Stack:** Hono v4.12 + Drizzle v0.45 + Better Auth v1.5 + React Router v7 (library mode) + qrcode.react v4.2 + html5-qrcode v2.3 on Cloudflare Workers with @cloudflare/vite-plugin v1.30

**Architecture:** Single Worker serves both SPA (via Workers Assets) and API (via Hono). No CORS, one deploy, shared types. The Cloudflare Vite plugin handles the unified build.

**Critical pitfall:** QR code readability on the dark DOZIS theme. Must use white background island for QR, regardless of surrounding brand aesthetics. Test on budget phones in dim lighting.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Foundation & Infrastructure** - TypeScript migration, Vite plugin setup, wrangler config, D1 schema, Hono skeleton
   - Addresses: Project structure, build pipeline
   - Avoids: Migration failures (Pitfall #8), CPU limit issues (Pitfall #12)
   - Includes: Resend domain setup and email warmup (start early, Pitfall #5)

2. **Authentication** - Better Auth integration with email-OTP, session management, admin middleware
   - Addresses: Email OTP login, admin auth
   - Avoids: D1 binding initialization error (Pitfall #6), OTP brute force (Pitfall #3)
   - Key risk: Better Auth per-request instance pattern is critical

3. **Events & Registration** - Event CRUD (admin), event listing (public), registration with QR token generation
   - Addresses: Event management, QR generation, registration flow
   - Avoids: QR forgery (Pitfall #2)

4. **Check-In & Loyalty** - QR scanner, attendance recording, loyalty tracking, 5th-event-free logic
   - Addresses: QR scanning, check-in flow, loyalty program
   - Avoids: D1 write bottleneck (Pitfall #4), duplicate check-in race condition (Pitfall #10), camera permission issues (Pitfall #7)
   - Key: Manual code input fallback alongside scanner

5. **Polish & Branding** - DOZIS visual identity, QR display optimization, error handling, loading states, mobile optimization
   - Addresses: Branding, UX polish, edge cases
   - Avoids: QR unreadability on dark theme (Pitfall #1), dark mode filter issues (Pitfall #13)

**Phase ordering rationale:**
- Foundation must come first (build pipeline, DB schema)
- Auth blocks everything (no features work without login)
- Events + registration before check-in (can't check in without registrations)
- Loyalty depends on check-in data
- Branding is last because functional correctness matters more than aesthetics for MVP, but QR contrast rules must be embedded from phase 3

**Research flags for phases:**
- Phase 2 (Auth): May need deeper research if better-auth D1 integration has undocumented quirks. The per-request factory pattern is well-documented but error-prone.
- Phase 4 (Scanner): html5-qrcode is stable but 3 years without updates. If iOS Safari issues surface, @yudiel/react-qr-scanner is the backup.
- Phase 1 (Foundation): Standard patterns, low research risk.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All libraries verified via npm, official docs, and Cloudflare tutorials. Versions confirmed current. |
| Features | HIGH | Well-scoped in PROJECT.md. Clear table stakes vs differentiators. |
| Architecture | HIGH | The single-Worker + Vite plugin pattern is Cloudflare's own recommended approach. Multiple tutorials confirm. |
| Auth (better-auth) | MEDIUM-HIGH | v1.5.6 is recent (6 days old). D1 integration is native since v1.5. But Workers-specific gotchas (per-request instantiation, nodejs_compat flag) need careful implementation. |
| QR libraries | HIGH | qrcode.react (1.3M+ downloads) and html5-qrcode (887K downloads) are industry standard. Stable, battle-tested. |
| Pitfalls | HIGH | Sourced from official docs, community issues, and real production experiences documented in blog posts. |

## Gaps to Address

- **Resend domain setup specifics:** The exact DNS records for dozis.hu need to be configured in Resend. This is a prerequisite for Phase 2 but requires access to the domain registrar.
- **D1 database region:** Must be created with `--location=weur` for Budapest proximity. This is a one-time setup decision.
- **Workers Paid plan:** The $5/month paid plan is recommended for production. Free tier's 10ms CPU limit is too restrictive for auth + DB operations.
- **Better Auth table schema interaction with Drizzle:** Better Auth creates its own tables. Need to verify there are no conflicts with Drizzle-managed tables in the same D1 database.
- **html5-qrcode iOS Safari compatibility:** The library hasn't been updated in 3 years. If iOS 18+ introduces camera API changes, a fallback to @yudiel/react-qr-scanner may be needed.
