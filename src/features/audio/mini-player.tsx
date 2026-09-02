import { Icon } from '../../components';
import { arabicNum } from '../../lib/format';
import { useAudio } from '../../store/audio-store';
import { usePlayerOpen } from './player-sheet';

// Collapsed playback bar; tap it to open the full player. Sits above the tabs.
export function MiniPlayer() {
  const { playing, isPlaying, error, toggle, stop } = useAudio();
  const openPlayer = usePlayerOpen((s) => s.set);
  if (!playing) return null;

  return (
    <div className="mini-player">
      <button className="icon-btn" aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'} onClick={toggle}>
        <Icon name={isPlaying ? 'pause' : 'play'} />
      </button>
      <button className="mini-player__label" onClick={() => openPlayer(true)}>
        {error ? <span className="mini-player__err">{error}</span> : <>سورة {arabicNum(playing.surah)} · الآية {arabicNum(playing.ayah)}</>}
      </button>
      <button className="icon-btn" aria-label="المشغّل" onClick={() => openPlayer(true)}><Icon name="up" /></button>
      <button className="icon-btn" aria-label="إيقاف" onClick={stop}><Icon name="close" /></button>
    </div>
  );
}
