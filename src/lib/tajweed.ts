// Parse the AlQuran Cloud "quran-tajweed" markup: `[<code>[letters]` where code
// (optionally `code:num`) names a tajwīd rule. Text outside brackets is plain.
export interface TajweedSeg {
  text: string;
  rule?: string; // family key (see RULES); undefined = plain
}

// Map single-letter edition codes → rule family.
const FAMILY: Record<string, string> = {
  q: 'qalqalah',
  g: 'ghunnah',
  n: 'madd', p: 'madd', m: 'madd', o: 'madd',
  f: 'ikhfa', c: 'ikhfa',
  a: 'idgham', u: 'idgham', w: 'idgham', d: 'idgham', b: 'idgham',
  i: 'iqlab',
  h: 'hamzawasl', s: 'silent', l: 'lamshams',
};

export interface RuleInfo {
  name: string;
  color: string;
}
export const RULES: Record<string, RuleInfo> = {
  qalqalah: { name: 'قلقلة', color: '#d9534f' },
  ghunnah: { name: 'غُنّة', color: '#2f9e6f' },
  madd: { name: 'مدّ', color: '#3f7fd0' },
  ikhfa: { name: 'إخفاء', color: '#9b59b6' },
  idgham: { name: 'إدغام', color: '#e08a2b' },
  iqlab: { name: 'إقلاب', color: '#1f9e9e' },
  hamzawasl: { name: 'همزة وصل', color: '#8a8f98' },
  silent: { name: 'حرف لا يُنطق', color: '#8a8f98' },
  lamshams: { name: 'لام شمسية', color: '#8a8f98' },
};

const RE = /\[([^[\]]+)\[([^\]]*)\]/g;

export function parseTajweed(marked: string): TajweedSeg[] {
  const segs: TajweedSeg[] = [];
  let last = 0;
  for (let m = RE.exec(marked); m; m = RE.exec(marked)) {
    if (m.index > last) segs.push({ text: marked.slice(last, m.index) });
    const code = m[1].split(':')[0];
    segs.push({ text: m[2], rule: FAMILY[code] });
    last = RE.lastIndex;
  }
  if (last < marked.length) segs.push({ text: marked.slice(last) });
  return segs;
}

export function ruleColor(rule?: string): string | undefined {
  return rule ? RULES[rule]?.color : undefined;
}
