const DEEP_LINK_RE =
  /^https?:\/\/ep(\d{4})\.europython\.eu\/(schedule|session|speaker)(?:\/([^/?#]+))?\/?(?:[?#].*)?$/i;

export type DeepLinkTarget =
  | { type: "schedule"; year: number }
  | { type: "session"; year: number; slug: string }
  | { type: "speaker"; year: number; slug: string };

export function parseDeepLink(url: string): DeepLinkTarget | null {
  const match = DEEP_LINK_RE.exec(url.trim());
  if (!match) return null;

  const [, yearStr, kind, slug] = match;
  const year = Number(yearStr);

  if (kind === "schedule") return slug ? null : { type: "schedule", year };
  if (!slug) return null;
  return { type: kind as "session" | "speaker", year, slug };
}
