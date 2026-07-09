import { useEffect, useMemo, useRef } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Text, useTheme } from "react-native-paper";

import { ScheduleItem, Session } from "@app-types/conference";
import { spacing } from "@theme";
import SessionListItem from "./SessionListItem";
import { useFavorites } from "@store/favorites";
import { useSettings } from "@store/settings";
import { hapticLightImpact, hapticSelection } from "@utils/haptics";
import { groupBySessionStartLabel, isBreak, sortScheduleItems } from "@utils/schedule";
import useSpeakerAvatars from "@hooks/useSpeakerAvatars";
import BreakListItem from "./BreakListItem";
import StateMessage from "../status/StateMessage";

type Row = { kind: "header"; title: string } | { kind: "item"; item: ScheduleItem };

type Props = {
  sessions: ScheduleItem[];
  onSelect: (id: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
  onToggleFavorite?: (id: string) => void;
  timeZone?: string;
};

export default function SessionList({
  sessions,
  onSelect,
  refreshing = false,
  onRefresh,
  emptyMessage = "No sessions to show.",
  onToggleFavorite,
  timeZone,
}: Props) {
  const { colors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { conferenceYear } = useSettings();
  const wasRefreshing = useRef(refreshing);
  const speakerAvatars = useSpeakerAvatars();

  const rows = useMemo<Row[]>(() => {
    const sorted = sortScheduleItems(sessions, conferenceYear);
    return groupBySessionStartLabel(sorted, timeZone).flatMap((section) => [
      { kind: "header", title: section.title } as Row,
      ...section.data.map((item) => ({ kind: "item", item }) as Row),
    ]);
  }, [sessions, timeZone, conferenceYear]);

  useEffect(() => {
    if (!wasRefreshing.current && refreshing) {
      hapticSelection();
    } else if (wasRefreshing.current && !refreshing) {
      hapticLightImpact();
    }
    wasRefreshing.current = refreshing;
  }, [refreshing]);

  if (sessions.length === 0) {
    return <StateMessage title={emptyMessage} />;
  }

  return (
    <FlashList
      data={rows}
      keyExtractor={(row) =>
        row.kind === "header"
          ? `h:${row.title}`
          : isBreak(row.item)
            ? row.item.id
            : (row.item.slotId ?? row.item.id)
      }
      getItemType={(row) =>
        row.kind === "header" ? "header" : isBreak(row.item) ? "break" : "session"
      }
      drawDistance={475}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.listContent}
      renderItem={({ item: row }) =>
        row.kind === "header" ? (
          <View style={styles.sectionHeader}>
            <Text variant="labelLarge" style={{ color: colors.onSurfaceVariant }}>
              {row.title}
            </Text>
          </View>
        ) : isBreak(row.item) ? (
          <BreakListItem slot={row.item} timeZone={timeZone} />
        ) : (
          <SessionListItem
            session={row.item as Session}
            onPress={onSelect}
            isFavorite={isFavorite(row.item.id)}
            timeZone={timeZone}
            speakerAvatars={speakerAvatars}
            onToggleFavorite={onToggleFavorite ?? toggleFavorite}
          />
        )
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  sectionHeader: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  empty: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
});
