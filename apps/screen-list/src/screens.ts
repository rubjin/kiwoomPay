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
  // 레이아웃 패턴 템플릿 — 목록 맨 위. 새 화면은 여기서 구성을 복사해 시작한다
  {
    system: 'internal',
    id: 'PATTERN-P01',
    depth1: '레이아웃 패턴',
    depth2: 'P01',
    depth3: '',
    name: 'Search → Result (조회 화면 템플릿)',
    path: '/patterns/search-result',
    type: '목록',
    pattern: 'P01',
    status: '작업중',
    planVersion: PLAN,
    updatedAt: '2026-11-13',
    tempWork: '검색 항목 · 예시 데이터 · 그리드 미리보기',
  },
  {
    system: 'internal',
    id: 'PATTERN-P02',
    depth1: '레이아웃 패턴',
    depth2: 'P02',
    depth3: '',
    name: 'Record → Form (등록 · 수정 화면 템플릿)',
    path: '/patterns/record-form',
    type: '등록 · 수정',
    pattern: 'P02',
    status: '작업중',
    planVersion: PLAN,
    updatedAt: '2026-11-13',
    tempWork: '입력 항목 · 예시 값',
  },
  {
    system: 'internal',
    id: 'KWPC0104',
    depth1: '메인',
    depth2: '다운로드센터',
    depth3: '',
    name: '다운로드 센터',
    path: '/main/download-center',
    type: '목록',
    pattern: 'P01',
    status: '작업중',
    planVersion: PLAN,
    updatedAt: '2026-11-12',
    tempWork:
      '그리드 미리보기 · 예시 데이터 · 진입 시 바로 조회 · 기본 기간(이번 달) · 생성중 상세 Footer [닫기]',
  },
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
  {
    system: 'internal',
    id: 'KWPC07010101',
    depth1: '운영관리',
    depth2: '가맹점 정보·계약 통합 관리',
    depth3: '가맹점 기본/계약 정보 관리',
    name: '가맹점 기본/계약 정보 관리 · 신규등록',
    path: '/operation/merchant-contract/basic/new',
    type: '등록 · 수정',
    pattern: 'P02',
    status: '작업중',
    planVersion: PLAN,
    updatedAt: '2026-11-12',
    tempWork:
      '고객 확인 정보 · 결제 오픈 현황 탭 · 선택지 값 · 찾기/주소 팝업 미연결 · 필수 검증(사업자구분만) · CPID 영역',
  },
  {
    system: 'internal',
    id: 'KWPC07010101',
    depth1: '운영관리',
    depth2: '가맹점 정보·계약 통합 관리',
    depth3: '가맹점 기본/계약 정보 관리',
    name: '가맹점 기본/계약 정보 관리 · 조회수정',
    path: '/operation/merchant-contract/basic/edit',
    type: '등록 · 수정',
    pattern: 'P02',
    status: '작업중',
    planVersion: PLAN,
    updatedAt: '2026-11-12',
    tempWork:
      'CPID 상세 영역(CPID 기본 정보 등 9개 탭) · 예시 데이터 · 사업자번호 수정/찾기 팝업 미연결',
  },
];
