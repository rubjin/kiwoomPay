import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout/MainLayout';
import { NotFoundPage } from '@/features/error/NotFoundPage';
import { MENU } from '@/constants/menu';
import { RequireAuth } from './RequireAuth';
import { useDocumentTitle } from './useDocumentTitle';
import { addonRoutes } from '@/features/addon/addon.routes';
import { authRoutes } from '@/features/auth/auth.routes';
import { mainRoutes } from '@/features/main/main.routes';
import { mypageRoutes } from '@/features/mypage/mypage.routes';
import { operationRoutes } from '@/features/operation/operation.routes';
import { conventionRoutes, patternRoutes } from '@/features/patterns/patterns.routes';
import { rmRoutes } from '@/features/rm/rm.routes';
import { settlementRoutes } from '@/features/settlement/settlement.routes';
import { statisticsRoutes } from '@/features/statistics/statistics.routes';
import { systemRoutes } from '@/features/system/system.routes';
import { transactionRoutes } from '@/features/transaction/transaction.routes';

/** 루트 Routes: 레이아웃 + 1depth 모듈 라우트 조립 */
export function AppRoutes() {
  useDocumentTitle();
  return (
    <Routes>
      {authRoutes}
      {conventionRoutes}
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to={MENU.KWPC0101} replace />} />
        {mainRoutes}
        {mypageRoutes}
        {transactionRoutes}
        {statisticsRoutes}
        {settlementRoutes}
        {operationRoutes}
        {addonRoutes}
        {rmRoutes}
        {systemRoutes}
        {patternRoutes}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
