import { StyleSheet, useWindowDimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Image } from "expo-image";
import {
  SnapbackZoom,
  useImageResolution,
  fitContainer,
} from "react-native-zoom-toolkit";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { radius } from "@theme";

type Props = {
  source: number;
  accessibilityLabel: string;
};

const DOUBLE_TAP_SCALE = 2;

export default function ZoomableImage({ source, accessibilityLabel }: Props) {
  const { width } = useWindowDimensions();
  const containerWidth = width - 32;
  const { resolution } = useImageResolution(source);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!resolution) {
    return <ActivityIndicator style={styles.loading} />;
  }

  const size = fitContainer(resolution.width / resolution.height, {
    width: containerWidth,
    height: containerWidth,
  });

  return (
    <SnapbackZoom
      onDoubleTap={() =>
        (scale.value = withTiming(scale.value > 1 ? 1 : DOUBLE_TAP_SCALE))
      }
    >
      <Animated.View style={animatedStyle}>
        <Image
          source={source}
          style={[size, styles.image]}
          contentFit="contain"
          accessible
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="image"
        />
      </Animated.View>
    </SnapbackZoom>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: radius.lg,
  },
  loading: {
    marginVertical: 32,
  },
});
