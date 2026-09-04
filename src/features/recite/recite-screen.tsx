import { useEffect, useRef, useState } from 'react';
import { AppHeader,Icon } from '../../components';
import { getSurah } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { getKv } from '../../lib/db';
import { allRecordings, deleteRecording, putRecording } from '../../lib/db';
import { useReader } from '../../store/reader-store';
import { useAudio } from '../../store/audio-store';

interface Clip { id: string; surah: number; ayah: number; blob: Blob; at: number }

export function ReciteScreen() {
  const surah = useReader((s) => s.surah);
  const play = useAudio((s) => s.play);
  const [ayah, setAyah] = useState(1);
  const [rec, setRec] = useState(false);
  const [clips, setClips] = useState<Clip[]>([]);
  const [weak, setWeak] = useState<{ key: string; acc: number }[]>([]);
  const mr = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const refresh = () => { void allRecordings().then((c) => setClips(c.reverse())); };
  useEffect(() => {
    refresh();
    void getKv<Record<string, number>>('reciteScores').then((m) =>
      setWeak(Object.entries(m ?? {}).filter(([, a]) => a < 80).map(([key, acc]) => ({ key, acc })).sort((a, b) => a.acc - b.acc).slice(0, 20)),
    );
  }, []);

  async function toggleRec() {
    if (rec) { mr.current?.stop(); setRec(false); return; }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks.current = [];
    mr.current = new MediaRecorder(stream);
    mr.current.ondataavailable = (e) => chunks.current.push(e.data);
    mr.current.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      await putRecording({ id: `${surah}:${ayah}:${clips.length}:${chunks.current.length}${Math.round(performance.now())}`, surah, ayah, blob: new Blob(chunks.current), at: performance.now() });
      refresh();
    };
    mr.current.start();
    setRec(true);
  }
  const replay = (b: Blob) => void new Audio(URL.createObjectURL(b)).play();
  async function original(s: number, a: number) {
    const su = await getSurah(s);
    const g = su?.ayahs.find((x) => x.a === a)?.g;
    if (g) play([{ surah: s, ayah: a, g }]);
  }

  return (
    <section className="screen">
      <AppHeader section="معمل التلاوة" />
      <div className="ab-row">
        <span>سورة {arabicNum(surah)} — الآية</span>
        <input type="number" min={1} value={ayah} onChange={(e) => setAyah(Number(e.target.value))} />
        <button className={rec ? 'btn btn--danger btn--sm' : 'btn btn--sm'} onClick={toggleRec}>
          <Icon name="mic" size={16} /> {rec ? 'إيقاف' : 'تسجيل'}
        </button>
      </div>
      <p className="field__hint">سجّل تلاوتك، استمع إليها، وقارنها بتلاوة القارئ.</p>

      {clips.map((c) => (
        <div key={c.id} className="recite-clip">
          <span>سورة {arabicNum(c.surah)} · الآية {arabicNum(c.ayah)}</span>
          <span>
            <button className="link" onClick={() => replay(c.blob)}>تسجيلي</button>
            <button className="link" onClick={() => original(c.surah, c.ayah)}>الأصل</button>
            <button className="link" onClick={async () => { await deleteRecording(c.id); refresh(); }}>حذف</button>
          </span>
        </div>
      ))}

      {weak.length > 0 && (
        <>
          <h2 className="stats-h">آيات تحتاج تحسينًا (من التسميع)</h2>
          {weak.map((w) => <div key={w.key} className="recite-clip"><span>{w.key}</span><span>{arabicNum(w.acc)}٪</span></div>)}
        </>
      )}
    </section>
  );
}
