import { RawSessions, RawSpeakers, RawSchedule, RawSpeaker, RawSession } from "@app-types/raw";
import {
  BreakSlot,
  DaySchedule,
  ScheduleItem,
  Session,
  Speaker,
  SpeakerRef,
} from "@app-types/conference";

import {
  isScheduleBreakEvent,
  isScheduleSessionEvent,
  isWrappedSessions,
  isWrappedSpeakers,
} from "./guards";

export function addMinutesToIso(
  startIso: string | undefined,
  minutes: number | null | undefined,
) {
  if (!startIso || typeof minutes !== "number" || Number.isNaN(minutes)) return null;
  const startDate = new Date(startIso);
  if (Number.isNaN(startDate.getTime())) return null;
  return new Date(startDate.getTime() + minutes * 60_000).toISOString();
}

export function parseTimeMs(iso: string | null | undefined) {
  if (!iso) return null;
  const ms = new Date(iso).getTime();
  return Number.isNaN(ms) ? null : ms;
}

export function unwrapSessions(raw: RawSessions): Record<string, RawSession> {
  return isWrappedSessions(raw) ? raw.sessions : raw;
}

export function unwrapSpeakers(raw: RawSpeakers): Record<string, RawSpeaker> {
  return isWrappedSpeakers(raw) ? raw.speakers : raw;
}

export function normalizeConferencePayload(
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

export function normalizeSpeaker(raw: RawSpeaker): Speaker {
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

export function normalizeSession(
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

export function mergeRooms(primary: string[], secondary: string[]) {
  const merged = new Set<string>();
  primary.forEach((room) => merged.add(room));
  secondary.forEach((room) => merged.add(room));
  return Array.from(merged);
}

/**
 * Builds per-day schedules from raw schedule events, merging schedule-slot
 * details (rooms/start/end/websiteUrl) onto each session. Returns a fresh
 * `sessionsById` map carrying the merged values instead of mutating the
 * `sessionsById` passed in.
 */
export function buildDays(
  sessionsById: Record<string, Session>,
  rawSchedule: RawSchedule,
): { days: DaySchedule[]; sessionsById: Record<string, Session> } {
  const mergedById: Record<string, Session> = {};
  for (const [code, session] of Object.entries(sessionsById)) {
    mergedById[code] = { ...session };
  }

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
      const baseSession = mergedById[code];
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
  return { days, sessionsById: mergedById };
}
