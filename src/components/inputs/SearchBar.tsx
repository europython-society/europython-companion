import React from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { Searchbar, useTheme } from "react-native-paper";
import { radius, spacing } from "@theme";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
};

const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = "Search",
  style,
  autoFocus = false,
}) => {
  const theme = useTheme();

  const handleClear = () => {
    onChangeText("");
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Searchbar
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoFocus={autoFocus}
        clearIcon="close"
        onClearIconPress={handleClear}
        style={[
          styles.searchbar,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
          },
        ]}
        inputStyle={[styles.input, { color: theme.colors.onSurface }]}
        iconColor={theme.colors.onSurface}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchbar: {
    elevation: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  input: {
    fontSize: 14,
  },
});

export default SearchBar;
