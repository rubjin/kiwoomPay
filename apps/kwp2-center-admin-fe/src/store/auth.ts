import { create } from 'zustand';

// TODO(이관): 기존 store/auth(token · user · menus)를 옮긴다. 지금은 라우트 보호에 필요한 최소 형태
interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 개발 중에는 로그인 없이 화면을 볼 수 있게 한다
  accessToken: import.meta.env.DEV ? 'dev' : null,
  setAccessToken: (accessToken) => set({ accessToken }),
}));
