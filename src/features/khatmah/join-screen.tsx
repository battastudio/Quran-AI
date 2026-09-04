import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components';
import { arabicNum } from '../../lib/format';
import { JUZ_START } from '../../lib/stats';
import { firstAyahOfPage } from '../../lib/quran';
import { useReader } from '../../store/reader-store';
import { decodeGroup } from './group';

/** #/khatmah/join?g=… — pick your juz from a group khatmah (local, no sync). */
export function KhatmahJoin() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const goTo = useReader((s) => s.goTo);
  const group = decodeGroup(params.get('g') ?? '');

  async function pick(juz: number) {
    const { surah, ayah } = await firstAyahOfPage(JUZ_START[juz - 1] ?? 1);
    goTo(surah, ayah);
    nav('/mushaf');
  }

  return (
    <section className="screen">
      <AppHeader section="ختمة جماعية" />
      {!group ? (
        <p className="field__hint">رابط الدعوة غير صالح.</p>
      ) : (
        <>
          <div className="ach-card ach-card--report">
            <div className="ach-card__title">{group.t || 'ختمة جماعية'}</div>
            <p className="ach-card__body">اختر جزءك من {arabicNum(group.n)} مشاركاً. كل جزء تقرؤه صدقة جارية.</p>
          </div>
          <div className="juz-grid">
            {Array.from({ length: 30 }, (_, i) => (
              <button key={i} className="juz-cell" onClick={() => void pick(i + 1)}>
                <b>الجزء</b>
                <span>{arabicNum(i + 1)}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
