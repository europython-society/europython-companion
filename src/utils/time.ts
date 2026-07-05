import { DATE_ISO_LOCALE } from "@config/constants";

/**
 * Format a session start time for list grouping, e.g. "Mon Jul 14, 09:00".
 */
export function formatSessionStartLabel(startIso: string, timeZone?: string) {
  const d = new Date(startIso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
}

/**
 * Format a session start time label, e.g. "09:00".
 */
export function formatSessionStartTime(startIso: string, timeZone?: string) {
  const d = new Date(startIso);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
}

/**
 * Format a date as YYYY-MM-DD in the given time zone.
 */

export const formatDateISO = (date: Date, timeZone?: string) =>
  new Intl.DateTimeFormat(DATE_ISO_LOCALE, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

/**
 * Format a conference day label without crossing timezones, e.g. "Mon 14 Jul".
 * Uses midday UTC to avoid date rollover across zones.
 */
export function formatConferenceDayLabel(dateStr: string, timeZone?: string) {
  const [year, month, day] = dateStr.split("-").map((part) => Number(part));
  const safeDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return safeDate.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone,
  });
}

/**
 * Return true if the session start time is at or after the supplied timestamp.
 */
export function isUpcomingSession(startIso: string, now = Date.now()) {
  return new Date(startIso).getTime() >= now;
}

/**
 * Format a fetchedAt ISO string into a user-facing timestamp.
 */
export function formatFetchedAt(iso?: string | null) {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Resolve the local device time zone name.
 */
export function getLocalTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
