import { useEffect, useState } from 'react';
import { surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { deleteSurah, downloadSurah, downloadedSurahs } from '../../lib/audio-cache';
import type { Reciter, SurahMeta } from '../../lib/types';
import { useSettings } from '../../store/settings-store';

const BASE = import.meta.env.BASE_URL;

// Reciter choice + per-surah offline download manager (Settings → Audio).
export function AudioSettings() {
  const reciter = useSettings((s) => s.reciter);
  const setSettings = useSettings((s) => s.set);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [list, setList] = useState<SurahMeta[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [progress, setProgress] = useState<{ surah: number; pct: number } | null>(null);

  const refresh = () => void downloadedSurahs(reciter).then(setDone);
  useEffect(() => {
    void fetch(`${BASE}data/reciters.json`).then((r) => r.json()).then(setReciters);
    void surahList().then(setList);
  }, []);
  useEffect(refresh, [reciter]);

  async function download(s: SurahMeta) {
    await downloadSurah(reciter, s.n, s.count, (d, t) => setProgress({ surah: s.n, pct: Math.round((d / t) * 100) }));
    setProgress(null);
    refresh();
  }
  async function remove(s: SurahMeta) {
    await deleteSurah(reciter, s.n, s.count);
    refresh();
  }

  return (
    <div className="audio-settings">
      <label className="field">
        <span>القارئ</span>
        <select value={reciter} onChange={(e) => setSettings({ reciter: e.target.value })}>
          {reciters.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </label>

      <p className="field__hint">نزّل السور للاستماع دون إنترنت:</p>
      <ul className="dl-list">
        {list.map((s) => {
          const ready = done.includes(s.n);
          const busy = progress?.surah === s.n;
          return (
            <li key={s.n} className="row">
              <span>{arabicNum(s.n)}. {s.name}</span>
              {busy ? (
                <span className="link">{arabicNum(progress!.pct)}٪</span>
              ) : ready ? (
                <button className="link" onClick={() => remove(s)}>حذف</button>
              ) : (
                <button className="link" onClick={() => download(s)}>تنزيل</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
