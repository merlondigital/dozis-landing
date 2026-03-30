---
phase: quick
plan: 260330-gge
subsystem: branding, navigation
tags: [domain, email, navbar, login]
dependency-graph:
  requires: []
  provides: [dozisbp-hu-emails, landing-login-button]
  affects: [email-sending, legal-pages, landing-navbar]
tech-stack:
  added: []
  patterns: [next-link-for-internal-nav]
key-files:
  created: []
  modified:
    - src/lib/email.ts
    - app/legal/privacy/page.tsx
    - app/legal/terms/page.tsx
    - src/lib/wallet/generate-pass.ts
    - .planning/STATE.md
    - components/landing/navbar.tsx
decisions:
  - Desktop login button placed after nav links, before hamburger menu in DOM order
  - Mobile login button as last li in mobile menu for natural flow
metrics:
  duration: 2min
  completed: "2026-03-30T09:56:44Z"
---

# Quick Task 260330-gge: dozisbp.hu Domain Update and Login Button Summary

All email/domain references updated to dozisbp.hu and landing navbar now has a "Bejelentkezes" login button on both desktop and mobile.

## Task Results

| Task | Name | Status | Commit | Key Changes |
|------|------|--------|--------|-------------|
| 1 | Update all domain references to dozisbp.hu | Done | 05eeaa5 | 5 files: email sender, legal contact emails, wallet pass type ID comment, STATE.md blocker |
| 2 | Add login button to landing navbar | Done | 7c8f0c0 | Desktop amber-outlined button + mobile menu item, both link to /login |

## Changes Made

### Task 1: Domain Reference Updates
- `src/lib/email.ts`: Sender changed from `onboarding@resend.dev` to `noreply@dozisbp.hu`
- `app/legal/privacy/page.tsx`: 4 occurrences of `dozisdozis0@gmail.com` replaced with `info@dozisbp.hu`
- `app/legal/terms/page.tsx`: 2 occurrences of `dozisdozis0@gmail.com` replaced with `info@dozisbp.hu`
- `src/lib/wallet/generate-pass.ts`: Comment updated `pass.hu.dozis.kupon` to `pass.hu.dozisbp.kupon`
- `.planning/STATE.md`: Blocker text updated from `dozis.hu` to `dozisbp.hu`

### Task 2: Navbar Login Button
- Added `Link` import from `next/link`
- Reordered JSX: logo -> ul (nav links) -> desktop login button -> hamburger
- Desktop: `max-md:hidden` amber-outlined button with 44px touch target, hover fills amber
- Mobile: Last `<li>` in the `<ul>` mobile menu, `md:hidden`, calls `setMenuOpen(false)` on click
- Both use `font-body` and DOZIS amber branding

## Verification Results

- No `dozisdozis0@gmail.com` references remain in `src/` or `app/`
- No `onboarding@resend.dev` references remain in `src/`
- `noreply@dozisbp.hu` confirmed in `src/lib/email.ts`
- `info@dozisbp.hu` confirmed in both privacy and terms pages
- `/login` link confirmed in `components/landing/navbar.tsx`
- `npx next build` passes without errors

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED
