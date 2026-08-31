import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Shell } from './shell';
import { ReaderScreen } from '../features/reader';
import { SettingsScreen } from '../features/settings';

// Hash routing: works on GitHub Pages sub-paths with no 404 rewrite needed.
const router = createHashRouter([
  {
    element: <Shell />,
    children: [
      { path: '/', element: <ReaderScreen /> },
      { path: '/settings', element: <SettingsScreen /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
