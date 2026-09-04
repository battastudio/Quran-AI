import { useEffect, useState } from 'react';
import { AppHeader, Icon } from '../../components';
import { getSurah, surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import { addReadingMinute } from '../../lib/stats';
import type { ReaderView, SurahMeta } from '../../lib/types';
import { useReader } from '../../store/reader-store';
import { useAudio } from '../../store/audio-store';
import { useSettings } from '../../store/settings-store';
import { SurahView } from './surah-view';
import { MushafPageView } from './mushaf-page-view';
import { FocusView } from './focus-view';
import { AyahCardsView } from './ayah-cards-view';
import { WbwView } from './wbw-view';
import { SurahPicker } from './surah-picker';
import { SurahSwipe } from './surah-swipe';

// order is right→left in RTL: كلمات first appears rightmost
const VIEWS: { id: ReaderView; label: string }[] = [
  { id: 'wbw', label: 'كلمات' },
  { id: 'cards', label: 'بطاقات' },
  { id: 'focus', label: 'تركيز' },
  { id: 'page', label: 'مصحف' },
  { id: 'scroll', label: 'تمرير' },
];
const SIZES = [26, 30, 34, 38];

export function ReaderScreen() {
  const surah = useReader((s) => s.surah);
  const setSurah = useReader((s) => s.setSurah);
  const setMark = useReader((s) => s.setMark);
  const goToAyah = useReader((s) => s.goTo);
  const view = useSettings((s) => s.readerView);
  const tajweed = useSettings((s) => s.tajweed);
  const fontSize = useSettings((s) => s.fontSize);
  const setView = useSettings((s) => s.set);
  const playQueue = useAudio((s) => s.play);
  const playSync = useAudio((s) => s.playSync);
  const [list, setList] = useState<SurahMeta[]>([]);
  const [pick, setPick] = useState(false);

  useEffect(() => {
    void surahList().then(setList);
    const id = setInterval(() => { if (!document.hidden) void addReadingMinute(); }, 60_000);
    return () => clearInterval(id);
  }, []);

  const meta = list.find((s) => s.n === surah);
  async function playSurah(sync = false) {
    const s = await getSurah(surah);
    if (!s) return;
    const q = s.ayahs.map((a) => ({ surah, ayah: a.a, g: a.g }));
    if (sync) playSync(q);
    else playQueue(q);
  }

  const cycleFont = () => {
    const i = SIZES.indexOf(fontSize);
    setView({ fontSize: SIZES[(i + 1) % SIZES.length] ?? 30 });
  };

  return (
    <section className="screen screen--reader">
      <AppHeader section="المصحف" />
      <div className="rsub">
        <button className="rsub__title" onClick={() => setPick(true)}>
          <b>{meta ? meta.name : `سورة ${arabicNum(surah)}`} <Icon name="up" size={16} /></b>
          {meta && <span className="rsub__meta">{meta.type} · {arabicNum(meta.count)} آية · صفحة {arabicNum(meta.page)}</span>}
        </button>
        <div className="rsub__tools">
          <button
            className={tajweed ? 'rtoggle rtoggle--on' : 'rtoggle'}
            aria-pressed={tajweed}
            onClick={() => setView({ tajweed: !tajweed })}
          >
            <span className="rtoggle__dot" /> التجويد
          </button>
          <button className="icon-btn" aria-label="حجم الخط" onClick={cycleFont}>أ</button>
          <button className="icon-btn" aria-label="ضع علامة القراءة" onClick={setMark}><Icon name="bookmark" /></button>
          <button className="icon-btn" aria-label="استماع مع تظليل الكلمات" onClick={() => playSurah(true)}><Icon name="mic" /></button>
          <button className="icon-btn" aria-label="تشغيل السورة" onClick={() => playSurah(false)}><Icon name="play" /></button>
        </div>
      </div>
      <div className="rtabs">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            className={view === v.id ? 'rtabs__btn rtabs__btn--on' : 'rtabs__btn'}
            onClick={() => setView({ readerView: v.id })}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'page' ? (
        <MushafPageView n={surah} />
      ) : (
        <SurahSwipe>
          {view === 'scroll' && <SurahView n={surah} />}
          {view === 'focus' && <FocusView n={surah} />}
          {view === 'cards' && <AyahCardsView n={surah} />}
          {view === 'wbw' && <WbwView n={surah} />}
        </SurahSwipe>
      )}

      <SurahPicker
        open={pick}
        onClose={() => setPick(false)}
        onPick={(n) => { setSurah(n); setPick(false); }}
        onJump={(s, a) => { goToAyah(s, a); setPick(false); }}
      />
    </section>
  );
}
