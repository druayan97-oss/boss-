import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { WeeklyPage } from '@/pages/WeeklyPage';
import { BoardPage } from '@/pages/BoardPage';
import { HrDetailPage } from '@/pages/HrDetailPage';
import { NominationPage } from '@/pages/NominationPage';
import { PlayLandingPage } from '@/pages/PlayLandingPage';
import { PlayResultPage } from '@/pages/PlayResultPage';
import { PlaySessionPage } from '@/pages/PlaySessionPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <BoardPage /> },
      { path: 'board/:type', element: <BoardPage /> },
      { path: 'hr/:id', element: <HrDetailPage /> },
      { path: 'nominate', element: <NominationPage /> },
      { path: 'play', element: <PlayLandingPage /> },
      { path: 'play/session', element: <PlaySessionPage /> },
      { path: 'play/session/:id', element: <PlaySessionPage /> },
      { path: 'play/result', element: <PlayResultPage /> },
      { path: 'play/result/:id', element: <PlayResultPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'weekly', element: <WeeklyPage /> },
    ],
  },
]);
