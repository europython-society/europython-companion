import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

import navigationRef from "@navigation/navigationRef";
import { SharedRoutes, TabRoutes } from "@navigation/routes";

function navigateToSession(sessionId: string) {
  navigationRef.navigate(TabRoutes.Schedule);
  setTimeout(() => {
    navigationRef.navigate(TabRoutes.Schedule, {
      screen: SharedRoutes.SessionDetail,
      params: { sessionId },
    });
  }, 0);
}

function extractSessionId(
  response: Notifications.NotificationResponse,
): string | undefined {
  const data = response?.notification?.request?.content?.data as {
    sessionId?: unknown;
  };
  return typeof data?.sessionId === "string"
    ? data.sessionId
    : data?.sessionId?.toString();
}

/**
 * Wires up notification-tap deep-linking: subscribes to notification responses
 * (both a foreground/background tap and a cold start resolved via
 * getLastNotificationResponseAsync) and navigates to the tapped session.
 *
 * The navigator may not be ready yet when a notification is tapped (e.g. cold
 * start), so the target session is held here and the returned `onNavReady`
 * must be called from the NavigationContainer's `onReady` to flush it.
 */
export function useNotificationDeepLink() {
  const pendingSessionId = useRef<string | null>(null);

  useEffect(() => {
    // Notification-tap deep-linking has no equivalent on web (no OS
    // notification tray to resolve a cold start from), and getLastNotification-
    // ResponseAsync isn't implemented there and rejects.
    if (Platform.OS === "web") return;

    const handleResponse = (response: Notifications.NotificationResponse) => {
      const sessionId = extractSessionId(response);
      if (!sessionId) {
        return;
      }
      if (navigationRef.isReady()) {
        navigateToSession(sessionId);
        pendingSessionId.current = null;
        return;
      }
      pendingSessionId.current = sessionId;
    };

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleResponse(response);
      }
    });

    const subscription =
      Notifications.addNotificationResponseReceivedListener(handleResponse);
    return () => subscription.remove();
  }, []);

  const onNavReady = () => {
    if (pendingSessionId.current) {
      navigateToSession(pendingSessionId.current);
      pendingSessionId.current = null;
    }
  };

  return { onNavReady };
}

export default useNotificationDeepLink;
