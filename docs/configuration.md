# Configuration

## app.json
`app.json` defines Expo runtime configuration:
- App identity: name (`EuroPython`), slug, orientation, icon, and splash screen.
- Platform settings: iOS bundle ID (`eu.europython.companion`), Android package (same id), calendar permissions (`NSCalendarsUsageDescription` on iOS, `READ_CALENDAR`/`WRITE_CALENDAR` on Android), web manifest basics (favicon, name, description, theme color).
- Plugins: `expo-notifications`, `expo-font`, `expo-calendar`, `expo-system-ui`, `expo-status-bar`, `expo-image`, `expo-splash-screen`.
- `newArchEnabled` is turned on for the project (there is no legacy-architecture code path to maintain).

Treat these values as release-critical. Coordinate changes to identifiers, permissions, or plugins with maintainers.

## There is no runtime environment-variable configuration
Unlike some Expo projects, this app reads **no** `process.env`/`EXPO_PUBLIC_*` values anywhere in `src/` or `App.tsx`. Everything that varies by environment is a static constant in `src/config/`:

- **`src/config/conference.ts`** — `API_BASE` (`"https://static.europython.eu/programme"`, hardcoded), `CONFERENCE_YEARS`/`DEFAULT_CONFERENCE_YEAR`, `CONFERENCE_META` (per-year title/subtitle/time zone/preferred room order), `SCHEMA_VERSION` (conference-data cache-key version), `WIFI_INFO_URL` (a conference-specific URL that has needed manual updating between events — it currently points at a per-event, hash-looking path under `ep2026.europython.eu`).
- **`src/config/constants.ts`** — notification lead-time defaults/options, the scheduled-notification cap, date/locale formatting constants, and the two refresh intervals (`UPCOMING_REFRESH_INTERVAL_MS` for the "now" tick on the home screen, `DATA_REFRESH_INTERVAL_MS` for both the conference-data cache TTL and the silent background refresh interval).

To point the app at a different data source (e.g. a staging environment), edit `API_BASE` in `src/config/conference.ts` directly — there is no `.env` mechanism, and `app.json` (not `app.config.js`) is used, so there's no `extra`-based config injection either. If you want that flexibility, it would need to be added explicitly.

`static.europython.eu` and the Wi-Fi info host both send `Access-Control-Allow-Origin: *`, so web fetches them directly with no proxy — there is no dev proxy anywhere in this repo.

## What contributors should and should not change
Safe to change:
- Conference metadata and the year list in `src/config/conference.ts` when a new programme is published (also update `WIFI_INFO_URL` — it's venue/event-specific and doesn't auto-update).
- UI-focused constants like notification lead options in `src/config/constants.ts`.
- A year's `preferredRoomOrder` in `CONFERENCE_META` (best-effort, case-insensitive exact-match room ordering for schedule display; safe to leave empty).

Avoid changing without coordination:
- Bundle identifiers, Android package, or permission lists in `app.json`.
- Expo plugin list or `newArchEnabled`.
- `API_BASE`/`SCHEMA_VERSION` in `src/config/conference.ts` — `API_BASE` affects production data loading for everyone; `SCHEMA_VERSION` must be bumped (not just edited) whenever `ConferenceData`'s normalized shape changes, so cached payloads from the previous shape aren't reused (see [Data and state](data-and-state.md)).
