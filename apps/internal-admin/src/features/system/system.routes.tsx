import { Route } from 'react-router-dom';
import { menuPlaceholderRoutes } from '@/router/placeholder';

// 10 시스템관리
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   1001 사용자·권한·보안 관리 → features/system/user-security/
//   1002 기준정보·코드 관리 → features/system/code/
//   1003 외부연계 관리 → features/system/external-link/
//   1004 시스템 운영 관리 → features/system/operation/
//   1005 알림·메시지 관리 → features/system/notification/
//   1006 VAN 라우팅 관리 → features/system/van-routing/
export const systemRoutes = <Route path="system">{menuPlaceholderRoutes('system')}</Route>;
