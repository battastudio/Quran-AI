import { create } from 'zustand';
import { ayahAudioUrl } from '../lib/audio-url';
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
  error: string | null;
  play: (queue: Track[], startIndex?: number) => void;
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
  error: null,
  play: (queue, startIndex = 0) => {
    set({ queue, error: null });
    playIndex(startIndex, set, get);
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
    audio().pause();
    set({ playing: null, isPlaying: false, queue: [] });
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
    return set({ playing: null, isPlaying: false });
  }
  const track = queue[i];
  const reciter = useSettings.getState().reciter;
  set({ playing: track, isPlaying: true, index: i, error: null });
  startWithFallback(reciter, track, speed, () => playIndex(i + 1, set, get), set);
  mediaSession(i, track, set, get);
}

// Try bitrates until one loads; remember the winner per reciter.
function startWithFallback(reciter: string, track: Track, speed: number, onEnd: () => void, set: SetFn) {
  const order = [reciterBitrate(reciter), ...BITRATES].filter((b, i, a) => a.indexOf(b) === i);
  let attempt = 0;
  const a = audio();
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
