import axios from 'axios';
import { config } from '@/app/config';
import { useAuthStore } from '@/store/auth';

// TODO(이관): 기존 api/http.ts의 인터셉터(JWT · CSRF · Refresh · 재인증 토큰)를 그대로 옮긴다
export const http = axios.create({
  baseURL: config.apiBase,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
