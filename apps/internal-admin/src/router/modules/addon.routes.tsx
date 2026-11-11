import { Route } from 'react-router-dom';
import { menuPlaceholderRoutes } from '../placeholder';

// 08 부가서비스
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   0801 지급대행 서비스 → pages/addon/payout-agency/
//   0802 인증 서비스 → pages/addon/certification/
//   0803 선/직불 & 다우머니 → pages/addon/prepaid-money/
//   0804 기타 부가서비스 → pages/addon/etc-service/
//   0805 해외결제 관리 → pages/addon/overseas-payment/
export const addonRoutes = <Route path="addon">{menuPlaceholderRoutes('addon')}</Route>;
