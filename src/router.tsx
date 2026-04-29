import { createBrowserRouter } from 'react-router-dom';
import { ScannerPage } from './pages/ScannerPage';
import { ResultPage } from './pages/ResultPage';
import { LoginPage } from './pages/LoginPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: <ScannerPage /> },
  { path: '/result', element: <ResultPage /> },
  { path: '*', element: <ScannerPage /> },
]);
