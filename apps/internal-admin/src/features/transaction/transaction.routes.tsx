import { Navigate, Route } from 'react-router-dom';
import { MENU } from '@/constants/menu';
import { lazyPage } from '@/router/lazy';
import { menuPlaceholderRoutes, remainingPlaceholderRoute } from '@/router/placeholder';

// 04 거래내역
//   0401 통합 거래 및 예외 관리 → features/transaction/integrated/
//   0402 카드 & 간편결제 → features/transaction/card-easypay/
//   0403 계좌 & 현금성 결제 → features/transaction/account-cash/
//   0404 포인트 & 소액결제 → features/transaction/point-micro/

const IntegratedTransactionPage = lazyPage(
  () => import('@/features/transaction/integrated/IntegratedTransactionPage'),
  'IntegratedTransactionPage',
);

export const transactionRoutes = (
  <Route path="transaction">
    <Route path="integrated">
      <Route index element={<Navigate to="list" replace />} />
      {/* KWPC04010100 통합 거래 내역 */}
      <Route path="list" element={<IntegratedTransactionPage />} />
      {remainingPlaceholderRoute('KWPC0401')}
    </Route>
    {menuPlaceholderRoutes('transaction', [MENU.KWPC0401])}
  </Route>
);
