import { Route } from 'react-router-dom';
import { MENU } from '@/constants/menu';
import { lazyPage } from '../lazy';
import { menuPlaceholderRoutes } from '../placeholder';

// 02 마이페이지
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   0201 계정관리 → pages/mypage/account/
//   0202 권한관리 → pages/mypage/permission/
//   0203 알림센터 → pages/mypage/notification/
//   2000 마이페이지 Hub(요약) → pages/mypage/hub/  (헤더 [내 정보])

const MypageHubPage = lazyPage(() => import('@/pages/mypage/hub/MypageHubPage'), 'MypageHubPage');
const AccountPage = lazyPage(() => import('@/pages/mypage/account/AccountPage'), 'AccountPage');
const PermissionPage = lazyPage(
  () => import('@/pages/mypage/permission/PermissionPage'),
  'PermissionPage',
);

export const mypageRoutes = (
  <Route path="mypage">
    {/* KWPC2000 마이페이지 */}
    <Route index element={<MypageHubPage />} />
    {/* KWPC02010100 계정관리 */}
    <Route path="account" element={<AccountPage />} />
    {/* KWPC02020000 권한관리 */}
    <Route path="permission" element={<PermissionPage />} />
    {menuPlaceholderRoutes('mypage', [MENU.KWPC0201, MENU.KWPC0202])}
  </Route>
);
