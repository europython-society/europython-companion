import { useEffect, useMemo } from "react";
import {
  DefaultTheme as NavDefaultTheme,
  DarkTheme as NavDarkTheme,
} from "@react-navigation/native";
import type { Theme as NavTheme } from "@react-navigation/native";
import { Appearance, Platform, useColorScheme } from "react-native";
import type { MD3Theme } from "react-native-paper";

import { createPaperTheme } from "@theme";
import type { ThemeMode } from "@store/settings";

/**
 * Derives the active Paper theme and a matching React Navigation theme from
 * the user's theme-mode preference (system/light/dark/night).
 */
export function useAppNavTheme(themeMode: ThemeMode): {
  paperTheme: MD3Theme;
  navTheme: NavTheme;
} {
  const systemScheme = useColorScheme();

  const effectiveMode =
    themeMode === "system" ? (systemScheme === "dark" ? "dark" : "light") : themeMode;
  const isDark = effectiveMode === "dark" || effectiveMode === "night";

  // The native tab bar reads the OS light/dark trait directly, so it must be
  // kept in step with the in-app theme or it flashes the system appearance
  // when the two disagree. Not applicable on web (no such trait to override).
  useEffect(() => {
    if (Platform.OS === "web") return;
    Appearance.setColorScheme(themeMode === "system" ? "unspecified" : isDark ? "dark" : "light");
  }, [themeMode, isDark]);

  return useMemo(() => {
    const paperTheme = createPaperTheme(effectiveMode);
    const navBase = isDark ? NavDarkTheme : NavDefaultTheme;
    const navTheme: NavTheme = {
      ...navBase,
      colors: {
        ...navBase.colors,
        background: paperTheme.colors.background,
        card: paperTheme.colors.surface,
        primary: paperTheme.colors.primary,
        text: paperTheme.colors.onSurface,
        border: paperTheme.colors.outline,
        notification: navBase.colors.notification,
      },
    };
    return { paperTheme, navTheme };
  }, [effectiveMode, isDark]);
}

export default useAppNavTheme;
