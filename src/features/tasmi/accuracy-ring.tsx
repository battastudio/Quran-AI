import { arabicNum } from '../../lib/format';

// Encouraging, never-shaming labels (Fable §C.3). No «فشل».
export function accuracyLabel(v: number): string {
  if (v >= 95) return 'أحسنت';
  if (v >= 80) return 'قريب من الإتقان';
  if (v >= 60) return 'تحتاج مراجعة';
  return 'استمع ثم حاول مرّة أخرى';
}

// Circular accuracy indicator (0–100%) with an encouraging label.
export function AccuracyRing({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg width={100} height={104} viewBox="0 0 100 104" className="ring" role="img"
      aria-label={`الدقّة ${arabicNum(value)} بالمئة — ${accuracyLabel(value)}`}>
      <circle cx={50} cy={42} r={r} fill="none" stroke="var(--border)" strokeWidth={7} />
      <circle
        cx={50} cy={42} r={r} fill="none" stroke={value >= 60 ? 'var(--success)' : 'var(--warn)'} strokeWidth={7} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 50 42)"
        style={{ transition: 'stroke-dashoffset 0.48s' }}
      />
      <text x={50} y={48} textAnchor="middle" fontSize={20} fill="var(--text)">{arabicNum(value)}٪</text>
      <text x={50} y={92} textAnchor="middle" fontSize={13} fill="var(--muted)">{accuracyLabel(value)}</text>
    </svg>
  );
}
