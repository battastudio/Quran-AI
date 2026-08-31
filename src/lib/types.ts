export interface Ayah {
  a: number; // number in surah
  g: number; // global ayah number (1..6236) — for audio CDN
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

export type ThemeMode = 'auto' | 'light' | 'dark' | 'emerald' | 'royal' | 'midnight' | 'sepia' | 'night';
export type ReaderView = 'scroll' | 'page' | 'focus' | 'cards';
export type AyahFont = 'amiri' | 'system';
export type SwipeDir = 'rtl' | 'ltr';

export interface Settings {
  theme: ThemeMode;
  ayahFont: AyahFont;
  readerView: ReaderView;
  swipeDir: SwipeDir;
  mushafPaper: boolean; // parchment page background in mushaf/page view
  reciter: string; // ar.* audio edition id
  audioBitrate: number; // 128 | 64 | 192
  tafsir: string; // active tafsir id ('muyassar' = bundled)
  fontSize: number; // ayah font px
  showWordHints: boolean;
  tajweed: boolean; // colored tajwīd reading mode
  calcMethod: string;
  asrModel: string; // offline Tasmi' model id (whisper-*)
  voskModelUrl: string; // optional Vosk model (.tar.gz URL); overrides whisper if set
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
