import * as Calendar from "expo-calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Linking, Platform } from "react-native";

import { DEFAULT_NOTIFICATION_LEAD_MINUTES } from "@config/constants";
import { Session } from "@app-types/conference";
import { getRoomLabel } from "./format";

type EventCache = Record<string, string>;

export const CALENDAR_PERMISSION_ERROR = "Calendar permission not granted";

const cacheKey = (year: number) => `ep:calendarEvents:${year}`;
const calendarIdCache: Record<number, string> = {};

/**
 * Load cached calendar event ids for a conference year.
 */
async function loadCache(year: number): Promise<EventCache> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(year));
    if (!raw) return {};
    return JSON.parse(raw) as EventCache;
  } catch {
    return {};
  }
}

/**
 * Persist cached calendar event ids for a year.
 */
async function saveCache(year: number, cache: EventCache) {
  try {
    await AsyncStorage.setItem(cacheKey(year), JSON.stringify(cache));
  } catch {}
}

/**
 * Resolve or create a writable calendar for the given year.
 */
async function ensureCalendarAccess(year: number): Promise<string> {
  if (calendarIdCache[year]) {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const cached = calendars.find((cal) => cal.id === calendarIdCache[year]);
      if (cached?.allowsModifications) return calendarIdCache[year];
    } catch {}
    delete calendarIdCache[year];
  }
  const permission = await Calendar.requestCalendarPermissionsAsync();
  if (permission.status !== "granted") {
    Alert.alert(
      "Calendar access is off",
      "Enable calendar access in your device settings to add sessions.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings?.() },
      ],
    );
    throw new Error(CALENDAR_PERMISSION_ERROR);
  }

  const defaultCalendar = await Calendar.getDefaultCalendarAsync().catch(() => null);
  if (defaultCalendar?.allowsModifications) {
    calendarIdCache[year] = defaultCalendar.id;
    return defaultCalendar.id;
  }

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const desiredTitle = `EuroPython ${year}`;
  const writable =
    calendars.find((c) => c.allowsModifications && c.title === desiredTitle) ??
    calendars.find((c) => c.allowsModifications);
  if (writable) {
    calendarIdCache[year] = writable.id;
    return writable.id;
  }

  const iosSource =
    defaultCalendar?.source ?? calendars.find((c) => c.source)?.source ?? null;
  const source =
    Platform.OS === "ios"
      ? (iosSource ?? { type: "local", name: "EuroPython" })
      : {
          type: Calendar.SourceType.LOCAL,
          name: "EuroPython",
          isLocalAccount: true,
        };

  const newCalendarId = await Calendar.createCalendarAsync({
    title: desiredTitle,
    color: "#2563eb",
    entityType: Calendar.EntityTypes.EVENT,
    source,
    sourceId: (source as any)?.id,
    name: "EuroPython",
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
    ownerAccount: Platform.OS === "android" ? "local" : undefined,
  });

  calendarIdCache[year] = newCalendarId;
  return newCalendarId;
}

/**
 * Add a session to the device calendar, reusing or creating a calendar entry.
 */
export async function addSessionToCalendar(
  session: Session,
  year: number,
  calendarIdOverride?: string,
  leadMinutes = DEFAULT_NOTIFICATION_LEAD_MINUTES,
): Promise<{ added: boolean; message: string; permissionDenied?: boolean }> {
  try {
    const calendarId = calendarIdOverride ?? (await ensureCalendarAccess(year));

    const cache = await loadCache(year);
    const existingEventId = cache[session.id];
    if (existingEventId) {
      try {
        const existing = await Calendar.getEventAsync(existingEventId);
        if (existing) {
          return {
            added: false,
            message: "This session is already in your calendar.",
          };
        }
      } catch {
        delete cache[session.id];
        await saveCache(year, cache);
      }
    }

    const startDate = new Date(session.start);
    const endDate = new Date(session.end);

    const location = getRoomLabel(session);
    const notes = [session.tweet, session.websiteUrl].filter(Boolean).join("\n");

    const newEventId = await Calendar.createEventAsync(calendarId, {
      title: session.title,
      startDate,
      endDate,
      location,
      notes: notes || undefined,
      timeZone: undefined,
      alarms: [{ relativeOffset: -Math.max(1, leadMinutes) }],
    });

    cache[session.id] = newEventId;
    await saveCache(year, cache);

    return { added: true, message: "Session added to your calendar." };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not add to calendar.";
    const permissionDenied = message === CALENDAR_PERMISSION_ERROR;
    return { added: false, message, permissionDenied };
  }
}

/**
 * Check whether a session already exists in the calendar.
 */
export async function isSessionInCalendar(sessionId: string, year: number) {
  const cache = await loadCache(year);
  const existingEventId = cache[sessionId];
  if (!existingEventId) return false;
  try {
    const existing = await Calendar.getEventAsync(existingEventId);
    return !!existing;
  } catch {
    return false;
  }
}

/**
 * Remove a session from the calendar if present.
 */
export async function removeSessionFromCalendar(
  sessionId: string,
  year: number,
): Promise<{ removed: boolean; message: string }> {
  const cache = await loadCache(year);
  const existingEventId = cache[sessionId];
  if (!existingEventId) {
    return { removed: false, message: "No calendar event found for this session." };
  }
  try {
    await Calendar.deleteEventAsync(existingEventId);
    delete cache[sessionId];
    await saveCache(year, cache);
    return { removed: true, message: "Removed from your calendar." };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not remove from calendar.";
    return { removed: false, message };
  }
}

/**
 * Get or create the calendar id used for the given conference year.
 */
export async function getCalendarIdForYear(year: number) {
  return ensureCalendarAccess(year);
}
