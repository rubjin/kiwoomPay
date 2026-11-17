import { Route } from 'react-router-dom';
import { lazyPage } from '@/router/lazy';
import { menuPlaceholderRoutes } from '@/router/placeholder';

// 03 로그인 (MainLayout 밖)
//   0300 로그인 → features/auth/login/
//   0301 SMS 인증 → features/auth/sms-auth/

const LoginPage = lazyPage(() => import('@/features/auth/login/LoginPage'), 'LoginPage');

export const authRoutes = (
  <Route path="auth">
    <Route path="login" element={<LoginPage />} />
    {menuPlaceholderRoutes('auth', ['/auth/login'])}
  </Route>
);
