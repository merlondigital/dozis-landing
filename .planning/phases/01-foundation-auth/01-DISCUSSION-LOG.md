# Phase 1: Foundation & Auth - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 01-foundation-auth
**Areas discussed:** App-Landing integration, Auth flow UX, TypeScript & Styling, Better-auth config, Stack pivot

---

## Stack Pivot (Mid-Discussion)

Original plan: Vite + Hono + @cloudflare/vite-plugin (SPA + API)

User requested Next.js during discussion. Clarified: Next.js on Cloudflare, not Vercel.

| Option | Description | Selected |
|--------|-------------|----------|
| @opennextjs/cloudflare | Next.js App Router on CF Workers via OpenNext adapter. D1/Drizzle stays. | ✓ |
| Next.js + Vercel | Full Vercel platform, abandon Cloudflare | |

**User's choice:** @opennextjs/cloudflare
**Notes:** User also requested PWA compatibility. D1, Drizzle, better-auth, Resend all remain.

---

## App <-> Landing Page Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Egy projekt, route-alapú | Landing = /, App = /app/*, API = /api/*. One config, one deploy. | ✓ |
| Két külön Vite entry point | Separate builds in one project | |
| Landing marad statikus, app külön | Separate projects, possibly subdomain | |

**User's choice:** Egy projekt, route-alapú
**Notes:** None — clear choice.

---

## Auth Flow UX

| Option | Description | Selected |
|--------|-------------|----------|
| Egylapús, lépéses | Single /app/login page: email → OTP → dashboard. Auto-create new users. | ✓ |
| Két külön oldal | Separate /app/login and /app/register | |

**User's choice:** Egylapús, lépéses

### Login Redirect

| Option | Description | Selected |
|--------|-------------|----------|
| /app/ (Dashboard) | Main dashboard with next event, QR, status | ✓ |
| Mindig eredeti cél URL | Redirect back to original target after login | |

**User's choice:** /app/ (Dashboard)

### Session Duration

| Option | Description | Selected |
|--------|-------------|----------|
| 30 nap | Comfortable for event app, most mobile apps work this way | ✓ |
| 7 nap | Shorter, more secure but inconvenient | |
| 90 nap | Very long, higher security risk | |

**User's choice:** 30 nap

---

## Registration (First Login)

User specified: mandatory form after first login with lastName, firstName, birthYear, address.

| Option | Description | Selected |
|--------|-------------|----------|
| Kötelező, blokkoló | Must complete form to access app. All fields required. | ✓ |
| Opcionális, átugorható | Form shown but skippable | |

**User's choice:** Kötelező, blokkoló
**Notes:** User explicitly listed the fields: vezetéknév, keresztnév, születési év, lakcím

---

## TypeScript & Styling

### TypeScript

| Option | Description | Selected |
|--------|-------------|----------|
| Új kód TS, landing marad JSX | New code in TS, landing stays JSX | Initially selected |
| Full TSX (Next.js) | Everything TSX — superseded by Next.js pivot | ✓ |

**User's choice:** Full TSX (became automatic with Next.js switch)

### Styling

| Option | Description | Selected |
|--------|-------------|----------|
| Tailwind CSS | Tailwind only, no component library | |
| Tailwind + shadcn/ui | Tailwind base + shadcn component library (Radix) | ✓ |
| CSS Modules marad | Keep current approach | |

**User's choice:** Tailwind + shadcn/ui

---

## Admin Management

| Option | Description | Selected |
|--------|-------------|----------|
| Environment variable | ADMIN_EMAILS comma-separated wrangler secret | |
| D1 tábla (role mező) | Role field in users table | ✓ |
| Hardcoded tömb | const array in code | |

**User's choice:** D1 tábla (role mező)
**Notes:** Deviates from original PROJECT.md ("Fix email lista a kódban/env-ben"). User prefers DB-level flexibility.

---

## OTP Email

| Option | Description | Selected |
|--------|-------------|----------|
| Minimál branded | DOZIS logo, dark bg, amber accent, Hungarian text | ✓ |
| Plain text | Text only, maximum deliverability | |
| Te döntsd el | Claude's discretion | |

**User's choice:** Minimál branded

---

## Claude's Discretion

- Database schema details
- Next.js + @opennextjs/cloudflare configuration
- better-auth integration patterns
- shadcn/ui component selection
- PWA manifest/service worker details

## Deferred Ideas

- Full PWA offline support → Phase 3-4
- DOZIS spray-paint branding polish → Phase 4
- Landing page visual migration → Phase 4
