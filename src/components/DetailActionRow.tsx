import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";
import { spacing } from "@theme";

export type DetailAction = {
  key: string;
  icon?: string;
  onPress?: () => void;
  iconColor?: string;
  containerColor?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  render?: () => React.ReactNode;
};

type Props = {
  actions: DetailAction[];
  style?: StyleProp<ViewStyle>;
};

export default function DetailActionRow({ actions, style }: Props) {
  if (actions.length === 0) return null;
  return (
    <View style={[styles.row, style]}>
      {actions.map((action) => {
        if (action.render) {
          return <React.Fragment key={action.key}>{action.render()}</React.Fragment>;
        }
        if (!action.icon) return null;
        return (
          <IconButton
            key={action.key}
            icon={action.icon}
            onPress={action.onPress}
            iconColor={action.iconColor}
            containerColor={action.containerColor}
            disabled={action.disabled}
            accessibilityLabel={action.accessibilityLabel}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: spacing.xs,
  },
});
