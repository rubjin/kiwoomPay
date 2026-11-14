import { Route } from 'react-router-dom';
import { MENU } from '@/constants/menu';
import { lazyPage } from '@/router/lazy';
import { menuPlaceholderRoutes } from '@/router/placeholder';

// 02 마이페이지
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   0201 계정관리 → features/mypage/account/
//   0202 권한관리 → features/mypage/permission/
//   0203 알림센터 → features/mypage/notification/
//   2000 마이페이지 Hub(요약) → features/mypage/hub/  (헤더 [내 정보])

const MypageHubPage = lazyPage(
  () => import('@/features/mypage/hub/MypageHubPage'),
  'MypageHubPage',
);
const AccountPage = lazyPage(() => import('@/features/mypage/account/AccountPage'), 'AccountPage');
const PermissionPage = lazyPage(
  () => import('@/features/mypage/permission/PermissionPage'),
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
