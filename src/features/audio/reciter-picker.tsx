import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../components';
import { ayahAudioUrl } from '../../lib/audio-url';
import type { Reciter } from '../../lib/types';
import { reciterBitrate } from '../../store/audio-store';

const BASE = import.meta.env.BASE_URL;
const PINNED = ['ar.alafasy', 'ar.abdurrahmaansudais', 'ar.abdulbasitmurattal', 'ar.minshawi', 'ar.husary'];
const BITRATES = [128, 64, 192];

let preview: HTMLAudioElement | null = null;
function playPreview(id: string, onEnd: () => void) {
  preview?.pause();
  preview = new Audio();
  const order = [reciterBitrate(id), ...BITRATES].filter((b, i, a) => a.indexOf(b) === i);
  let i = 0;
  const tryNext = () => {
    if (i >= order.length) return onEnd();
    preview!.onerror = tryNext;
    preview!.src = ayahAudioUrl(id, 1, order[i++]); // Fātiḥa 1:1
    void preview!.play().catch(() => {});
  };
  preview.onended = onEnd;
  tryNext();
}
function stopPreview() {
  preview?.pause();
  preview = null;
}

// Searchable reciter list with a per-row sound preview.
export function ReciterPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [q, setQ] = useState('');
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`${BASE}data/reciters.json`).then((r) => r.json()).then(setReciters);
    return stopPreview;
  }, []);

  const list = useMemo(() => {
    if (q) return reciters.filter((r) => r.name.includes(q));
    const pinned = PINNED.map((id) => reciters.find((r) => r.id === id)).filter(Boolean) as Reciter[];
    return [...pinned, ...reciters.filter((r) => !PINNED.includes(r.id))];
  }, [q, reciters]);

  function togglePreview(id: string) {
    if (playing === id) { stopPreview(); setPlaying(null); return; }
    setPlaying(id);
    playPreview(id, () => setPlaying(null));
  }

  return (
    <div className="reciter-picker">
      <input className="search-input" placeholder="ابحث عن قارئ…" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="reciter-list">
        {list.map((r) => (
          <li key={r.id} className={value === r.id ? 'reciter-row reciter-row--on' : 'reciter-row'}>
            <button className="reciter-row__name" onClick={() => onChange(r.id)}>{r.name}</button>
            <button className="icon-btn" aria-label="استماع" onClick={() => togglePreview(r.id)}>
              <Icon name={playing === r.id ? 'pause' : 'play'} size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
