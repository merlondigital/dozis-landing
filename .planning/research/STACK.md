# Technology Stack

**Project:** DOZIS Event App
**Researched:** 2026-03-29

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

**Critical setup note:** On Cloudflare Workers, create ONE Drizzle/D1 instance per request in Hono middleware, share it downstream. Do NOT create the auth instance globally — D1 bindings only exist within request context. Add `nodejs_compat` flag to wrangler config.

### Email

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| resend | latest | Transactional email | Already decided. Simple REST API, works natively on Workers (uses fetch). Install the SDK (`npm i resend`), store API key as a Worker secret. Rate limit: 2 req/sec default — fine for OTP volume of a small event app. | HIGH |

**Integration pattern:**
```typescript
// In better-auth config's sendVerificationOTP callback:
const resend = new Resend(c.env.RESEND_API_KEY);
// Don't await — prevents timing attacks
resend.emails.send({
  from: 'DOZIS <noreply@dozis.hu>',
  to: email,
  subject: `${otp} — DOZIS belépési kód`,
  html: `<p>A belépési kódod: <strong>${otp}</strong></p>`
});
```

### QR Code Generation (Client-side)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| qrcode.react | ^4.2.0 | QR code rendering | **Use qrcode.react, not react-qr-code or lean-qr.** It has 1.3-1.9M weekly downloads (most popular by far), supports both SVG and Canvas rendering, simple API (`<QRCodeSVG value={...} />`), customizable colors/size/margin/embedded images. SVG mode is best for mobile display (crisp at any zoom). v4.2.0 is stable — no updates needed, it does one thing well. | HIGH |

**Usage for DOZIS:**
```tsx
<QRCodeSVG
  value={registrationToken}  // unique per user+event
  size={256}
  bgColor="transparent"
  fgColor="#f59e0b"  // amber to match DOZIS branding
  level="M"  // medium error correction — good balance
  marginSize={4}
/>
```

### QR Code Scanning (Camera, Admin-side)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| html5-qrcode | ^2.3.8 | QR scanning via camera | **Use html5-qrcode, not @yudiel/react-qr-scanner.** Reasons: (1) 887K weekly downloads, battle-tested, (2) Uses ZXing decoder underneath (same as alternatives), (3) Works on all mobile browsers (iOS Safari, Chrome Android), (4) No React wrapper needed — wrap it yourself in a useEffect hook for full control, (5) Supports camera switching (front/back). @yudiel/react-qr-scanner uses the Barcode Detection API which has inconsistent browser support (not available on Firefox, limited iOS). html5-qrcode's own decoder works everywhere. | MEDIUM |

**Alternative considered:** `@yudiel/react-qr-scanner` — Modern API, nice React hooks, but relies on Barcode Detection API which lacks universal browser support. For an event check-in app where reliability is critical (admin scans in dark club environment), proven cross-browser support wins.

**Note:** html5-qrcode hasn't been updated in 3 years (v2.3.8). It's stable, not abandoned — QR decoding doesn't need frequent updates. If issues arise, `@yudiel/react-qr-scanner` with its ZXing fallback is the backup.

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

```
DOZIS/
├── src/                        # Landing page (existing React app)
│   ├── App.jsx
│   └── ...
├── app/                        # Event app (new)
│   ├── src/
│   │   ├── main.tsx           # React entry
│   │   ├── App.tsx
│   │   ├── routes/            # React Router pages
│   │   ├── components/        # UI components
│   │   ├── lib/
│   │   │   └── auth-client.ts # better-auth client
│   │   └── styles/
│   └── index.html             # SPA entry HTML
├── worker/
│   ├── index.ts               # Hono app entry
│   ├── routes/                # API route handlers
│   ├── middleware/             # Auth, CORS, logging
│   ├── db/
│   │   ├── schema.ts          # Drizzle schema
│   │   └── migrations/        # Generated SQL
│   └── lib/
│       ├── auth.ts            # better-auth server config
│       └── email.ts           # Resend integration
├── drizzle.config.ts
├── vite.config.ts
├── wrangler.jsonc
├── tsconfig.json
└── package.json
```

## Installation

```bash
# Core backend
npm install hono drizzle-orm better-auth resend zod

# Core frontend
npm install react-router qrcode.react html5-qrcode

# Dev dependencies
npm install -D @cloudflare/vite-plugin drizzle-kit wrangler typescript \
  @types/react @types/react-dom tailwindcss @tailwindcss/vite

# Optional
npm install nanoid date-fns
```

## Key Configuration

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [react(), cloudflare()],
});
```

### wrangler.jsonc
```jsonc
{
  "name": "dozis",
  "main": "./worker/index.ts",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "not_found_handling": "single-page-application"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "dozis-db",
      "database_id": "<your-database-id>"
    }
  ]
}
```

### drizzle.config.ts
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './worker/db/schema.ts',
  out: './worker/db/migrations',
});
```

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
