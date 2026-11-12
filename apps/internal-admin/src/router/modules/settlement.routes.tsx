import { Navigate, Route } from 'react-router-dom';
import { MENU } from '@/constants/menu';
import { lazyPage } from '../lazy';
import { menuPlaceholderRoutes } from '../placeholder';

// 06 정산내역
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다
//   0601 가맹점 정산 관리 → pages/settlement/merchant/
//   0602 지급 및 예외 정산 관리 → pages/settlement/payout-exception/
//   0603 청구 & 원천사 정산 → pages/settlement/billing-source/
//   0604 원천사 입금 & 차액 정산 → pages/settlement/source-deposit/
//   0605 환불 관리 → pages/settlement/refund/
//   0606 수수료 & 대리점 정산 → pages/settlement/fee-agency/
//   0607 세무 & 정산 증빙 → pages/settlement/tax-evidence/
//   0608 분배정산 → pages/settlement/distribution/
//   0609 정산 정책 관리 → pages/settlement/policy/
//   0610 정산 스케줄 관리 → pages/settlement/schedule/

const MerchantSettlementExecutePage = lazyPage(
  () => import('@/pages/settlement/merchant/execute/MerchantSettlementExecutePage'),
  'MerchantSettlementExecutePage',
);

export const settlementRoutes = (
  <Route path="settlement">
    <Route path="merchant">
      <Route index element={<Navigate to="execute" replace />} />
      {/* KWPC06010201 가맹점 정산 실행/처리 */}
      <Route path="execute" element={<MerchantSettlementExecutePage />} />
    </Route>
    {menuPlaceholderRoutes('settlement', [MENU.KWPC0601])}
  </Route>
);
