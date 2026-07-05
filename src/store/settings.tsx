import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  CONFERENCE_YEARS,
  DEFAULT_CONFERENCE_YEAR,
  getConferenceMeta,
} from "@config/conference";
import { DEFAULT_NOTIFICATION_LEAD_MINUTES } from "@config/constants";
import { setHapticsEnabledRuntime } from "@utils/haptics";
import { loadJsonFromStorage, saveJsonToStorage } from "@utils/storage";

export const SETTINGS_KEY = "app:settings";

type SettingsState = {
  conferenceYear: number;
  themeMode: ThemeMode;
  timeZonePreference: TimeZonePreference;
  onboardingSeen: boolean;
  notificationsEnabled: boolean;
  breakNotificationsEnabled: boolean;
  hapticsEnabled: boolean;
  notificationLeadMinutes: number;
};

type SettingsContextValue = {
  conferenceYear: number;
  availableYears: number[];
  setConferenceYear: (year: number) => Promise<void>;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  timeZonePreference: TimeZonePreference;
  setTimeZonePreference: (pref: TimeZonePreference) => Promise<void>;
  notificationsEnabled: boolean;
  breakNotificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setBreakNotificationsEnabled: (enabled: boolean) => Promise<void>;
  notificationLeadMinutes: number;
  setNotificationLeadMinutes: (minutes: number) => Promise<void>;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => Promise<void>;
  onboardingSeen: boolean;
  setOnboardingSeen: () => Promise<void>;
  resetOnboardingSeen: () => Promise<void>;
  hydrated: boolean;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export type ThemeMode = "system" | "light" | "dark" | "night";
export const DEFAULT_THEME_MODE: ThemeMode = "system";
export type TimeZonePreference = "conference" | "local";
export const DEFAULT_TIMEZONE_PREFERENCE: TimeZonePreference = "conference";
export const DEFAULT_NOTIFICATIONS_ENABLED = true;
export const DEFAULT_BREAK_NOTIFICATIONS_ENABLED = true;
export const DEFAULT_ONBOARDING_SEEN = false;
export const DEFAULT_HAPTICS_ENABLED = true;

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [conferenceYear, setConferenceYearState] = useState<number>(
    DEFAULT_CONFERENCE_YEAR,
  );
  const [themeMode, setThemeModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [timeZonePreference, setTimeZonePreferenceState] = useState<TimeZonePreference>(
    DEFAULT_TIMEZONE_PREFERENCE,
  );
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(
    DEFAULT_NOTIFICATIONS_ENABLED,
  );
  const [breakNotificationsEnabled, setBreakNotificationsEnabledState] =
    useState<boolean>(DEFAULT_BREAK_NOTIFICATIONS_ENABLED);
  const [notificationLeadMinutes, setNotificationLeadMinutesState] = useState<number>(
    DEFAULT_NOTIFICATION_LEAD_MINUTES,
  );
  const [hapticsEnabled, setHapticsEnabledState] = useState<boolean>(
    DEFAULT_HAPTICS_ENABLED,
  );
  const [onboardingSeen, setOnboardingSeenState] = useState<boolean>(
    DEFAULT_ONBOARDING_SEEN,
  );
  const [hydrated, setHydrated] = useState(false);

  const persistSettings = async (overrides: Partial<SettingsState> = {}) => {
    const payload: SettingsState = {
      conferenceYear,
      themeMode,
      timeZonePreference,
      notificationsEnabled,
      breakNotificationsEnabled,
      notificationLeadMinutes,
      hapticsEnabled,
      onboardingSeen,
      ...overrides,
    };
    await saveJsonToStorage(SETTINGS_KEY, payload);
  };

  useEffect(() => {
    (async () => {
      const parsed =
        (await loadJsonFromStorage<Partial<SettingsState> | null>(SETTINGS_KEY, null)) ??
        null;
      if (parsed) {
        if (parsed.conferenceYear && CONFERENCE_YEARS.includes(parsed.conferenceYear)) {
          setConferenceYearState(parsed.conferenceYear);
        }
        if (
          parsed.themeMode &&
          ["system", "light", "dark", "night"].includes(parsed.themeMode)
        ) {
          setThemeModeState(parsed.themeMode as ThemeMode);
        }
        if (
          parsed.timeZonePreference &&
          ["conference", "local"].includes(parsed.timeZonePreference)
        ) {
          setTimeZonePreferenceState(parsed.timeZonePreference as TimeZonePreference);
        }
        if (typeof parsed.notificationsEnabled === "boolean") {
          setNotificationsEnabledState(parsed.notificationsEnabled);
        }
        if (typeof parsed.breakNotificationsEnabled === "boolean") {
          setBreakNotificationsEnabledState(parsed.breakNotificationsEnabled);
        }
        if (
          typeof parsed.notificationLeadMinutes === "number" &&
          parsed.notificationLeadMinutes > 0
        ) {
          setNotificationLeadMinutesState(parsed.notificationLeadMinutes);
        }
        if (typeof parsed.hapticsEnabled === "boolean") {
          setHapticsEnabledState(parsed.hapticsEnabled);
        }
        if (typeof parsed.onboardingSeen === "boolean") {
          setOnboardingSeenState(parsed.onboardingSeen);
        }
      }
      setHydrated(true);
    })();
  }, []);

  const setConferenceYear = async (year: number) => {
    if (!CONFERENCE_YEARS.includes(year)) return;
    setConferenceYearState(year);
    await persistSettings({ conferenceYear: year });
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await persistSettings({ themeMode: mode });
  };

  const setTimeZonePreference = async (pref: TimeZonePreference) => {
    setTimeZonePreferenceState(pref);
    await persistSettings({ timeZonePreference: pref });
  };

  const setNotificationsEnabled = async (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    await persistSettings({ notificationsEnabled: enabled });
  };

  const setBreakNotificationsEnabled = async (enabled: boolean) => {
    setBreakNotificationsEnabledState(enabled);
    await persistSettings({ breakNotificationsEnabled: enabled });
  };

  const setHapticsEnabled = async (enabled: boolean) => {
    setHapticsEnabledState(enabled);
    await persistSettings({ hapticsEnabled: enabled });
  };

  const setOnboardingSeen = async () => {
    setOnboardingSeenState(true);
    await persistSettings({ onboardingSeen: true });
  };

  const resetOnboardingSeen = async () => {
    setOnboardingSeenState(false);
    await persistSettings({ onboardingSeen: false });
  };

  const setNotificationLeadMinutes = async (minutes: number) => {
    if (minutes <= 0) return;
    setNotificationLeadMinutesState(minutes);
    await persistSettings({ notificationLeadMinutes: minutes });
  };

  useEffect(() => {
    setHapticsEnabledRuntime(hapticsEnabled);
  }, [hapticsEnabled]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      conferenceYear,
      availableYears: CONFERENCE_YEARS,
      setConferenceYear,
      themeMode,
      setThemeMode,
      timeZonePreference,
      setTimeZonePreference,
      notificationsEnabled,
      breakNotificationsEnabled,
      setNotificationsEnabled,
      setBreakNotificationsEnabled,
      notificationLeadMinutes,
      setNotificationLeadMinutes,
      hapticsEnabled,
      setHapticsEnabled,
      onboardingSeen,
      setOnboardingSeen,
      resetOnboardingSeen,
      hydrated,
    }),
    [
      conferenceYear,
      themeMode,
      timeZonePreference,
      notificationsEnabled,
      breakNotificationsEnabled,
      notificationLeadMinutes,
      hapticsEnabled,
      onboardingSeen,
      resetOnboardingSeen,
      hydrated,
    ],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}

export { getConferenceMeta };

export function getEffectiveTimeZone(
  preference: TimeZonePreference,
  year: number,
): string | undefined {
  if (preference === "local") return undefined;
  const meta = getConferenceMeta(year);
  return meta.timeZone;
}
