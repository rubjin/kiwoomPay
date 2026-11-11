import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/router';
import { config } from './config';

export function App() {
  return (
    <BrowserRouter basename={config.basename}>
      <AppRoutes />
    </BrowserRouter>
  );
}
