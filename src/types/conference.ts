export interface SpeakerRef {
  id: string;
  name: string;
  affiliation: string | null;
}

export interface Speaker {
  id: string;
  name: string;
  affiliation: string | null;
  biography: string | null;
  avatar: string | null;
  homepage: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  mastodonUrl: string | null;
  twitterUrl: string | null;
  blueskyUrl: string | null;
  gitUrl: string | null;
  slug: string;
}

export interface Session {
  id: string;
  eventType?: "session";

  /**
   * Optional slot identifier when the same session appears multiple times in the schedule.
   * Keeps list keys stable even if a session spans multiple time slots.
   */
  slotId?: string;

  title: string;

  /** This is in markdown format */
  abstract: string | null;

  /** ISO datetime */
  start: string;
  end: string;

  rooms: string[];

  /** Basically rooms[0] */
  room: string | null;

  track: string | null;
  level: string | null;
  sessionType: string | null;
  delivery: string | null;
  slug: string;
  tweet: string | null;
  websiteUrl: string | null;
  youtubeUrl: string | null;
  speakers: SpeakerRef[];
}

export interface BreakSlot {
  id: string;
  title: string;
  start: string;
  end: string;
  rooms: string[];
  eventType: "break";
}

export type ScheduleItem = Session | BreakSlot;

export interface DaySchedule {
  /** YYYY-MM-DD */
  date: string;

  sessionIds: string[];
  events: ScheduleItem[];
}

export interface ConferenceData {
  days: DaySchedule[];
  sessionsById: Record<string, Session>;
  speakersById: Record<string, Speaker>;
}
