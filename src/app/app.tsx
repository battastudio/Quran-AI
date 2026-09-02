import { useEffect } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Shell } from './shell';
import { HomeScreen } from '../features/home';
import { ReaderScreen } from '../features/reader';
import { SettingsScreen } from '../features/settings';
import { TasmiScreen } from '../features/tasmi';
import { PrayerScreen } from '../features/prayer';
import { HifzScreen, PracticeScreen } from '../features/hifz';
import { SearchScreen } from '../features/search';
import { TafsirSearch } from '../features/tafsir';
import { KhatmahScreen } from '../features/khatmah';
import { BookmarksScreen } from '../features/bookmarks';
import { AdhkarScreen } from '../features/adhkar';
import { StatsScreen } from '../features/stats';
import { TasbihScreen } from '../features/tasbih';
import { AsmaScreen } from '../features/asma';
import { DuasScreen } from '../features/duas';
import { CalendarScreen } from '../features/calendar';
import { useSettings } from '../store/settings-store';
import { useReader } from '../store/reader-store';
import { runReminders } from '../features/notifications';
import { useAuth } from '../features/auth';
import { useInstall } from '../features/install';

const router = createHashRouter([
  {
    element: <Shell />,
    children: [
      { path: '/', element: <HomeScreen /> },
      { path: '/mushaf', element: <ReaderScreen /> },
      { path: '/tasmi', element: <TasmiScreen /> },
      { path: '/prayer', element: <PrayerScreen /> },
      { path: '/hifz', element: <HifzScreen /> },
      { path: '/hifz/practice', element: <PracticeScreen /> },
      { path: '/search', element: <SearchScreen /> },
      { path: '/tafsir-search', element: <TafsirSearch /> },
      { path: '/khatmah', element: <KhatmahScreen /> },
      { path: '/bookmarks', element: <BookmarksScreen /> },
      { path: '/adhkar', element: <AdhkarScreen /> },
      { path: '/stats', element: <StatsScreen /> },
      { path: '/tasbih', element: <TasbihScreen /> },
      { path: '/asma', element: <AsmaScreen /> },
      { path: '/duas', element: <DuasScreen /> },
      { path: '/calendar', element: <CalendarScreen /> },
      { path: '/settings', element: <SettingsScreen /> },
    ],
  },
]);

export function App() {
  useEffect(() => {
    void useReader.getState().hydrate();
    void useSettings
      .getState()
      .hydrate()
      .then(() => runReminders());
    useAuth.getState().init();
    useInstall.getState().init();
  }, []);
  return <RouterProvider router={router} />;
}
