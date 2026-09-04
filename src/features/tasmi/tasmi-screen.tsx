import { useEffect, useState } from 'react';
import { AppHeader,Spinner } from '../../components';
import { getSurah } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { Ayah } from '../../lib/types';
import { useReader } from '../../store/reader-store';
import { useTasmi, type TasmiMode } from './tasmi-store';
import { LiveTasmi } from './live-tasmi';
import { DrillTasmi } from './drill-tasmi';
import { OfflineTasmi } from './offline-tasmi';

const MODES: { id: TasmiMode; label: string }[] = [
  { id: 'follow', label: 'تتبّع' },
  { id: 'memorize', label: 'اختبار الحفظ' },
  { id: 'drill', label: 'تدريب آية' },
  { id: 'offline', label: 'دون إنترنت' },
];

export function TasmiScreen() {
  const surah = useReader((s) => s.surah);
  const { mode, setMode } = useTasmi();
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);

  useEffect(() => {
    void getSurah(surah).then((s) => setAyahs(s?.ayahs ?? []));
  }, [surah]);

  return (
    <section className="screen">
      <AppHeader section="التسميع" />
      <div className="tasmi-modes">
        {MODES.map((m) => (
          <button key={m.id} className={mode === m.id ? 'chip chip--on' : 'chip'} onClick={() => setMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>
      <p className="field__hint">سورة {arabicNum(surah)} — غيّرها من تبويب المصحف.</p>
      <p className="field__hint">التسميع يقيس صحّة الكلمات فقط، ولا يقيّم أحكام التجويد.</p>
      {!ayahs ? (
        <Spinner />
      ) : mode === 'drill' ? (
        <DrillTasmi surah={surah} ayahs={ayahs} />
      ) : mode === 'offline' ? (
        <OfflineTasmi surah={surah} ayahs={ayahs} />
      ) : (
        <LiveTasmi surah={surah} ayahs={ayahs} memorize={mode === 'memorize'} />
      )}
    </section>
  );
}
