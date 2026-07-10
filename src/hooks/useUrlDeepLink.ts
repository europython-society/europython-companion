import { useEffect, useRef } from "react";
import { Linking, Platform } from "react-native";

import navigationRef from "@navigation/navigationRef";
import { SharedRoutes, TabRoutes } from "@navigation/routes";
import { useConferenceData } from "@store/conferenceData";
import { useSettings } from "@store/settings";
import { parseDeepLink, DeepLinkTarget } from "@utils/deepLink";

function navigateToSchedule() {
  navigationRef.navigate(TabRoutes.Schedule);
}

function navigateToSession(sessionId: string) {
  navigationRef.navigate(TabRoutes.Schedule);
  setTimeout(() => {
    navigationRef.navigate(TabRoutes.Schedule, {
      screen: SharedRoutes.SessionDetail,
      params: { sessionId },
    });
  }, 0);
}

function navigateToSpeaker(speakerId: string) {
  navigationRef.navigate(TabRoutes.Speakers);
  setTimeout(() => {
    navigationRef.navigate(TabRoutes.Speakers, {
      screen: SharedRoutes.SpeakerDetail,
      params: { speakerId },
    });
  }, 0);
}

/**
 * Wires up https://ep{year}.europython.eu/{session,speaker}/{slug} and
 * .../schedule universal links (native only — see docs/navigation.md).
 * This is best-effort: it depends on associatedDomains/intentFilters in
 * app.config.js *and* an apple-app-site-association/assetlinks.json hosted
 * on europython.eu.
 *
 * Session/speaker links carry a slug and a year, but session/speaker data is
 * indexed by id and loaded per-year, so a link can't always resolve
 * synchronously. The target is buffered and retried whenever the loaded
 * year or data changes (same buffering idea as useNotificationDeepLink,
 * but keyed on data-readiness instead of nav-readiness).
 */
export function useUrlDeepLink() {
  const { data } = useConferenceData();
  const { conferenceYear, setConferenceYear } = useSettings();

  const pendingRef = useRef<DeepLinkTarget | null>(null);
  const dataRef = useRef(data);
  const yearRef = useRef(conferenceYear);
  dataRef.current = data;
  yearRef.current = conferenceYear;

  const tryResolvePending = () => {
    const target = pendingRef.current;
    const currentData = dataRef.current;
    if (!target || target.year !== yearRef.current || !currentData) return;

    if (target.type === "schedule") {
      navigateToSchedule();
      pendingRef.current = null;
      return;
    }

    if (target.type === "session") {
      const session = Object.values(currentData.sessionsById).find(
        (s) => s.slug === target.slug,
      );
      if (session) {
        navigateToSession(session.id);
        pendingRef.current = null;
      }
      return;
    }

    const speaker = Object.values(currentData.speakersById).find(
      (s) => s.slug === target.slug,
    );
    if (speaker) {
      navigateToSpeaker(speaker.id);
      pendingRef.current = null;
    }
  };

  useEffect(() => {
    tryResolvePending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, conferenceYear]);

  useEffect(() => {
    // No universal-link equivalent on web (see module doc comment).
    if (Platform.OS === "web") return;

    const handleUrl = (url: string) => {
      const target = parseDeepLink(url);
      if (!target) return;
      pendingRef.current = target;
      if (target.year !== yearRef.current) {
        setConferenceYear(target.year);
      }
      tryResolvePending();
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    const subscription = Linking.addEventListener("url", ({ url }) => handleUrl(url));
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useUrlDeepLink;
