import { getEffectiveTimeZone, useSettings } from "@store/settings";

/**
 * Convenience hook for accessing the current effective time zone and year.
 */
export function useEffectiveTimeZone() {
  const { conferenceYear, timeZonePreference } = useSettings();
  const timeZone = getEffectiveTimeZone(timeZonePreference, conferenceYear);
  return { timeZone, conferenceYear, timeZonePreference };
}

export default useEffectiveTimeZone;
