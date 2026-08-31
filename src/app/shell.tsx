import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'المصحف', end: true },
  { to: '/settings', label: 'الإعدادات', end: false },
];

// Root layout: content + bottom tab bar. More tabs (audio, prayer, hifz)
// get added here as those features land.
export function Shell() {
  return (
    <div className="shell">
      <main className="shell__content">
        <Outlet />
      </main>
      <nav className="shell__nav">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) => (isActive ? 'shell__tab shell__tab--active' : 'shell__tab')}
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
