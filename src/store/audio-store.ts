import { create } from 'zustand';
import { ayahAudioUrl } from '../lib/audio-url';
import { useSettings } from './settings-store';

interface Track {
  surah: number;
  ayah: number;
}

interface AudioState {
  playing: Track | null;
  isPlaying: boolean;
  queue: Track[];
  speed: number;
  loop: boolean; // A–B loop the current queue
  play: (queue: Track[], startIndex?: number) => void;
  toggle: () => void;
  stop: () => void;
  setSpeed: (s: number) => void;
  setLoop: (v: boolean) => void;
}

let el: HTMLAudioElement | null = null;
function audio(): HTMLAudioElement {
  if (!el) el = new Audio();
  return el;
}

export const useAudio = create<AudioState>((set, get) => ({
  playing: null,
  isPlaying: false,
  queue: [],
  speed: 1,
  loop: false,
  play: (queue, startIndex = 0) => {
    set({ queue });
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
  const a = audio();
  a.src = ayahAudioUrl(useSettings.getState().reciter, track.surah, track.ayah);
  a.playbackRate = speed;
  a.onended = () => playIndex(i + 1, set, get);
  void a.play();
  set({ playing: track, isPlaying: true });
  mediaSession(i, track, set, get);
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
