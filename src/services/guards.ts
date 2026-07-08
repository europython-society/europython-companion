import {
  RawSessions,
  RawSpeakers,
  RawSession,
  RawSpeaker,
  RawScheduleEvent,
  RawScheduleSessionEvent,
  RawScheduleBreakEvent,
} from "@app-types/raw";
import { ConferenceData } from "@app-types/conference";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isConferenceData(value: unknown): value is ConferenceData {
  if (!isRecord(value)) return false;
  const days = (value as { days?: unknown }).days;
  const sessionsById = (value as { sessionsById?: unknown }).sessionsById;
  const speakersById = (value as { speakersById?: unknown }).speakersById;
  return Array.isArray(days) && isRecord(sessionsById) && isRecord(speakersById);
}

export function isRawSession(value: unknown): value is RawSession {
  if (!isRecord(value)) return false;
  return typeof value.code === "string" && typeof value.title === "string";
}

export function isRawSpeaker(value: unknown): value is RawSpeaker {
  if (!isRecord(value)) return false;
  return typeof value.code === "string" && typeof value.name === "string";
}

export function isWrappedSessions(
  raw: RawSessions,
): raw is { sessions: Record<string, RawSession> } {
  if (!isRecord(raw) || !("sessions" in raw)) return false;
  const candidate = (raw as { sessions?: unknown }).sessions;
  return isRecord(candidate) && !isRawSession(candidate);
}

export function isWrappedSpeakers(
  raw: RawSpeakers,
): raw is { speakers: Record<string, RawSpeaker> } {
  if (!isRecord(raw) || !("speakers" in raw)) return false;
  const candidate = (raw as { speakers?: unknown }).speakers;
  return isRecord(candidate) && !isRawSpeaker(candidate);
}

export function isScheduleSessionEvent(
  ev: RawScheduleEvent,
): ev is RawScheduleSessionEvent {
  return ev.event_type === "session";
}

export function isScheduleBreakEvent(ev: RawScheduleEvent): ev is RawScheduleBreakEvent {
  return ev.event_type === "break";
}

export function isWifiInfo(value: unknown): value is { ssid: string; password: string } {
  return (
    isRecord(value) &&
    typeof value.ssid === "string" &&
    typeof value.password === "string"
  );
}
