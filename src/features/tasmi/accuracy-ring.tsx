import { arabicNum } from '../../lib/format';

// Circular accuracy indicator (0–100%).
export function AccuracyRing({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg width={84} height={84} viewBox="0 0 84 84" className="ring">
      <circle cx={42} cy={42} r={r} fill="none" stroke="var(--border)" strokeWidth={7} />
      <circle
        cx={42} cy={42} r={r} fill="none" stroke="var(--accent)" strokeWidth={7} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 42 42)"
        style={{ transition: 'stroke-dashoffset 0.4s' }}
      />
      <text x={42} y={48} textAnchor="middle" fontSize={20} fill="var(--text)">{arabicNum(value)}٪</text>
    </svg>
  );
}
