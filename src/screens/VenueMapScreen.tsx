import { useState } from "react";
import { StyleSheet, View, Linking } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";

import ScreenContainer from "@components/layout/ScreenContainer";
import PaddedScrollView from "@components/layout/PaddedScrollView";
import InfoCard from "@components/InfoCard";
import ZoomableImage from "@components/venue/ZoomableImage";
import { venueViews, ACCESSIBILITY_EMAIL } from "@data/venue";
import { spacing } from "@theme";

export default function VenueMapScreen() {
  const { colors } = useTheme();
  const [activeKey, setActiveKey] = useState(venueViews[0].key);
  const view = venueViews.find((v) => v.key === activeKey) ?? venueViews[0];

  return (
    <ScreenContainer title="Venue map" subtitle="ICE Kraków Congress Centre">
      <View style={styles.switcher}>
        <PaddedScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentPadding={0}
        >
          <View style={styles.chipRow}>
            {venueViews.map((v) => (
              <Chip
                key={v.key}
                selected={v.key === activeKey}
                onPress={() => setActiveKey(v.key)}
                mode={v.key === activeKey ? "flat" : "outlined"}
              >
                {v.label}
              </Chip>
            ))}
          </View>
        </PaddedScrollView>
      </View>

      <PaddedScrollView>
        {view.lines && view.lines.length > 0 && (
          <InfoCard
            title={view.label}
            lines={view.lines}
            actions={
              view.key === "accessibility"
                ? [
                    {
                      label: "Email accessibility team",
                      onPress: () => Linking.openURL(`mailto:${ACCESSIBILITY_EMAIL}`),
                    },
                  ]
                : undefined
            }
          />
        )}

        {view.floors?.map((floor) => (
          <InfoCard key={floor.floor} title={floor.floor} lines={floor.rooms} />
        ))}

        {view.images?.map((image) => (
          <View key={image.accessibilityLabel} style={styles.imageBlock}>
            <ZoomableImage
              source={image.source}
              accessibilityLabel={image.accessibilityLabel}
            />
            {image.caption && (
              <Text
                variant="bodySmall"
                style={[styles.caption, { color: colors.onSurfaceVariant }]}
              >
                {image.caption}
              </Text>
            )}
          </View>
        ))}
      </PaddedScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  switcher: {
    paddingHorizontal: spacing.md,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  imageBlock: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  caption: {
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
