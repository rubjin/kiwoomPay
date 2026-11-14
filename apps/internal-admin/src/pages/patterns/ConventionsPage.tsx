import {
  Badge,
  FormTable,
  Infobox,
  PageLayout,
  Tab,
  type BadgeTone,
} from '@kiwoompay/design-system';
import { useState, type CSSProperties } from 'react';
import { LOCAL_PARTS, type LocalVerdict } from './conventionsLocal';
import { FOLDER_TREES, treeText } from './conventionsTree';

/** 규칙 한 줄: 항목 · 규칙 · 예시(파일 · 코드) */
interface Rule {
  item: string;
  rule: string;
  example?: string;
}

interface RuleGroup {
  title: string;
  rules: Rule[];
}

// 확정 결정(docs/ai/status.md · docs/ai/brief.md · docs/ai/page-patterns-plan.md)에서 화면 개발에 필요한 규칙만 모았다.
// 결정이 바뀌면 status.md를 먼저 고치고 여기도 같이 고친다
const CONVENTIONS: RuleGroup[] = [
  {
    title: '폴더 · 파일 배치 (앱)',
    rules: [
      {
        item: '화면',
        rule: 'pages/<1depth>/<2depth>/ 아래 화면 하나 = <이름>Page.tsx 하나',
        example: 'pages/settlement/merchant/execute/MerchantSettlementExecutePage.tsx',
      },
      {
        item: '화면 부품',
        rule: '그 화면만 쓰는 부품 · 팝업은 화면 폴더의 components/. 페이지는 조합만 한다',
        example: 'execute/components/ledgerColumns.tsx',
      },
      {
        item: '검색 항목 · 초기값',
        rule: '화면마다 다른 검색 항목 · 순서는 components/searchFields.ts(SEARCH_FIELDS), 초기 검색값은 components/initialParams.ts(createInitialParams() — 화면에 들어올 때 오늘 기준으로 만든다)',
        example: 'createInitialParams()',
      },
      {
        item: '선택지',
        rule: '고정 선택지(전체 · 시각 · 조회기준일)는 constants/options/, 서버 공통코드는 useCodeOptions(group) — 받기 전에는 constants/codes.ts 임시값',
        example: "useCodeOptions('PAY_METHOD', { withAll: true })",
      },
      {
        item: '공통 팝업',
        rule: '여러 화면이 같이 쓰는 업무 팝업(찾기 · 설정)은 components/popups/',
        example: 'components/popups/BizFinderModal.tsx',
      },
      {
        item: 'API · 타입',
        rule: 'api/<1depth>/<이름>.ts · types/<1depth>/<이름>.ts. 스펙이 없으면 예시 데이터 + TODO(API)',
        example: 'api/main/downloadCenter.ts',
      },
      {
        item: '라우트',
        rule: '1depth별 router/modules/<1depth>.routes.tsx, 페이지는 lazyPage로 나눠 불러온다',
        example: "lazyPage(() => import('@/pages/…'), 'XxxPage')",
      },
      {
        item: '메뉴 · 화면명',
        rule: '화면ID ↔ 경로는 constants/menu.ts(라우트 · DB 메뉴 url과 같아야 함). 화면을 만들면 constants/screens.ts에 같은 경로로 한 줄 — 브라우저 탭 제목이 된다',
        example: "{ id: 'KWPC0104', name: '다운로드 센터', path: '/main/download-center' }",
      },
      {
        item: '디자인 시스템',
        rule: '업무 문구 · API · 권한 판단은 앱에만. 디자인 시스템(packages/design-system)은 순수 UI · 패턴 템플릿 · 흐름 훅(fetch 없음). 컴포넌트 폴더는 Name.tsx · Name.module.scss · Name.stories.tsx · index.ts',
      },
    ],
  },
  {
    title: '이름',
    rules: [
      {
        item: '화면ID',
        rule: 'IA 화면ID(12자리)를 그대로 쓴다. 메뉴는 KWPC + 1depth + 2depth',
        example: 'KWPC06010201 · KWPC0601',
      },
      {
        item: '파일',
        rule: '컴포넌트는 PascalCase — 화면 …Page, 팝업 …Modal. 데이터 · 함수 파일은 camelCase',
        example: 'DownloadDetailModal.tsx · searchFields.ts',
      },
      {
        item: '상수',
        rule: '고정 목록 · 표는 UPPER_SNAKE_CASE',
        example: 'SEARCH_FIELDS · TX_SOURCES · SETTLEMENT_CYCLES',
      },
      {
        item: 'CSS 클래스',
        rule: 'CSS Modules, BEM 없이 단순하게. 상태 · 변형은 clsx로 조합, 중첩 최대 2단계, 요소 · ID 선택자 금지',
        example: '.button · .primary · .small · .disabled',
      },
      {
        item: '토큰',
        rule: '값이 아닌 역할로 이름 짓는다. SCSS 변수와 CSS 변수(--kp-*)는 1:1',
        example: 'bg/primary (O) · blue-bg (X)',
      },
      {
        item: '글자 스타일',
        rule: '컴포넌트 SCSS는 Figma 스타일 이름 그대로 (없는 이름은 빌드 에러)',
        example: '@include m.typography(typo-16-semi-bold)',
      },
    ],
  },
  {
    title: '스타일 · 간격',
    rules: [
      {
        item: '값 직접 쓰지 않기',
        rule: '색 · 글자 · 그림자 · 여러 컴포넌트가 쓰는 크기는 토큰(tokens/custom → --kp-*). 한 컴포넌트만 쓰는 크기 · 간격은 그 *.module.scss 맨 위 SCSS 변수 (Stylelint가 경고)',
        example: '$rf-row-height: 52px;',
      },
      {
        item: '컨트롤 간격',
        rule: '입력 + 버튼 · 버튼 + 버튼 8, 칸 안 라벨 + 입력 12, 형태가 다른 묶음 사이 16. ControlGroup으로 묶고 인라인 스타일로 간격을 만들지 않는다',
        example: '<ControlGroup spacing="lg"><ControlGroup>…</ControlGroup>…</ControlGroup>',
      },
      {
        item: '표 테두리',
        rule: '칸 사이에는 세로선, 표 양 끝(첫 칸 왼쪽 · 마지막 칸 오른쪽)에는 선 없음. FormTable · GridPlaceholder · IBSheet 테마 공통',
      },
      {
        item: '그리드 · 캘린더',
        rule: '표는 IBSheet(디자인 시스템은 영역 · 여백 · 테마만), 날짜 선택도 IBSheet 캘린더(어댑터)',
      },
      {
        item: '키컬러',
        rule: '컴포넌트 · 토큰은 세 시스템 공통, 키컬러(Primary)만 시스템별 — :root[data-system="merchant"] 등',
      },
    ],
  },
  {
    title: '팝업',
    rules: [
      {
        item: 'Modal 크기',
        rule: 'sm 400 · md 620 · lg 880 · xl 1280 · xxl 1680. xl은 넓은 입력 표, xxl은 화면형 팝업',
        example: '<Modal size="lg">',
      },
      {
        item: '하단 버튼',
        rule: 'Modal Footer 버튼은 항상 lg 48 (Figma에 40으로 그려져 있어도 48)',
      },
      {
        item: '결과 안내',
        rule: '성공 · 실패 안내는 Alert(Modal sm)로 통일, Toast 없음. 처리 후에는 재조회(refresh()) 다음에 완료 Alert',
        example: "await result.refresh(); dialog.alert('처리되었습니다.')",
      },
      {
        item: '찾기 팝업',
        rule: 'P03 Lookup → Apply: useLookup().open()이 고른 값(취소 시 null)을 돌려준다',
        example: 'const biz = await lookup.open();',
      },
      {
        item: '팝업 모음',
        rule: '새 팝업은 팝업 모음(/patterns/popups)에 버튼을 추가하고, 화면 목록에는 /patterns/popups?open=<버튼 키>로 링크',
      },
    ],
  },
  {
    title: '화면 흐름',
    rules: [
      {
        item: '시작점',
        rule: '새 화면은 레이아웃 패턴 템플릿(P01 ~ P07)에서 구성을 복사해 시작한다. UI 규격은 디자인 가이드, 업무 조건은 화면설계서, 골격 · 상태 흐름은 패턴',
      },
      {
        item: '조회 화면',
        rule: '최초 진입 시 조회하지 않는다(결과 영역은 조회 전 상태)',
        example: 'useSearchResult — autoSearch 기본 false',
      },
      {
        item: '조회 전용 값',
        rule: '읽기만 하는 값은 입력 요소가 아니라 텍스트로 보여 준다',
      },
      {
        item: '미저장 이탈',
        rule: 'Work Tab 닫기 · 브라우저 닫기(beforeunload)에서 확인',
      },
      {
        item: '공통 상태',
        rule: '로딩 · 0건 · 오류 · 권한 없음은 StatusView 한 곳에서 문구 · 아이콘 · 높이를 정한다',
      },
    ],
  },
  {
    title: '임의 작업 · 기록',
    rules: [
      {
        item: '시안 없는 값',
        rule: '기존 토큰 · 컴포넌트 조합 + TODO(시안) 주석이 달린 임시값. 값을 추측해 확정하지 않는다',
        example: '// TODO(시안) 간격 8',
      },
      {
        item: '임의 작업 표시',
        rule: '시안 · 정책 없이 만든 부분은 "(임의 작업)"으로 남긴다 — Storybook parameters.tempWork, 화면 목록 tempWork(기타 칸)',
      },
      {
        item: '화면 목록',
        rule: '화면을 만들거나 고치면 apps/screen-list/src/screens.ts에 IA 화면ID로 한 줄 추가 · 갱신 (상태 · 경로 · 최종업데이트일)',
      },
      {
        item: '결정 기록',
        rule: '확정 결정 · 단계 요약은 docs/ai/status.md. status의 확정 결정이 brief보다 우선',
      },
      {
        item: '개발 전용 페이지',
        rule: '패턴 템플릿 · 팝업 모음 · 이 컨벤션 페이지는 개발 서버에서만(import.meta.env.DEV). 운영 빌드에는 빠진다',
      },
    ],
  },
  {
    title: '커밋',
    rules: [
      {
        item: '형식',
        rule: 'Conventional Commits, 제목은 한글 50자 내외 · 마침표 없음, 본문은 "- 변경 내용" 목록',
        example: 'feat(settlement): 원장 지급확정 팝업',
      },
      {
        item: 'type · scope',
        rule: 'type: feat · fix · refactor · style · docs · chore · build · test. scope: tokens · styles · storybook · 컴포넌트명 · 앱 영역',
      },
      {
        item: '나누기',
        rule: '성격이 다른 변경은 커밋을 나눈다. 화면 목록(apps/screen-list) 변경은 화면 개발과 따로 — chore(screen-list)',
      },
    ],
  },
];

const RULE_COLUMNS = '160px minmax(0, 1fr) minmax(0, 0.7fr)';

// 트리는 고정폭 글꼴이어야 선 · 설명 칸이 맞는다 (임의 작업 — 시안 없음, 개발 서버 전용 페이지라 인라인)
const TREE_STYLE: CSSProperties = {
  margin: 0,
  padding: 'var(--kp-space-16)',
  overflowX: 'auto',
  fontFamily: 'Consolas, "D2Coding", monospace',
  fontSize: 13,
  lineHeight: '22px',
  color: 'var(--kp-color-text-body)',
  background: 'var(--kp-color-bg-page)',
  border: '1px solid var(--kp-color-line-default)',
};

const LOCAL_COLUMNS = '200px minmax(0, 0.9fr) minmax(0, 0.8fr) 72px minmax(0, 1fr)';
const VERDICT_TONE: Record<LocalVerdict, BadgeTone> = {
  필요: 'error',
  후보: 'warning',
  유지: 'neutral',
};

// 화면이 길어 라인 탭으로 한 묶음씩 보여 준다: 폴더 구조(트리 4개) + 규칙 묶음마다 한 탭 + 화면 전용 부품
const TREE_TAB = '폴더 구조';
const LOCAL_TAB = '화면 전용 부품';

/**
 * 개발 컨벤션 (화면 확인용, 임의 작업 — 시안 없음). 화면 목록 맨 위에서 연다.
 * Header · LNB · Work Tab 없이 단독 화면(router/index.tsx에서 MainLayout 밖).
 * 폴더 구조 트리 + 새 화면을 만들 때 지킬 파일 배치 · 이름 · 스타일 · 팝업 · 흐름 · 기록 · 커밋 규칙
 * + 컴포넌트로 만들지 않고 한 화면에서만 쓰는 부품 목록
 */
export function ConventionsPage() {
  const [tab, setTab] = useState(TREE_TAB);
  const group = CONVENTIONS.find((g) => g.title === tab);

  return (
    <PageLayout>
      <PageLayout.Title title="개발 컨벤션" />

      <Infobox>
        <Infobox.Item>
          확정 결정 원문은 docs/ai/status.md(확정 결정) · docs/ai/brief.md ·
          docs/ai/page-patterns-plan.md에 있습니다. 결정이 바뀌면 원문을 먼저 고치고 이
          페이지(pages/patterns/ConventionsPage.tsx)도 같이 고칩니다.
        </Infobox.Item>
      </Infobox>

      <Tab value={tab} onChange={setTab} aria-label="컨벤션 묶음">
        <Tab.Item value={TREE_TAB}>{TREE_TAB}</Tab.Item>
        {CONVENTIONS.map((g) => (
          <Tab.Item key={g.title} value={g.title}>
            {g.title}
          </Tab.Item>
        ))}
        <Tab.Item value={LOCAL_TAB}>{LOCAL_TAB}</Tab.Item>
      </Tab>

      {tab === TREE_TAB &&
        FOLDER_TREES.map((tree) => (
          <PageLayout.Section key={tree.title} title={`폴더 구조 · ${tree.title}`}>
            <p style={{ margin: '0 0 var(--kp-space-8)', color: 'var(--kp-color-text-secondary)' }}>
              {tree.description}
            </p>
            <pre style={TREE_STYLE}>{treeText(tree.lines)}</pre>
          </PageLayout.Section>
        ))}

      {group && (
        <PageLayout.Section title={group.title}>
          <FormTable template={RULE_COLUMNS}>
            <FormTable.Row>
              <FormTable.Head>항목</FormTable.Head>
              <FormTable.Head>규칙</FormTable.Head>
              <FormTable.Head>예시</FormTable.Head>
            </FormTable.Row>
            {group.rules.map((r) => (
              <FormTable.Row key={r.item}>
                <FormTable.Label>{r.item}</FormTable.Label>
                <FormTable.Cell>{r.rule}</FormTable.Cell>
                <FormTable.Cell>{r.example ?? '-'}</FormTable.Cell>
              </FormTable.Row>
            ))}
          </FormTable>
        </PageLayout.Section>
      )}

      {tab === LOCAL_TAB && (
        <>
          <Infobox>
            <Infobox.Item title="판단">
              필요 — 이미 여러 곳에 같은 코드가 있어 공통으로 올린다 · 후보 — 두 번째 사용처가
              생기면 올린다 · 유지 — 그 화면 전용으로 둔다. 화면을 만들다 여기 있는 모양이 다시
              나오면 새로 만들지 말고 공통으로 올린 뒤 쓴다.
            </Infobox.Item>
          </Infobox>
          {LOCAL_PARTS.map((g) => (
            <PageLayout.Section key={g.title} title={`${LOCAL_TAB} · ${g.title}`}>
              <FormTable template={LOCAL_COLUMNS}>
                <FormTable.Row>
                  <FormTable.Head>이름</FormTable.Head>
                  <FormTable.Head>위치 (pages/ 기준)</FormTable.Head>
                  <FormTable.Head>하는 일</FormTable.Head>
                  <FormTable.Head>판단</FormTable.Head>
                  <FormTable.Head>올린다면</FormTable.Head>
                </FormTable.Row>
                {g.parts.map((p) => (
                  <FormTable.Row key={p.name}>
                    <FormTable.Label>{p.name}</FormTable.Label>
                    <FormTable.Cell>{p.where}</FormTable.Cell>
                    <FormTable.Cell>{p.role}</FormTable.Cell>
                    <FormTable.Cell center>
                      <Badge size="sm" tone={VERDICT_TONE[p.verdict]}>
                        {p.verdict}
                      </Badge>
                    </FormTable.Cell>
                    <FormTable.Cell>{p.plan ?? '-'}</FormTable.Cell>
                  </FormTable.Row>
                ))}
              </FormTable>
            </PageLayout.Section>
          ))}
        </>
      )}
    </PageLayout>
  );
}
