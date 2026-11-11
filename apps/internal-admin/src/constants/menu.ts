// 화면ID ↔ path 매핑. 라우트 · DB 메뉴(url)는 이 path와 정확히 같아야 한다.
// 기준: KWP v2.0_TO-BE_IA_v0.7_20261103.xlsx › 내부관리자 (1depth / 2depth)

export interface MenuInfo {
  /** 화면ID (KWPC + 1depth + 2depth) */
  id: string;
  depth1: string;
  depth2: string;
  path: string;
}

export const MENUS = [
  { id: 'KWPC0101', depth1: '메인', depth2: '대시보드', path: '/main/dashboard' },
  { id: 'KWPC0104', depth1: '메인', depth2: '다운로드센터', path: '/main/download-center' },
  { id: 'KWPC0201', depth1: '마이페이지', depth2: '계정관리', path: '/mypage/account' },
  { id: 'KWPC0202', depth1: '마이페이지', depth2: '권한관리', path: '/mypage/permission' },
  { id: 'KWPC0203', depth1: '마이페이지', depth2: '알림센터', path: '/mypage/notification' },
  { id: 'KWPC0300', depth1: '로그인', depth2: '로그인', path: '/auth/login' },
  { id: 'KWPC0301', depth1: '로그인', depth2: 'SMS 인증', path: '/auth/sms-auth' },
  {
    id: 'KWPC0401',
    depth1: '거래내역',
    depth2: '통합 거래 및 예외 관리',
    path: '/transaction/integrated',
  },
  {
    id: 'KWPC0402',
    depth1: '거래내역',
    depth2: '카드 & 간편결제',
    path: '/transaction/card-easypay',
  },
  {
    id: 'KWPC0403',
    depth1: '거래내역',
    depth2: '계좌 & 현금성 결제',
    path: '/transaction/account-cash',
  },
  {
    id: 'KWPC0404',
    depth1: '거래내역',
    depth2: '포인트 & 소액결제',
    path: '/transaction/point-micro',
  },
  {
    id: 'KWPC0501',
    depth1: '통계내역',
    depth2: '매출 분석 및 통계',
    path: '/statistics/sales-analysis',
  },
  { id: 'KWPC0502', depth1: '통계내역', depth2: '리스크 & RM 관리', path: '/statistics/risk' },
  { id: 'KWPC0503', depth1: '통계내역', depth2: '대손 및 채권 관리', path: '/statistics/bad-debt' },
  {
    id: 'KWPC0504',
    depth1: '통계내역',
    depth2: '보고자료 센터',
    path: '/statistics/report-center',
  },
  { id: 'KWPC0601', depth1: '정산내역', depth2: '가맹점 정산 관리', path: '/settlement/merchant' },
  {
    id: 'KWPC0602',
    depth1: '정산내역',
    depth2: '지급 및 예외 정산 관리',
    path: '/settlement/payout-exception',
  },
  {
    id: 'KWPC0603',
    depth1: '정산내역',
    depth2: '청구 & 원천사 정산',
    path: '/settlement/billing-source',
  },
  {
    id: 'KWPC0604',
    depth1: '정산내역',
    depth2: '원천사 입금 & 차액 정산',
    path: '/settlement/source-deposit',
  },
  { id: 'KWPC0605', depth1: '정산내역', depth2: '환불 관리', path: '/settlement/refund' },
  {
    id: 'KWPC0606',
    depth1: '정산내역',
    depth2: '수수료 & 대리점 정산',
    path: '/settlement/fee-agency',
  },
  {
    id: 'KWPC0607',
    depth1: '정산내역',
    depth2: '세무 & 정산 증빙',
    path: '/settlement/tax-evidence',
  },
  { id: 'KWPC0608', depth1: '정산내역', depth2: '분배정산', path: '/settlement/distribution' },
  { id: 'KWPC0609', depth1: '정산내역', depth2: '정산 정책 관리', path: '/settlement/policy' },
  { id: 'KWPC0610', depth1: '정산내역', depth2: '정산 스케줄 관리', path: '/settlement/schedule' },
  {
    id: 'KWPC0701',
    depth1: '운영관리',
    depth2: '가맹점 정보·계약 통합 관리',
    path: '/operation/merchant-contract',
  },
  {
    id: 'KWPC0702',
    depth1: '운영관리',
    depth2: '원천사 정보·계약 통합 관리',
    path: '/operation/source-contract',
  },
  {
    id: 'KWPC0703',
    depth1: '운영관리',
    depth2: '계정 & 권한 관리',
    path: '/operation/account-permission',
  },
  {
    id: 'KWPC0704',
    depth1: '운영관리',
    depth2: '원천사 연동 관리',
    path: '/operation/source-integration',
  },
  { id: 'KWPC0705', depth1: '운영관리', depth2: '게시판 & CS 관리', path: '/operation/board-cs' },
  {
    id: 'KWPC0706',
    depth1: '운영관리',
    depth2: '리스크 & 차단 관리',
    path: '/operation/risk-block',
  },
  { id: 'KWPC0707', depth1: '운영관리', depth2: 'AML/KYC 관리', path: '/operation/aml-kyc' },
  {
    id: 'KWPC0708',
    depth1: '운영관리',
    depth2: '신규 계약/청약 관리',
    path: '/operation/new-contract',
  },
  { id: 'KWPC0709', depth1: '운영관리', depth2: '오프라인 PG 관리', path: '/operation/offline-pg' },
  { id: 'KWPC0710', depth1: '운영관리', depth2: '프로모션 관리', path: '/operation/promotion' },
  { id: 'KWPC0801', depth1: '부가서비스', depth2: '지급대행 서비스', path: '/addon/payout-agency' },
  { id: 'KWPC0802', depth1: '부가서비스', depth2: '인증 서비스', path: '/addon/certification' },
  {
    id: 'KWPC0803',
    depth1: '부가서비스',
    depth2: '선/직불 & 다우머니',
    path: '/addon/prepaid-money',
  },
  { id: 'KWPC0804', depth1: '부가서비스', depth2: '기타 부가서비스', path: '/addon/etc-service' },
  {
    id: 'KWPC0805',
    depth1: '부가서비스',
    depth2: '해외결제 관리',
    path: '/addon/overseas-payment',
  },
  { id: 'KWPC0901', depth1: 'RM관리', depth2: '이상거래 모니터링(FDS)', path: '/rm/fds' },
  { id: 'KWPC0902', depth1: 'RM관리', depth2: '가맹점 리스크 평가', path: '/rm/merchant-risk' },
  {
    id: 'KWPC1001',
    depth1: '시스템관리',
    depth2: '사용자·권한·보안 관리',
    path: '/system/user-security',
  },
  { id: 'KWPC1002', depth1: '시스템관리', depth2: '기준정보·코드 관리', path: '/system/code' },
  { id: 'KWPC1003', depth1: '시스템관리', depth2: '외부연계 관리', path: '/system/external-link' },
  { id: 'KWPC1004', depth1: '시스템관리', depth2: '시스템 운영 관리', path: '/system/operation' },
  {
    id: 'KWPC1005',
    depth1: '시스템관리',
    depth2: '알림·메시지 관리',
    path: '/system/notification',
  },
  { id: 'KWPC1006', depth1: '시스템관리', depth2: 'VAN 라우팅 관리', path: '/system/van-routing' },
] as const satisfies readonly MenuInfo[];

export type MenuId = (typeof MENUS)[number]['id'];

/** 화면ID → path. 예) MENU.KWPC0401 === '/transaction/integrated' */
export const MENU = Object.fromEntries(MENUS.map((m) => [m.id, m.path])) as Record<MenuId, string>;

/** 1depth path(예: 'transaction')에 속한 2depth 메뉴 */
export const menusOf = (depth1Path: string) =>
  MENUS.filter((m) => m.path.split('/')[1] === depth1Path);
