import { createBrowserRouter } from 'react-router-dom';
import { ScannerPage } from './pages/ScannerPage';
import { ResultPage } from './pages/ResultPage';
import { LoginPage } from './pages/LoginPage';
import { RequireAuth } from './components/RequireAuth';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/', element: <ScannerPage /> },
      { path: '/result', element: <ResultPage /> },
      { path: '*', element: <ScannerPage /> },
    ],
  },
]);
