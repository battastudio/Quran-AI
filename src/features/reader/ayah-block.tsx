import { Icon } from '../../components';
import { words } from '../../lib/quran';
import { ayahMark } from '../../lib/format';
import type { Ayah } from '../../lib/types';
import { useSettings } from '../../store/settings-store';
import { useAudio } from '../../store/audio-store';
import { useWordSheet } from '../words';
import { TajweedText } from './tajweed-text';
import { useAyahActions } from './ayah-actions';

interface Props {
  surah: number;
  ayah: Ayah;
  playing: boolean;
  bookmarked: boolean;
  highlight?: string; // color key
  translation?: string;
}

export function AyahBlock({ surah, ayah, playing, highlight, translation }: Props) {
  const fontSize = useSettings((s) => s.fontSize);
  const tajweed = useSettings((s) => s.tajweed);
  const showWord = useWordSheet((s) => s.show);
  const playFrom = useAudio((s) => s.play);
  const cw = useAudio((s) => s.currentWord);
  const showActions = useAyahActions((s) => s.show);

  const cls = ['ayah', playing && 'ayah--playing', highlight && `ayah--hl-${highlight}`].filter(Boolean).join(' ');
  return (
    <div id={`ayah-${ayah.a}`} className={cls}>
      <p className="ayah__text" style={{ fontSize }}>
        {tajweed ? (
          <TajweedText surah={surah} ayah={ayah.a} plain={ayah.t} />
        ) : (
          words(ayah.t).map((w, i) => {
            const active = cw?.surah === surah && cw.ayah === ayah.a && cw.index === i;
            return (
              <span key={i} className={active ? 'ayah__word ayah__word--playing' : 'ayah__word'} onClick={() => showWord(w, surah, ayah.a, i + 1)}>
                {w}{' '}
              </span>
            );
          })
        )}
        <span className="ayah__mark">{ayahMark(ayah.a)}</span>
      </p>
      {translation && <p className="ayah__tr" dir="auto">{translation}</p>}
      <div className="ayah__actions">
        <button className="icon-btn" aria-label="استماع" onClick={() => playFrom([{ surah, ayah: ayah.a, g: ayah.g }])}><Icon name="play" /></button>
        <button className="icon-btn" aria-label="إجراءات" onClick={() => showActions({ surah, ayah: ayah.a, g: ayah.g, text: ayah.t })}><Icon name="list" /></button>
      </div>
    </div>
  );
}
