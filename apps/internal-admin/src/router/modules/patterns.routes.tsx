import { Navigate, Route } from 'react-router-dom';
import { lazyPage } from '../lazy';

// 레이아웃 패턴 템플릿 (화면 확인용, 임의 작업). 메뉴에는 없고 화면 목록(apps/screen-list)에서 연다
//   P01 Search → Result → pages/patterns/SearchResultPatternPage
//   P02 Record → Form → pages/patterns/RecordFormPatternPage
//   P03 Lookup → Apply → pages/patterns/LookupApplyPatternPage
// 개발 서버에서만 등록한다 — 운영 빌드에서는 import.meta.env.DEV가 false라 라우트 · 페이지 chunk가 모두 빠진다

function createPatternRoutes() {
  const SearchResultPatternPage = lazyPage(
    () => import('@/pages/patterns/SearchResultPatternPage'),
    'SearchResultPatternPage',
  );
  const RecordFormPatternPage = lazyPage(
    () => import('@/pages/patterns/RecordFormPatternPage'),
    'RecordFormPatternPage',
  );
  const LookupApplyPatternPage = lazyPage(
    () => import('@/pages/patterns/LookupApplyPatternPage'),
    'LookupApplyPatternPage',
  );

  return (
    <Route path="patterns">
      <Route index element={<Navigate to="search-result" replace />} />
      <Route path="search-result" element={<SearchResultPatternPage />} />
      <Route path="record-form" element={<RecordFormPatternPage />} />
      <Route path="lookup-apply" element={<LookupApplyPatternPage />} />
    </Route>
  );
}

export const patternRoutes = import.meta.env.DEV ? createPatternRoutes() : null;
