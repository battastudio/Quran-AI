import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../components';

const tabs = [
  { to: '/', label: 'الرئيسية', icon: 'home', end: true },
  { to: '/mushaf', label: 'المصحف', icon: 'book', end: false },
  { to: '/hifz', label: 'الحفظ', icon: 'star', end: false },
  { to: '/settings', label: 'الإعدادات', icon: 'gear', end: false },
];

export function BottomBar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const tasmiActive = pathname === '/tasmi';

  return (
    <nav className="bar">
      {tabs.slice(0, 2).map((t) => <Tab key={t.to} {...t} />)}
      <button
        className={tasmiActive ? 'bar__mic bar__mic--on' : 'bar__mic'}
        aria-label="التسميع"
        onClick={() => nav('/tasmi')}
      >
        <Icon name="mic" size={26} />
      </button>
      {tabs.slice(2).map((t) => <Tab key={t.to} {...t} />)}
    </nav>
  );
}

function Tab({ to, label, icon, end }: { to: string; label: string; icon: string; end: boolean }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'bar__tab bar__tab--on' : 'bar__tab')}>
      {({ isActive }) => (
        <>
          <Icon name={icon} size={22} fill={isActive} />
          <span>{label}</span>
          {isActive && <motion.span layoutId="bar-dot" className="bar__dot" />}
        </>
      )}
    </NavLink>
  );
}
