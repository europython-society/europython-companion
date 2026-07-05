# Navigation

## Structure
Navigation is split into:
- A bottom tab navigator for the main app (`Home`, `Schedule`, `Speakers`, `Agenda`, `Settings`).
- A stack navigator per tab, configured in `src/navigation/stackConfigs.ts`.
- A standalone onboarding stack shown before the main tabs.

Shared detail routes (`SessionDetail`, `SpeakerDetail`) are reused across multiple stacks. Route names and typed param lists live in `src/navigation/routes.ts`.

## Screen registration
To register a screen, add it to the relevant stack config in `src/navigation/stackConfigs.ts`. The stack configs are turned into navigators at runtime in `App.tsx`.

For the full wiring checklist (including new tabs), see [docs/development-workflow.md](development-workflow.md).

## Route naming and labels
Route constants in `src/navigation/routes.ts` are the identifiers you pass to `navigate`:
- Tab routes are internal IDs ending in `Tab` (for example, `TabRoutes.Home` is `"HomeTab"`).
- Root stack routes use `*Main` suffixes (for example, `HomeMain`, `ScheduleMain`, `AgendaMain`).
- UI labels come from `tabScreens` and `options.title` in `src/navigation/stackConfigs.ts`, not from route names.

The Agenda tab is the favorites feature: `TabRoutes.Agenda` renders `FavoritesScreen` via the `agenda` stack config and is labeled "My agenda" in `tabScreens`.

## Typed navigation params
Route names and params are typed in `src/navigation/routes.ts`. Each stack has its own `*StackParamList`, and tabs are typed with `RootTabParamList`. Use those types with React Navigation hooks to keep params correct.

## Shared navigation helpers
`src/hooks/useAppNavigation.ts` centralizes cross-tab routing logic. Detail helpers like `openSession` and `openSpeaker` try the local stack first, then the parent tab, then `navigationRef`. Tab switching helpers (`goToScheduleTab`, `goToSettingsTab`, etc.) route directly to the tab navigator or `navigationRef`. If you add a destination that should be reachable from multiple stacks, extend `useAppNavigation` so callers do not have to reimplement the fallback logic.

## Example: add a new screen
This example adds a `VenueMap` screen to the Home stack.

### 1) Create the screen
`src/screens/VenueMapScreen.tsx`
```tsx
import React from "react";
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
