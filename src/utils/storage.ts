import AsyncStorage from "@react-native-async-storage/async-storage";

const reportStorageError = (action: string, key: string, err: unknown) => {
  console.warn(`Storage ${action} failed for ${key}`, err);
};

/**
 * Safely load JSON from AsyncStorage with a fallback value.
 */
export async function loadJsonFromStorage<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch (err) {
    reportStorageError("read", key, err);
    return fallback;
  }
}

/**
 * Safely save JSON to AsyncStorage.
 */
export async function saveJsonToStorage<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    reportStorageError("write", key, err);
  }
}

/**
 * Safe wrapper around static JSON requires for optional data.
 * Pass a loader callback with a static require inside to keep Metro happy.
 */
export function loadJsonData<T>(loader: () => T, fallback: T): T {
  try {
    const data = loader();
    return (data as T) ?? fallback;
  } catch (err) {
    reportStorageError("require", "static-json", err);
    return fallback;
  }
}
