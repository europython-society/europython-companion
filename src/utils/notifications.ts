import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";

import {
  DEFAULT_NOTIFICATION_LEAD_MINUTES,
  MAX_SCHEDULED_NOTIFICATIONS,
} from "@config/constants";
import {
  hapticLightImpact,
  hapticSelection,
  hapticSuccess,
  hapticWarning,
} from "./haptics";
export type NotificationKind = "session" | "break";

export type NotificationEntry = {
  id: string;
  title: string;
  start: string;
  kind: NotificationKind;
  roomLabel?: string | null;
};

let permissionCache: boolean | null = null;

/**
 * Request notification permissions if needed, caching the last result.
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const current = await Notifications.getPermissionsAsync();
  const currentGranted =
    current.granted ||
    current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  if (currentGranted) {
    permissionCache = true;
    return true;
  }

  if (permissionCache === false) return false;

  const request = await Notifications.requestPermissionsAsync();
  permissionCache =
    request.granted ||
    request.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  return permissionCache;
}

/**
 * Clear the cached permission state so the next check re-queries the system.
 */
export function resetNotificationPermissionCache() {
  permissionCache = null;
}

/**
 * Normalize a notification trigger into either an absolute date or relative milliseconds.
 */
export function normalizeTrigger(
  trigger: Notifications.NotificationTriggerInput | null,
): { date: Date | null; relativeMs: number | null } {
  if (!trigger) return { date: null, relativeMs: null };
  const anyTrigger = trigger as any;

  const dateValue =
    anyTrigger?.date ??
    anyTrigger?.timestamp ??
    anyTrigger?.value ??
    anyTrigger?.time ??
    anyTrigger?.nextTriggerDate ??
    null;

  if (dateValue) {
    const d = new Date(dateValue);
    if (!Number.isNaN(d.getTime())) {
      return { date: d, relativeMs: null };
    }
  }

  const seconds =
    typeof anyTrigger?.seconds === "number"
      ? anyTrigger.seconds
      : typeof anyTrigger?.timeInterval === "number"
        ? anyTrigger.timeInterval
        : null;
  if (seconds && seconds > 0) {
    return { date: null, relativeMs: seconds * 1000 };
  }

  return { date: null, relativeMs: null };
}

type PermissionResult = {
  granted: boolean;
  openedSettings?: boolean;
};

/**
 * Shared helper to request notification permission with haptics and optional settings prompt.
 */
export async function requestNotificationPermissionWithFeedback(opts?: {
  openSettingsPrompt?: () => Promise<void> | void;
  suppressPrompt?: boolean;
}): Promise<PermissionResult> {
  hapticSelection();
  const granted = await ensureNotificationPermission();
  if (granted) {
    hapticSuccess();
    return { granted: true };
  }
  hapticWarning();
  if (!opts?.suppressPrompt) {
    const prompt =
      opts?.openSettingsPrompt ??
      (() =>
        Alert.alert("Notifications are off", "Enable alerts in your device settings.", [
          { text: "Cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings?.() },
        ]));
    await Promise.resolve(prompt());
    return { granted: false, openedSettings: true };
  }
  hapticLightImpact();
  return { granted: false };
}

/**
 * Cancel existing notifications and schedule a fresh set for the given sessions.
 */
export async function rescheduleSessionNotifications(
  sessions: NotificationEntry[],
  leadMinutes = DEFAULT_NOTIFICATION_LEAD_MINUTES,
) {
  if (Platform.OS === "web") return;
  const ok = await ensureNotificationPermission();
  if (!ok) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = Date.now();
  const sessionLeadTimeMs = Math.max(1, leadMinutes) * 60 * 1000;
  const leadMinutesLabel = Math.max(1, leadMinutes);

  const upcoming = sessions
    .map((session) => {
      const start = new Date(session.start).getTime();
      const leadMs = session.kind === "break" ? 0 : sessionLeadTimeMs;
      const triggerTime = start - leadMs;
      return { session, triggerTime, start };
    })
    .filter(({ triggerTime, start }) => triggerTime > now && start > now)
    .sort((a, b) => a.triggerTime - b.triggerTime)
    .slice(0, MAX_SCHEDULED_NOTIFICATIONS);

  await Promise.all(
    upcoming.map(async ({ session, triggerTime }) => {
      const roomLabel = session.roomLabel?.trim() || "the room";
      const isBreak = session.kind === "break";
      await Notifications.scheduleNotificationAsync({
        content: {
          title: isBreak
            ? `${session.title} starting soon`
            : `${session.title} starting in ${leadMinutesLabel} minutes`,
          body: isBreak
            ? "Keep in mind that there are multiple stations for food and drinks. Enjoy!"
            : `Head to ${roomLabel} and take a seat before the session starts!`,
          sound: "default",
          data: { sessionId: session.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(triggerTime),
        },
      });
    }),
  );
}

/**
 * Cancel all scheduled notifications.
 */
export async function clearScheduledSessionNotifications() {
  if (Platform.OS === "web") return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}
