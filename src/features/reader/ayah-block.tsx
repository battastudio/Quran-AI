import { useState } from 'react';
import { Icon } from '../../components';
import { words } from '../../lib/quran';
import { ayahMark } from '../../lib/format';
import { toggleBookmark } from '../../lib/db';
import { shareAyahImage } from '../../lib/share-image';
import type { Ayah } from '../../lib/types';
import { useSettings } from '../../store/settings-store';
import { useAudio } from '../../store/audio-store';
import { useWordSheet } from '../words';
import { useTafsirSheet } from '../tafsir';
import { useNoteSheet } from '../bookmarks';
import { memorizeAyah } from '../hifz';
import { TajweedText } from './tajweed-text';

interface Props {
  surah: number;
  ayah: Ayah;
  playing: boolean;
  bookmarked: boolean;
}

export function AyahBlock({ surah, ayah, playing, bookmarked }: Props) {
  const fontSize = useSettings((s) => s.fontSize);
  const tajweed = useSettings((s) => s.tajweed);
  const showWord = useWordSheet((s) => s.show);
  const showTafsir = useTafsirSheet((s) => s.show);
  const showNote = useNoteSheet((s) => s.show);
  const playFrom = useAudio((s) => s.play);
  const [marked, setMarked] = useState(bookmarked);
  const [memo, setMemo] = useState(false);

  return (
    <div id={`ayah-${ayah.a}`} className={playing ? 'ayah ayah--playing' : 'ayah'}>
      <p className="ayah__text" style={{ fontSize }}>
        {tajweed ? (
          <TajweedText surah={surah} ayah={ayah.a} plain={ayah.t} />
        ) : (
          words(ayah.t).map((w, i) => (
            <span key={i} className="ayah__word" onClick={() => showWord(w, surah, ayah.a, i + 1)}>
              {w}{' '}
            </span>
          ))
        )}
        <span className="ayah__mark">{ayahMark(ayah.a)}</span>
      </p>
      <div className="ayah__actions">
        <button className="icon-btn" aria-label="استماع" onClick={() => playFrom([{ surah, ayah: ayah.a, g: ayah.g }])}><Icon name="play" /></button>
        <button className="icon-btn" aria-label="تفسير" onClick={() => showTafsir(surah, ayah.a)}><Icon name="info" /></button>
        <button
          className={marked ? 'icon-btn icon-btn--on' : 'icon-btn'}
          aria-label="حفظ إشارة"
          onClick={async () => setMarked(await toggleBookmark(surah, ayah.a))}
        >
          <Icon name="bookmark" fill={marked} />
        </button>
        <button className="icon-btn" aria-label="ملاحظة" onClick={() => showNote(surah, ayah.a)}><Icon name="note" /></button>
        <button className="icon-btn" aria-label="مشاركة" onClick={() => void shareAyahImage(ayah.t, `سورة ${surah} — الآية ${ayah.a}`)}><Icon name="share" /></button>
        <button
          className={memo ? 'icon-btn icon-btn--on' : 'icon-btn'}
          aria-label="أضف للحفظ"
          onClick={async () => {
            await memorizeAyah(surah, ayah.a);
            setMemo(true);
          }}
        >
          <Icon name="plus" />
        </button>
      </div>
    </div>
  );
}
