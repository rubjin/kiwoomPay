import { Route } from 'react-router-dom';
import { menuPlaceholderRoutes } from '../placeholder';

// 01 메인
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   0101 대시보드 → pages/main/dashboard/
//   0104 다운로드센터 → pages/main/download-center/
export const mainRoutes = <Route path="main">{menuPlaceholderRoutes('main')}</Route>;
