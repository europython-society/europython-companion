import { useMemo } from "react";

import { useConferenceData } from "@store/conferenceData";

/**
 * Returns a memoized map of speaker IDs to avatar URLs (or null).
 */
export function useSpeakerAvatars() {
  const { data } = useConferenceData();

  return useMemo(() => {
    const map: Record<string, string | null> = {};
    if (data) {
      Object.values(data.speakersById).forEach((sp) => {
        map[sp.id] = sp.avatar ?? null;
      });
    }
    return map;
  }, [data]);
}

export default useSpeakerAvatars;
