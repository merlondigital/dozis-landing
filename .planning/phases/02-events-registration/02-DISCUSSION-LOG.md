# Phase 2: Events & Registration — Discussion Log

**Date:** 2026-03-29
**Mode:** Auto (--auto flag, all decisions auto-resolved)
**Duration:** ~1 min (no interactive Q&A)

## Gray Areas Identified

1. Event data model — genre tags structure, fields
2. Event listing layout — cards vs list
3. Next event highlighting — how to visually distinguish
4. QR code content — what to encode
5. QR code display — presentation style
6. Registration flow — one-tap vs confirmation
7. Admin event form — inline vs separate page
8. Event deletion — soft vs hard delete

## Auto-Resolved Decisions

| # | Area | Question | Selected | Rationale |
|---|------|----------|----------|-----------|
| 1 | Event data model | Genre tags: freeform or predefined? | Predefined enum | Fixed genre list from PROJECT.md context |
| 2 | Event listing | Card grid or list? | Card-based layout | Events have visual content (date, venue, genres) |
| 3 | Next event | How to highlight? | Larger hero card at top | Visually distinct, draws attention |
| 4 | QR content | What to encode? | HMAC-signed token (regId:eventId:userId:hmac) | Per REGN-02, verifiable at scan time |
| 5 | QR display | Display style? | Full-screen modal, white bg, max contrast | Per REGN-03, optimized for scanning |
| 6 | Registration | One-tap or confirmation? | One-tap | Per REGN-01, minimal friction |
| 7 | Admin form | Inline or separate page? | Separate form pages | Cleaner for complex multi-field form |
| 8 | Deletion | Soft or hard delete? | Hard delete with confirmation | Small app, no soft delete needed |

## Prior Decisions Applied

- Stack: Next.js App Router + @opennextjs/cloudflare (D-01)
- Routing: /app/* for authenticated app (D-06)
- Styling: Tailwind + shadcn/ui, DOZIS dark theme (D-22–25)
- Admin: role field in users table (D-19)
- Tech: qrcode.react for QR generation (from CLAUDE.md)

---
*Auto-generated, no interactive discussion took place*
