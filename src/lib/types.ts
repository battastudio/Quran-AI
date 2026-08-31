export interface Ayah {
  a: number; // number in surah
  t: string; // uthmani text
  p: number; // mushaf page
  j: number; // juz
}

export interface Surah {
  n: number;
  name: string;
  ename: string;
  type: string; // مكية | مدنية
  count: number;
  page: number;
  ayahs: Ayah[];
}

export type SurahMeta = Omit<Surah, 'ayahs'>;

export interface Reciter {
  id: string; // everyayah folder
  name: string;
}

export interface TafsirBook {
  id: string; // alquran.cloud edition id
  name: string;
}

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface Settings {
  theme: ThemeMode;
  reciter: string;
  tafsir: string; // active tafsir id ('muyassar' = bundled)
  fontSize: number; // ayah font px
  showWordHints: boolean;
  tajweed: boolean; // colored tajwīd reading mode
  calcMethod: string;
  voskModelUrl: string; // optional offline Tasmi' model (.tar.gz URL); '' = online only
  notify: {
    prayer: boolean;
    adhkar: boolean;
    kahf: boolean;
    fasting: boolean;
    hifz: boolean;
  };
}

// SM-2 card for a memorized ayah (key: "surah:ayah").
export interface HifzCard {
  key: string;
  surah: number;
  ayah: number;
  ease: number;
  interval: number; // days
  due: number; // epoch ms
  reps: number;
}
