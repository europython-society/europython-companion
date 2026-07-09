# Navigation

## Structure
Navigation is split into:
- A bottom tab navigator for the main app (`Home`, `Schedule`, `Speakers`, `Agenda`, `Settings`) — see [Architecture](architecture.md#navigation--tab-bar) for why there are two different tab-bar implementations (`AppTabs.tsx` for web, `AppTabs.native.tsx` for iOS/Android, picked by Metro's platform-extension resolution, not a runtime branch).
- A native-stack navigator per tab, configured in `src/navigation/stackConfigs.ts` and built into components by `src/navigation/stacks.tsx`.
- A standalone onboarding stack shown before the main tabs (not part of `tabScreens`/`AppTabs` — see [Architecture](architecture.md#boot-flow)).

Shared detail routes (`SessionDetail`, `SpeakerDetail`) are duplicated into the Home/Schedule/Speakers/Agenda stacks (not a single cross-tab modal stack), so pushing a detail screen from any tab keeps it within that tab's back-stack. Route names and typed param lists live in `src/navigation/routes.ts`.

## Screen registration
To register a screen, add it to the relevant stack config in `src/navigation/stackConfigs.ts`. `src/navigation/stacks.tsx` turns every entry in `stackConfigs` into a navigator component (`builtStacks`) eagerly at module load; `App.tsx` and `AppTabs` consume `builtStacks` by key.

For the full wiring checklist (including new tabs), see [docs/development-workflow.md](development-workflow.md).

## Route naming and labels
Route constants in `src/navigation/routes.ts` are the identifiers you pass to `navigate`:
- Tab routes are internal IDs ending in `Tab` (for example, `TabRoutes.Home` is `"HomeTab"`).
- Each tab's root stack route uses a `*Main` suffix (for example, `HomeStackRoutes.Home` is `"HomeMain"`, `AgendaStackRoutes.Agenda` is `"AgendaMain"`).
- UI labels come from `tabScreens` and each screen's `options.title` in `src/navigation/stackConfigs.ts`, not from route names.

The Agenda tab is the favorites feature: `TabRoutes.Agenda` renders a component named `MyAgendaScreen` in `stackConfigs.ts`, which is actually the default export of `src/screens/FavoritesScreen.tsx` — the route/tab concept is "My agenda" (its `tabScreens` title) but the underlying screen file and export are named `FavoritesScreen`/`FavoritesScreen`'s default export aliased to `MyAgendaScreen` at the import site.

## Typed navigation params
Route names and params are typed in `src/navigation/routes.ts`. Each stack has its own `*StackParamList`, tabs are typed with `RootTabParamList`, and `CombinedParamList` intersects everything for helpers that need to navigate across stacks (like `useAppNavigation`). Use those types with React Navigation hooks to keep params correct.

## Shared navigation helpers
`src/hooks/useAppNavigation.ts` centralizes cross-tab routing logic: `goToHomeTab`/`goToScheduleTab`/`goToSpeakersTab`/`goToAgendaTab`/`goToSettingsTab`, `openSession(sessionId)`, `openSpeaker(speakerId)`, `openNotificationsList`, `openCoC`, `openCoCContacts`. Detail-opening helpers try (1) the local stack if it already has the route, then (2) the parent tab navigator with a nested `{ screen, params }`, then (3) `navigationRef` directly. Tab-switch helpers go straight to the parent tab navigator or `navigationRef`. If you add a destination that should be reachable from multiple stacks, extend `useAppNavigation` so callers don't have to reimplement the fallback logic.

This is a **separate mechanism** from `src/hooks/useNotificationDeepLink.ts`, which handles OS-notification-tap deep linking by driving `navigationRef` directly (with a pending-ref buffer for cold starts before the navigator is ready) rather than going through `useAppNavigation`. If you change how session detail is reached, check both.

## Example: add a new screen
This example adds a `VenueMap` screen to the Home stack.

### 1) Create the screen
`src/screens/VenueMapScreen.tsx`
```tsx
import { Text } from "react-native-paper";
import ScreenContainer from "@components/layout/ScreenContainer";

export default function VenueMapScreen() {
  return (
    <ScreenContainer title="Venue map">
      <Text>Map content goes here.</Text>
    </ScreenContainer>
  );
}
```

### 2) Register the route name and params
`src/navigation/routes.ts`
```ts
export const HomeStackRoutes = {
  // ...existing routes
  VenueMap: "VenueMap",
} as const;

export type HomeStackParamList = {
  // ...existing params
  [HomeStackRoutes.VenueMap]: undefined;
};
```

### 3) Register the screen in the stack
`src/navigation/stackConfigs.ts`
```ts
import VenueMapScreen from "@screens/VenueMapScreen";

// inside stackConfigs.home.screens
{ name: HomeStackRoutes.VenueMap, component: VenueMapScreen, options: { title: "Venue map" } },
```

### 4) Link to it from an existing screen
```tsx
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList, HomeStackRoutes } from "@navigation/routes";

const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

navigation.navigate(HomeStackRoutes.VenueMap);
```

If `VenueMap` should be reachable from other tabs too (not just Home), add a helper to `useAppNavigation.ts` following the `openSession`/`openSpeaker` fallback pattern instead of navigating directly.
