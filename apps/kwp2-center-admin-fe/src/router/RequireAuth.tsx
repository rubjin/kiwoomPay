import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

/** 로그인하지 않았으면 로그인 화면으로 보낸다. 메뉴 권한 확인은 기존 RequireAuth 로직을 옮겨 붙인다 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.accessToken !== null);
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/auth/login" replace state={{ from: location }} />;
  return children;
}
