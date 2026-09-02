import { create } from 'zustand';
import type { Settings } from '../lib/types';
import { loadSettings, saveSettings } from '../lib/db';

export const DEFAULTS: Settings = {
  theme: 'auto',
  ayahFont: 'amiri',
  readerView: 'scroll',
  swipeDir: 'rtl',
  mushafPaper: true,
  reciter: 'ar.alafasy',
  audioBitrate: 128,
  tafsir: 'muyassar',
  translation: 'none',
  comfort: false,
  fontSize: 30,
  showWordHints: true,
  tajweed: false,
  calcMethod: 'UmmAlQura',
  adhanSound: true,
  asrModel: 'onnx-community/whisper-tiny',
  voskModelUrl: '',
  notify: { prayer: true, adhkar: true, kahf: true, fasting: false, hifz: true },
};

interface SettingsState extends Settings {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  set: (patch: Partial<Settings>) => void;
}

function applyTheme(theme: Settings['theme']) {
  const resolved =
    theme === 'auto'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  document.documentElement.dataset.theme = resolved;
}

function applyAyahFont(font: Settings['ayahFont']) {
  document.documentElement.dataset.ayahfont = font;
}
function applyComfort(on: boolean) {
  document.documentElement.dataset.comfort = on ? 'on' : '';
}

export const useSettings = create<SettingsState>((set, get) => ({
  ...DEFAULTS,
  hydrated: false,
  hydrate: async () => {
    const saved = await loadSettings();
    const merged = { ...DEFAULTS, ...saved, notify: { ...DEFAULTS.notify, ...saved?.notify } };
    // migrate stale reciter ids (pre-CDN builds saved everyayah folder names)
    if (!merged.reciter.startsWith('ar.')) merged.reciter = DEFAULTS.reciter;
    applyTheme(merged.theme);
    applyAyahFont(merged.ayahFont);
    applyComfort(merged.comfort);
    set({ ...merged, hydrated: true });
  },
  set: (patch) => {
    const next = { ...pick(get()), ...patch };
    if (patch.theme) applyTheme(patch.theme);
    if (patch.ayahFont) applyAyahFont(patch.ayahFont);
    if (patch.comfort !== undefined) applyComfort(patch.comfort);
    set(patch);
    void saveSettings(next);
  },
}));

function pick(s: SettingsState): Settings {
  const { theme, ayahFont, readerView, swipeDir, mushafPaper, reciter, audioBitrate, tafsir, translation, comfort, fontSize, showWordHints, tajweed, calcMethod, adhanSound, asrModel, voskModelUrl, notify } = s;
  return { theme, ayahFont, readerView, swipeDir, mushafPaper, reciter, audioBitrate, tafsir, translation, comfort, fontSize, showWordHints, tajweed, calcMethod, adhanSound, asrModel, voskModelUrl, notify };
}
