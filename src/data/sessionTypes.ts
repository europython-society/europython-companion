export const sessionTypeAccentMap: Record<string, string> = {
  announcement: "#ef4444",
  keynote: "#facc15",
  tutorial: "#f97316",
  summit: "#8b5cf6",
  sponsored: "#06b6d4",
  panel: "#38bdf8",
  poster: "#f472b6",
  documentary: "#fbbf24",
  talk: "#3b82f6",
  session: "#9ca3af",
};

export const sessionTypeLegendEntries = [
  { label: "Keynote", key: "keynote" as const },
  { label: "Talk / Long talk", key: "talk" as const },
  { label: "Tutorial", key: "tutorial" as const },
  { label: "Summit", key: "summit" as const },
  { label: "Sponsored", key: "sponsored" as const },
  { label: "Panel", key: "panel" as const },
  { label: "Poster", key: "poster" as const },
  { label: "Documentary", key: "documentary" as const },
  { label: "Announcement / Plenary", key: "announcement" as const },
  { label: "Other session", key: "session" as const },
];
