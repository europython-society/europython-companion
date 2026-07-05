import React from "react";
import { IconButton } from "react-native-paper";
import { StyleProp, ViewStyle } from "react-native";

import { hapticHeavyImpact, hapticSelection } from "@utils/haptics";

type IconButtonProps = Omit<
  React.ComponentProps<typeof IconButton>,
  "icon" | "iconColor" | "onPress"
>;

type Props = IconButtonProps & {
  isFavorite: boolean;
  onToggle: () => void;
  favoriteColor: string;
  defaultColor: string;
  style?: StyleProp<ViewStyle>;
};

export default function FavoriteToggleButton({
  isFavorite,
  onToggle,
  favoriteColor,
  defaultColor,
  style,
  ...rest
}: Props) {
  const handlePress = () => {
    if (isFavorite) {
      hapticSelection();
    } else {
      hapticHeavyImpact();
    }
    onToggle();
  };

  return (
    <IconButton
      {...rest}
      icon={isFavorite ? "star" : "star-outline"}
      iconColor={isFavorite ? favoriteColor : defaultColor}
      onPress={handlePress}
      style={style}
    />
  );
}
