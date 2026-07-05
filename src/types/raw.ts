export interface RawSession {
  abstract: string;
  code: string;
  delivery: string | null;
  duration: string;
  end: string;
  level: string | null;
  next_session: string | null;
  prev_session: string | null;
  resources: unknown | null;
  room: string;
  session_type: string | null;
  sessions_after: string[];
  sessions_before: string[];
  sessions_in_parallel: string[];
  slug: string;
  speakers: string[];
  start: string;
  title: string;
  track: string | null;
  tweet: string | null;
  website_url: string | null;
  youtube_url: string | null;
}

export type RawSessions = Record<string, RawSession> | { sessions: Record<string, RawSession> };

export interface RawSpeaker {
  code: string;
  name: string;
  affiliation: string | null;
  biography: string | null;
  avatar: string | null;
  homepage: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  mastodon_url: string | null;
  twitter_url: string | null;
  bluesky_url: string | null;
  gitx_url: string | null;
  slug: string;
  submissions: string[];
}

export type RawSpeakers =
  | Record<string, RawSpeaker>
  | { speakers: Record<string, RawSpeaker> };

export interface RawScheduleSpeakerRef {
  code: string;
  name: string;
  avatar: string;
  slug: string;
  website_url: string;
}

export interface RawScheduleSessionEvent {
  event_type: "session";
  code: string;
  start: string;
  duration: number;
  title: string;
  rooms: string[];
  level: string;
  session_type: string;
  slug: string;
  speakers: RawScheduleSpeakerRef[];
  track: string | null;
  tweet: string;
  website_url: string;
}

export interface RawScheduleBreakEvent {
  event_type: "break";
  start: string;
  duration: number;
  title: string;
  rooms: string[];
}

export type RawScheduleEvent = RawScheduleSessionEvent | RawScheduleBreakEvent;

export interface RawScheduleDay {
  events: RawScheduleEvent[];
  rooms: string[];
}

export interface RawSchedule {
  days: Record<string, RawScheduleDay>;
  events?: Record<string, RawScheduleEvent>;
}
