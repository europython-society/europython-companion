import { Alert, Share } from "react-native";

type ShareOptions = {
  title: string;
  url?: string | null;
  message?: string;
  alertTitle?: string;
  failureMessage?: string;
};

/**
 * Share a URL or message; alerts on failure.
 */
export async function shareLink({
  title,
  url,
  message,
  alertTitle = "Unable to share",
  failureMessage = "Could not share this content.",
}: ShareOptions): Promise<boolean> {
  if (!url) return false;
  try {
    await Share.share({
      title,
      message: message ?? url,
    });
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : failureMessage;
    Alert.alert(alertTitle, msg);
    return false;
  }
}
