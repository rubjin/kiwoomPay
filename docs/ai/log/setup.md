# 프로젝트 · 개발 환경

> 범위: 워크스페이스 · Storybook 설정 · 앱 뼈대 · JSP · IBSheet 설치 · 폴더 구조 · 개발 전용 페이지(화면 목록 · 팝업 모음 · 컨벤션) · 공통코드 · 공통화. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### 워크스페이스 · 빌드

- pnpm 워크스페이스: `packages/design-system`(`@kiwoompay/design-system`) · `apps/internal-admin` · `apps/screen-list`. React 19(디자인 시스템 peer `^18.3.1 || ^19.0.0`), TypeScript 5.9, Vite 7, ESLint 9, Stylelint 16, Storybook 10
- 라이브러리 산출물: ES 모듈 + CSS 1개(`kiwoompay-ui.css`), React는 peer. 폰트는 `pretendard` dynamic-subset woff2를 `dist/fonts`로 복사해 `<link>`로 로드
- SCSS: 컴포넌트는 `@use 'tokens' as t;` · `@use 'mixins' as m;`(Vite `loadPaths`). 반응형 mixin은 데스크톱 기준 `max-width`
- 앱 개발 서버는 디자인 시스템 src를 바로 읽음(`vite.source.ts` `designSystemSource()`, HMR) — 운영 빌드는 `dist`. 앱 tsc는 `dist/types`를 보므로 새 export를 추가하면 디자인 시스템 `pnpm build` 후 앱 typecheck. 개발 서버 폰트는 미들웨어가 `pretendard` 패키지에서 직접 줌
- `pnpm dev`: 내부관리자(5173) + 화면 목록(5180, 브라우저 자동 열기). Storybook 6006(deps 캐시가 깨지면 `node_modules/.cache/storybook` 삭제 후 재시작, Windows는 드라이브 문자 대문자 경로 `C:\…`에서 실행)

### JSP 연동 (SPA, `docs/jsp-integration.md`)

- 앱마다 셸 JSP 1개 + React Router. 서버는 `/api` · `/static` 외 GET을 셸로 forward. 컨텍스트 패스 · API 주소는 셸의 `data-basename` · `data-api-base`(`app/config.ts`)
- 빌드 `base: './'`, 산출물 `app.js` · `app.css`(해시 없음 + `?v=`) · `chunks/<이름>-<해시>.js`. 시스템 키컬러는 html `data-system`

### IBSheet8

- `@ibsheet/react` · `@ibsheet/interface`(npm). 본체 · 라이선스는 업체에서 받아 `apps/<앱>/public/ibsheet/`(개발) · JSP `static/ibsheet/`(운영), index.html · 셸 JSP 주석 해제
- 캘린더 어댑터 `app/providers/ibsheetCalendar.ts`(`IBSheet.showCalendar`, `window.IBSheet`가 없으면 null → 자체 DatePicker)
- Grid는 IBSheet 전까지 `GridPlaceholder`(TODO(IBSheet) 주석)

### 앱 구조 (내부관리자)

- `src/features/<1depth>/`: 폴더 = 화면(2depth), 파일 = 1depth 공용(`<1depth>.routes.tsx` · `<이름>.api.ts` · `<이름>.types.ts` · `<1depth>.options.ts`). 기능 폴더끼리 import 금지(예외: 개발 전용 팝업 모음). 공통 → 기능은 `router/index.tsx`만
- 공통 폴더: app · router · layouts · features · api(`<이름>.api.ts` · `.types.ts`) · components · constants · hooks · store · utils · assets. 빈 폴더 · `.gitkeep` 두지 않음
- 화면 안: 검색 항목 `components/searchFields.ts`, 초기값 `components/initialParams.ts`(`createInitialParams()` — 화면 진입 때 계산), 한 화면의 UI 목록은 화면 파일
- 선택지: 서버 공통코드 `useCodeOptions(group, { withAll })`(받기 전 임시값 `constants/codes.ts` `CODE_FALLBACK`, `store/code.ts` 그룹별 캐시, `codeLabel`), 고정 선택지만 `constants/options`. 새 그룹은 `CODE_FALLBACK`에 추가
- 공용 도구: `api/mock.ts`(`wait` · `paginate`), `utils/format.ts`(`formatNumber` · `formatWon` · `formatCount` · `orDash`), `utils/period`(퀵 기간), 세로 묶음은 디자인 시스템 `Stack`, 가로는 `ControlGroup`
- 탭 제목: `constants/screens.ts`(경로 ↔ 화면명) — 화면을 만들면 라우트와 같은 경로로 한 줄 추가
- 로그인: `RequireAuth`, 로그인 화면은 레이아웃 밖

### 개발 전용 페이지 (운영 빌드 제외 — `import.meta.env.DEV`)

- 패턴 페이지 `/patterns/*`, 기본 레이아웃 `/patterns/layout`, 팝업 모음 `/patterns/popups`(새 팝업은 `GROUPS`에 버튼 + 렌더 한 줄, `?open=<키>`), 개발 컨벤션 `/patterns/conventions`(레이아웃 없음)
- 컨벤션 페이지: 확정 결정이 바뀌면 status.md를 먼저 고치고 `ConventionsPage.tsx` `CONVENTIONS`도 같이. 파일을 추가 · 이동하면 `conventionsTree.ts`도. 화면 전용 부품 목록은 `conventionsLocal.ts`
- 화면 목록 앱(`apps/screen-list/src/screens.ts`): 화면을 만들거나 고치면 한 줄 추가 · 갱신(상태 · 화면ID · 경로 · 최종업데이트일). 줄 key는 `시스템 | 화면ID | 화면명`. 커밋은 화면 개발과 나눈다(`chore(screen-list)`)

### Storybook

- 그룹: Introduction → Foundation → Components(단일 UI, 이름순) → Composites(Search · Result · Form · Feedback) → Layout → Patterns. 혼자 쓰면 Components, 여러 컴포넌트를 묶은 업무 부품이면 Composites, 화면 틀이면 Layout
- 단일 컴포넌트는 스토리 `title: 'Components/<이름>'` + MDX `<Meta of={Stories} name="Guide" />`, 묶음은 `Components/<그룹>/<컴포넌트>` + `<Meta title="…/Guide" />`. 정렬은 `.storybook/preview.tsx` storySort
- 코드 복사는 `.storybook/sourceTransform.ts`(배치용 div 제거 · prettier). 임의 작업 표시는 `parameters.tempWork` → 캔버스 배지
- 이미지(로고 등)는 앱 자산을 Storybook이 주소로 읽음 — 디자인 시스템에 두지 않음

## 열린 질문

- [Q12] JSP 프로젝트의 실제 정적 폴더 경로 · 셸 JSP 위치 · 서버 forward 설정 (문서는 `webapp/static/<앱>/` · Spring 컨트롤러 예시 가정)
- [Q47] IBSheet8 본체 · 라이선스(`ibleaders.js`, 도메인별) 파일 필요 — 업체(IB Leaders)에서 받아야 함. 캘린더 어댑터는 실제 IBSheet로 미확인(달력 위치 좌표 기준, 최대 기간 초과 안내 방식). 라이선스 파일 커밋 여부는 사내 정책
- [Q74] 공통코드 API 스펙: 주소, 응답 형식(code · name 필드명, 정렬 · 사용 여부), 그룹 ID, 다국어 여부. 받으면 `fetchCodes`만 바꾸면 됨
