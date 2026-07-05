import { useMemo } from "react";
import {
  DefaultTheme as NavDefaultTheme,
  DarkTheme as NavDarkTheme,
} from "@react-navigation/native";
import type { Theme as NavTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
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

  return useMemo(() => {
    const effectiveMode = themeMode === "system" ? (systemScheme ?? "light") : themeMode;
    const paperTheme = createPaperTheme(
      effectiveMode === "dark" ? "dark" : effectiveMode === "light" ? "light" : "night",
    );
    const navBase =
      effectiveMode === "dark" || effectiveMode === "night"
        ? NavDarkTheme
        : NavDefaultTheme;
    const navTheme: NavTheme = {
      ...navBase,
      colors: {
        ...navBase.colors,
        background: paperTheme.colors?.background ?? navBase.colors.background,
        card: paperTheme.colors?.surface ?? navBase.colors.card,
        primary: paperTheme.colors?.primary ?? navBase.colors.primary,
        text: paperTheme.colors?.onSurface ?? navBase.colors.text,
        border: paperTheme.colors?.outline ?? navBase.colors.border,
        notification: navBase.colors.notification,
      },
    };
    return { paperTheme, navTheme };
  }, [themeMode, systemScheme]);
}

export default useAppNavTheme;
