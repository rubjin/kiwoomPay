import { Route } from 'react-router-dom';
import { MENU } from '@/constants/menu';
import { lazyPage } from '@/router/lazy';
import { menuPlaceholderRoutes } from '@/router/placeholder';

// 01 메인
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   0101 대시보드 → features/main/dashboard/
//   0104 다운로드센터 → features/main/download-center/

const DownloadCenterPage = lazyPage(
  () => import('@/features/main/download-center/DownloadCenterPage'),
  'DownloadCenterPage',
);

export const mainRoutes = (
  <Route path="main">
    {/* KWPC0104 다운로드 센터 */}
    <Route path="download-center" element={<DownloadCenterPage />} />
    {menuPlaceholderRoutes('main', [MENU.KWPC0104])}
  </Route>
);
