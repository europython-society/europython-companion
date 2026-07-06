import { MD3LightTheme, MD3DarkTheme, MD3Theme } from "react-native-paper";

type Palette = {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  favorite: string;
};

export const lightPalette: Palette = {
  primary: "#7a7ebd",
  primaryContainer: "#dcdff5",
  secondary: "#ee714b",
  secondaryContainer: "#f7d4c8",
  onSecondaryContainer: "#5a2315",
  background: "#f4ecdf",
  surface: "#faf4eeff",
  surfaceAlt: "#ebe4ddff",
  border: "#d8cbbd",
  text: "#1b1e2a",
  textMuted: "#5a6072",
  favorite: "#fabc1b",
};

export const darkPalette: Palette = {
  primary: "#757acb",
  primaryContainer: "#2c3454",
  secondary: "#8bd0ff",
  secondaryContainer: "#203043",
  onSecondaryContainer: "#d8f0ff",
  background: "#0f1628",
  surface: "#111a2d",
  surfaceAlt: "#1b2335",
  border: "#3a4463",
  text: "#e6e8f3",
  textMuted: "#9fa6c0",
  favorite: "#fabc1b",
};
export const nightPalette: Palette = {
  ...darkPalette,
  background: "#000000",
  surface: "#121212",
  surfaceAlt: "#1e1e1e",
  border: "#2c2c2c",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  pill: 999,
};

function tint(base: string, accent: string, amount: number): string {
  const b = parseInt(base.slice(1, 7), 16);
  const a = parseInt(accent.slice(1, 7), 16);
  const mix = (shift: number) => {
    const bc = (b >> shift) & 255;
    const ac = (a >> shift) & 255;
    return Math.round(bc + (ac - bc) * amount);
  };
  return `#${[mix(16), mix(8), mix(0)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export const paperTheme: MD3Theme = createPaperTheme("light");

export function createPaperTheme(mode: "light" | "dark" | "night"): MD3Theme {
  const palette =
    mode === "light" ? lightPalette : mode === "dark" ? darkPalette : nightPalette;
  const base = mode === "dark" || mode === "night" ? MD3DarkTheme : MD3LightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.primary,
      secondary: palette.secondary,
      primaryContainer: palette.primaryContainer,
      secondaryContainer: palette.secondaryContainer,
      onSecondaryContainer: palette.onSecondaryContainer,
      background: palette.background,
      surface: palette.surface,
      surfaceVariant: palette.surfaceAlt,
      outline: palette.border,
      outlineVariant: palette.border,
      onSurface: palette.text,
      onSurfaceVariant: palette.textMuted,
      onPrimary: "#ffffff",
      // MD3 elevation is meant to be a subtle primary-tinted overlay on surface,
      // not a flat color swap — this keeps level1 (mode="elevated" Card default)
      // close enough to plain surface to not clash with nested outlined cards.
      elevation: {
        ...base.colors.elevation,
        level0: palette.surface,
        level1: tint(palette.surface, palette.primary, 0.05),
        level2: tint(palette.surface, palette.primary, 0.08),
        level3: tint(palette.surface, palette.primary, 0.11),
        level4: tint(palette.surface, palette.primary, 0.12),
        level5: tint(palette.surface, palette.primary, 0.14),
      },
    },
  };
}
