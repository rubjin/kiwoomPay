# 프로젝트 · 개발 환경

> 범위: 워크스페이스 · Storybook 설정 · 앱 뼈대 · JSP · IBSheet 설치 · 폴더 구조 · 개발 전용 페이지(화면 목록 · 팝업 모음 · 컨벤션) · 공통코드 · 공통화. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### 워크스페이스 · 빌드

- pnpm 워크스페이스: `packages/design-system`(`@kiwoompay/design-system`) · `apps/kwp2-center-admin-fe` · `apps/screen-list`. React 19(디자인 시스템 peer `^18.3.1 || ^19.0.0`), TypeScript 5.9, Vite 7, ESLint 9, Stylelint 16, Storybook 10
- 앱 ESLint(`apps/kwp2-center-admin-fe/eslint.config.js`)는 디자인 시스템과 같은 규칙 + **인라인 `style` 경고**(`react/forbid-dom-props` · `forbid-component-props`). 허용 예외(사유 주석): IBSheet 그리드 크기(IbsheetSamplePage) · P03 조회 결과 높이 고정 · 권한관리 특수권한 3단 칸 폭 · 거래내역 검색 체크박스 오른쪽 끝 · 컨벤션 페이지(개발 전용)
- 라이브러리 산출물: ES 모듈 + CSS 1개(`kiwoompay-ui.css`), React는 peer. 폰트는 `pretendard` dynamic-subset woff2를 `dist/fonts`로 복사해 `<link>`로 로드
- SCSS: 컴포넌트는 `@use 'tokens' as t;` · `@use 'mixins' as m;`(Vite `loadPaths`). 반응형 mixin은 데스크톱 기준 `max-width`
- 앱 개발 서버는 디자인 시스템 src를 바로 읽음(`vite.source.ts` `designSystemSource()`, HMR) — 운영 빌드는 `dist`. 앱 tsc · 에디터는 `dist/types`를 보므로 루트 `pnpm dev`가 디자인 시스템 타입을 watch로 다시 만든다(`dev` = tsconfig.build --watch). dev를 안 켰을 때는 디자인 시스템 `pnpm build`. 타입 빌드에 declarationMap — 앱에서 Ctrl+클릭(정의로 이동)하면 dist가 아니라 src 원본으로 간다. 개발 서버 폰트는 미들웨어가 `pretendard` 패키지에서 직접 줌
- `pnpm dev`: 디자인 시스템 타입 watch + 내부관리자(5173) + 화면 목록(5180, 브라우저 자동 열기). Storybook은 `pnpm storybook`. Storybook 6006(deps 캐시가 깨지면 `node_modules/.cache/storybook` 삭제 후 재시작, Windows는 드라이브 문자 대문자 경로 `C:\…`에서 실행)

### JSP 연동 (SPA, `docs/jsp-integration.md`)

- 앱마다 셸 JSP 1개 + React Router. 서버는 `/api` · `/static` 외 GET을 셸로 forward. 컨텍스트 패스 · API 주소는 셸의 `data-basename` · `data-api-base`(`app/config.ts`)
- 빌드 `base: './'`, 산출물 `app.js` · `app.css`(해시 없음 + `?v=`) · `chunks/<이름>-<해시>.js`. 시스템 키컬러는 html `data-system`

### IBSheet8

- 본체 · 라이선스는 `vendor/ibsheet/`(git 제외, `vendor/README.md`만 커밋) · 운영은 JSP `static/ibsheet/`. 개발 서버 · Storybook은 `packages/design-system/vite.ibsheet.ts` `ibsheet()`가 폴더가 있을 때만 스크립트 주입 · `/ibsheet/*` 응답 — 새 앱은 vite.config에 `ibsheet()`만 추가
- 캘린더 어댑터 `app/providers/ibsheetCalendar.ts`(`IBSheet.showCalendar`, `window.IBSheet`가 없으면 null → 자체 DatePicker)
- 페이지 결과 표는 `@kiwoompay/design-system/ibsheet` `IbsheetGrid`(IBSheet가 없으면 같은 props로 GridPlaceholder), 팝업 안 표는 GridPlaceholder
- KWP 테마(`src/styles/ibsheet/ibsheet-theme.scss`): 줄 색 판(IBHoverRowBackground · IBFocusRowBackground)은 표 뒤(z-index -1, SheetMain `isolation: isolate` · 흰 바탕은 SheetMain)에 둔다 — 위에 덮으면 칸 안 필드 · 버튼까지 물듦. 커서 칸 테두리는 IBSheet 기본 위치 그대로(사용자 결정) — 표 바깥으로 잘리는 첫 열 왼쪽 · 마지막 열 오른쪽 조각만 투명(`ibsheetOptions` onFocus가 MainTag에 `data-kp-ib-focus-edge` first · last). 표 묶음(IBSection)의 `contain: paint` · 칸 위치(position) 변경은 IBSheet 위치 계산이 틀어지므로 건드리지 않는다
- 개발 서버 `ibsheet()`: 라이선스 → 본체 → ko → plugins 3개 스크립트 + 기본 테마 `css/default/main.css`(Prefix IB — 테마 CSS가 없으면 달력이 크기 0). 기본 테마는 **cascade layer(ibsheet)** 로 불러옴(`@layer kp-ib-fix, ibsheet`) — 기본 테마의 `.IBMain span{color…}` · `.IBMain *{box-sizing:content-box!important}`가 칸 안 디자인 시스템 컴포넌트를 덮지 않게. 운영 셸 JSP도 같은 방식(jsp-integration 7절). Storybook은 `.storybook/main.ts`가 `ibsheetInstalled` · `ibsheetHeadHtml()` 사용(tsconfig `allowImportingTsExtensions`)
- 달력: 단일은 날짜를 누르면 바로 반영 · 닫힘. 기간은 **드래그로 고르고 [선택]**, 미리 선택(Date)은 하지 않고 돌려받은 날짜 중 가장 이른 날 ~ 가장 늦은 날
- 연결 도우미 `packages/design-system/src/ibsheet/`(`@kiwoompay/design-system/ibsheet`, 빌드 `dist/ibsheet.js`): `IbsheetGrid` · `ibsheetOptions`(공통 옵션: 위 건수 줄 숨김 `InfoRowConfig.Visible 0` · 머리 전체선택 · 줄무늬 없음 · `HoverScope 1` · `NoDataMessage 0` — 빈 상태는 ResultPanel StatusView, `checkedRowClass` · `Events`) · `ibsheetCells`(`ibBadge` · `ibButton` · `IB_DATE_BUTTON_WIDTH` 36 — 32면 칸 오른쪽 선 1 때문에 아이콘이 잘림). 줄 48 · 머리 40(페이지 표 — 확정 결정 "표 높이")은 옵션으로만(CSS로 못 바꿈)
- `IbsheetGrid`: render가 글자면 글자, React 요소면 `renderToStaticMarkup` HTML을 Html 칸에(`.kpIbHtml`), 칸 클릭 → 그 요소의 onClick 대신 부름. 열 이름은 `c_<key>`(IBSheet 예약어 `id` 충돌). **열 구성(키 · 순서)이 바뀌면 표를 다시 만든다**(표시항목설정). 폭: 폭 없는 열이 있으면 폭 있는 열 고정 · 폭 없는 열이 남는 폭(RelWidth 1 · 최소 100), 모두 폭이 있으면 디자인 폭 비율로 늘림(넘치면 가로 스크롤), 체크 열 44, FitWidth는 빈 더미 열이 생겨 안 씀. 높이 = 머리 40(headerHeight) + 줄 48 × n(+ 가로 스크롤바 23 — onRenderFinish에서 `.IBHScrollMid`로 판단). 행이 없으면 머리 43 + 상태 안내 220 + 스크롤바, ResultPanel이 `data-kp-ib-empty` 표 위에 StatusView를 겹침. 머리 일부 선택(–)은 `headerCheckEvents`가 MainTag `data-kp-ib-check`(none · partial · all)
- `IbsheetGrid` 추가 옵션(2026-11-19): `isRowSelectable`(체크 칸 `__checkCanEdit 0` → IBSheet 읽기 전용 체크박스 모양(회색, 고를 수 없음 · 머리 전체선택도 건너뜀), `kpIbNoCheck`는 커서만) · `filterable`(머리 깔때기 → `IbsheetFilterPanel`, MultiSelect 패널 모양, 받은 rows 안에서 거름, 켜짐은 `kpIbHeadFilterOn`) · `headerHeight`(두 줄 머리 56, 빈 표 안내 위치는 `data-kp-ib-head`) · 열 `edit`(`IbsheetColumn` — text · date, `canEdit(row)`, 편집 칸은 `kpIbEditable`: 평소 글자 · 달력 아이콘은 마우스 올린 줄만, 머리 이름 옆 연필) · `onCellEdit` · `sortable`(머리 정렬 아이콘 `sort-asc` · `sort-desc` 16, 오름 → 내림 → 정렬 안 함, 받은 rows 안에서 정렬 · IBSheet 머리 클릭 정렬은 끔, 정렬 안 함은 sort-asc를 회색으로 — TODO(시안)). 머리 아이콘 묶음은 필터 → 4 → 정렬(맨 오른쪽), 칸 끝에서 20(`margin-right` 8 — 기본 테마 content-box라 padding은 안 먹음). 열 폭은 머리(이름 + 연필 + 아이콘)가 다 보이는 폭보다 좁으면 넓힌다(`headerMinWidth`, canvas로 글자 폭 측정). 머리 hover 말풍선(`IBHintHeaderMain`)은 body 아래 별도 SheetMain에 붙어 표의 글자 크기 범위를 벗어나므로 띄우지 않는다. 머리는 `{ Value, Type: 'Html', Class }` 객체면 HTML이 그려진다(문자열 머리는 `\n`만 줄바꿈, `<br>`은 글자로 보임 — 측정). 머리 아이콘 클릭은 표 el에 capture로 받아 IBSheet 정렬보다 먼저 처리. Date 편집 후 값은 밀리초 숫자로 온다(`toDateText`)
- 글자: 칸 · 머리 14(확정 결정 "데이터 표 글자"), `IbsheetGrid textSize="sm"`이면 13(`data-kp-ib-size` — 정산 원장). 칸 안 Badge 13(Badge.module.scss가 `.kpIbHtml` · `[data-kp-table]` 안 sm을 13으로) · 버튼 12 · 편집 상자 `IBEditCellInput` · 입력 모양 칸 `kpIbInput` 12. 칸 안 컴포넌트의 안쪽 글자 요소는 테마 맨 위 `:where(.IBMain .kpIbHtml) :is(span…)` 규칙으로 글자 크기 · 굵기 · 색을 물려받게 함(표 전체 14 규칙이 직접 걸리면 Badge_label이 14로 커졌음)
- 테마 메모: 색은 파일 맨 위 `$ib-color-*` 변수. 기본 테마가 `.IBMain *`에 content-box !important라 칸 안 요소 높이는 테두리를 빼서 계산. 편집 칸 테두리(IBEditCellBorder)는 커서 칸과 같은 색 · 같은 안쪽 이동. 표 양 끝 세로선 · 아래 두 겹 선(IBMainTable · IBSpaceRow 배경) · 목록 그림자 제거. 머리 체크박스는 줄(u.IBBool*)과 다른 div.IBCheck0/1/2Left. `:has` 안 `:has`는 CSS가 허용하지 않음(기간 시작 · 끝 날짜는 `> :not(.IBPickSel)`로). puppeteer 캡처가 화면 크기를 바꾸면 IBSheet가 목록을 닫음 → captureBeyondViewport false
- 남은 것(임의 작업): 드롭다운 · 달력 칸 아이콘은 편집 칸에만, 열린 셀렉트 둘레 칸 포커스 테두리(Primary 2)는 그대로, 필터 · 툴바 등 다른 IBSheet UI는 테두리 색만

### 앱 구조 (내부관리자)

- `src/features/<1depth>/`: 폴더 = 화면(2depth), 파일 = 1depth 공용(`<1depth>.routes.tsx` · `<이름>.api.ts` · `<이름>.types.ts` · `<1depth>.options.ts`). 기능 폴더끼리 import 금지(예외: 개발 전용 팝업 모음, `src/mocks`는 기능 타입 · 초기값 import 가능). 공통 → 기능은 `router/index.tsx`만
- 공통 폴더: app · router · layouts · features · api(`<이름>.api.ts` · `.types.ts`) · components · constants · hooks · store · utils · assets. 빈 폴더는 두지 않음 — 예외: 아직 화면이 없는 2depth 자리(IA 메뉴)만 `.gitkeep`, 파일이 생기면 `.gitkeep`을 지운다(컨벤션 페이지와 같음)
- 화면 안: 검색 항목 `components/searchFields.ts`, 초기값 `components/initialParams.ts`(`createInitialParams()` — 화면 진입 때 계산), 한 화면의 UI 목록은 화면 파일
- 선택지: 서버 공통코드 `useCodeOptions(group, { withAll })`(받기 전 임시값 `constants/codes.ts` `CODE_FALLBACK`, `store/code.ts` 그룹별 캐시, `codeLabel`), 고정 선택지만 `constants/options`. 새 그룹은 `CODE_FALLBACK`에 추가
- 예시 데이터: `src/mocks/<1depth>/<이름>.mock.ts`(같은 이름 api.ts가 씀, src/api 공용은 `mocks/common/`), 도구 `mocks/utils.ts`(`wait` · `paginate`). api 파일에 데이터를 두지 않음 — `docs/screen-from-spec.md` 4절
- 공용 도구: `utils/format.ts`(`formatNumber` · `formatWon` · `formatCount` · `orDash`), `utils/period`(퀵 기간), 세로 묶음은 디자인 시스템 `Stack`, 가로는 `ControlGroup`(`grow`는 Field 본문 같은 세로 배치 안에서도 남는 폭을 채움 — width 100%)
- 탭 제목: `constants/screens.ts`(경로 ↔ 화면명) — 화면을 만들면 라우트와 같은 경로로 한 줄 추가
- 로그인: `RequireAuth`, 로그인 화면은 레이아웃 밖

### 개발 전용 페이지 (운영 빌드 제외 — `import.meta.env.DEV`)

- 패턴 페이지 `/patterns/*`, 기본 레이아웃 `/patterns/layout`, 팝업 모음 `/patterns/popups`(새 팝업은 `GROUPS`에 버튼 + 렌더 한 줄, `?open=<키>`), 개발 컨벤션 `/patterns/conventions`(레이아웃 없음)
- 컨벤션 페이지: 확정 결정이 바뀌면 status.md를 먼저 고치고 `ConventionsPage.tsx` `CONVENTIONS`도 같이. 파일을 추가 · 이동하면 `conventionsTree.ts`도. 화면 전용 부품 목록은 `conventionsLocal.ts`
- IBSheet 샘플 `/patterns/ibsheet`(`features/patterns/IbsheetSamplePage`, 임의 작업): 셀 종류(링크 · Badge · 금액 · 셀렉트 · 달력 · 입력 · 버튼) · 단일 / 기간 달력 · Total · Pagination(페이지마다 `loadSearchData`) 확인용 — 테마를 고치면 여기서 회귀 확인
- 화면 목록 앱(`apps/screen-list/src/screens.ts`): 표는 `GridPlaceholder maxHeight="max(320px, calc(100vh - 420px))"`(420은 위 영역 · Total 줄 어림값). 화면을 만들거나 고치면 한 줄 추가 · 갱신(상태 · 화면ID · 경로 · 최종업데이트일). 줄 key는 `시스템 | 화면ID | 화면명`. 커밋은 화면 개발과 나눈다(`chore(screen-list)`)

### Storybook

- 그룹: Introduction → Foundation → Components(단일 UI, 이름순) → Composites(Search · Result · Form · Feedback) → Layout → Patterns. 혼자 쓰면 Components, 여러 컴포넌트를 묶은 업무 부품이면 Composites, 화면 틀이면 Layout
- 단일 컴포넌트는 스토리 `title: 'Components/<이름>'` + MDX `<Meta of={Stories} name="Guide" />`, 묶음은 `Components/<그룹>/<컴포넌트>` + `<Meta title="…/Guide" />`. 정렬은 `.storybook/preview.tsx` storySort
- 코드 복사는 `.storybook/sourceTransform.ts`(배치용 div 제거 · prettier). 임의 작업 표시는 `parameters.tempWork` → 캔버스 배지
- 이미지(로고 등)는 디자인 시스템에 두지 않고 내부관리자 앱 이미지를 import(`src/stories/systemAssets.ts` → `apps/kwp2-center-admin-fe/src/assets/`). staticDirs 주소 방식은 쓰지 않음(개발 서버에서 404)

## 열린 질문

- [Q12] JSP 프로젝트의 실제 정적 폴더 경로 · 셸 JSP 위치 · 서버 forward 설정 (문서는 `webapp/static/<앱>/` · Spring 컨트롤러 예시 가정)
- [Q47] IBSheet 남은 확인: 운영 도메인 라이선스(지금은 localhost만 확인), 기간 달력의 최대 기간 초과 안내 방식, 기간 달력을 열 때 현재 기간 표시
- [Q81] 개발자 협의 대기: ① API 값 전달 — 조회도 POST + BODY로 통일할지(화면 코드는 그대로, `*.api.ts`만 바뀜) ② Swagger 주소(받으면 `TODO(API)` 함수 · `*.types.ts` 연결) ③ 브라우저 URL — PATH를 IA 메뉴 단계대로 만들지, 상세 번호는 PATH 파라미터인지 쿼리스트링인지, 검색 조건 · 페이지를 쿼리스트링에 남길지 ④ 서버 Controller 화면ID와 프론트 `constants/menu.ts` 중 기준
- [Q74] 공통코드 API 스펙: 주소, 응답 형식(code · name 필드명, 정렬 · 사용 여부), 그룹 ID, 다국어 여부. 받으면 `fetchCodes`만 바꾸면 됨
