// Khatmah-by-link (group) — the group definition travels in the URL, base64-encoded.
// No backend: joiners pick a juz locally; claims are not synced (Fable §A.3).
export interface Group { t: string; n: number } // title, group size

export function encodeGroup(g: Group): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(g))));
}

export function decodeGroup(s: string): Group | null {
  try {
    const g = JSON.parse(decodeURIComponent(escape(atob(s)))) as Group;
    if (typeof g.t === 'string' && typeof g.n === 'number') return g;
  } catch { /* malformed link */ }
  return null;
}

export function groupLink(g: Group): string {
  const base = `${location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, '');
  return `${base}/#/khatmah/join?g=${encodeGroup(g)}`;
}
