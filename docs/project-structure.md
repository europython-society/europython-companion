# Project structure

Imports use path aliases defined in `tsconfig.json` and `babel.config.js` (for example, `@components/*`, `@screens/*`). Keep those aliases aligned when moving or renaming folders.

## components/
Why it exists: reusable UI building blocks shared across screens (layout, lists, buttons, status states).
Boundaries: keep components presentational and pass data/callbacks from screens. `components/layout/ScreenContainer.tsx` is an intentional exception that reads settings and navigation state to render app chrome and banners; document similar exceptions if they are added.
Theming: UI tokens live in `src/theme.ts`, and components can access them via `src/hooks/useAppTheme.ts`. Extend tokens there to keep spacing, colors, and typography consistent.

## config/
Why it exists: centralized app constants and conference metadata used across the UI.
Boundaries: avoid side effects and runtime state; keep values static and deterministic.

## data/
Why it exists: static content that is bundled with the app (onboarding copy, CoC URL, info cards, session type labels).
Boundaries: no runtime logic or dynamic fetches; keep this as declarative data only.

## hooks/
Why it exists: shared logic that spans multiple screens or components, especially side-effectful flows.
Boundaries: hooks should not render UI; keep them focused and composable.

## navigation/
Why it exists: route names, typed parameter lists, and stack/tab registration live in one place.
Boundaries: no business logic here; navigation should not reach into services or stores.

## screens/
Why it exists: top-level views that orchestrate data loading, state, and layout for a route.
Boundaries: avoid defining reusable UI here; push reusable layout into `components/` and logic into `hooks/` or `utils/`.

## services/
Why it exists: data access and normalization, including network requests and caching.
Boundaries: avoid UI, navigation, or direct component coupling; return typed data only.

## store/
Why it exists: global state containers and persistence for settings, conference data, and favorites.
Boundaries: keep state operations focused on storage and access; data parsing belongs in `services/`.

## types/
Why it exists: TypeScript interfaces for raw API payloads and normalized app models.
Boundaries: no runtime code; this is types only.

## utils/
Why it exists: pure helpers and isolated side-effect wrappers (formatting, time, notifications, calendar, storage).
Boundaries: avoid React hooks and UI; keep logic testable and side effects centralized.
