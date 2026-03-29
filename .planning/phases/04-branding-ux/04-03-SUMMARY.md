---
phase: 04-branding-ux
plan: 03
subsystem: ui
tags: [service-worker, offline, localStorage, qr-code, pwa]

# Dependency graph
requires:
  - phase: 04-01
    provides: QR display component and event detail actions with DOZIS branding
provides:
  - QR data localStorage caching utility (lib/qr-cache.ts)
  - Offline QR code display with cached data fallback
  - Service worker for static asset and navigation caching
  - Offline mode indicator for cached QR display
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [service-worker-caching, localStorage-qr-cache, offline-indicator-pattern]

key-files:
  created: [lib/qr-cache.ts, public/sw.js]
  modified: [components/events/qr-display.tsx, app/app/events/[id]/qr/page.tsx, components/events/event-detail-actions.tsx, app/layout.tsx]

key-decisions:
  - "30-day expiry for cached QR data in localStorage"
  - "Stale-while-revalidate for navigation, cache-first for static assets in SW"
  - "Inline script for SW registration to avoid React component overhead"

patterns-established:
  - "QR cache: dozis_qr_{eventId} keys with dozis_qr_index for enumeration"
  - "Offline detection: navigator.onLine + online/offline window events with SSR guard"
  - "SW cache versioning: dozis-v1 with old cache cleanup on activate"

requirements-completed: [UX-03]

# Metrics
duration: 2min
completed: 2026-03-29
---

# Phase 4 Plan 3: Offline QR Support Summary

**localStorage QR data caching with service worker for offline QR code display at event venues**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-29T19:55:35Z
- **Completed:** 2026-03-29T19:57:52Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- QR data cached in localStorage on every QR view (qrToken, eventId, eventName, eventDate) with 30-day expiry
- Offline indicator bar ("Offline mod -- mentett QR kod") with WifiOff icon shown when device is disconnected
- Service worker (88 lines) with cache-first for static assets, network-first with 3s timeout for navigation, API requests never cached
- SW registered on every page load via inline script in root layout

## Task Commits

Each task was committed atomically:

1. **Task 1: QR data cache utility and offline QR display with indicator** - `ad63232` (feat)
2. **Task 2: Service worker for static asset caching and registration** - `bb581e4` (feat)

## Files Created/Modified
- `lib/qr-cache.ts` - localStorage QR cache utility with cacheQrData, getCachedQrData, getAllCachedQrs, clearExpiredQrCache
- `public/sw.js` - Service worker with per-request-type caching strategies
- `components/events/qr-display.tsx` - Added offline state detection, amber indicator, and QR data caching on mount
- `app/app/events/[id]/qr/page.tsx` - Pass eventId prop to QrDisplay
- `components/events/event-detail-actions.tsx` - Pass eventId prop to QrDisplay
- `app/layout.tsx` - Service worker registration inline script

## Decisions Made
- 30-day expiry for cached QR data — long enough for event cycles, short enough to not accumulate stale data
- Stale-while-revalidate for navigation requests with 3-second timeout — ensures pages load fast and are cached for offline use
- Inline script for SW registration rather than a React component — simpler, no hydration overhead

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 4 (Branding & UX Polish) is now complete with all 3 plans executed
- The app has DOZIS branding, legal pages, and offline QR support
- Ready for verification and deployment

## Self-Check: PASSED

All files verified on disk, all commit hashes found in git log.

---
*Phase: 04-branding-ux*
*Completed: 2026-03-29*
