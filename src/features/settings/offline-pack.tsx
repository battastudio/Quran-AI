import { useState } from 'react';
import { Icon } from '../../components';
import { getSurah } from '../../lib/quran';
import { downloadSurah } from '../../lib/audio-cache';
import { reciterBitrate } from '../../store/audio-store';
import { useSettings } from '../../store/settings-store';

const BASE = import.meta.env.BASE_URL;
const DATA = ['quran.json', 'surahs.json', 'tafsir-muyassar.json', 'quran-tajweed.json',
  'word-morphology.json', 'segments-alafasy.json', 'reciters.json', 'tafsir-catalog.json',
  'adhkar.json', 'asma.json', 'duas.json'];
const SURAHS = [1, 18, 36, 55, 67, 112, 113, 114]; // Fātiḥa, Kahf, Yā-Sīn, Raḥmān, Mulk, Ikhlāṣ+

// One-tap: warm the bundled-data cache + download key surahs for the current reciter.
export function OfflinePack() {
  const reciter = useSettings((s) => s.reciter);
  const [status, setStatus] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function run() {
    setDone(false);
    setStatus('تجهيز البيانات…');
    for (const f of DATA) await fetch(`${BASE}data/${f}`).catch(() => {});
    await fetch(`${BASE}adhan.mp3`).catch(() => {});
    for (let i = 0; i < SURAHS.length; i++) {
      const s = await getSurah(SURAHS[i]);
      if (!s) continue;
      setStatus(`تنزيل الصوت… (${i + 1}/${SURAHS.length}) ${s.name}`);
      await downloadSurah(reciter, s.n, s.ayahs.map((a) => a.g), reciterBitrate(reciter), () => {});
    }
    setStatus(null);
    setDone(true);
  }

  return (
    <div className="stack">
      <button className="btn install-btn" disabled={status !== null} onClick={run}>
        <Icon name="download" size={18} /> {status ?? (done ? 'جاهز للعمل دون إنترنت ✓' : 'تجهيز للعمل دون إنترنت')}
      </button>
      <p className="field__hint">
        يُنزّل النصوص والتفسير الميّسر والبيانات + صوت سور مختارة (الفاتحة، الكهف، يس، الرحمن،
        الملك، القصار) للقارئ الحالي، ليعمل التطبيق كاملًا دون إنترنت.
      </p>
    </div>
  );
}
