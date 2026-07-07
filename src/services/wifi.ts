import AsyncStorage from "@react-native-async-storage/async-storage";

import { WIFI_INFO_URL } from "@config/conference";

import { isWifiInfo } from "./guards";

export type WifiInfo = { ssid: string; password: string };

const WIFI_INFO_CACHE_KEY = "wifiInfo:v1";

/**
 * Load venue Wi-Fi credentials with offline caching, fetched fresh each call
 * so credentials can change without an app update.
 */
export async function loadWifiInfo(): Promise<WifiInfo | null> {
  try {
    const res = await fetch(WIFI_INFO_URL);
    if (!res.ok) throw new Error(`Failed to fetch wifi info: ${res.status}`);
    const json: unknown = await res.json();
    if (!isWifiInfo(json)) throw new Error("Invalid wifi info payload");
    await AsyncStorage.setItem(WIFI_INFO_CACHE_KEY, JSON.stringify(json));
    return json;
  } catch {
    const cached = await AsyncStorage.getItem(WIFI_INFO_CACHE_KEY);
    if (!cached) return null;
    try {
      const parsed: unknown = JSON.parse(cached);
      return isWifiInfo(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
}
