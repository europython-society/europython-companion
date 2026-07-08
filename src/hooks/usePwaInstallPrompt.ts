import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import { loadJsonFromStorage, saveJsonToStorage } from "@utils/storage";

const DISMISSED_KEY = "pwa:installPromptDismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari's own flag; not present in the DOM lib types.
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iPhone|iPod/.test(navigator.userAgent);
}

export function usePwaInstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(true);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (isStandalone()) return;

    setIos(isIos());

    let cancelled = false;
    loadJsonFromStorage<boolean>(DISMISSED_KEY, false).then((wasDismissed) => {
      if (!cancelled) setDismissed(wasDismissed);
    });

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredEvent(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => setDeferredEvent(null);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      cancelled = true;
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    const choice = await deferredEvent.userChoice;
    setDeferredEvent(null);
    if (choice.outcome !== "accepted") {
      setDismissed(true);
      void saveJsonToStorage(DISMISSED_KEY, true);
    }
  }, [deferredEvent]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    void saveJsonToStorage(DISMISSED_KEY, true);
  }, []);

  const canInstall = !!deferredEvent;

  return {
    visible: Platform.OS === "web" && !dismissed && (canInstall || ios),
    canInstall,
    ios,
    install,
    dismiss,
  };
}
