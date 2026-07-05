import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { DEFAULT_WEB_PROXY_BASE } from "@config/constants";
import {
  RawSessions,
  RawSpeakers,
  RawSchedule,
  RawSession,
  RawSpeaker,
  RawScheduleEvent,
  RawScheduleSessionEvent,
  RawScheduleBreakEvent,
} from "@app-types/raw";
import {
  BreakSlot,
  ConferenceData,
  DaySchedule,
  ScheduleItem,
  Session,
  Speaker,
  SpeakerRef,
} from "@app-types/conference";

type CachedConferencePayload =
  | {
      data: ConferenceData;
      fetchedAt?: string | null;
    }
  | ConferenceData;

type LoadConferenceResult = {
  data: ConferenceData;
  fromCache: boolean;
  fetchedAt: string | null;
  resolvedYear: number;
};

const PROD_BASE_URL = "https://static.europython.eu";

const ENV_BASE_TEMPLATE = process.env.EXPO_PUBLIC_API_BASE?.replace(/\/$/, "") || null;

function buildBasePath(year: number) {
  return `/programme/ep${year}/releases/current`;
}

function buildProdBaseUrl(year: number) {
  return `${PROD_BASE_URL}${buildBasePath(year)}`;
}

function resolveBaseUrl(year: number): string {
  if (__DEV__ && Platform.OS === "web") {
    const origin =
      process.env.EXPO_PUBLIC_WEB_PROXY_BASE?.replace(/\/$/, "") ||
      DEFAULT_WEB_PROXY_BASE;
    return `${origin}${buildBasePath(year)}`;
  }

  if (ENV_BASE_TEMPLATE) {
    if (ENV_BASE_TEMPLATE.includes("{year}")) {
      return ENV_BASE_TEMPLATE.replace("{year}", String(year));
    }
    return ENV_BASE_TEMPLATE;
  }
  return buildProdBaseUrl(year);
}

export const DEFAULT_PROD_BASE_URL = buildProdBaseUrl;

const conferenceCacheKey = (year: number) => `ep${year}:conferenceData:v2`;

function addMinutesToIso(
  startIso: string | undefined,
  minutes: number | null | undefined,
) {
  if (!startIso || typeof minutes !== "number" || Number.isNaN(minutes)) return null;
  const startDate = new Date(startIso);
  if (Number.isNaN(startDate.getTime())) return null;
  return new Date(startDate.getTime() + minutes * 60_000).toISOString();
}

function parseTimeMs(iso: string | null | undefined) {
  if (!iso) return null;
  const ms = new Date(iso).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isConferenceData(value: unknown): value is ConferenceData {
  if (!isRecord(value)) return false;
  const days = (value as { days?: unknown }).days;
  const sessionsById = (value as { sessionsById?: unknown }).sessionsById;
  const speakersById = (value as { speakersById?: unknown }).speakersById;
  return Array.isArray(days) && isRecord(sessionsById) && isRecord(speakersById);
}

function isRawSession(value: unknown): value is RawSession {
  if (!isRecord(value)) return false;
  return typeof value.code === "string" && typeof value.title === "string";
}

function isRawSpeaker(value: unknown): value is RawSpeaker {
  if (!isRecord(value)) return false;
  return typeof value.code === "string" && typeof value.name === "string";
}

function isWrappedSessions(
  raw: RawSessions,
): raw is { sessions: Record<string, RawSession> } {
  if (!isRecord(raw) || !("sessions" in raw)) return false;
  const candidate = (raw as { sessions?: unknown }).sessions;
  return isRecord(candidate) && !isRawSession(candidate);
}

function isWrappedSpeakers(
  raw: RawSpeakers,
): raw is { speakers: Record<string, RawSpeaker> } {
  if (!isRecord(raw) || !("speakers" in raw)) return false;
  const candidate = (raw as { speakers?: unknown }).speakers;
  return isRecord(candidate) && !isRawSpeaker(candidate);
}

function unwrapSessions(raw: RawSessions): Record<string, RawSession> {
  return isWrappedSessions(raw) ? raw.sessions : raw;
}

function unwrapSpeakers(raw: RawSpeakers): Record<string, RawSpeaker> {
  return isWrappedSpeakers(raw) ? raw.speakers : raw;
}

function normalizeConferencePayload(
  rawSessions: RawSessions,
  rawSpeakers: RawSpeakers,
  rawSchedule: RawSchedule,
) {
  return {
    sessions: unwrapSessions(rawSessions),
    speakers: unwrapSpeakers(rawSpeakers),
    schedule: rawSchedule,
  };
}

function isScheduleSessionEvent(
  ev: RawScheduleEvent,
): ev is RawScheduleSessionEvent {
  return ev.event_type === "session";
}

function isScheduleBreakEvent(ev: RawScheduleEvent): ev is RawScheduleBreakEvent {
  return ev.event_type === "break";
}

async function fetchJson<T>(baseUrl: string, path: string): Promise<T> {
  const url = `${baseUrl}/${path}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    const prodUrl = buildProdBaseUrl(currentYearRef ?? new Date().getFullYear());
    if (__DEV__ && baseUrl !== prodUrl) {
      const fallbackUrl = `${prodUrl}/${path}`;
      const res = await fetch(fallbackUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
      }
      return (await res.json()) as T;
    }
    throw err;
  }
}

async function readCachedConferenceData(cacheKey: string): Promise<{
  data: ConferenceData;
  fetchedAt: string | null;
} | null> {
  const cached = await AsyncStorage.getItem(cacheKey);
  if (!cached) return null;
  try {
    const parsed = JSON.parse(cached) as unknown;
    const dataCandidate =
      isRecord(parsed) && "data" in parsed ? (parsed as { data?: unknown }).data : parsed;
    if (!isConferenceData(dataCandidate)) {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }
    const fetchedAtValue = isRecord(parsed)
      ? (parsed as { fetchedAt?: unknown; fetched_at?: unknown }).fetchedAt ??
        (parsed as { fetchedAt?: unknown; fetched_at?: unknown }).fetched_at
      : null;
    const fetchedAt = typeof fetchedAtValue === "string" ? fetchedAtValue : null;
    return { data: dataCandidate, fetchedAt };
  } catch {
    await AsyncStorage.removeItem(cacheKey);
    return null;
  }
}

function normalizeSpeaker(raw: RawSpeaker): Speaker {
  const avatar =
    raw.avatar && raw.avatar.toString().trim().length > 0 ? raw.avatar.toString() : null;

  return {
    id: raw.code,
    name: raw.name,
    affiliation: raw.affiliation,
    biography: raw.biography,
    avatar,
    homepage: raw.homepage,
    websiteUrl: raw.website_url,
    linkedinUrl: raw.linkedin_url,
    mastodonUrl: raw.mastodon_url,
    twitterUrl: raw.twitter_url,
    blueskyUrl: raw.bluesky_url,
    gitUrl: raw.gitx_url,
    slug: raw.slug,
  };
}

function normalizeSession(
  raw: RawSession,
  speakersById: Record<string, Speaker>,
): Session {
  const websiteUrl =
    raw.website_url && raw.website_url.toString().trim().length > 0
      ? raw.website_url.toString()
      : null;
  const youtubeUrl =
    raw.youtube_url && raw.youtube_url.toString().trim().length > 0
      ? raw.youtube_url.toString()
      : null;

  const baseRooms: string[] = raw.room && raw.room.trim().length > 0 ? [raw.room] : [];

  const speakerRefs: SpeakerRef[] = raw.speakers.map((code) => {
    const sp = speakersById[code];
    if (!sp) {
      return {
        id: code,
        name: code,
        affiliation: null,
      };
    }
    return {
      id: sp.id,
      name: sp.name,
      affiliation: sp.affiliation,
    };
  });

  return {
    id: raw.code,
    eventType: "session",
    title: raw.title,
    abstract: raw.abstract ?? null,
    start: raw.start,
    end: raw.end,
    rooms: baseRooms,
    room: baseRooms[0] ?? null,
    track: raw.track,
    level: raw.level,
    sessionType: raw.session_type,
    delivery: raw.delivery,
    slug: raw.slug,
    tweet: raw.tweet,
    websiteUrl,
    youtubeUrl,
    speakers: speakerRefs,
  };
}

function mergeRooms(primary: string[], secondary: string[]) {
  const merged = new Set<string>();
  primary.forEach((room) => merged.add(room));
  secondary.forEach((room) => merged.add(room));
  return Array.from(merged);
}

function buildDays(
  sessionsById: Record<string, Session>,
  rawSchedule: RawSchedule,
): DaySchedule[] {
  const days: DaySchedule[] = [];

  for (const [date, day] of Object.entries(rawSchedule.days)) {
    const seen = new Set<string>();
    const orderedCodes: string[] = [];
    const events: ScheduleItem[] = [];

    day.events.forEach((ev, idx) => {
      if (isScheduleBreakEvent(ev) || !isScheduleSessionEvent(ev)) {
        const start = ev.start;
        const duration = ev.duration;
        if (!start) return;
        const end = addMinutesToIso(start, duration) ?? start;
        const breakId = `break-${date}-${idx}`;
        const breakEvent: BreakSlot = {
          id: breakId,
          title: ev.title ?? "Break",
          start,
          end,
          rooms: ev.rooms || [],
          eventType: "break",
        };
        events.push(breakEvent);
        return;
      }

      const code = ev.code.trim();
      if (!code) return;
      const baseSession = sessionsById[code];
      if (!baseSession) return;

      const scheduleRooms = ev.rooms ?? [];
      if (scheduleRooms.length > 0) {
        const mergedRooms = mergeRooms(scheduleRooms, baseSession.rooms);
        baseSession.rooms = mergedRooms;
        baseSession.room = mergedRooms[0] ?? baseSession.room ?? null;
      }

      if (!baseSession.websiteUrl && ev.website_url) {
        const url = ev.website_url.toString().trim();
        if (url.length > 0) {
          baseSession.websiteUrl = url;
        }
      }

      if (!seen.has(code)) {
        orderedCodes.push(code);
        seen.add(code);
      }

      const slotStart = ev.start ?? baseSession.start;
      const slotEnd = addMinutesToIso(slotStart, ev.duration) ?? baseSession.end;

      const slotStartMs = parseTimeMs(slotStart);
      const baseStartMs = parseTimeMs(baseSession.start);
      if (slotStartMs !== null && (baseStartMs === null || slotStartMs < baseStartMs)) {
        baseSession.start = slotStart;
      }
      const slotEndMs = parseTimeMs(slotEnd);
      const baseEndMs = parseTimeMs(baseSession.end);
      if (slotEndMs !== null && (baseEndMs === null || slotEndMs > baseEndMs)) {
        baseSession.end = slotEnd ?? baseSession.end;
      }

      const slotRooms = scheduleRooms.length > 0 ? scheduleRooms : baseSession.rooms;

      const slotSession: Session = {
        ...baseSession,
        start: slotStart ?? baseSession.start,
        end: slotEnd ?? baseSession.end,
        rooms: slotRooms,
        room: slotRooms[0] ?? baseSession.room ?? null,
        slotId: `${code}-${date}-${idx}`,
        eventType: "session",
      };

      events.push(slotSession);
    });

    days.push({
      date,
      sessionIds: orderedCodes,
      events,
    });
  }

  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}

let currentYearRef: number | null = null;

async function loadFromNetwork(year: number): Promise<ConferenceData> {
  const baseUrl = resolveBaseUrl(year);
  const [rawSessions, rawSpeakers, rawSchedule] = await Promise.all([
    fetchJson<RawSessions>(baseUrl, "sessions.json"),
    fetchJson<RawSpeakers>(baseUrl, "speakers.json"),
    fetchJson<RawSchedule>(baseUrl, "schedule.json"),
  ]);

  const { sessions: sessionsPayload, speakers: speakersPayload, schedule } =
    normalizeConferencePayload(rawSessions, rawSpeakers, rawSchedule);

  const speakersById: Record<string, Speaker> = {};
  for (const [code, raw] of Object.entries(speakersPayload)) {
    speakersById[code] = normalizeSpeaker(raw);
  }

  const sessionsById: Record<string, Session> = {};
  for (const [code, raw] of Object.entries(sessionsPayload)) {
    sessionsById[code] = normalizeSession(raw, speakersById);
  }

  const days = buildDays(sessionsById, schedule);

  return {
    days,
    sessionsById,
    speakersById,
  };
}

/**
 * Load conference data with offline caching.
 * - Try newtork first.
 * - If it fails, fall back to cached ConferenceData in AsyncStorage.
 */
export async function loadConferenceData(year: number): Promise<ConferenceData> {
  const { data } = await loadConferenceDataWithMeta(year);
  return data;
}

export async function loadConferenceDataWithMeta(
  year: number,
): Promise<LoadConferenceResult> {
  currentYearRef = year;
  const cacheKey = conferenceCacheKey(year);

  try {
    const data = await loadFromNetwork(year);
    const payload: CachedConferencePayload = {
      data,
      fetchedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(payload));
    return {
      data,
      fromCache: false,
      fetchedAt: payload.fetchedAt ?? null,
      resolvedYear: year,
    };
  } catch (err) {
    const cached = await readCachedConferenceData(cacheKey);
    if (cached) {
      return {
        data: cached.data,
        fromCache: true,
        fetchedAt: cached.fetchedAt,
        resolvedYear: year,
      };
    }
    throw err;
  }
}
