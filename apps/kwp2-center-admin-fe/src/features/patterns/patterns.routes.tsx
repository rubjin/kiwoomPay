import { Navigate, Route } from 'react-router-dom';
import { lazyPage } from '@/router/lazy';

// 레이아웃 패턴 템플릿 (화면 확인용, 임의 작업). 메뉴에는 없고 화면 목록(apps/screen-list)에서 연다
//   개발 컨벤션 (폴더 구조 · 규칙) → features/patterns/ConventionsPage — MainLayout 밖(Header · LNB · Work Tab 없음), conventionRoutes
//   P00 Layout (Header · LNB · Work Tab · 타이틀) → features/patterns/P00LayoutPage
//   P01 Search → Result → features/patterns/P01SearchResultPage
//   P02 Record → Form → features/patterns/P02RecordFormPage
//   P03 Lookup → Apply → features/patterns/P03LookupApplyPage
//   P04 Action → Feedback → features/patterns/P04ActionFeedbackPage
//   팝업 모음 (앱 팝업을 화면별 버튼으로) → features/patterns/PopupsPage
//   IBSheet 샘플 (테마별 그리드 · 달력 모양) → features/patterns/IbsheetSamplePage
// 개발 서버에서만 등록한다 — 운영 빌드에서는 import.meta.env.DEV가 false라 라우트 · 페이지 chunk가 모두 빠진다

function createPatternRoutes() {
  const P00LayoutPage = lazyPage(
    () => import('@/features/patterns/P00LayoutPage'),
    'P00LayoutPage',
  );
  const P01SearchResultPage = lazyPage(
    () => import('@/features/patterns/P01SearchResultPage'),
    'P01SearchResultPage',
  );
  const P02RecordFormPage = lazyPage(
    () => import('@/features/patterns/P02RecordFormPage'),
    'P02RecordFormPage',
  );
  const P03LookupApplyPage = lazyPage(
    () => import('@/features/patterns/P03LookupApplyPage'),
    'P03LookupApplyPage',
  );
  const P04ActionFeedbackPage = lazyPage(
    () => import('@/features/patterns/P04ActionFeedbackPage'),
    'P04ActionFeedbackPage',
  );

  const PopupsPage = lazyPage(() => import('@/features/patterns/PopupsPage'), 'PopupsPage');
  const IbsheetSamplePage = lazyPage(
    () => import('@/features/patterns/IbsheetSamplePage'),
    'IbsheetSamplePage',
  );

  return (
    <Route path="patterns">
      <Route index element={<Navigate to="layout" replace />} />
      <Route path="layout" element={<P00LayoutPage />} />
      <Route path="search-result" element={<P01SearchResultPage />} />
      <Route path="record-form" element={<P02RecordFormPage />} />
      <Route path="lookup-apply" element={<P03LookupApplyPage />} />
      <Route path="action-feedback" element={<P04ActionFeedbackPage />} />
      <Route path="popups" element={<PopupsPage />} />
      <Route path="ibsheet" element={<IbsheetSamplePage />} />
    </Route>
  );
}

export const patternRoutes = import.meta.env.DEV ? createPatternRoutes() : null;

function createConventionRoutes() {
  const ConventionsPage = lazyPage(
    () => import('@/features/patterns/ConventionsPage'),
    'ConventionsPage',
  );
  return <Route path="patterns/conventions" element={<ConventionsPage />} />;
}

/** 개발 컨벤션: App Shell 없이 단독 화면이라 MainLayout 밖에 둔다 (router/index.tsx) */
export const conventionRoutes = import.meta.env.DEV ? createConventionRoutes() : null;
