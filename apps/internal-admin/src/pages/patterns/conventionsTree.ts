// 개발 컨벤션 페이지의 폴더 구조 트리. [트리 줄, 설명]
// 폴더 · 파일을 옮기거나 새 갈래를 만들면 여기도 같이 고친다

export type TreeLine = readonly [line: string, description?: string];

export interface FolderTree {
  title: string;
  description: string;
  lines: readonly TreeLine[];
}

export const FOLDER_TREES: readonly FolderTree[] = [
  {
    title: '저장소 전체',
    description: 'pnpm 워크스페이스. 디자인 시스템 1개 + 앱(시스템별 관리자 앱 · 화면 목록)',
    lines: [
      ['kiwoompay-ui/'],
      ['├─ CLAUDE.md', 'AI 작업 규칙 진입점 (brief · status를 불러온다)'],
      ['├─ docs/'],
      ['│  ├─ ai/brief.md', '작업 지시 원본 (기술 스택 · 설계 원칙 · 커밋 형식)'],
      ['│  ├─ ai/status.md', '진행 현황 · 확정 결정 — brief보다 우선'],
      ['│  ├─ ai/page-patterns-plan.md', '페이지 패턴 P01 ~ P08 설계 · 확정 결정'],
      ['│  ├─ token-workflow.md', '토큰 변경 절차 (JSON → build-tokens)'],
      ['│  ├─ icon-workflow.md', '아이콘 추가 절차 (SVG → build-icons)'],
      ['│  └─ jsp-integration.md', 'JSP 셸 · 빌드 산출물 연결 (SPA)'],
      ['├─ packages/design-system/', '세 앱이 공유하는 디자인 시스템 (아래 트리)'],
      ['├─ apps/internal-admin/', '내부관리자 앱 (아래 트리)'],
      ['├─ apps/screen-list/', '화면 목록 — 개발 도구 (pnpm screens, 5180)'],
      ['│  ├─ src/screens.ts', '작업 기록: 화면을 만들거나 고치면 한 줄 추가 · 갱신'],
      [
        '│  ├─ src/ia/*.generated.ts',
        'IA 시트에서 생성 (scripts/import-ia.mjs) — 직접 고치지 않음',
      ],
      ['│  └─ src/rows.ts', 'IA 줄 + 작업 기록 → 목록 줄'],
      ['├─ temp/', '시안 PNG (가이드 · 컴포넌트 · 페이지) — 측정용'],
      [
        '└─ pnpm-workspace.yaml · package.json',
        '루트 스크립트: pnpm dev · screens · storybook · build',
      ],
    ],
  },
  {
    title: '디자인 시스템 (packages/design-system)',
    description: '순수 UI · 패턴 템플릿 · 흐름 훅. 업무 문구 · API · 권한 판단은 넣지 않는다',
    lines: [
      ['packages/design-system/'],
      ['├─ tokens/'],
      ['│  ├─ figma/', 'Figma 원본 JSON (color · space · text-styles) — 수정 금지'],
      ['│  └─ custom/', '코드 토큰 JSON (컴포넌트 · 영역별 파일, 이름 충돌 시 빌드 에러)'],
      ['│     └─ themes/', '시스템별 키컬러 (merchant · agency)'],
      ['├─ scripts/'],
      ['│  ├─ build-tokens.mjs', 'JSON → SCSS 변수 + --kp-* CSS 변수 (pnpm tokens)'],
      ['│  ├─ build-icons.mjs', 'SVG → icons.generated.tsx'],
      ['│  └─ copy-fonts.mjs', 'Pretendard woff2 복사 (self-host)'],
      ['├─ src/'],
      ['│  ├─ styles/'],
      ['│  │  ├─ tokens/_generated.scss', '자동 생성 — 직접 수정 금지'],
      ['│  │  ├─ tokens/_index.scss', '컴포넌트가 @use 하는 토큰 진입점'],
      ['│  │  ├─ mixins/', 'typography · respond-to · ellipsis · focus-ring 등'],
      ['│  │  └─ base/', 'reset · global · :root CSS 변수'],
      [
        '│  ├─ components/',
        '단일 UI · 화면 틀 (Button · field · selection · Modal · Tab · layout · navigation · display …)',
      ],
      ['│  │  └─ Button/', 'Name.tsx · Name.module.scss · Name.stories.tsx · index.ts'],
      ['│  ├─ patterns/', '패턴 템플릿 + 흐름 훅 (fetch 없음, API 함수는 인자로)'],
      ['│  │  ├─ common/', 'StatusView(로딩 · 0건 · 오류) · DialogProvider(useDialog)'],
      [
        '│  │  ├─ search-result/',
        'P01 SearchPanel · AppliedFilters · ResultPanel · useSearchResult',
      ],
      ['│  │  ├─ record-form/', 'P02 FormSection · FormTable · ContextChip'],
      ['│  │  ├─ lookup/', 'P03 useLookup · LookupField'],
      ['│  │  ├─ action/', 'P04 useAction'],
      ['│  │  └─ auth/ · feed/ · config/', 'P05 로그인 · P06 알림 · P07 설정 팝업'],
      ['│  ├─ hooks/ · utils/'],
      ['│  └─ index.ts', '공개 API (named export) — 앱은 여기서만 가져온다'],
      ['├─ docs/', 'Storybook 가이드 MDX (Foundation · Components · Patterns)'],
      ['└─ vite.source.ts', '앱 개발 서버가 dist 대신 src를 바로 읽게 하는 설정 (HMR)'],
    ],
  },
  {
    title: '내부관리자 앱 (apps/internal-admin/src)',
    description: '화면 = 패턴 템플릿 조립 + API 연결. 1depth · 2depth 폴더는 IA 메뉴를 따른다',
    lines: [
      ['apps/internal-admin/src/'],
      ['├─ app/', 'main(진입) · App · config · providers(IBSheet 캘린더 어댑터)'],
      ['├─ router/'],
      ['│  ├─ index.tsx', '레이아웃 + 1depth 라우트 모듈 조립'],
      ['│  ├─ modules/<1depth>.routes.tsx', '1depth별 라우트 (pages를 lazyPage로)'],
      ['│  ├─ lazy.tsx', 'lazyPage — 페이지 코드 스플리팅'],
      ['│  ├─ placeholder.tsx', '아직 없는 화면 → 준비 중 화면'],
      ['│  └─ useDocumentTitle.ts', '경로 → 브라우저 탭 제목'],
      ['├─ layouts/', 'MainLayout(App Shell) · Header · Lnb · WorkTabBar · Footer'],
      ['├─ pages/'],
      ['│  ├─ <1depth>/<2depth>/', '화면 (아래 "화면 폴더" 트리)'],
      ['│  ├─ auth/', '로그인 · SMS 인증 (MainLayout 밖)'],
      ['│  └─ patterns/', '패턴 템플릿 · 팝업 모음 · 개발 컨벤션 (개발 서버 전용)'],
      ['├─ components/'],
      ['│  ├─ common/', '앱 공통 화면 조각 (PlaceholderPage)'],
      ['│  └─ popups/', '여러 화면이 쓰는 업무 팝업 (BizFinderModal)'],
      ['├─ api/<1depth>/<이름>.ts', 'API 함수 (스펙 전에는 예시 데이터 + TODO(API))'],
      ['├─ types/<1depth>/<이름>.ts', 'API · 화면 데이터 타입'],
      ['├─ constants/'],
      ['│  ├─ menu.ts', '화면ID ↔ 경로 (라우트 · DB 메뉴 url과 같아야 함)'],
      ['│  ├─ screens.ts', '경로 ↔ 화면명 (브라우저 탭 제목)'],
      ['│  ├─ codes.ts', '공통코드 임시값 (CODE_FALLBACK)'],
      ['│  └─ options/', '고정 선택지 (전체 · 시각 · 조회기준일)'],
      ['├─ hooks/useCodeOptions.ts', '공통코드 선택지 (받기 전에는 임시값)'],
      ['├─ store/', 'zustand — auth · code(공통코드 캐시) · workTabs'],
      ['└─ utils/', 'code(코드 → 이름) · period(조회 기간)'],
    ],
  },
  {
    title: '화면 폴더 (예: 가맹점 정산 실행/처리)',
    description: '페이지 파일은 조합만, 화면 고유 부품은 같은 폴더 components/에',
    lines: [
      ['pages/settlement/merchant/execute/'],
      ['├─ MerchantSettlementExecutePage.tsx', '페이지 — 검색 · 결과 · 처리 흐름 조립'],
      ['└─ components/'],
      ['   ├─ searchFields.ts', 'SEARCH_FIELDS — 검색 항목 · 순서 · 적용 조건 칩 표시'],
      ['   ├─ initialParams.ts', 'createInitialParams() — 오늘 기준 초기 검색값'],
      ['   ├─ ledgerColumns.tsx', '결과 표 열'],
      ['   ├─ actions/', '업무 처리 팝업 (지급일 변경 · 보류 · 지급확정 · 재산출)'],
      ['   └─ detail/LedgerDetailModal.tsx', '상세 팝업'],
    ],
  },
];

/** 트리 줄 + 설명을 한 덩어리 글로 (설명은 같은 칸에서 시작하도록 맞춤) */
export function treeText(lines: readonly TreeLine[]): string {
  const width = Math.max(...lines.map(([line]) => line.length)) + 4;
  return lines
    .map(([line, description]) => (description ? line.padEnd(width) + description : line))
    .join('\n');
}
