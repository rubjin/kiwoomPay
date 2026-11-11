import { Navigate, Route } from 'react-router-dom';
import { MENU } from '@/constants/menu';
import { lazyPage } from '../lazy';
import { menuPlaceholderRoutes } from '../placeholder';

// 04 거래내역
//   0401 통합 거래 및 예외 관리 → pages/transaction/integrated/
//   0402 카드 & 간편결제 → pages/transaction/card-easypay/
//   0403 계좌 & 현금성 결제 → pages/transaction/account-cash/
//   0404 포인트 & 소액결제 → pages/transaction/point-micro/

const IntegratedTransactionPage = lazyPage(
  () => import('@/pages/transaction/integrated/IntegratedTransactionPage'),
  'IntegratedTransactionPage',
);

export const transactionRoutes = (
  <Route path="transaction">
    <Route path="integrated">
      <Route index element={<Navigate to="list" replace />} />
      {/* KWPC04010100 통합 거래 내역 */}
      <Route path="list" element={<IntegratedTransactionPage />} />
    </Route>
    {menuPlaceholderRoutes('transaction', [MENU.KWPC0401])}
  </Route>
);
