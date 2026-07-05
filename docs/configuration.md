# Configuration

## app.json
`app.json` defines Expo runtime configuration:
- App identity: name, slug, orientation, icon, and splash.
- Platform settings: iOS bundle ID, Android package, and calendar permissions.
- Plugins: notifications, fonts, calendar, and system UI integration.
- `newArchEnabled` is turned on for the project.

Treat these values as release-critical. Coordinate changes to identifiers, permissions, or plugins with maintainers.

## Environment and runtime config
The data layer supports two optional environment variables (read in `src/services/data.ts`):
- `EXPO_PUBLIC_API_BASE` overrides the programme base URL. If it includes `{year}`, it is replaced with the selected year.
- `EXPO_PUBLIC_WEB_PROXY_BASE` overrides the local web proxy base (defaults to `http://localhost:4000`).

Resolution order in `src/services/data.ts`:
- Web dev (`__DEV__` + `Platform.OS === "web"`): always use `EXPO_PUBLIC_WEB_PROXY_BASE` (or the default). `EXPO_PUBLIC_API_BASE` is ignored in this path.
- All other cases: use `EXPO_PUBLIC_API_BASE` when set, otherwise fall back to the production static host.
- In dev, a failed non-prod fetch falls back to the production host.

Static configuration lives in `src/config/`:
- `conference.ts` defines the supported years, titles/subtitles, and per-year time zones.
- `constants.ts` holds notification defaults, proxy defaults, and shared time/date constants.

`dev-proxy.mjs` is the local proxy used by `pnpm web` to avoid CORS issues when hitting the EuroPython static host.

## Setting EXPO_PUBLIC_* locally
This repo uses `app.json` (not `app.config.js`), so environment values must be supplied by your shell when you start Expo. Examples:

- Override the base API for native/dev builds:
  ```sh
  EXPO_PUBLIC_API_BASE="https://example.com/programme/ep{year}/releases/current" pnpm start
  ```
- Point web dev at a custom proxy origin:
  ```sh
  EXPO_PUBLIC_WEB_PROXY_BASE="http://localhost:4001" pnpm web
  ```

If you want `.env` support, add it explicitly and document it; it is not configured here.

## What contributors should and should not change
Safe to change:
- Conference metadata and the year list in `src/config/conference.ts` when a new programme is published.
- UI-focused constants like notification lead options in `src/config/constants.ts`.

Avoid changing without coordination:
- Bundle identifiers, Android package, or permission lists in `app.json`.
- Expo plugin list or `newArchEnabled`.
- Base URL resolution logic in `src/services/data.ts` (affects production data loading).
