import { useMemo } from "react";

import { sessionTypeAccentMap, sessionTypeLegendEntries } from "@data/sessionTypes";

/**
 * Resolve an accent color for a session type string with a fallback.
 */
export function getSessionTypeAccent(sessionType?: string | null, fallback?: string) {
  if (!sessionType) return sessionTypeAccentMap.session || fallback;
  const key = sessionType.trim().toLowerCase();
  if (key.includes("announce")) return sessionTypeAccentMap.announcement;
  if (key.includes("keynote")) return sessionTypeAccentMap.keynote;
  if (key.includes("tutorial")) return sessionTypeAccentMap.tutorial;
  if (key.includes("summit")) return sessionTypeAccentMap.summit;
  if (key.includes("sponsor")) return sessionTypeAccentMap.sponsored;
  if (key.includes("panel")) return sessionTypeAccentMap.panel;
  if (key.includes("poster")) return sessionTypeAccentMap.poster;
  if (key.includes("documentary")) return sessionTypeAccentMap.documentary;
  if (key.includes("talk")) return sessionTypeAccentMap.talk;
  return sessionTypeAccentMap.session || fallback;
}

/**
 * Hook returning legend entries of session types and colors.
 */
export function useSessionTypeLegendEntries() {
  return useMemo(
    () =>
      sessionTypeLegendEntries.map((entry) => ({
        label: entry.label,
        color: sessionTypeAccentMap[entry.key],
      })),
    [],
  );
}
