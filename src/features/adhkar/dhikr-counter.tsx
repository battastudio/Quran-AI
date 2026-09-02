import { useEffect, useState } from 'react';
import { Icon } from '../../components';
import { arabicNum } from '../../lib/format';
import { targetCount } from '../../lib/adhkar';
import { completeFeedback, tapFeedback } from '../../lib/haptics';

// Tap-anywhere counter with a progress ring, haptics + sound, and auto-advance.
export function DhikrCounter({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(1);
  const [ripple, setRipple] = useState(0);

  useEffect(() => {
    setCount(0);
    setTarget(targetCount(text));
  }, [text]);

  const done = count >= target;
  const r = 26;
  const c = 2 * Math.PI * r;

  function tap() {
    if (done) return;
    const n = count + 1;
    setCount(n);
    setRipple((x) => x + 1);
    if (n >= target) {
      completeFeedback();
      setTimeout(onComplete, 650);
    } else tapFeedback();
  }

  return (
    <div className="dhikr">
      <p className="dhikr__text">{text}</p>
      <div className="dhikr__row">
        <div className="dhikr__goal">
          <button className="icon-btn" aria-label="أنقص" onClick={() => setTarget((t) => Math.max(1, t - 1))}><Icon name="prev" size={16} /></button>
          <span>الهدف {arabicNum(target)}</span>
          <button className="icon-btn" aria-label="زد" onClick={() => setTarget((t) => t + 1)}><Icon name="next" size={16} /></button>
        </div>
        <button className={done ? 'dhikr__tap dhikr__tap--done' : 'dhikr__tap'} onClick={tap}>
          <svg width={72} height={72} viewBox="0 0 72 72">
            <circle cx={36} cy={36} r={r} fill="none" stroke="var(--border)" strokeWidth={6} />
            <circle cx={36} cy={36} r={r} fill="none" stroke="var(--accent)" strokeWidth={6} strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(count / target, 1))} transform="rotate(-90 36 36)"
              style={{ transition: 'stroke-dashoffset 0.25s' }} />
            <text x={36} y={42} textAnchor="middle" fontSize={20} fill="var(--text)">{done ? '✓' : arabicNum(count)}</text>
          </svg>
          <span key={ripple} className="dhikr__ripple" />
        </button>
      </div>
    </div>
  );
}
