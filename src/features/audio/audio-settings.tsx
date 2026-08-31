import { useEffect, useMemo, useState } from 'react';
import { getSurah, surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { deleteSurah, downloadSurah, downloadedSurahs } from '../../lib/audio-cache';
import type { Reciter, SurahMeta } from '../../lib/types';
import { useSettings } from '../../store/settings-store';

const BASE = import.meta.env.BASE_URL;
const BITRATES = [64, 128, 192];

// Reciter choice (searchable, 176) + bitrate + per-surah offline download.
export function AudioSettings() {
  const reciter = useSettings((s) => s.reciter);
  const bitrate = useSettings((s) => s.audioBitrate);
  const setSettings = useSettings((s) => s.set);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [list, setList] = useState<SurahMeta[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [q, setQ] = useState('');
  const [progress, setProgress] = useState<{ surah: number; pct: number } | null>(null);

  const refresh = () => void downloadedSurahs(reciter).then(setDone);
  useEffect(() => {
    void fetch(`${BASE}data/reciters.json`).then((r) => r.json()).then(setReciters);
    void surahList().then(setList);
  }, []);
  useEffect(refresh, [reciter]);

  const filtered = useMemo(
    () => (q ? reciters.filter((r) => r.name.includes(q)) : reciters),
    [q, reciters],
  );

  async function download(s: SurahMeta) {
    const full = await getSurah(s.n);
    if (!full) return;
    const gs = full.ayahs.map((a) => a.g);
    await downloadSurah(reciter, s.n, gs, bitrate, (d, t) => setProgress({ surah: s.n, pct: Math.round((d / t) * 100) }));
    setProgress(null);
    refresh();
  }
  async function remove(s: SurahMeta) {
    const full = await getSurah(s.n);
    if (full) await deleteSurah(reciter, s.n, full.ayahs.map((a) => a.g), bitrate);
    refresh();
  }

  return (
    <div className="audio-settings stack">
      <label className="field">
        <span>القارئ ({arabicNum(reciters.length)} قارئ)</span>
        <input className="search-input" placeholder="ابحث عن قارئ…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select size={6} value={reciter} onChange={(e) => setSettings({ reciter: e.target.value })} className="reciter-select">
          {filtered.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </label>
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
