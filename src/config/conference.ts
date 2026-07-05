export const CONFERENCE_YEARS = [2025, 2024, 2023, 2022];
export const DEFAULT_CONFERENCE_YEAR = Math.max(...CONFERENCE_YEARS);

export type ConferenceMeta = { title: string; subtitle: string; timeZone: string };

export const CONFERENCE_META: Record<number, ConferenceMeta> = {
  2025: {
    title: "EuroPython 2025",
    subtitle: "Prague · July 14–20",
    timeZone: "Europe/Prague",
  },
  2024: {
    title: "EuroPython 2024",
    subtitle: "Prague · July 8–14",
    timeZone: "Europe/Prague",
  },
  2023: {
    title: "EuroPython 2023",
    subtitle: "Prague · July 17–23",
    timeZone: "Europe/Prague",
  },
  2022: {
    title: "EuroPython 2022",
    subtitle: "Dublin · July 11–17",
    timeZone: "Europe/Dublin",
  },
};

export const getConferenceMeta = (year: number) => CONFERENCE_META[year]!;
