import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { Switch, Text, TouchableRipple, useTheme } from "react-native-paper";

import { spacing } from "@theme";

type BaseProps = {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
  right?: React.ReactNode;
  children?: React.ReactNode;
};

export function SettingsRow({
  title,
  subtitle,
  style,
  disabled,
  onPress,
  right,
  children,
}: BaseProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.row, style, disabled && { opacity: 0.6 }]}>
      <View style={styles.textBlock}>
        <Text variant="bodyMedium" style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="bodySmall"
            style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableRipple onPress={onPress} disabled={disabled}>
        {content}
      </TouchableRipple>
    );
  }

  return content;
}

type SwitchProps = Omit<BaseProps, "right" | "children"> & {
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
};

export function SettingsSwitchRow({
  value,
  onValueChange,
  disabled,
  testID,
  ...rest
}: SwitchProps) {
  const { colors } = useTheme();
  return (
    <SettingsRow
      {...rest}
      disabled={disabled}
      right={
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          testID={testID}
          color={colors.primary}
        />
      }
    />
  );
}

export default SettingsRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  textBlock: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    color: undefined,
  },
});
