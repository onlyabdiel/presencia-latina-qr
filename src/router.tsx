import { createBrowserRouter } from 'react-router-dom';
import { ScannerPage } from './pages/ScannerPage';
import { ResultPage } from './pages/ResultPage';

export const router = createBrowserRouter([
  { path: '/', element: <ScannerPage /> },
  { path: '/result', element: <ResultPage /> },
  { path: '*', element: <ScannerPage /> },
]);
