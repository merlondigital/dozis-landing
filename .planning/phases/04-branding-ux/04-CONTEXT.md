# Phase 4: Branding & UX Polish - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Final polish pass: DOZIS visual identity enforcement across all pages, mobile-first responsive design, Hungarian language completeness check, offline QR support via service worker, and all legally required pages (privacy policy, cookie policy, ÁSZF). This phase does NOT add new features — it refines everything built in Phases 1-3.

</domain>

<decisions>
## Implementation Decisions

### DOZIS Branding Enforcement
- **D-01:** Audit all pages for consistent DOZIS identity: dark navy background (#0a0e1a), amber accents (amber-400/500), blue accent for secondary elements
- **D-02:** Typography: Anton for headings (landing page hero, page titles), Montserrat for body text — verify all pages use correct fonts
- **D-03:** Spray-paint aesthetic: textured/distressed elements on key landing page sections, subtle grain overlay on hero areas
- **D-04:** Logo and favicon: ensure DOZIS logo is in header, favicon set correctly
- **D-05:** Consistent component styling: all Cards, Buttons, Inputs should follow the DOZIS dark theme — no unstyled defaults

### Mobile-First Responsive Design
- **D-06:** All interactive elements (buttons, links, form inputs) must have minimum 44px touch targets
- **D-07:** Audit all pages for responsive breakpoints: mobile (default), tablet (md:), desktop (lg:)
- **D-08:** QR scanner page: full viewport height on mobile, no scrolling needed during scan
- **D-09:** Event cards: stack vertically on mobile, 2-column on tablet, 3-column on desktop
- **D-10:** Admin tables (guest list, event list): horizontal scroll on mobile, full table on desktop
- **D-11:** Navigation: mobile-friendly header with hamburger menu if needed

### Hungarian UI Completeness
- **D-12:** Scan all components for any English text visible to users — replace with Hungarian
- **D-13:** Date formatting: always use Hungarian locale (date-fns hu locale)
- **D-14:** Error messages: all validation errors, auth errors, check-in feedback in Hungarian
- **D-15:** Form labels, placeholders, button text: all Hungarian
- **D-16:** Meta tags: page titles and descriptions in Hungarian

### Offline QR Support
- **D-17:** Cache user's active QR codes in localStorage on registration
- **D-18:** QR display page checks localStorage first — if cached QR data exists and network fails, show from cache
- **D-19:** Service worker for static asset caching (PWA-lite — no full PWA install in v1)
- **D-20:** "Offline mód" indicator shown when displaying cached QR

### Legal Pages
- **D-21:** Adatvédelmi Tájékoztató (Privacy Policy) at /legal/privacy — GDPR compliant, Hungarian
- **D-22:** Cookie Szabályzat (Cookie Policy) at /legal/cookies — minimal cookies (session only), Hungarian
- **D-23:** ÁSZF (Terms of Service) at /legal/terms — event registration terms, Hungarian
- **D-24:** Adatkezelő: TERMÉSZETES SZEMÉLY (natural person), NOT a company/legal entity
- **D-25:** Footer links to all legal pages on every app page
- **D-26:** Legal pages accessible without authentication (public routes)
- **D-27:** Data collected: email, name (first + last), birth year, address, event attendance history
- **D-28:** Data purpose: event registration, check-in verification, loyalty tracking
- **D-29:** Data retention: as long as user account exists, deletion on request
- **D-30:** Third parties: Resend (email), Cloudflare (hosting/data processing)

### Claude's Discretion
- Exact grain/texture overlay CSS approach
- Whether to add subtle animations (fade-in on page load, etc.)
- Exact service worker caching strategy (cache-first vs stale-while-revalidate)
- Landing page polish details

</decisions>

<canonical_refs>
## Canonical References

### Project Specs
- `.planning/PROJECT.md` — DOZIS branding details, admin names (POLOSAI, PETRUS, DAVE)
- `.planning/REQUIREMENTS.md` — INFR-05, UX-01, UX-02, UX-03
- `.planning/ROADMAP.md` — Phase 4 success criteria

### All Phase Outputs
- Phase 1-3 SUMMARY files for understanding all built pages and components
- `app/` directory tree — all pages to audit
- `components/` directory tree — all components to audit
- `app/globals.css` — current global styles
- `tailwind.config.ts` — current theme configuration

### External
- Anton font (Google Fonts) — already configured in layout.tsx
- Montserrat font (Google Fonts) — already configured in layout.tsx
- GDPR requirements for Hungarian websites

</canonical_refs>

<code_context>
## Existing Code Insights

### Pages to Audit
- `/` — Landing page (already branded in Phase 1)
- `/app/login` — Login page
- `/app/register` — Registration page
- `/app/page.tsx` — User dashboard
- `/app/events/page.tsx` — Event listing
- `/app/events/[id]/page.tsx` — Event detail
- `/app/events/[id]/qr/page.tsx` — QR display
- `/app/admin/page.tsx` — Admin dashboard
- `/app/admin/events/page.tsx` — Admin event list
- `/app/admin/events/new/page.tsx` — Create event
- `/app/admin/events/[id]/edit/page.tsx` — Edit event
- `/app/admin/events/[id]/scan/page.tsx` — QR scanner
- `/app/admin/events/[id]/guests/page.tsx` — Guest list

### Components to Audit
- `components/auth/*` — Login, OTP, register forms
- `components/app/*` — App shell, header
- `components/events/*` — Event cards, hero, QR display, register button
- `components/admin/*` — Event form, event list, guest list
- `components/checkin/*` — Scanner, feedback, manual entry
- `components/loyalty/*` — Loyalty card

### New Pages
- `/legal/privacy` — Privacy Policy (new)
- `/legal/cookies` — Cookie Policy (new)
- `/legal/terms` — Terms of Service (new)

</code_context>

<deferred>
## Deferred Ideas
- Full PWA (manifest + install prompt) — v2 (PLAT-01)
- Push notifications — v2 (PLAT-02)
- Apple/Google Wallet pass — v2 (PLAT-03)
- Advanced animations and micro-interactions — post-launch
</deferred>

---

*Phase: 04-branding-ux*
*Context gathered: 2026-03-29*
*Mode: auto*
