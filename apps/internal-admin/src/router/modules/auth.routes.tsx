import { Route } from 'react-router-dom';
import { lazyPage } from '../lazy';
import { menuPlaceholderRoutes } from '../placeholder';

// 03 로그인 (MainLayout 밖)
//   0300 로그인 → pages/auth/login/
//   0301 SMS 인증 → pages/auth/sms-auth/

const LoginPage = lazyPage(() => import('@/pages/auth/login/LoginPage'), 'LoginPage');

export const authRoutes = (
  <Route path="auth">
    <Route path="login" element={<LoginPage />} />
    {menuPlaceholderRoutes('auth', ['/auth/login'])}
  </Route>
);
