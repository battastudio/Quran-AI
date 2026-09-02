// Hijri (Umm al-Qura) via native Intl — no dataset. Fasting days + Islamic events.
const CAL = 'islamic-umalqura';

export function hijriParts(d = new Date()): { day: number; month: number; year: number } {
  const p = new Intl.DateTimeFormat(`en-US-u-ca-${CAL}`, { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(d);
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return { day: get('day'), month: get('month'), year: get('year') };
}

export function hijriLabel(d = new Date()): string {
  return new Intl.DateTimeFormat(`ar-SA-u-ca-${CAL}`, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

// Returns the reason this is a recommended fasting day, or null.
export function fastingReason(d = new Date()): string | null {
  const wd = d.getDay();
  if (wd === 1) return 'الاثنين';
  if (wd === 4) return 'الخميس';
  const { day } = hijriParts(d);
  if (day >= 13 && day <= 15) return 'الأيام البيض';
  return null;
}

const EVENTS = [
  { m: 1, d: 10, name: 'عاشوراء' },
  { m: 3, d: 12, name: 'المولد النبوي' },
  { m: 7, d: 27, name: 'الإسراء والمعراج' },
  { m: 8, d: 15, name: 'ليلة النصف من شعبان' },
  { m: 9, d: 1, name: 'بداية رمضان' },
  { m: 9, d: 27, name: 'ليلة القدر (٢٧)' },
  { m: 10, d: 1, name: 'عيد الفطر' },
  { m: 12, d: 9, name: 'يوم عرفة' },
  { m: 12, d: 10, name: 'عيد الأضحى' },
];

export function upcomingEvents(from = new Date(), count = 5): { name: string; inDays: number }[] {
  const out: { name: string; inDays: number }[] = [];
  const d = new Date(from);
  for (let i = 0; i < 400 && out.length < count; i++) {
    const p = hijriParts(d);
    const ev = EVENTS.find((e) => e.m === p.month && e.d === p.day);
    if (ev) out.push({ name: ev.name, inDays: i });
    d.setDate(d.getDate() + 1);
  }
  return out;
}
