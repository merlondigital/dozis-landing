# DÓZIS. Event App

## What This Is

Event management app a DÓZIS. budapesti elektronikus zenei kollektíva számára. A vendégek regisztrálnak eventekre, QR kódot kapnak amit az eventen beolvasnak az adminok. A userek látják a múltbeli eventjeiket és az 5. ingyenes event felé haladásukat. Az adminok teljes event- és vendégkezelést kapnak.

## Core Value

A vendég QR kóddal igazolhatja jelenlétét az eventen, és az 5. látogatása ingyenes — ez tartja visszatérőnek a közösséget.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User email OTP-vel tud regisztrálni és belépni (6 jegyű kód emailben)
- [ ] User regisztrálhat eventre és QR kódot kap
- [ ] User megmutathatja QR kódját az eventen (mobil képernyőn)
- [ ] Admin beolvashatja a QR kódot és igazolhatja a jelenlétet
- [ ] User látja a múltbeli eventjeit és részvételi számát
- [ ] User látja hány event van hátra az ingyenesig (5. event auto-free)
- [ ] User látja a következő eventet
- [ ] Admin tud eventet létrehozni, szerkeszteni, törölni
- [ ] Admin látja a megjelent vendégek listáját eventenként
- [ ] Admin tud vendégeket kezelni (lista, keresés)
- [ ] Az app a DÓZIS branding vizualitását használja (sötét, amber/kék, spray-paint)
- [ ] Magyar nyelvű felület

### Out of Scope

- Fizetés / jegyvásárlás — v2-re tervezve, v1-ben csak regisztráció
- SMS OTP — email OTP elegendő v1-hez
- Kétnyelvű felület — v1 csak magyar
- Push notifikációk — v2 feature
- Social login (Google/Instagram) — v2 feature

## Context

- A DÓZIS. landing page (React + Vite) már ebben a repóban van
- Az event app mellé kerül, valószínűleg /app route-ként vagy külön Vite entry-ként
- A kollektíva tagjai: POLOSAI, PETRUS, DAVE — ők az adminok
- Fix admin lista email alapján, nem kell admin meghívó rendszer
- Helyszín: DOPAMIN, Budapest
- Műfajok: UK Garage, Club Trance, Tech House, Deep House, Afro House, Bouncy
- Az 5. event ingyenes funkció automatikus: 4 igazolt jelenlét után az 5. regisztráció auto-free
- A QR kód a regisztrációkor generálódik, eventenként egyedi

## Constraints

- **Tech stack**: Cloudflare Pages + Workers + D1 — az egész Cloudflare ökoszisztémában
- **Email**: Resend az OTP emailekhez
- **Branding**: DÓZIS vizuális identitás kötelező (sötét háttér, amber/kék színvilág, Anton/Montserrat font, spray-paint effekt)
- **Nyelv**: Magyar UI, angol kód/commit
- **Admin auth**: Fix email lista a kódban/env-ben, ugyanaz az OTP flow mint a usereknek
- **Repo**: Meglévő DOZIS landing page repóba kerül

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Cloudflare Pages + Workers + D1 | Teljes ökoszisztéma, edge compute, D1 serverless SQL | — Pending |
| Email OTP (6 jegyű) auth | Jelszó nélküli, egyszerű, biztonságos | — Pending |
| QR generálás regisztrációkor | User azonnal látja a jegyét, nem kell jegyrendelés | — Pending |
| 5. event automatikus ingyenesség | User engagement, loyalty program jelleg | — Pending |
| Fix admin lista | Kis csapat (3 fő), nem kell admin management | — Pending |
| Fizetés v2-re halasztva | V1 fókusz a core flow-n (regisztráció → QR → jelenlét) | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-29 after initialization*
