---
phase: quick
plan: 260330-gge
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/email.ts
  - app/legal/privacy/page.tsx
  - app/legal/terms/page.tsx
  - src/lib/wallet/generate-pass.ts
  - .planning/STATE.md
  - components/landing/navbar.tsx
autonomous: true
requirements: []
must_haves:
  truths:
    - "OTP emails are sent from noreply@dozisbp.hu"
    - "Legal pages show info@dozisbp.hu as contact email"
    - "Landing navbar has a Bejelentkezes button linking to /login"
    - "Login button is visible on both desktop and mobile menu"
  artifacts:
    - path: "src/lib/email.ts"
      provides: "Updated sender email"
      contains: "noreply@dozisbp.hu"
    - path: "app/legal/privacy/page.tsx"
      provides: "Updated contact emails"
      contains: "info@dozisbp.hu"
    - path: "app/legal/terms/page.tsx"
      provides: "Updated contact email"
      contains: "info@dozisbp.hu"
    - path: "components/landing/navbar.tsx"
      provides: "Login button in navbar"
      contains: "/login"
  key_links:
    - from: "components/landing/navbar.tsx"
      to: "/login"
      via: "Next.js Link or anchor href"
      pattern: "href.*login"
---

<objective>
Update all domain references from dozisdozis0@gmail.com to dozisbp.hu emails, update Apple Wallet pass type ID comment, and add a "Bejelentkezes" login button to the landing page navbar.

Purpose: Domain branding consistency + user access to login from landing page.
Output: Updated email references, navbar with login CTA.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/lib/email.ts
@app/legal/privacy/page.tsx
@app/legal/terms/page.tsx
@src/lib/wallet/generate-pass.ts
@components/landing/navbar.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update all domain references to dozisbp.hu</name>
  <files>src/lib/email.ts, app/legal/privacy/page.tsx, app/legal/terms/page.tsx, src/lib/wallet/generate-pass.ts, .planning/STATE.md</files>
  <action>
    1. `src/lib/email.ts` line 11: Change `from: "DOZIS. <onboarding@resend.dev>"` to `from: "DOZIS. <noreply@dozisbp.hu>"`

    2. `app/legal/privacy/page.tsx` — 4 changes:
       - Line 36: `href="mailto:dozisdozis0@gmail.com"` → `href="mailto:info@dozisbp.hu"`
       - Line 39: `dozisdozis0@gmail.com` (display text) → `info@dozisbp.hu`
       - Line 230: `href="mailto:dozisdozis0@gmail.com"` → `href="mailto:info@dozisbp.hu"`
       - Line 233: `dozisdozis0@gmail.com` (display text) → `info@dozisbp.hu`

    3. `app/legal/terms/page.tsx` — 2 changes:
       - Line 35: `href="mailto:dozisdozis0@gmail.com"` → `href="mailto:info@dozisbp.hu"`
       - Line 38: `dozisdozis0@gmail.com` (display text) → `info@dozisbp.hu`

    4. `src/lib/wallet/generate-pass.ts` line 20: Change comment `pass.hu.dozis.kupon` → `pass.hu.dozisbp.kupon`

    5. `.planning/STATE.md` line 104: Change `dozis.hu` → `dozisbp.hu` in the blocker text about Resend domain setup
  </action>
  <verify>
    <automated>grep -rn "dozisdozis0@gmail.com" src/ app/ && echo "FAIL: old gmail still found" || echo "PASS: no old gmail refs"; grep -rn "onboarding@resend.dev" src/ && echo "FAIL: resend.dev still found" || echo "PASS: no resend.dev refs"; grep -n "dozisbp.hu" src/lib/email.ts app/legal/privacy/page.tsx app/legal/terms/page.tsx src/lib/wallet/generate-pass.ts .planning/STATE.md</automated>
  </verify>
  <done>All email references use dozisbp.hu domain. No dozisdozis0@gmail.com or onboarding@resend.dev remains in source files.</done>
</task>

<task type="auto">
  <name>Task 2: Add login button to landing navbar</name>
  <files>components/landing/navbar.tsx</files>
  <action>
    Add a "BEJELENTKEZES" link to the navbar that navigates to `/login`. Use Next.js `Link` component from `next/link`.

    Desktop: Place the link AFTER the `<ul>` nav links and BEFORE the hamburger button in the JSX order. Style it as a small amber-outlined button:
    - `text-xs font-medium tracking-[0.15em] uppercase`
    - `border border-dozis-amber text-dozis-amber`
    - `px-4 py-2 rounded transition-all duration-300`
    - `hover:bg-dozis-amber hover:text-black`
    - `min-h-[44px] flex items-center` (44px touch target per project convention)
    - `max-md:hidden` to hide on mobile (shown in mobile menu instead)
    - `fontFamily: "var(--font-body)"` inline style to match nav links

    Mobile menu: Add the link as the LAST `<li>` inside the existing `<ul>` mobile menu, after the NAV_LINKS map. Style it distinctly from nav links:
    - `md:hidden` to only show in mobile menu context
    - `text-base font-medium tracking-[0.15em] uppercase`
    - `border border-dozis-amber text-dozis-amber`
    - `px-6 py-3 rounded mt-4 inline-block`
    - `hover:bg-dozis-amber hover:text-black transition-all duration-300`
    - `min-h-[44px]` touch target
    - Also call `setMenuOpen(false)` on click

    Import `Link` from `next/link` at the top of the file.
  </action>
  <verify>
    <automated>cd /Users/merlon/projects/DOZIS && npx next build 2>&1 | tail -5</automated>
  </verify>
  <done>Navbar shows "BEJELENTKEZES" button linking to /login. Visible as amber-outlined button on desktop (after nav links). Visible as last item in mobile menu. Build passes without errors.</done>
</task>

</tasks>

<verification>
- `grep -rn "dozisdozis0@gmail.com" src/ app/` returns no results
- `grep -rn "onboarding@resend.dev" src/` returns no results
- `grep -n "noreply@dozisbp.hu" src/lib/email.ts` finds the updated sender
- `grep -n "info@dozisbp.hu" app/legal/privacy/page.tsx app/legal/terms/page.tsx` finds all contact emails
- `grep -n "/login" components/landing/navbar.tsx` finds the login link
- `npx next build` completes without errors
</verification>

<success_criteria>
1. All email sender/contact references use dozisbp.hu domain
2. Landing navbar has visible login button on both desktop and mobile
3. Build passes
</success_criteria>

<output>
After completion, create `.planning/quick/260330-gge-dozisbp-hu-domain-update-and-add-login-b/260330-gge-SUMMARY.md`
</output>
