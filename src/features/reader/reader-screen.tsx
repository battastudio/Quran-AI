import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components';
import { getSurah, surahList } from '../../lib/quran';
import { arabicNum } from '../../lib/format';
import type { ReaderView, SurahMeta } from '../../lib/types';
import { useReader } from '../../store/reader-store';
import { useAudio } from '../../store/audio-store';
import { useSettings } from '../../store/settings-store';
import { SurahView } from './surah-view';
import { MushafPageView } from './mushaf-page-view';
import { FocusView } from './focus-view';
import { AyahCardsView } from './ayah-cards-view';
import { SurahPicker } from './surah-picker';

const VIEWS: { id: ReaderView; icon: string }[] = [
  { id: 'scroll', icon: 'list' },
  { id: 'page', icon: 'page' },
  { id: 'focus', icon: 'focus' },
  { id: 'cards', icon: 'grid' },
];

export function ReaderScreen() {
  const surah = useReader((s) => s.surah);
  const setSurah = useReader((s) => s.setSurah);
  const view = useSettings((s) => s.readerView);
  const setView = useSettings((s) => s.set);
  const playQueue = useAudio((s) => s.play);
  const nav = useNavigate();
  const [list, setList] = useState<SurahMeta[]>([]);
  const [pick, setPick] = useState(false);

  useEffect(() => {
    void surahList().then(setList);
  }, []);

  const meta = list.find((s) => s.n === surah);
  async function playSurah() {
    const s = await getSurah(surah);
    if (s) playQueue(s.ayahs.map((a) => ({ surah, ayah: a.a })));
  }

  return (
    <section className="screen screen--reader">
      <header className="reader-head">
        <button className="reader-head__title" onClick={() => setPick(true)}>
          {meta ? meta.name : `سورة ${arabicNum(surah)}`} <Icon name="up" size={16} />
        </button>
        <div className="reader-head__nav">
          <div className="view-switch">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                className={view === v.id ? 'view-switch__btn view-switch__btn--on' : 'view-switch__btn'}
                aria-label={v.id}
                onClick={() => setView({ readerView: v.id })}
              >
                <Icon name={v.icon} size={18} />
              </button>
            ))}
          </div>
          <button className="icon-btn" aria-label="بحث" onClick={() => nav('/search')}><Icon name="search" /></button>
          <button className="icon-btn" aria-label="تشغيل السورة" onClick={playSurah}><Icon name="play" /></button>
        </div>
      </header>

      {view === 'scroll' && <SurahView n={surah} />}
      {view === 'page' && <MushafPageView n={surah} />}
      {view === 'focus' && <FocusView n={surah} />}
      {view === 'cards' && <AyahCardsView n={surah} />}

      <SurahPicker
        open={pick}
        onClose={() => setPick(false)}
        onPick={(n) => { setSurah(n); setPick(false); }}
      />
      <div className="reader-nav">
        <button className="icon-btn" disabled={surah <= 1} onClick={() => setSurah(surah - 1)}><Icon name="prev" /></button>
        <button className="icon-btn" disabled={surah >= 114} onClick={() => setSurah(surah + 1)}><Icon name="next" /></button>
      </div>
    </section>
  );
}
