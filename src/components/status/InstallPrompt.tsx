import { StyleSheet } from "react-native";
import { Button, Card, IconButton, Portal, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { radius, spacing } from "@theme";
import type { usePwaInstallPrompt } from "@hooks/usePwaInstallPrompt";

type Props = ReturnType<typeof usePwaInstallPrompt>;

export default function InstallPrompt({
  visible,
  canInstall,
  ios,
  install,
  dismiss,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Portal>
      <Card
        mode="elevated"
        style={[
          styles.card,
          { bottom: insets.bottom + spacing.lg, backgroundColor: colors.surface },
        ]}
      >
        <Card.Content style={styles.content}>
          <Text variant="bodySmall" style={[styles.message, { color: colors.onSurface }]}>
            {ios
              ? 'Install EuroPython Companion PWA: tap share icon, then "Add to Home Screen"'
              : "Install EuroPython Companion PWA for quick, offline access"}
          </Text>
          {canInstall && (
            <Button mode="text" onPress={install} compact>
              Install
            </Button>
          )}
          <IconButton
            icon="close"
            size={16}
            onPress={dismiss}
            accessibilityLabel="Dismiss install prompt"
          />
        </Card.Content>
      </Card>
    </Portal>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    maxWidth: 480,
    alignSelf: "center",
    borderRadius: radius.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    flex: 1,
  },
});
