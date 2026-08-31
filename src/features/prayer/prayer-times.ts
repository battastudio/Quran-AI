import { CalculationMethod, Coordinates, PrayerTimes, Qibla } from 'adhan';
import type { Coords } from '../../lib/geo';

const METHODS: Record<string, () => ReturnType<typeof CalculationMethod.MuslimWorldLeague>> = {
  UmmAlQura: CalculationMethod.UmmAlQura,
  MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
  Egyptian: CalculationMethod.Egyptian,
  Karachi: CalculationMethod.Karachi,
  NorthAmerica: CalculationMethod.NorthAmerica,
  Dubai: CalculationMethod.Dubai,
};

export const METHOD_NAMES: Record<string, string> = {
  UmmAlQura: 'أم القرى (السعودية)',
  MuslimWorldLeague: 'رابطة العالم الإسلامي',
  Egyptian: 'الهيئة المصرية',
  Karachi: 'كراتشي',
  NorthAmerica: 'أمريكا الشمالية (ISNA)',
  Dubai: 'دبي',
};

export interface PrayerRow {
  key: string;
  name: string;
  time: Date;
}

const LABELS: Record<string, string> = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

export function computeTimes(coords: Coords, method: string, date = new Date()) {
  const c = new Coordinates(coords.lat, coords.lng);
  const params = (METHODS[method] ?? CalculationMethod.UmmAlQura)();
  const pt = new PrayerTimes(c, date, params);
  const rows: PrayerRow[] = (['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(
    (k) => ({ key: k, name: LABELS[k], time: pt[k] }),
  );
  return { rows, next: pt.nextPrayer(), qibla: Qibla(c) };
}
