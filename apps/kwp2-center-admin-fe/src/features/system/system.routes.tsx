import { Navigate, Route } from 'react-router-dom';
import { MENU } from '@/constants/menu';
import { lazyPage } from '@/router/lazy';
import { menuPlaceholderRoutes, remainingPlaceholderRoute } from '@/router/placeholder';

// 10 시스템관리
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   1001 사용자·권한·보안 관리 → features/system/user-security/
//   1002 기준정보·코드 관리 → features/system/code/
//   1003 외부연계 관리 → features/system/external-link/
//   1004 시스템 운영 관리 → features/system/operation/
//   1005 알림·메시지 관리 → features/system/notification/
//   1006 VAN 라우팅 관리 → features/system/van-routing/

const MenuManagePage = lazyPage(
  () => import('@/features/system/user-security/menu/MenuManagePage'),
  'MenuManagePage',
);

const FunctionCodePage = lazyPage(
  () => import('@/features/system/user-security/function-code/FunctionCodePage'),
  'FunctionCodePage',
);

const PermissionTemplatePage = lazyPage(
  () => import('@/features/system/user-security/permission-template/PermissionTemplatePage'),
  'PermissionTemplatePage',
);

const GeneralPermissionPage = lazyPage(
  () => import('@/features/system/user-security/permission-approval/GeneralPermissionPage'),
  'GeneralPermissionPage',
);

const SpecialApprovalPage = lazyPage(
  () => import('@/features/system/user-security/permission-approval/SpecialApprovalPage'),
  'SpecialApprovalPage',
);

export const systemRoutes = (
  <Route path="system">
    <Route path="user-security">
      <Route index element={<Navigate to="menu" replace />} />
      {/* KWPC10010201 메뉴·기능 관리 › 메뉴관리 */}
      <Route path="menu" element={<MenuManagePage />} />
      {/* KWPC10010202 메뉴·기능 관리 › 기능 코드 관리 */}
      <Route path="function-code" element={<FunctionCodePage />} />
      {/* KWPC10010301 권한 템플릿 관리 - 권한 항목 */}
      <Route path="permission-template" element={<PermissionTemplatePage />} />
      {/* KWPC10010401 권한 신청 승인 관리 › 일반 메뉴·기능 권한 */}
      <Route path="permission-approval" element={<GeneralPermissionPage />} />
      {/* KWPC10010403 권한 신청 승인 관리 › 특수권한 결재 현황 */}
      <Route path="permission-approval/special" element={<SpecialApprovalPage />} />
      {remainingPlaceholderRoute('KWPC1001')}
    </Route>
    {menuPlaceholderRoutes('system', [MENU.KWPC1001])}
  </Route>
);
