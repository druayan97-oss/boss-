import { RouterProvider } from 'react-router-dom';
import { AppStateProvider } from '@/app/state';
import { router } from '@/app/router';

export default function App() {
  return (
    <AppStateProvider>
      <RouterProvider router={router} />
    </AppStateProvider>
  );
}
