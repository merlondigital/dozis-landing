<!-- GSD:project-start source:PROJECT.md -->
## Project

**DÓZIS. Event App**

Event management app a DÓZIS. budapesti elektronikus zenei kollektíva számára. A vendégek regisztrálnak eventekre, QR kódot kapnak amit az eventen beolvasnak az adminok. A userek látják a múltbeli eventjeiket és az 5. ingyenes event felé haladásukat. Az adminok teljes event- és vendégkezelést kapnak.

**Core Value:** A vendég QR kóddal igazolhatja jelenlétét az eventen, és az 5. látogatása ingyenes — ez tartja visszatérőnek a közösséget.

### Constraints

- **Tech stack**: Cloudflare Pages + Workers + D1 — az egész Cloudflare ökoszisztémában
- **Email**: Resend az OTP emailekhez
- **Branding**: DÓZIS vizuális identitás kötelező (sötét háttér, amber/kék színvilág, Anton/Montserrat font, spray-paint effekt)
- **Nyelv**: Magyar UI, angol kód/commit
- **Admin auth**: Fix email lista a kódban/env-ben, ugyanaz az OTP flow mint a usereknek
- **Repo**: Meglévő DOZIS landing page repóba kerül
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Platform
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Cloudflare Workers | - | Backend compute | Edge-first, D1/KV bindings, zero cold starts. Already decided. |
| Cloudflare D1 | - | Database (SQLite) | Serverless SQL, free tier generous (5M reads/day, 100K writes/day), 10GB limit per DB — way more than enough for event app |
| Cloudflare Pages/Workers Assets | - | Static hosting | SPA serving with `not_found_handling = "single-page-application"` |
| Vite | ^8.0.0 | Build tool | Already in repo. Fast HMR, native ESM. |
| React | ^19.2.4 | UI framework | Already in repo. |
### Build & Deploy
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @cloudflare/vite-plugin | ^1.30.2 | Vite-Workers integration | Official plugin, GA since April 2025. Runs Workers runtime locally during dev, handles asset building, replaces need for wrangler dev in most cases. **This is the recommended way to build full-stack apps on CF in 2026.** |
| wrangler | latest | CLI for D1 management & deploy | Still needed for D1 migrations, database creation, secret management. But Vite plugin handles dev server. |
| TypeScript | ^5.7 | Type safety | The project is JSX now but should migrate to TSX. Drizzle, Hono, Better Auth all have excellent TS support. |
### Backend Framework
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Hono | ^4.12.9 | API framework | **Use Hono, not bare Workers API.** Hono is ~12KB (tiny preset), zero deps, built on Web Standards. Provides routing, middleware, typed bindings, Zod validation integration. Cloudflare officially endorses it — they even blogged about its creator. Bare Workers API means writing your own router, middleware, error handling — pointless when Hono exists. | HIGH |
### ORM & Database
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Drizzle ORM | ^0.45.2 | ORM for D1 | **Use Drizzle, not raw SQL.** Type-safe queries, schema-as-code, automatic migrations via drizzle-kit, first-class D1 support. The Hono + Drizzle + D1 combo is the standard Cloudflare full-stack pattern in 2025-2026. Raw SQL means no type safety, manual migrations, and more error-prone code. | HIGH |
| drizzle-kit | latest | Migrations CLI | Generates SQL migrations from schema changes, supports D1 HTTP API for remote operations and local SQLite file for dev. | HIGH |
### Authentication
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| better-auth | ^1.5.6 | Auth framework | **Use better-auth with email-otp plugin, not custom auth.** Reasons: (1) Built-in email-OTP with configurable length/expiry/attempts, (2) Native D1 support since v1.5, (3) Hono integration documented on hono.dev, (4) Session management handled, (5) Race-condition-safe OTP validation. Custom auth means implementing OTP storage, expiry, rate limiting, session tokens manually — all solved problems. | HIGH |
| better-auth email-otp plugin | built-in | OTP sign-in flow | 6-digit OTP, 300s default expiry, 3 attempts max, supports "sign-in" and "email-verification" types. Configure `sendVerificationOTP` callback to call Resend. | HIGH |
### Email
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| resend | latest | Transactional email | Already decided. Simple REST API, works natively on Workers (uses fetch). Install the SDK (`npm i resend`), store API key as a Worker secret. Rate limit: 2 req/sec default — fine for OTP volume of a small event app. | HIGH |
### QR Code Generation (Client-side)
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| qrcode.react | ^4.2.0 | QR code rendering | **Use qrcode.react, not react-qr-code or lean-qr.** It has 1.3-1.9M weekly downloads (most popular by far), supports both SVG and Canvas rendering, simple API (`<QRCodeSVG value={...} />`), customizable colors/size/margin/embedded images. SVG mode is best for mobile display (crisp at any zoom). v4.2.0 is stable — no updates needed, it does one thing well. | HIGH |
### QR Code Scanning (Camera, Admin-side)
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| html5-qrcode | ^2.3.8 | QR scanning via camera | **Use html5-qrcode, not @yudiel/react-qr-scanner.** Reasons: (1) 887K weekly downloads, battle-tested, (2) Uses ZXing decoder underneath (same as alternatives), (3) Works on all mobile browsers (iOS Safari, Chrome Android), (4) No React wrapper needed — wrap it yourself in a useEffect hook for full control, (5) Supports camera switching (front/back). @yudiel/react-qr-scanner uses the Barcode Detection API which has inconsistent browser support (not available on Firefox, limited iOS). html5-qrcode's own decoder works everywhere. | MEDIUM |
### Routing (Client-side SPA)
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| React Router | ^7.x (library mode) | SPA routing | **Use React Router v7 in library mode, not TanStack Router.** This is a simple app with ~8-10 routes. React Router is 20KB (vs TanStack's 45KB), simpler API, the team already uses React (familiarity), and library mode is perfect for SPAs — just `<BrowserRouter>` + `<Routes>`. TanStack Router's type-safe params and search param management are overkill here. Framework mode is unnecessary since we have Hono for the backend. | HIGH |
### Validation
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| zod | ^4.3.6 | Schema validation | Zod v4 is 14x faster for strings, and has `@zod/mini` for edge (smaller bundle). Use for API request validation (Hono has built-in Zod middleware), form validation on client, and Drizzle schema validation integration (drizzle-zod is now built into drizzle-orm). | HIGH |
### Styling
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | ^4.x | Utility-first CSS | Fast dev, dark theme trivial, responsive mobile-first. DOZIS branding (dark bg, amber/blue accents) maps perfectly to Tailwind config. The landing page uses CSS modules now, but for the app portion Tailwind is more productive. | MEDIUM |
## Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @hono/zod-validator | latest | Request validation middleware | Every API endpoint that accepts input |
| nanoid | latest | Short unique ID generation | QR tokens, OTP codes if not using better-auth's built-in |
| date-fns | latest | Date formatting (Hungarian locale) | Event dates display in UI |
## What NOT to Use
| Technology | Why Not |
|------------|---------|
| Next.js | Overkill. This is an SPA + API, not an SSR app. Cloudflare Vite plugin + Hono is lighter and more native to CF. |
| Prisma | Poor Cloudflare D1 support, heavy runtime, designed for long-running servers not edge. |
| NextAuth / Auth.js | Designed for Next.js. Better Auth is purpose-built for Hono + CF Workers. |
| Lucia Auth | Deprecated as of March 2025. Better Auth is the recommended replacement. |
| TanStack Router | Overkill for ~10 routes. Adds complexity and bundle size without proportional benefit. |
| react-qr-reader | Abandoned (4 years, last v3.0.0-beta-1). |
| passport.js | Node.js-specific, doesn't run on Workers runtime. |
| Express.js | Node.js-specific, doesn't run on Workers runtime. |
| Cloudflare Pages (legacy) | Workers Assets is the recommended approach in 2026. Pages is being superseded. |
| Custom auth implementation | Tempting for "simple" OTP, but you'll end up reimplementing rate limiting, session management, CSRF protection, timing-safe comparison. Better Auth solves all of this. |
## Project Structure
## Installation
# Core backend
# Core frontend
# Dev dependencies
# Optional
## Key Configuration
### vite.config.ts
### wrangler.jsonc
### drizzle.config.ts
## Sources
- [Cloudflare Vite Plugin - Official Docs](https://developers.cloudflare.com/workers/vite-plugin/)
- [Cloudflare Vite Plugin - React SPA with API Tutorial](https://developers.cloudflare.com/workers/vite-plugin/tutorial/)
- [Hono - Cloudflare Workers Getting Started](https://hono.dev/docs/getting-started/cloudflare-workers)
- [Hono - Best Practices](https://hono.dev/docs/guides/best-practices)
- [Drizzle ORM - Cloudflare D1 Connection](https://orm.drizzle.team/docs/connect-cloudflare-d1)
- [Drizzle ORM - Get Started with D1](https://orm.drizzle.team/docs/get-started/d1-new)
- [Better Auth - Email OTP Plugin](https://better-auth.com/docs/plugins/email-otp)
- [Better Auth on Cloudflare - Hono Example](https://hono.dev/examples/better-auth-on-cloudflare)
- [Resend - Send with Cloudflare Workers](https://resend.com/docs/send-with-cloudflare-workers)
- [Cloudflare D1 Limits](https://developers.cloudflare.com/d1/platform/limits/)
- [qrcode.react - GitHub](https://github.com/zpao/qrcode.react)
- [html5-qrcode - GitHub](https://github.com/mebjas/html5-qrcode)
- [React Router - Picking a Mode](https://reactrouter.com/start/modes)
- [Zod v4 - Release Notes](https://zod.dev/v4)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
