import { useEffect } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Shell } from './shell';
import { HomeScreen } from '../features/home';
import { ReaderScreen } from '../features/reader';
import { SettingsScreen } from '../features/settings';
import { TasmiScreen } from '../features/tasmi';
import { PrayerScreen } from '../features/prayer';
import { HifzScreen } from '../features/hifz';
import { SearchScreen } from '../features/search';
import { KhatmahScreen } from '../features/khatmah';
import { BookmarksScreen } from '../features/bookmarks';
import { AdhkarScreen } from '../features/adhkar';
import { useSettings } from '../store/settings-store';
import { useReader } from '../store/reader-store';
import { runReminders } from '../features/notifications';
import { useAuth } from '../features/auth';

const router = createHashRouter([
  {
    element: <Shell />,
    children: [
      { path: '/', element: <HomeScreen /> },
      { path: '/mushaf', element: <ReaderScreen /> },
      { path: '/tasmi', element: <TasmiScreen /> },
      { path: '/prayer', element: <PrayerScreen /> },
      { path: '/hifz', element: <HifzScreen /> },
      { path: '/search', element: <SearchScreen /> },
      { path: '/khatmah', element: <KhatmahScreen /> },
      { path: '/bookmarks', element: <BookmarksScreen /> },
      { path: '/adhkar', element: <AdhkarScreen /> },
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
  }, []);
  return <RouterProvider router={router} />;
}
