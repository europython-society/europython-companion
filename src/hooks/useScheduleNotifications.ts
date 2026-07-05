import { useEffect } from "react";

import { useConferenceData } from "@store/conferenceData";
import { useFavorites } from "@store/favorites";
import { useSettings } from "@store/settings";
import { isKeynoteSessionType, isBreak } from "@utils/schedule";
import {
  NotificationEntry,
  clearScheduledSessionNotifications,
  rescheduleSessionNotifications,
} from "@utils/notifications";
import { Session } from "@app-types/conference";
import { getRoomLabel } from "@utils/format";

/**
 * Keeps local notifications in sync for upcoming keynotes and favorited sessions.
 */
export function useScheduleNotifications() {
  const { data, loading } = useConferenceData();
  const { favorites } = useFavorites();
  const {
    notificationsEnabled,
    notificationLeadMinutes,
    breakNotificationsEnabled,
  } = useSettings();

  useEffect(() => {
    if (!notificationsEnabled && !breakNotificationsEnabled) {
      clearScheduledSessionNotifications();
    }
  }, [notificationsEnabled, breakNotificationsEnabled]);

  useEffect(() => {
    if (!data || loading) return;
    if (!notificationsEnabled && !breakNotificationsEnabled) return;

    const keyed: Record<string, NotificationEntry> = {};
    const addSessionNotification = (session: Session) => {
      const key = session.slotId ?? session.id;
      if (keyed[key]) return;
      keyed[key] = {
        id: session.id,
        title: session.title,
        start: session.start,
        kind: "session",
        roomLabel: getRoomLabel(session),
      };
    };

    if (notificationsEnabled) {
      data.days.forEach((day) => {
        day.events?.forEach((ev) => {
          if (isBreak(ev)) return;
          const session = ev as Session;
          const isFavoriteSession = favorites.has(session.id);
          const isKeynote = isKeynoteSessionType(session.sessionType);
          if (!isFavoriteSession && !isKeynote) return;
          addSessionNotification(session);
        });
      });
    }

    if (breakNotificationsEnabled) {
      data.days.forEach((day) => {
        day.events?.forEach((ev) => {
          if (isBreak(ev)) {
            keyed[ev.id] = {
              id: ev.id,
              title: ev.title,
              start: ev.start,
              kind: "break",
            };
          }
        });
      });
    }

    const toNotify = Object.values(keyed);
    rescheduleSessionNotifications(toNotify, notificationLeadMinutes);
  }, [
    data,
    loading,
    favorites,
    notificationsEnabled,
    notificationLeadMinutes,
    breakNotificationsEnabled,
  ]);
}
