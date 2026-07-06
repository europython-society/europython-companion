import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Card, Text } from "react-native-paper";

import { radius, spacing } from "@theme";

type CardProps = Partial<React.ComponentProps<typeof Card>>;

type Props = {
  title: string;
  children: React.ReactNode;
  card?: boolean;
  cardProps?: CardProps;
  style?: StyleProp<ViewStyle>;
  action?: React.ReactNode;
};

export default function SettingsSection({
  title,
  children,
  card = true,
  cardProps,
  style,
  action,
}: Props) {
  const cardMode = cardProps?.mode ?? "elevated";
  const cardStyle = cardProps?.style;

  const cardElement = card ? (
    <Card {...cardProps} mode={cardMode as any} style={[styles.card, cardStyle]}>
      <Card.Content>{children}</Card.Content>
    </Card>
  ) : (
    children
  );

  return (
    <View style={[styles.section, style]}>
      <View style={styles.header}>
        <Text
          variant="titleMedium"
          style={action ? styles.withAction : styles.withoutAction}
        >
          {title}
        </Text>
        {action ? <View style={styles.withAction}>{action}</View> : null}
      </View>
      {cardElement}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  withAction: {
    marginBottom: -spacing.md,
  },
  withoutAction: {
    marginBottom: spacing.xs,
  },
  card: {
    borderRadius: radius.xl,
  },
});
