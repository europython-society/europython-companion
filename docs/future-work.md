# Future work

## Known limitations
- Programme data is static JSON, refreshed on a timer/app-foreground/manual pull — there's no push-based "the schedule just changed" signal.
- User settings and favorites are stored locally with no cross-device sync.
- Local notifications are fully cancelled and rebuilt on every relevant change (favorites/settings/data), not incrementally diffed — fine at the current `MAX_SCHEDULED_NOTIFICATIONS` cap (180) but worth knowing if that cap or the rebuild frequency ever becomes a real cost.
- The "Push notifications" toggle in `SettingsScreen` is a disabled placeholder (`value={false}`, `disabled`) — there's no push notification backend or token registration anywhere in the app; only local (on-device) notifications are implemented.
- `Alert.alert` on web is a monkey-patch (`src/utils/webAlertPolyfill.ts`) over `window.confirm`/`window.alert`, which only supports a binary confirm/cancel — any call site written with 3+ buttons would degrade to picking one "action" button and one "cancel" button, silently dropping the others.
- `usePwaInstallPrompt`'s iOS detection (`/iPhone|iPod/`) excludes iPad, which reports a desktop Safari user agent — iPad Safari users won't see the manual "Add to Home Screen" instructions.
- `AppTabs.native.tsx` renders `null` briefly on non-iOS native platforms while tab icons are resolved asynchronously (`resolveAndroidIcons`) — a momentary blank tab bar on cold start.
- `WIFI_INFO_URL` in `src/config/conference.ts` is a per-event URL (currently pointing at a specific hash-looking path under `ep2026.europython.eu`) that needs manual updating for each new conference — it isn't derived from `CONFERENCE_YEARS`/year like the programme data URLs are.
- `CoCScreen`'s `WebView` only allows the first same-origin navigation (`onShouldStartLoadWithRequest`), so any in-page links on the CoC site beyond the initial load won't work inside the app — this is deliberate (keeps the WebView scoped to the CoC page) but worth knowing if the CoC site's structure changes.

## Likely evolution points
- New conference years require updates to `src/config/conference.ts` (`CONFERENCE_YEARS`, `CONFERENCE_META` including time zone, and `WIFI_INFO_URL`), plus validating `preferredRoomOrder` against the new venue's room names.
- If the upstream programme JSON shape changes, update `src/types/raw.ts` and `src/services/conferenceTransform.ts` together, and bump `SCHEMA_VERSION` in `src/config/conference.ts` so old cached payloads aren't reused (see [Data and state](data-and-state.md#cache-invalidation)).
- If push notifications are ever implemented, they'd need a backend (token registration + a push service) — nothing in this repo currently talks to one; the Settings UI slot already exists but is a no-op.
- Navigation may expand if new tabs or deep-linked entry points are introduced — remember there are two navigation-fallback systems (`useAppNavigation` and `useNotificationDeepLink`) to keep in sync (see [Architecture](architecture.md#two-independent-deep-linkfallback-systems-into-the-same-nav-tree)).
- A test runner could be added (see [Testing](testing.md)) — `src/services/conferenceTransform.ts`, `src/utils/schedule.ts`, and `src/services/guards.ts` are pure and would be the easiest first targets.

## Safe areas to experiment
- UI polish in `src/components/` and theming via `src/theme.ts`.
- Home screen content and onboarding copy in `src/data/`.
- Additional session type labels/colors in `src/data/sessionTypes.ts`.
- Notification lead-time options (`NOTIFICATION_LEAD_OPTIONS` in `src/config/constants.ts`).
- New screens added through the existing stack configuration flow (see [Navigation](navigation.md)).
