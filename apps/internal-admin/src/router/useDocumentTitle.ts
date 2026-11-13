import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_TITLE, NOT_FOUND_TITLE, screenNameOf } from '@/constants/screens';

/**
 * 브라우저 탭 제목 = 현재 경로의 화면명 (constants/screens.ts).
 * 페이지 코드에서는 제목을 정하지 않는다 — 경로만 보므로 Work Tab에 숨겨진 화면이 제목을 바꾸지 않는다.
 */
export function useDocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    // '/'는 대시보드로 이동하는 중이라 기본 제목
    document.title = pathname === '/' ? DEFAULT_TITLE : (screenNameOf(pathname) ?? NOT_FOUND_TITLE);
  }, [pathname]);
}
