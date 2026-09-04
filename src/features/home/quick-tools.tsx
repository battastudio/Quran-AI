import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components';

const TOOLS = [
  { to: '/adhkar', label: 'الأذكار', icon: 'moon' },
  { to: '/prayer', label: 'القبلة', icon: 'compass' },
  { to: '/tasbih', label: 'التسبيح', icon: 'beads' },
  { to: '/duas', label: 'الدعاء', icon: 'hands' },
];

/** Primary worship shortcuts row. */
export function QuickTools() {
  const nav = useNavigate();
  return (
    <div className="qtools">
      {TOOLS.map((t) => (
        <button key={t.to} className="qtool" onClick={() => nav(t.to)}>
          <span className="qtool__icon"><Icon name={t.icon} size={22} /></span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
