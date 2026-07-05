import { useTheme } from "react-native-paper";
import { darkPalette, lightPalette } from "@theme";

export function useAppTheme() {
  const paperTheme = useTheme();
  const palette = paperTheme.dark ? darkPalette : lightPalette;
  return { paperTheme, palette };
}
