# Architecture Overview

EuroPython Companion is an Expo/React Native app that works fully offline once data is cached. It pulls static EuroPython programme JSON, normalizes it, and stores it in AsyncStorage alongside user settings and favorites. The app boots into providers for settings, data, and favorites, gates on onboarding/persisted settings hydration, then shows a bottom-tab experience (Home, Schedule, Speakers, Agenda, Settings). Local notifications mirror favorited sessions, keynotes, and breaks, and calendar sync lets users add sessions to their device calendar.

Big-picture flow:
- `SettingsProvider` hydrates/persists preferences (year, theme, TZ preference, notifications, haptics, onboarding) and toggles runtime haptics. UI renders only after hydration; onboarding renders until flagged complete.
- `AppContent` builds Paper/Navigation themes (light/dark/night), mounts providers, chooses onboarding vs main tabs, wires notification taps to navigate to sessions (queued if nav not ready), and starts schedule notification syncing.
- `ConferenceDataProvider` fetches/caches conference data per year; `FavoritesProvider` hydrates starred IDs; `useScheduleNotifications` keeps local notifications in sync with favorites/keynotes/breaks per schedule slot with a lead time and room labels.
- Tabs are built from `stackConfigs` with shared routes; helpers in `useAppNavigation` route to sessions/speakers/agenda/settings/CoC/notifications across stacks.

## Entry, Navigation & Theme
- `index.ts`: Registers `App` with Expo.
- `App.tsx`: Creates stack navigators from `stackConfigs`, bottom tabs from `tabScreens`, builds Paper and navigation themes via `createPaperTheme`, guards onboarding vs main tabs, listens to notification taps (including delayed navigation before nav ready), and wraps everything in `SettingsProvider`, `ConferenceDataProvider`, and `FavoritesProvider`.
- `src/navigation/routes.ts`: Route names and typed param lists for tabs and stacks (shared detail routes for sessions/speakers).
- `src/navigation/stackConfigs.ts`: Screen lists per stack, tab metadata (`tabIconNames`, titles), and stack component wiring.
- `src/navigation/navigationRef.ts`: Global navigation ref used when navigating outside hook context.
- `src/theme.ts`: Light/dark/night palettes, spacing/radius scales, `createPaperTheme` builder, and default `paperTheme`/`colors`.

## Config, Tooling & Scripts
- `app.json`: Expo config (icon/splash from `assets/icon.png`), permissions (calendar, reminders), plugins (expo-notifications/font/calendar/system-ui), Android/iOS/web basics, and new-architecture flag.
- `tsconfig.json` / `babel.config.js`: Path aliases (`@`, `@components`, `@hooks`, `@utils`, `@store`, `@screens`, `@navigation`, `@config`, `@app-types`, `@services`, `@theme`, `@data`) and module resolver setup; strict TS with unused checks.
- `package.json`: Expo entry at `index.ts`; scripts for `start`, `android`, `ios`, `web`, `format`/`format:check` (Prettier), and `typecheck` (`tsc --noEmit`).
- `.github/workflows/ci.yml`: CI runs pnpm install and `pnpm typecheck`.
- `src/config/constants.ts`: Shared defaults and caps (notification lead minutes/options, max scheduled notifications, ISO locale, max date sentinel, and refresh intervals).

## Data Sources & Types
- Remote JSON expected at `https://static.europython.eu/programme/ep{year}/releases/current/`; `EXPO_PUBLIC_API_BASE` can override. Both this host and `ep2026.europython.eu` (Wi-Fi info) send `Access-Control-Allow-Origin: *`, so web fetches them directly with no proxy.
- `src/types/raw.ts`: Raw JSON shapes for sessions, speakers, and schedule (map-shaped payloads, typed schedule events).
- `src/types/conference.ts`: App-facing normalized types (Speaker/Session with optional `slotId`, BreakSlot, DaySchedule, ConferenceData, SpeakerRef).
- `src/config/conference.ts`: Year list, default year, per-year title/subtitle/time zone, and `getConferenceMeta`.

## Services & Data Flow
- `src/services/guards.ts`: Runtime type guards for raw payloads, conference data, and Wi-Fi info.
- `src/services/conferenceTransform.ts`: Pure normalization (speakers/sessions) and `buildDays`, which uses schedule as the source of truth for room/time/website overrides while building per-day event lists (multi-slot support via `slotId`) and returns a merged `sessionsById` (earliest/latest slot times, unioned rooms) without mutating its input.
- `src/services/conference.ts`: Resolves base URL (env override, otherwise prod), fetches `sessions.json`/`speakers.json`/`schedule.json` (prod fallback in dev on failure), and caches payloads in AsyncStorage (`ep{year}:conferenceData:v2`) with fetched-at metadata. Returns offline cache when network fails.
- `src/services/wifi.ts`: Fetches live venue Wi-Fi credentials directly from the conference host, with AsyncStorage caching (network-first, cache fallback).

## State & Context
- `src/store/settings.tsx`: Settings context for year, theme mode (`system`/`light`/`dark`/`night`), TZ preference (conference vs local), notifications (session+break), notification lead minutes, haptics enabled, onboarding seen. Persists to AsyncStorage (`app:settings`), exposes setters, `availableYears`, `getEffectiveTimeZone`, and toggles runtime haptics.
- `src/store/conferenceData.tsx`: Fetches conference data via `loadConferenceDataWithMeta` and Wi-Fi info via `loadWifiInfo` together on every cycle, tracks loading/refreshing/error/offline/cache status, last fetched time, resolved year, and exposes `refresh`. Auto-refreshes silently on a timer (`DATA_REFRESH_INTERVAL_MS`) and on app-foreground (`AppState`), throttled to avoid duplicate fetches. Subscribes to NetInfo and infers offline via `navigator.onLine` for web.
- `src/store/favorites.tsx`: Favorites context persisted per year (`europython:favorites:{year}`) with `toggleFavorite`, `setFavorite`, `clearFavorites`, and `loadFavorites`/`saveFavorites` helpers.

## Hooks
- `src/hooks/useScheduleNotifications.ts`: Mirrors favorites + keynotes (and optional breaks) into local notifications per schedule slot with lead time and room labels, dedupes by slot/session id, and clears all if both toggles are off.
- `src/hooks/useCalendarSync.ts`: User-facing calendar helpers with confirmation alerts, haptics, busy state, bulk add-all-favorites, and per-session add/remove wired to Expo Calendar helpers.
- `src/hooks/useAppNavigation.ts`: Shared navigation helpers to open tabs/screens (sessions, speakers, agenda, settings, CoC, CoC contacts, notifications) with parent/tab/global ref fallbacks.
- `src/hooks/useEffectiveTimeZone.ts`: Returns effective TZ based on settings/year.
- `src/hooks/useSpeakerAvatars.ts`: Memoized map of speaker id → avatar URL/null.
- `src/hooks/useAppTheme.ts`: Returns active Paper theme plus derived palette (light/dark).

## Components
Layout:
- `components/layout/ScreenContainer.tsx`: Page shell with safe-area padding, optional header/back button, info button or header actions, and “old data” banner linking to Settings when not on latest year.
- `components/layout/PaddedScrollView.tsx`: ScrollView with configurable padding and bottom spacing.

Home:
- `components/home/HomeHeroCard.tsx`: Hero card with CTA buttons for schedule/speakers.
- `components/home/UpcomingList.tsx`: Upcoming (optionally favorites-only) sessions/breaks card; auto-refreshes “now,” uses favorites/time zone, links to agenda, shows helper text when empty, and renders speaker avatars when available.
- `components/home/NeedToKnowList.tsx`: Renders InfoCards from `homeInfo` data with navigation-bound actions.

Schedule:
- `components/schedule/SessionList.tsx`: SectionList grouping schedule items by start label with refresh control, favorites support, speaker avatars, and break rendering.
- `components/schedule/SessionListItem.tsx`: Session row with accent border by session type, subtitle (room/date/time), speaker avatars/names, and favorite toggle/star.
- `components/schedule/BreakListItem.tsx`: Highlighted card for breaks with coffee icon and time range.
- `components/schedule/ScheduleFilters.tsx`: Day chips with auto-scroll-to-selected, expandable track dropdown, level chips, and clear-filters helper.
- `components/schedule/FavoriteToggleButton.tsx`: IconButton with haptics and star/outline states.
- `components/schedule/SessionTypeLegendDialog.tsx`: Dialog showing session-type color legend.

Inputs & Settings UI:
- `components/inputs/SearchBar.tsx`: Styled Paper Searchbar with clear icon.
- `components/inputs/ChipPicker.tsx`: Generic chip-based single-select.
- `components/settings/SettingsSection.tsx`: Section wrapper with optional card/action slot.
- `components/settings/SettingsRow.tsx`: Basic settings row plus `SettingsSwitchRow` for switches.

Status/UI helpers:
- `components/status/OfflineBanner.tsx`: Cached/offline banner.
- `components/status/OfflineNotice.tsx`: Chooses offline/cached/failed messages with last-updated timestamp.
- `components/status/StateMessage.tsx`: Centered message with optional spinner/subtitle.
- `components/status/DataBoundary.tsx`: Guard for loading/error/empty states with optional header slot.

Shared/display:
- `components/SpeakerListItem.tsx`: Speaker card row with avatar/initials and affiliation.
- `components/SpeakerAvatar.tsx`: Avatar/initials wrapper with name fallback.
- `components/SocialLinksRow.tsx`: Icon row opening social/contact links.
- `components/DetailActionRow.tsx`: Stack of icon actions for detail headers (share/favorite/calendar, etc.).
- `components/InfoCard.tsx`: Outlined card with title, bullet lines, and inline actions.
- `components/MarkdownBody.tsx`: Markdown renderer with themed styles.
- `components/ContactCard.tsx`: Contact details card for CoC contacts.

## Screens
- `screens/OnboardingScreen.tsx`: Multi-slide onboarding (notifications/Discord actions) that marks onboarding complete.
- `screens/HomeScreen.tsx`: Home hub with hero card, offline notice, upcoming favorites, and “Need to know” cards.
- `screens/ScheduleScreen.tsx`: Schedule browser with search, day/track/level filters, offline notice, session type legend dialog, and SectionList rendering by start time; defaults to today’s day when available.
- `screens/SpeakersScreen.tsx`: Speaker directory with search and alphabetized cards.
- `screens/SpeakerDetailScreen.tsx`: Speaker profile with bio markdown, social links, sessions list (favorites toggle), and share.
- `screens/SessionDetailScreen.tsx`: Session detail with abstract markdown, session metadata, speaker list, favorite toggle, share, calendar add/remove (lead time respected), offline notice.
- `screens/FavoritesScreen.tsx`: “My agenda” of starred sessions with add-all-to-calendar, refresh, legend dialog, and empty-state helper.
- `screens/SettingsScreen.tsx`: Year/theme selection (supports “night”), favorites export/clear, notification toggles (sessions with lead time, breaks, placeholder push toggle), haptics, time zone preference, onboarding reset, data freshness info, and refresh button; link to scheduled notifications.
- `screens/NotificationsScreen.tsx`: Lists scheduled local notifications with trigger timing using normalized triggers, sorted by scheduled time.
- `screens/CoCScreen.tsx`: WebView for Code of Conduct with header-hiding JS, guarded navigation, actions for CoC contacts/open-in-browser.
- `screens/CoCContactsScreen.tsx`: CoC contacts list from JSON plus primary email card.

## Utilities
- `utils/notifications.ts`: Permission caching/reset, permission prompt helper with haptics, normalize triggers, schedule/cancel session & break notifications (cap at 180) with lead-time copy for sessions and break messaging.
- `utils/calendar.ts`: Expo Calendar helpers to ensure/create writable calendar per year, cache event IDs in AsyncStorage, add/remove/check session events with lead-time alarms and room/notes helpers, and prompt to open settings if calendar permission is denied.
- `utils/format.ts`: Room label helper, session time range/subtitle builders, minutes-from-ms formatter, and initials helper.
- `utils/time.ts`: Start-time labels, conference-day labels (TZ-safe), ISO date formatting, upcoming check, fetched-at formatting, and local time zone lookup.
- `utils/schedule.ts`: Keynote check, break/session type guards, plus schedule-oriented sorting/grouping helpers and adapters for sortable items (used for notification list ordering).
- `utils/sessionTypes.ts`: Session-type accent resolver and legend hook backed by data map.
- `utils/share.ts`: Safe share helper with alert fallback.
- `utils/haptics.ts`: Toggleable haptics wrappers for selection/impact/success/warning.
- `utils/storage.ts`: Safe AsyncStorage load/save JSON helpers plus a safe static JSON loader wrapper for optional bundler `require`.

## Data & Content
- `src/data/homeInfo.ts`: “Need to know” InfoCard content plus navigation action keys.
- `src/data/onboarding.ts`: Onboarding slide copy and Discord link.
- `src/data/sessionTypes.ts`: Session-type accent colors and legend entries.
- `src/data/coc.ts`: CoC URL used by the WebView screen.
- `src/data/coc_contacts.json`: Optional CoC contacts consumed by the contacts screen.
- Remote programme data: `sessions.json`, `speakers.json`, `schedule.json` hosted per year at the static EuroPython endpoint.
