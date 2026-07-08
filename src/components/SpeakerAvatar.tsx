import { StyleProp, ViewStyle } from "react-native";
import { Avatar } from "react-native-paper";
import { Image, ImageStyle } from "expo-image";

import { initialsFromName } from "@utils/format";

type Props = {
  name: string;
  avatarUri?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function SpeakerAvatar({ name, avatarUri, size = 24, style }: Props) {
  const initials = initialsFromName(name || "Unknown").slice(0, 2);

  if (avatarUri) {
    return (
      <Image
        source={{ uri: avatarUri }}
        style={[
          { width: size, height: size, borderRadius: size / 2 },
          style as StyleProp<ImageStyle>,
        ]}
        cachePolicy="memory-disk"
        contentFit="cover"
        transition={100}
      />
    );
  }

  return <Avatar.Text size={size} label={initials} style={style} />;
}
