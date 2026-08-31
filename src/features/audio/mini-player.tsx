import { arabicNum } from '../../lib/format';
import { useAudio } from '../../store/audio-store';

const SPEEDS = [0.75, 1, 1.25, 1.5];

// Global playback bar; renders only while a track is loaded. Sits above the tabs.
export function MiniPlayer() {
  const { playing, isPlaying, speed, loop, toggle, stop, setSpeed, setLoop } = useAudio();
  if (!playing) return null;

  return (
    <div className="mini-player">
      <button className="icon-btn" aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'} onClick={toggle}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <span className="mini-player__label">
        {arabicNum(playing.surah)}:{arabicNum(playing.ayah)}
      </span>
      <button
        className={loop ? 'chip chip--on' : 'chip'}
        aria-label="تكرار"
        onClick={() => setLoop(!loop)}
      >
        تكرار
      </button>
      <button
        className="chip"
        aria-label="السرعة"
        onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
      >
        {speed}×
      </button>
      <button className="icon-btn" aria-label="إيقاف" onClick={stop}>✕</button>
    </div>
  );
}
