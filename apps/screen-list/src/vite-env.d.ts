/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 시스템별 앱 주소 (기본: 각 앱 개발 서버) */
  readonly VITE_URL_CENTER?: string;
  readonly VITE_URL_MANAGE?: string;
  readonly VITE_URL_AGENCY?: string;
}
