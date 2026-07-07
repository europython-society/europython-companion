# Configuration

## app.json
`app.json` defines Expo runtime configuration:
- App identity: name, slug, orientation, icon, and splash.
- Platform settings: iOS bundle ID, Android package, and calendar permissions.
- Plugins: notifications, fonts, calendar, and system UI integration.
- `newArchEnabled` is turned on for the project.

Treat these values as release-critical. Coordinate changes to identifiers, permissions, or plugins with maintainers.

## Environment and runtime config
The data layer supports one optional environment variable (read in `src/services/conference.ts`):
- `EXPO_PUBLIC_API_BASE` overrides the programme base URL. If it includes `{year}`, it is replaced with the selected year.

Resolution order in `src/services/conference.ts`:
- Use `EXPO_PUBLIC_API_BASE` when set, otherwise fall back to the production static host.
- A failed non-prod fetch falls back to the production host in dev.

Static configuration lives in `src/config/`:
- `conference.ts` defines the supported years, titles/subtitles, per-year time zones, and the Wi-Fi info URL.
- `constants.ts` holds notification defaults and shared time/date constants.

`static.europython.eu` and `ep2026.europython.eu` (Wi-Fi info) both send `Access-Control-Allow-Origin: *`, so web (dev and prod) fetches them directly — no proxy needed.

## Setting EXPO_PUBLIC_* locally
This repo uses `app.json` (not `app.config.js`), so environment values must be supplied by your shell when you start Expo. Example:

- Override the base API for native/dev builds:
  ```sh
  EXPO_PUBLIC_API_BASE="https://example.com/programme/ep{year}/releases/current" pnpm start
  ```

If you want `.env` support, add it explicitly and document it; it is not configured here.

## What contributors should and should not change
Safe to change:
- Conference metadata and the year list in `src/config/conference.ts` when a new programme is published.
- UI-focused constants like notification lead options in `src/config/constants.ts`.

Avoid changing without coordination:
- Bundle identifiers, Android package, or permission lists in `app.json`.
- Expo plugin list or `newArchEnabled`.
- Base URL resolution logic in `src/services/conference.ts` (affects production data loading).
