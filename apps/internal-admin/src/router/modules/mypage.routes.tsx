import { Route } from 'react-router-dom';
import { lazyPage } from '../lazy';
import { menuPlaceholderRoutes } from '../placeholder';

// 02 마이페이지
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   0201 계정관리 → pages/mypage/account/
//   0202 권한관리 → pages/mypage/permission/
//   0203 알림센터 → pages/mypage/notification/
//   2000 마이페이지 Hub(요약) → pages/mypage/hub/  (헤더 [내 정보])

const MypageHubPage = lazyPage(() => import('@/pages/mypage/hub/MypageHubPage'), 'MypageHubPage');

export const mypageRoutes = (
  <Route path="mypage">
    {/* KWPC2000 마이페이지 */}
    <Route index element={<MypageHubPage />} />
    {menuPlaceholderRoutes('mypage')}
  </Route>
);
