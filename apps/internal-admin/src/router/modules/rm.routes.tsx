import { Route } from 'react-router-dom';
import { menuPlaceholderRoutes } from '../placeholder';

// 09 RM관리
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   0901 이상거래 모니터링(FDS) → pages/rm/fds/
//   0902 가맹점 리스크 평가 → pages/rm/merchant-risk/
export const rmRoutes = <Route path="rm">{menuPlaceholderRoutes('rm')}</Route>;
