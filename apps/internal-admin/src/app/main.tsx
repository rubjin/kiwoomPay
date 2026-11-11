import '@kiwoompay/design-system/style.css'; // 토큰(:root 변수) + reset + global. 앱에서 한 번만
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const el = document.getElementById('root');
if (!el) throw new Error('#root 를 찾을 수 없습니다');

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
