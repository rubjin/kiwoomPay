import { MENUS } from './menu';

// 화면 경로 ↔ 화면명. 브라우저 탭 제목(나중에 Work Tab 라벨)의 단일 출처.
// 화면(3depth)을 만들면 라우트와 같은 경로로 한 줄 추가한다. 없는 경로는 2depth 메뉴 이름을 쓴다.

export interface ScreenInfo {
  /** 화면ID (레이아웃 패턴은 P01 · P02) */
  id: string;
  /** 화면명 (Figma 화면 제목) */
  name: string;
  path: string;
}

export const SCREENS: readonly ScreenInfo[] = [
  { id: 'KWPC0104', name: '다운로드 센터', path: '/main/download-center' },
  { id: 'KWPC2000', name: '마이페이지', path: '/mypage' },
  { id: 'KWPC04010100', name: '통합 거래내역', path: '/transaction/integrated/list' },
  { id: 'KWPC06010201', name: '가맹점 정산 실행/처리', path: '/settlement/merchant/execute' },
  {
    id: 'KWPC07010101',
    name: '가맹점 기본/계약 정보 관리',
    path: '/operation/merchant-contract/basic/new',
  },
  {
    id: 'KWPC07010101',
    name: '가맹점 기본/계약 정보 관리',
    path: '/operation/merchant-contract/basic/edit',
  },
  // 레이아웃 패턴 템플릿 (화면 목록에서 연다). 개발 서버에서만 — router/modules/patterns.routes.tsx
  ...(import.meta.env.DEV
    ? [
        { id: 'P01', name: 'P01', path: '/patterns/search-result' },
        { id: 'P02', name: 'P02', path: '/patterns/record-form' },
        { id: 'P03', name: 'P03', path: '/patterns/lookup-apply' },
        { id: 'P04', name: 'P04', path: '/patterns/action-feedback' },
      ]
    : []),
];

export const DEFAULT_TITLE = '키움페이 내부관리자';
export const NOT_FOUND_TITLE = '페이지를 찾을 수 없습니다';

/** 현재 경로의 화면명. 만든 화면 → 화면명, 아직 없는 화면 → 2depth 메뉴 이름, 둘 다 아니면 null */
export function screenNameOf(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  const screen = SCREENS.find((s) => s.path === path);
  if (screen) return screen.name;
  const menu = MENUS.find((m) => path === m.path || path.startsWith(m.path + '/'));
  return menu?.depth2 ?? null;
}
