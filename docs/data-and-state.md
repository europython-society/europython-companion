# Data and state

## Data sources and normalization
Programme data is loaded from three JSON endpoints (`sessions.json`, `speakers.json`, `schedule.json`). `src/services/data.ts`:
- Resolves a base URL from `EXPO_PUBLIC_API_BASE`, a web proxy base, or the production static host.
- Normalizes speakers and sessions into `ConferenceData`.
- Builds per-day schedules, creating break slots and assigning `slotId` when a session appears in multiple time slots.
- Merges rooms and schedule overrides back into session records.
- Caches the payload in AsyncStorage under `ep{year}:conferenceData:v2` with `fetchedAt` metadata.

## Cache invalidation
If you change `ConferenceData` shape or normalization logic, bump the version suffix in `conferenceCacheKey` in `src/services/data.ts` (for example, `v2` to `v3`) so stale payloads are not reused. For local testing, clearing app storage or reinstalling also resets cached data.

## Store responsibilities
- `src/store/conferenceData.tsx` owns loading, refresh, offline state, and cache tracking. Screens read it via `useConferenceData`.
- `src/store/favorites.tsx` stores starred session IDs per year (`europython:favorites:{year}`) and exposes `toggleFavorite` and `clearFavorites`.
- `src/store/settings.tsx` persists user preferences (`app:settings`) including theme, time zone preference, notifications, and onboarding state.

## Derived state
Derived values are computed close to where they are used:
- Schedule filtering, search, and sorting are computed in screens using `useMemo`.
- `useEffectiveTimeZone` derives the time zone from settings + conference metadata.
- `useSpeakerAvatars` builds a memoized map of speaker IDs to avatar URLs.
- Session type colors and legends are mapped through `utils/sessionTypes.ts` and `data/sessionTypes.ts`.

## Side effects and isolation
Side effects are centralized so screens stay declarative:
- Notifications are scheduled in `utils/notifications.ts` and orchestrated by `useScheduleNotifications`.
- Calendar integration is implemented in `utils/calendar.ts` and exposed as user flows via `useCalendarSync`.
- Storage helpers in `utils/storage.ts` are used for settings/favorites, while `src/services/data.ts` and `src/utils/calendar.ts` use AsyncStorage directly for cache payloads.
- Runtime haptics are toggled via `setHapticsEnabledRuntime` in `src/utils/haptics.ts` when settings change.
