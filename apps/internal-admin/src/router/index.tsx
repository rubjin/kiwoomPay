import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout/MainLayout';
import { NotFoundPage } from '@/pages/error/NotFoundPage';
import { MENU } from '@/constants/menu';
import { RequireAuth } from './RequireAuth';
import { useDocumentTitle } from './useDocumentTitle';
import { addonRoutes } from './modules/addon.routes';
import { authRoutes } from './modules/auth.routes';
import { mainRoutes } from './modules/main.routes';
import { mypageRoutes } from './modules/mypage.routes';
import { operationRoutes } from './modules/operation.routes';
import { conventionRoutes, patternRoutes } from './modules/patterns.routes';
import { rmRoutes } from './modules/rm.routes';
import { settlementRoutes } from './modules/settlement.routes';
import { statisticsRoutes } from './modules/statistics.routes';
import { systemRoutes } from './modules/system.routes';
import { transactionRoutes } from './modules/transaction.routes';

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
