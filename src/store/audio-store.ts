import { create } from 'zustand';
import { ayahAudioUrl, syncAudioUrl } from '../lib/audio-url';
import { getSurah, segmentsFor } from '../lib/quran';
import { getKv, setKv } from '../lib/db';
import { useSettings } from './settings-store';

// islamic.network hosts different bitrates per reciter — resolve one that works.
const BITRATES = [128, 64, 192];
const resolved: Record<string, number> = {};
export function reciterBitrate(reciter: string): number {
  return resolved[reciter] ?? useSettings.getState().audioBitrate;
}
void getKv<Record<string, number>>('bitrateCache').then((c) => Object.assign(resolved, c ?? {}));

interface Track {
  surah: number;
  ayah: number;
  g: number; // global ayah number (for the CDN)
}

interface AudioState {
  playing: Track | null;
  isPlaying: boolean;
  queue: Track[];
  index: number;
  speed: number;
  loop: boolean; // A–B loop the current queue
  sync: boolean; // word-sync playback (Alafasy + segments)
  currentWord: { surah: number; ayah: number; index: number } | null;
  repeatLeft: number; // remaining full-queue repeats (listen-and-repeat)
  error: string | null;
  play: (queue: Track[], startIndex?: number, repeat?: number) => void;
  playSync: (queue: Track[], startIndex?: number) => void;
  playRange: (surah: number, from: number, to: number, repeat: number) => Promise<void>;
  toggle: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  setSpeed: (s: number) => void;
  setLoop: (v: boolean) => void;
}

let el: HTMLAudioElement | null = null;
function audio(): HTMLAudioElement {
  if (!el) el = new Audio();
  return el;
}
export const audioEl = audio;

export const useAudio = create<AudioState>((set, get) => ({
  playing: null,
  isPlaying: false,
  queue: [],
  index: 0,
  speed: 1,
  loop: false,
  sync: false,
  currentWord: null,
  repeatLeft: 1,
  error: null,
  play: (queue, startIndex = 0, repeat = 1) => {
    set({ queue, error: null, sync: false, currentWord: null, repeatLeft: repeat });
    playIndex(startIndex, set, get);
  },
  playSync: (queue, startIndex = 0) => {
    set({ queue, error: null, sync: true, currentWord: null, repeatLeft: 1 });
    playIndex(startIndex, set, get);
  },
  // A–B repeat: loop an ayah range N× (Infinity via loop).
  playRange: async (surah, from, to, repeat) => {
    const s = await getSurah(surah);
    if (!s) return;
    const q = s.ayahs.filter((a) => a.a >= from && a.a <= to).map((a) => ({ surah, ayah: a.a, g: a.g }));
    if (!q.length) return;
    set({ loop: repeat === Infinity });
    get().play(q, 0, repeat === Infinity ? 1 : repeat);
  },
  toggle: () => {
    const a = audio();
    if (a.paused) {
      void a.play();
      set({ isPlaying: true });
    } else {
      a.pause();
      set({ isPlaying: false });
    }
  },
  stop: () => {
    const a = audio();
    a.pause();
    a.ontimeupdate = null;
    set({ playing: null, isPlaying: false, queue: [], currentWord: null });
  },
  next: () => playIndex(get().index + 1, set, get),
  prev: () => playIndex(get().index - 1, set, get),
  setSpeed: (s) => {
    audio().playbackRate = s;
    set({ speed: s });
  },
  setLoop: (v) => set({ loop: v }),
}));

function playIndex(i: number, set: SetFn, get: GetFn) {
  const { queue, speed } = get();
  if (i < 0 || i >= queue.length) {
    if (get().loop && queue.length) return playIndex(0, set, get);
    if (get().repeatLeft > 1 && queue.length) {
      set({ repeatLeft: get().repeatLeft - 1 });
      return playIndex(0, set, get);
    }
    return set({ playing: null, isPlaying: false });
  }
  const track = queue[i];
  set({ playing: track, isPlaying: true, index: i, error: null, currentWord: null });
  if (get().sync) startSync(track, speed, () => playIndex(i + 1, set, get), set);
  else startWithFallback(useSettings.getState().reciter, track, speed, () => playIndex(i + 1, set, get), set);
  mediaSession(i, track, set, get);
}

// Word-sync playback: Alafasy audio + bundled segments → live current-word.
function startSync(track: Track, speed: number, onEnd: () => void, set: SetFn) {
  const a = audio();
  a.playbackRate = speed;
  a.onerror = null;
  a.onended = onEnd;
  a.src = syncAudioUrl(track.surah, track.ayah);
  void segmentsFor(track.surah, track.ayah).then((segs) => {
    a.ontimeupdate = () => {
      if (!segs) return;
      const ms = a.currentTime * 1000;
      const seg = segs.find((s) => ms >= s[1] && ms < s[2]);
      set({ currentWord: seg ? { surah: track.surah, ayah: track.ayah, index: seg[0] } : null });
    };
  });
  void a.play().catch(() => {});
}

// Try bitrates until one loads; remember the winner per reciter.
function startWithFallback(reciter: string, track: Track, speed: number, onEnd: () => void, set: SetFn) {
  const order = [reciterBitrate(reciter), ...BITRATES].filter((b, i, a) => a.indexOf(b) === i);
  let attempt = 0;
  const a = audio();
  a.ontimeupdate = null; // clear any sync-mode word tracker
  a.playbackRate = speed;
  a.onended = onEnd;
  const tryNext = () => {
    if (attempt >= order.length) {
      set({ isPlaying: false, error: 'تعذّر تشغيل هذا القارئ. جرّب قارئًا آخر.' });
      return;
    }
    const bitrate = order[attempt++];
    a.onerror = tryNext;
    a.oncanplay = () => {
      resolved[reciter] = bitrate;
      void setKv('bitrateCache', resolved);
      a.oncanplay = null;
    };
    a.src = ayahAudioUrl(reciter, track.g, bitrate);
    void a.play().catch(() => {});
  };
  tryNext();
}

// Lock-screen / hardware media controls.
function mediaSession(i: number, track: Track, set: SetFn, get: GetFn) {
  const ms = navigator.mediaSession;
  if (!ms) return;
  ms.metadata = new MediaMetadata({
    title: `الآية ${track.ayah}`,
    artist: `سورة ${track.surah}`,
    album: 'نور القرآن',
  });
  ms.setActionHandler('play', () => get().toggle());
  ms.setActionHandler('pause', () => get().toggle());
  ms.setActionHandler('nexttrack', () => playIndex(i + 1, set, get));
  ms.setActionHandler('previoustrack', () => playIndex(i - 1, set, get));
}

type SetFn = (p: Partial<AudioState>) => void;
type GetFn = () => AudioState;
