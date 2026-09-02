import { useEffect, useState } from 'react';
import { getSurah, surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { deleteSurah, downloadSurah, downloadedSurahs } from '../../lib/audio-cache';
import type { SurahMeta } from '../../lib/types';
import { useSettings } from '../../store/settings-store';
import { reciterBitrate } from '../../store/audio-store';
import { ReciterPicker } from './reciter-picker';

const BITRATES = [64, 128, 192];

// Reciter choice (searchable + preview) + bitrate + per-surah offline download.
export function AudioSettings() {
  const reciter = useSettings((s) => s.reciter);
  const bitrate = useSettings((s) => s.audioBitrate);
  const setSettings = useSettings((s) => s.set);
  const [list, setList] = useState<SurahMeta[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [progress, setProgress] = useState<{ surah: number; pct: number } | null>(null);

  const refresh = () => void downloadedSurahs(reciter).then(setDone);
  useEffect(() => { void surahList().then(setList); }, []);
  useEffect(refresh, [reciter]);

  async function download(s: SurahMeta) {
    const full = await getSurah(s.n);
    if (!full) return;
    const gs = full.ayahs.map((a) => a.g);
    await downloadSurah(reciter, s.n, gs, reciterBitrate(reciter), (d, t) => setProgress({ surah: s.n, pct: Math.round((d / t) * 100) }));
    setProgress(null);
    refresh();
  }
  async function remove(s: SurahMeta) {
    const full = await getSurah(s.n);
    if (full) await deleteSurah(reciter, s.n, full.ayahs.map((a) => a.g), reciterBitrate(reciter));
    refresh();
  }

  return (
    <div className="audio-settings stack">
      <div className="field">
        <span>القارئ</span>
        <ReciterPicker value={reciter} onChange={(id) => setSettings({ reciter: id })} />
      </div>
      <label className="field">
        <span>جودة الصوت</span>
        <div className="chips">
          {BITRATES.map((b) => (
            <button key={b} className={bitrate === b ? 'chip chip--on' : 'chip'} onClick={() => setSettings({ audioBitrate: b })}>{arabicNum(b)}k</button>
          ))}
        </div>
      </label>
      <p className="field__hint">نزّل السور للاستماع دون إنترنت:</p>
      <ul className="dl-list">
        {list.map((s) => {
          const ready = done.includes(s.n);
          const busy = progress?.surah === s.n;
          return (
            <li key={s.n} className="row">
              <span>{arabicNum(s.n)}. {s.name}</span>
              {busy ? <span className="link">{arabicNum(progress!.pct)}٪</span>
                : ready ? <button className="link" onClick={() => remove(s)}>حذف</button>
                : <button className="link" onClick={() => download(s)}>تنزيل</button>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
