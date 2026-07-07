import AsyncStorage from "@react-native-async-storage/async-storage";

import { CONFERENCE_YEARS, DEFAULT_CONFERENCE_YEAR, API_BASE } from "@config/conference";
import { RawSessions, RawSpeakers, RawSchedule } from "@app-types/raw";
import { ConferenceData, Session, Speaker } from "@app-types/conference";

import { isConferenceData, isRecord } from "./guards";
import { buildDays, normalizeConferencePayload, normalizeSession, normalizeSpeaker } from "./conferenceTransform";

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

function buildBaseUrl(year: number) {
  return `${API_BASE}/ep${year}/releases/current`;
}

const conferenceCacheKey = (year: number) => `ep${year}:conferenceData:v2`;

async function fetchJson<T>(baseUrl: string, path: string): Promise<T> {
  const url = `${baseUrl}/${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
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

async function loadFromNetwork(year: number): Promise<ConferenceData> {
  const baseUrl = buildBaseUrl(year);
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

  let sessionsById: Record<string, Session> = {};
  for (const [code, raw] of Object.entries(sessionsPayload)) {
    sessionsById[code] = normalizeSession(raw, speakersById);
  }

  const built = buildDays(sessionsById, schedule);
  sessionsById = built.sessionsById;

  return {
    days: built.days,
    sessionsById,
    speakersById,
  };
}

/**
 * Load conference data with offline caching.
 * - Try network first.
 * - If it fails, fall back to cached ConferenceData in AsyncStorage.
 */
export async function loadConferenceDataWithMeta(
  year: number,
): Promise<LoadConferenceResult> {
  const cacheKey = conferenceCacheKey(year);

  try {
    const data = await loadFromNetwork(year);
    const fetchedAt = new Date().toISOString();
    try {
      const payload = JSON.stringify({ data, fetchedAt } satisfies CachedConferencePayload);
      try {
        await AsyncStorage.setItem(cacheKey, payload);
      } catch {
        await Promise.all(
          CONFERENCE_YEARS.filter((y) => y !== year && y !== DEFAULT_CONFERENCE_YEAR).map((y) =>
            AsyncStorage.removeItem(conferenceCacheKey(y)),
          ),
        );
        await AsyncStorage.setItem(cacheKey, payload);
      }
    } catch (cacheErr) {
      console.warn(`Failed to cache conference data for ${year}; offline fallback unavailable`, cacheErr);
    }
    return {
      data,
      fromCache: false,
      fetchedAt,
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
