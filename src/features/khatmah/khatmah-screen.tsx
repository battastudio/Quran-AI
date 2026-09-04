import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components';
import { firstAyahOfPage } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { dayKey } from '../../lib/streak';
import { progressPct, todaysRange } from '../../lib/khatmah';
import { useReader } from '../../store/reader-store';
import { useKhatmah } from './khatmah-store';
import { GroupInvite } from './group-invite';

const OPTIONS = [7, 15, 30, 60];

export function KhatmahScreen() {
  const { plan, hydrate, start, markTodayDone, cancel } = useKhatmah();
  const goTo = useReader((s) => s.goTo);
  const nav = useNavigate();
  useEffect(() => void hydrate(), [hydrate]);

  if (!plan)
    return (
      <section className="screen">
        <AppHeader section="خطة الختمة" />
        <p className="field__hint">اختر مدّة إتمام الختمة:</p>
        <div className="chips">
          {OPTIONS.map((d) => (
            <button key={d} className="chip" onClick={() => start(d)}>
              {arabicNum(d)} يوم
            </button>
          ))}
        </div>
        <GroupInvite />
      </section>
    );

  const range = todaysRange(plan, dayKey());
  async function readToday() {
    const { surah, ayah } = await firstAyahOfPage(range.from);
    goTo(surah, ayah);
    nav('/mushaf');
  }

  return (
    <section className="screen">
      <AppHeader section="خطة الختمة" />
      <div className="stat">
        <b>{arabicNum(progressPct(plan))}٪</b>
        <span>من الختمة ({arabicNum(plan.days)} يوم)</span>
      </div>
      <p className="prayer-next">
        ورد اليوم: الصفحات {arabicNum(range.from)} — {arabicNum(range.to)}
      </p>
      <div className="stack">
        <button className="btn" onClick={readToday}>اقرأ ورد اليوم</button>
        <button className="btn btn--sm" onClick={markTodayDone}>تم إنجاز ورد اليوم</button>
        <button className="link" onClick={cancel}>إلغاء الختمة</button>
      </div>
      <GroupInvite />
    </section>
  );
}
