import { NavLink, Outlet } from 'react-router-dom';
import { MiniPlayer } from '../features/audio';
import { WordSheet } from '../features/words';
import { TafsirSheet } from '../features/tafsir';
import { NoteSheet } from '../features/bookmarks';
import { InstallPrompt, UpdateToast } from '../features/install';
import { Onboarding } from '../features/onboarding';

const tabs = [
  { to: '/', label: 'الرئيسية', end: true },
  { to: '/mushaf', label: 'المصحف', end: false },
  { to: '/prayer', label: 'الصلاة', end: false },
  { to: '/hifz', label: 'الحفظ', end: false },
  { to: '/settings', label: 'الإعدادات', end: false },
];

export function Shell() {
  return (
    <div className="shell">
      <main className="shell__content">
        <Outlet />
      </main>
      <InstallPrompt />
      <UpdateToast />
      <MiniPlayer />
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
      <WordSheet />
      <TafsirSheet />
      <NoteSheet />
      <Onboarding />
    </div>
  );
}
