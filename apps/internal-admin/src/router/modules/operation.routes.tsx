import { Navigate, Route } from 'react-router-dom';
import { MENU } from '@/constants/menu';
import { lazyPage } from '../lazy';
import { menuPlaceholderRoutes } from '../placeholder';

// 07 운영관리
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   0701 가맹점 정보·계약 통합 관리 → pages/operation/merchant-contract/
//   0702 원천사 정보·계약 통합 관리 → pages/operation/source-contract/
//   0703 계정 & 권한 관리 → pages/operation/account-permission/
//   0704 원천사 연동 관리 → pages/operation/source-integration/
//   0705 게시판 & CS 관리 → pages/operation/board-cs/
//   0706 리스크 & 차단 관리 → pages/operation/risk-block/
//   0707 AML/KYC 관리 → pages/operation/aml-kyc/
//   0708 신규 계약/청약 관리 → pages/operation/new-contract/
//   0709 오프라인 PG 관리 → pages/operation/offline-pg/
//   0710 프로모션 관리 → pages/operation/promotion/
const page = () => import('@/pages/operation/merchant-contract/basic/MerchantBasicPage');
const MerchantCreatePage = lazyPage(page, 'MerchantCreatePage');
const MerchantEditPage = lazyPage(page, 'MerchantEditPage');

export const operationRoutes = (
  <Route path="operation">
    <Route path="merchant-contract">
      <Route index element={<Navigate to="basic/edit" replace />} />
      {/* KWPC07010101 가맹점 기본/계약 정보 관리: 신규등록 · 조회수정 */}
      <Route path="basic/new" element={<MerchantCreatePage />} />
      <Route path="basic/edit" element={<MerchantEditPage />} />
    </Route>
    {menuPlaceholderRoutes('operation', [MENU.KWPC0701])}
  </Route>
);
