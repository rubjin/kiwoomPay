import { Route } from 'react-router-dom';
import { menuPlaceholderRoutes } from '../placeholder';

// 05 통계내역
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   0501 매출 분석 및 통계 → pages/statistics/sales-analysis/
//   0502 리스크 & RM 관리 → pages/statistics/risk/
//   0503 대손 및 채권 관리 → pages/statistics/bad-debt/
//   0504 보고자료 센터 → pages/statistics/report-center/
export const statisticsRoutes = (
  <Route path="statistics">{menuPlaceholderRoutes('statistics')}</Route>
);
