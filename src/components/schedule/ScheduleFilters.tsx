import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  findNodeHandle,
  UIManager,
  Platform,
} from "react-native";
import { Button, Chip, Text, useTheme } from "react-native-paper";
import { radius, spacing } from "@theme";
import { hapticSelection } from "@utils/haptics";

export type DayOption = {
  value: string;
  label: string;
};

type Props = {
  dayOptions: DayOption[];
  selectedDay: string | null;
  onChangeDay: (day: string) => void;

  trackOptions: string[];
  selectedTrack: string | "all";
  onChangeTrack: (track: string | "all") => void;

  levelOptions: string[];
  selectedLevel: string | "all";
  onChangeLevel: (level: string | "all") => void;

  anyFilterActive: boolean;
  onClearFilters: () => void;
};

const capitalizeWords = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export default function ScheduleFilters({
  dayOptions,
  selectedDay,
  onChangeDay,
  trackOptions,
  selectedTrack,
  onChangeTrack,
  levelOptions,
  selectedLevel,
  onChangeLevel,
  anyFilterActive,
  onClearFilters,
}: Props) {
  const { colors } = useTheme();

  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);
  const dayScrollRef = useRef<ScrollView | null>(null);
  const chipHandles = useRef<Record<string, number | null>>({});
  const chipLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const [scrollWidth, setScrollWidth] = useState<number | null>(null);

  const getNodeHandle = (node: any) => {
    if (Platform.OS === "web") return null;
    try {
      return findNodeHandle(node);
    } catch {
      return null;
    }
  };

  const scrollToSelected = () => {
    if (!selectedDay) return;
    if (Platform.OS === "web") {
      const layout = chipLayouts.current[selectedDay];
      if (!layout) return;
      const viewportWidth = scrollWidth ?? Dimensions.get("window").width;
      const targetX = Math.max(0, layout.x - (viewportWidth - layout.width) / 2);
      requestAnimationFrame(() => {
        dayScrollRef.current?.scrollTo({ x: targetX, animated: true });
      });
      return;
    }

    const chipHandle = chipHandles.current[selectedDay];
    const scrollHandle = getNodeHandle(dayScrollRef.current);
    if (!chipHandle || !scrollHandle) return;

    UIManager.measureLayout(
      chipHandle,
      scrollHandle,
      () => {},
      (x, _y, width) => {
        const viewportWidth = scrollWidth ?? Dimensions.get("window").width;
        const targetX = Math.max(0, x - (viewportWidth - width) / 2);
        requestAnimationFrame(() => {
          dayScrollRef.current?.scrollTo({ x: targetX, animated: true });
        });
      },
    );
  };

  useEffect(() => {
    scrollToSelected();
  }, [selectedDay, dayOptions.length, scrollWidth]);

  useEffect(() => {
    if (!selectedDay) return;
    const timer = setTimeout(scrollToSelected, 120);
    return () => clearTimeout(timer);
  }, [selectedDay, dayOptions.length, scrollWidth]);

  const currentTrackLabel = selectedTrack === "all" ? "All tracks" : selectedTrack;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.filterBlock}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          ref={dayScrollRef}
          onLayout={(event) => {
            setScrollWidth(event.nativeEvent.layout.width);
          }}
        >
          {dayOptions.map((day) => {
            const isSelected = selectedDay === day.value;
            return (
              <View
                key={day.value}
                ref={(node) => {
                  if (Platform.OS !== "web") {
                    const handle = getNodeHandle(node);
                    chipHandles.current[day.value] = handle;
                    if (handle && selectedDay === day.value) {
                      requestAnimationFrame(scrollToSelected);
                    }
                  }
                }}
                onLayout={(event) => {
                  const { x, width } = event.nativeEvent.layout;
                  chipLayouts.current[day.value] = { x, width };
                  if (Platform.OS === "web" && selectedDay === day.value) {
                    requestAnimationFrame(scrollToSelected);
                  }
                }}
              >
                <Chip
                  selected={isSelected}
                  onPress={() => {
                    onChangeDay(day.value);
                    setTrackDropdownOpen(false);
                  }}
                  style={[
                    styles.chip,
                    isSelected && {
                      backgroundColor: colors.secondaryContainer,
                    },
                  ]}
                  textStyle={
                    isSelected ? { color: colors.onSecondaryContainer } : undefined
                  }
                  mode="outlined"
                >
                  {day.label}
                </Chip>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.filtersToggleRow}>
          <Button
            mode="text"
            icon={filtersExpanded ? "chevron-up" : "tune"}
            onPress={() => {
              hapticSelection();
              setFiltersExpanded((prev) => !prev);
              setTrackDropdownOpen(false);
            }}
            contentStyle={styles.filtersToggleButtonContent}
            labelStyle={styles.filtersToggleButtonLabel}
            compact
          >
            {filtersExpanded ? "Hide filters" : "Show filters"}
          </Button>
        </View>
      </View>

      {filtersExpanded && (
        <>
          {trackOptions.length > 0 && (
            <View style={styles.filterBlock}>
              <View style={styles.filterHeaderRow}>
                <Text
                  variant="bodySmall"
                  style={[styles.filterLabel, { color: colors.onSurfaceVariant }]}
                >
                  Track
                </Text>
              </View>
              <View style={styles.trackRow}>
                <Chip
                  mode="outlined"
                  icon="tag"
                  selected={selectedTrack !== "all"}
                  onPress={() => setTrackDropdownOpen((open) => !open)}
                  style={styles.trackChip}
                  textStyle={styles.trackChipText}
                >
                  {currentTrackLabel}
                </Chip>
              </View>
              {trackDropdownOpen && (
                <View
                  style={[
                    styles.trackDropdown,
                    {
                      borderColor: colors.outlineVariant,
                      backgroundColor: colors.surface,
                      shadowColor: colors.onSurface,
                    },
                  ]}
                >
                  <ScrollView
                    style={{ maxHeight: 240 }}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={true}
                  >
                    <Pressable
                      style={styles.trackOption}
                      onPress={() => {
                        onChangeTrack("all");
                        setTrackDropdownOpen(false);
                      }}
                    >
                      <Text variant="bodySmall">All tracks</Text>
                    </Pressable>
                    {trackOptions.map((track) => (
                      <Pressable
                        key={track}
                        style={styles.trackOption}
                        onPress={() => {
                          onChangeTrack(track);
                          setTrackDropdownOpen(false);
                        }}
                      >
                        <Text variant="bodySmall">{track}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {levelOptions.length > 0 && (
            <View style={styles.filterBlock}>
              <View style={styles.filterHeaderRow}>
                <Text
                  variant="bodySmall"
                  style={[styles.filterLabel, { color: colors.onSurfaceVariant }]}
                >
                  Level
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {levelOptions.map((level) => {
                  const isSelected = selectedLevel === level;
                  return (
                    <Chip
                      key={level}
                      selected={isSelected}
                      onPress={() => {
                        if (isSelected) {
                          onChangeLevel("all");
                        } else {
                          onChangeLevel(level);
                        }
                      }}
                      style={[
                        styles.chip,
                        isSelected && {
                          backgroundColor: colors.secondaryContainer,
                        },
                      ]}
                      textStyle={
                        isSelected ? { color: colors.onSecondaryContainer } : undefined
                      }
                      mode="outlined"
                    >
                      {capitalizeWords(level)}
                    </Chip>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={styles.clearRow}>
            <Text
              variant="bodySmall"
              style={{
                color: anyFilterActive ? colors.primary : colors.onSurfaceVariant,
              }}
              onPress={anyFilterActive ? onClearFilters : undefined}
            >
              Clear filters
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  filterBlock: {
    marginBottom: spacing.xs,
  },
  filterHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  filterLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    marginRight: spacing.xs,
  },
  filtersToggleRow: {
    marginTop: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  filtersToggleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  filtersToggleButtonLabel: {
    textAlign: "center",
  },
  trackRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  trackChip: {
    flex: 1,
    maxWidth: "100%",
  },
  trackChipText: {
    width: "85%",
    textAlign: "center",
  },
  trackDropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: radius.lg,
    alignSelf: "stretch",
    shadowOpacity: 0.08,
    shadowRadius: radius.sm,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  trackOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  clearRow: {
    alignItems: "flex-end",
    marginTop: spacing.xs,
  },
});
