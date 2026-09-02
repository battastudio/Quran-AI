import { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import { BottomSheet, Icon } from '../../components';
import { arabicNum } from '../../lib/format';
import { useSettings } from '../../store/settings-store';
import { audioEl, useAudio } from '../../store/audio-store';
import { ReciterPicker } from './reciter-picker';

export const usePlayerOpen = create<{ open: boolean; set: (v: boolean) => void }>((set) => ({
  open: false,
  set: (open) => set({ open }),
}));

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const fmt = (s: number) => (isNaN(s) ? '٠:٠٠' : `${arabicNum(Math.floor(s / 60))}:${arabicNum(String(Math.floor(s % 60)).padStart(2, '0'))}`);

// Floating full player: seek bar, reciter switcher, speed, A–B loop, next/prev.
export function PlayerSheet() {
  const { open, set } = usePlayerOpen();
  const { playing, isPlaying, speed, loop, error, toggle, next, prev, setSpeed, setLoop, playRange } = useAudio();
  const reciter = useSettings((s) => s.reciter);
  const setSettings = useSettings((s) => s.set);
  const [ab, setAb] = useState({ from: 1, to: 7, rep: 3 });
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [sleep, setSleep] = useState(0);
  const sleepRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = useAudio((s) => s.stop);

  useEffect(() => {
    const a = audioEl();
    const onTime = () => { setT(a.currentTime); setDur(a.duration); };
    a.addEventListener('timeupdate', onTime);
    return () => a.removeEventListener('timeupdate', onTime);
  }, []);

  function setSleepTimer(m: number) {
    setSleep(m);
    if (sleepRef.current) clearTimeout(sleepRef.current);
    if (m > 0) sleepRef.current = setTimeout(() => { stop(); setSleep(0); }, m * 60_000);
  }

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
      <div className="field">
        <span>تكرار نطاق (من–إلى) للحفظ</span>
        <div className="ab-row">
          <input type="number" min={1} value={ab.from} onChange={(e) => setAb({ ...ab, from: +e.target.value })} aria-label="من الآية" />
          <input type="number" min={1} value={ab.to} onChange={(e) => setAb({ ...ab, to: +e.target.value })} aria-label="إلى الآية" />
          <div className="chips">
            {[1, 3, 5, Infinity].map((r) => (
              <button key={r} className={ab.rep === r ? 'chip chip--on' : 'chip'} onClick={() => setAb({ ...ab, rep: r })}>{r === Infinity ? '∞' : arabicNum(r)}×</button>
            ))}
          </div>
          <button className="btn btn--sm" onClick={() => void playRange(playing.surah, ab.from, ab.to, ab.rep)}>تشغيل</button>
        </div>
      </div>
      <div className="field">
        <span>القارئ</span>
        <ReciterPicker value={reciter} onChange={(id) => setSettings({ reciter: id })} />
      </div>
      <div className="field">
        <span>مؤقّت النوم</span>
        <div className="chips">
          {[0, 5, 15, 30].map((m) => (
            <button key={m} className={sleep === m ? 'chip chip--on' : 'chip'} onClick={() => setSleepTimer(m)}>
              {m === 0 ? 'إيقاف' : `${arabicNum(m)} د`}
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
