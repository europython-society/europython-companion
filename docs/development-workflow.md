# Development workflow

## Add a new screen
1. Create the screen component in `src/screens/YourScreen.tsx` and wrap content with `ScreenContainer` for consistent layout.
2. Add a route name in `src/navigation/routes.ts` for the appropriate stack and update the matching `*StackParamList` type.
3. Register the screen in `src/navigation/stackConfigs.ts` under the target stack with a `title` option.
4. Navigate to the new screen from existing UI using a typed `useNavigation` hook or a helper in `useAppNavigation` if it should be shared across stacks.

If the new screen belongs in a new tab, also:
- Add a new stack entry in `stackConfigs` and include the root screen.
- Extend the `TabScreenConfig` `stackKey` union in `src/navigation/stackConfigs.ts`.
- Update `TabRoutes`, `RootTabParamList`, `tabIconNames`, and `tabScreens` in `src/navigation`.

## Add a new UI component safely
- Start in `src/components/` and choose the closest subfolder (for example, `schedule/` or `settings/`).
- Keep the component presentational; accept data and callbacks as props.
- Use theme values from `src/theme.ts` or `useAppTheme` rather than inline magic values.
- If a new token is needed, add it in `src/theme.ts` and wire it through `createPaperTheme` or `useAppTheme`.
- Prefer small, composable components over large UI blocks embedded in screens.

## Introduce shared logic
- Pure helpers belong in `src/utils/` (formatting, time calculations, mapping helpers).
- Side-effectful flows belong in `src/hooks/` or `src/utils/` depending on whether React state is needed.
- Persistent user state should live in `src/store/` and be exposed through a provider hook.
- Data fetching and normalization belong in `src/services/` only.

## Avoid breaking navigation or state
- Keep route names centralized in `src/navigation/routes.ts` and update the typed param lists together.
- For destinations used across multiple stacks, add or extend a helper in `src/hooks/useAppNavigation.ts` so cross-tab fallbacks stay consistent.
- Ensure screens using `useConferenceData`, `useSettings`, or `useFavorites` remain inside their providers in `App.tsx`.
- When adding new settings, update default values and persistence in `src/store/settings.tsx`.
- When changing schedule data, ensure `ConferenceData` normalization remains consistent with `src/types/raw.ts` and `src/types/conference.ts`.

## Native project workflow
The repository includes `ios/` and `android/` directories, and the `pnpm ios` / `pnpm android` scripts build from those projects. If you change native configuration, update platform files directly and keep `app.json` in sync when relevant. Avoid regenerating native folders unless maintainers ask for it.

## Testing onboarding flows
To re-run the first-run experience, go to Settings and use "Restart onboarding experience". The app switches back to the onboarding stack on the next render.
