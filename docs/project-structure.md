# Project structure

Imports use path aliases defined identically in `tsconfig.json` and `babel.config.js` (`@/*`, `@components/*`, `@hooks/*`, `@utils/*`, `@store/*`, `@screens/*`, `@navigation/*`, `@config/*`, `@app-types/*`, `@services/*`, `@theme`, `@data/*`). Metro doesn't resolve `tsconfig` paths natively, so these two config files are kept in sync manually — if you add a new alias, add it in both places.

## components/
Why it exists: reusable UI building blocks shared across screens (`layout/`, `home/`, `schedule/`, `inputs/`, `settings/`, `status/`, plus flat shared components like `SpeakerAvatar`, `MarkdownBody`).
Boundaries: keep components presentational and pass data/callbacks from screens. `components/layout/ScreenContainer.tsx` and `components/status/OfflineNotice.tsx` are intentional exceptions that read settings/navigation/conference-data state directly to render app chrome and banners — document similar exceptions if they're added.
Theming: UI tokens live in `src/theme.ts`; components access palette-only values via `src/hooks/useAppTheme.ts`. Extend tokens there to keep spacing, colors, and typography consistent.

## config/
Why it exists: centralized, static app constants and conference metadata (`conference.ts`, `constants.ts`).
Boundaries: no side effects, no runtime state, no environment reads — the app has no `EXPO_PUBLIC_*`/`process.env` usage anywhere (see [Configuration](configuration.md)). Values here are compile-time constants.

## data/
Why it exists: static content bundled with the app (onboarding copy, CoC URL/contacts, home-screen info cards, session type labels/colors).
Boundaries: no runtime logic or dynamic fetches; declarative data only.

## hooks/
Why it exists: shared logic that spans multiple screens/components — cross-cutting concerns (navigation fallbacks, theme derivation, notification sync) and side-effectful flows (calendar, PWA install prompt, notification deep-linking).
Boundaries: hooks should not render UI (the one exception, `useScheduleNotifications`, is mounted via a dedicated no-render wrapper component in `App.tsx` rather than rendering anything itself); keep them focused and composable.

## navigation/
Why it exists: route names, typed parameter lists, and stack/tab registration live in one place (`routes.ts`, `stackConfigs.ts`, `stacks.tsx`, `navigationRef.ts`). `AppTabs.tsx`/`AppTabs.native.tsx` is the one deliberate platform fork in the codebase — see [Architecture](architecture.md#native-vs-web-tab-bar-platform-split-files-not-a-runtime-branch).
Boundaries: no business logic here; navigation should not reach into services or stores directly (screens/hooks do that and pass results through).

## screens/
Why it exists: top-level views that orchestrate data loading, state, and layout for a route.
Boundaries: avoid defining reusable UI here; push reusable layout into `components/` and logic into `hooks/` or `utils/`. Filter/search/sort state is commonly owned by the screen itself (see `ScheduleScreen`) with computation via `useMemo`.

## services/
Why it exists: data access and normalization — network requests, response validation, and AsyncStorage caching for remote data (`conference.ts`, `conferenceTransform.ts`, `guards.ts`, `wifi.ts`).
Boundaries: no UI, navigation, or direct component coupling; return typed, normalized data only. This is distinct from `store/`, which owns *when* to call these and how the result is exposed to the component tree.

## store/
Why it exists: global state containers and persistence for settings, conference data, and favorites — each a React Context + provider (`settings.tsx`, `conferenceData.tsx`, `favorites.tsx`).
Boundaries: keep state operations focused on orchestration (loading, caching lifecycle, exposing setters) and persistence; data fetching/parsing belongs in `services/`.

## types/
Why it exists: TypeScript interfaces for raw upstream JSON payloads (`raw.ts`) and normalized app models (`conference.ts`).
Boundaries: no runtime code; types only.

## utils/
Why it exists: pure helpers and isolated side-effect wrappers — formatting, time, scheduling/sorting, notifications, calendar, storage, haptics, sharing (see [Architecture](architecture.md#utilities-srcutils) for the full list).
Boundaries: avoid React hooks and UI; keep logic testable (most of these are good candidates if tests are ever added — see [Testing](testing.md)) and side effects centralized rather than scattered across components.
