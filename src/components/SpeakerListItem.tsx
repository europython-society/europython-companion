import { Card } from "react-native-paper";

import SpeakerAvatar from "@components/SpeakerAvatar";

type Props = {
  name: string;
  affiliation?: string | null;
  avatar?: string | null;
  onPress: () => void;
};

export default function SpeakerListItem({ name, affiliation, avatar, onPress }: Props) {
  return (
    <Card mode="outlined" onPress={onPress} style={{ marginBottom: 4 }}>
      <Card.Title
        title={name}
        subtitle={affiliation ?? undefined}
        titleStyle={{ fontWeight: "bold" }}
        subtitleStyle={{ marginTop: -6 }}
        left={() => <SpeakerAvatar name={name} avatarUri={avatar} size={40} />}
      />
    </Card>
  );
}
