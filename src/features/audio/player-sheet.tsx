import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { BottomSheet, Icon } from '../../components';
import { arabicNum } from '../../lib/format';
import type { Reciter } from '../../lib/types';
import { useSettings } from '../../store/settings-store';
import { audioEl, useAudio } from '../../store/audio-store';

export const usePlayerOpen = create<{ open: boolean; set: (v: boolean) => void }>((set) => ({
  open: false,
  set: (open) => set({ open }),
}));

const BASE = import.meta.env.BASE_URL;
const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const fmt = (s: number) => (isNaN(s) ? '٠:٠٠' : `${arabicNum(Math.floor(s / 60))}:${arabicNum(String(Math.floor(s % 60)).padStart(2, '0'))}`);

// Floating full player: seek bar, reciter switcher, speed, A–B loop, next/prev.
export function PlayerSheet() {
  const { open, set } = usePlayerOpen();
  const { playing, isPlaying, speed, loop, error, toggle, next, prev, setSpeed, setLoop } = useAudio();
  const reciter = useSettings((s) => s.reciter);
  const setSettings = useSettings((s) => s.set);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    void fetch(`${BASE}data/reciters.json`).then((r) => r.json()).then(setReciters);
  }, []);
  useEffect(() => {
    const a = audioEl();
    const onTime = () => { setT(a.currentTime); setDur(a.duration); };
    a.addEventListener('timeupdate', onTime);
    return () => a.removeEventListener('timeupdate', onTime);
  }, []);

  if (!playing) return null;
  return (
    <BottomSheet open={open} title="المشغّل" onClose={() => set(false)}>
      {error && <p className="error">{error}</p>}
      <p className="player__ref">سورة {arabicNum(playing.surah)} · الآية {arabicNum(playing.ayah)}</p>
      <input
        className="player__seek" type="range" min={0} max={dur || 0} step={0.1} value={t || 0}
        onChange={(e) => { audioEl().currentTime = Number(e.target.value); }}
      />
      <div className="player__time"><span>{fmt(t)}</span><span>{fmt(dur)}</span></div>
      <div className="player__controls">
        <button className={loop ? 'icon-btn icon-btn--on' : 'icon-btn'} aria-label="تكرار" onClick={() => setLoop(!loop)}><Icon name="clock" /></button>
        <button className="icon-btn" aria-label="السابق" onClick={prev}><Icon name="prev" /></button>
        <button className="mic" style={{ width: 64, height: 64 }} aria-label={isPlaying ? 'إيقاف' : 'تشغيل'} onClick={toggle}><Icon name={isPlaying ? 'pause' : 'play'} size={26} /></button>
        <button className="icon-btn" aria-label="التالي" onClick={next}><Icon name="next" /></button>
        <button className="icon-btn" aria-label="السرعة" onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}>{speed}×</button>
      </div>
      <label className="field">
        <span>القارئ</span>
        <select value={reciter} onChange={(e) => setSettings({ reciter: e.target.value })}>
          {reciters.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </label>
    </BottomSheet>
  );
}
