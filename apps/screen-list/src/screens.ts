// 화면 목록 데이터. 화면을 만들거나 고치면 해당 시스템에 한 줄 추가 · 갱신한다.
// 1 · 2depth는 IA(각 앱 constants/menu.ts), 3depth · 화면명은 Figma GUI 기준.

export type SystemId = 'internal' | 'merchant' | 'agency';

export const SYSTEMS: { id: SystemId; label: string; url: string }[] = [
  {
    id: 'internal',
    label: '내부관리자',
    url: import.meta.env.VITE_URL_INTERNAL ?? 'http://localhost:5173',
  },
  {
    id: 'merchant',
    label: '가맹점관리자',
    url: import.meta.env.VITE_URL_MERCHANT ?? 'http://localhost:5174',
  },
  {
    id: 'agency',
    label: '영업대행사',
    url: import.meta.env.VITE_URL_AGENCY ?? 'http://localhost:5175',
  },
];

export const STATUSES = ['작업중', '작업완료', '삭제', '보류'] as const;
export type ScreenStatus = (typeof STATUSES)[number];

export type ScreenType = '목록' | '상세' | '등록 · 수정' | '팝업' | '대시보드' | '로그인' | '기타';

export interface ScreenInfo {
  system: SystemId;
  /** 화면ID */
  id: string;
  depth1: string;
  depth2: string;
  depth3: string;
  /** 화면명 (Figma 화면 제목) */
  name: string;
  /** 앱 안 경로 (시스템 url 뒤에 붙는다) */
  path: string;
  type: ScreenType;
  /** 적용한 페이지 패턴 (docs/ai/page-patterns-plan.md) */
  pattern?: string;
  status: ScreenStatus;
  /** 기획 반영 버전 (IA · GUI) */
  planVersion: string;
  /** 최종 업데이트일 YYYY-MM-DD */
  updatedAt: string;
  /** 시안 · 정책 없이 임시로 만든 부분 → 화면명 옆 "(임의 작업: …)" */
  tempWork?: string;
}

const PLAN = 'IA v0.7 (26-11-03) · GUI 26-11-10';

export const SCREENS: ScreenInfo[] = [
  {
    system: 'internal',
    id: 'KWPC04010100',
    depth1: '거래내역',
    depth2: '통합 거래 및 예외 관리',
    depth3: '통합 거래내역',
    name: '통합 거래내역',
    path: '/transaction/integrated/list',
    type: '목록',
    pattern: 'P01',
    status: '작업중',
    planVersion: PLAN,
    updatedAt: '2026-11-12',
    tempWork: '그리드 미리보기 · 예시 데이터 · 찾기 팝업 미연결',
  },
  {
    system: 'internal',
    id: 'KWPC06010201',
    depth1: '정산내역',
    depth2: '가맹점 정산 관리',
    depth3: '정산 실행/처리',
    name: '가맹점 정산 실행/처리',
    path: '/settlement/merchant/execute',
    type: '목록',
    pattern: 'P01',
    status: '작업중',
    planVersion: PLAN,
    updatedAt: '2026-11-12',
    tempWork: '상세 검색 내용 · 그리드 미리보기 · 예시 데이터',
  },
];
