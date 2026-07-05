# Architecture

## Runtime composition
The app bootstraps in `App.tsx` with `SettingsProvider` always mounted to hydrate preferences before rendering. `ConferenceDataProvider` and `FavoritesProvider` are mounted only after onboarding completes, when the main tab navigator is shown.

Navigation is layered: an onboarding stack is shown until the settings flag is set, then a bottom tab navigator hosts per-tab stack navigators built from `src/navigation/stackConfigs.ts`. Onboarding screens should not call `useConferenceData` or `useFavorites` because those providers are not mounted yet.

## Data flow
High-level flow at runtime:
1. `src/services/data.ts` fetches and normalizes `sessions.json`, `speakers.json`, and `schedule.json`.
2. `src/store/conferenceData.tsx` owns fetch state and exposes `useConferenceData` for screens.
3. Screens render lists/detail views and pass data down to UI components.
4. User actions update local state through `src/store/settings.tsx` and `src/store/favorites.tsx`.

## Hooks and cross-cutting logic
Hooks are used to keep screens thin and to centralize side effects:
- `useScheduleNotifications` mirrors favorites/keynotes/breaks into local notifications.
- `useCalendarSync` wraps calendar access, confirmations, and haptics.
- `useAppNavigation` normalizes navigation behavior across stacks and tabs.
- `useEffectiveTimeZone` and `useAppTheme` standardize derived values.

## Constraints and tradeoffs
- Offline-first caching favors resilience over live updates; manual refresh is explicit.
- Programme data is treated as static JSON; changes in upstream shape require updates in `src/services/data.ts`.
- User preferences and favorites are device-local only; there is no account sync.
- Local notifications are fully re-scheduled and capped to avoid OS limits.
- The tab + stack model simplifies deep navigation at the cost of more route wiring.
