# 프로젝트 · 개발 환경

> 범위: 워크스페이스 · Storybook 설정 · 앱 뼈대 · JSP · IBSheet 설치 · 폴더 구조 · 개발 전용 페이지(화면 목록 · 팝업 모음 · 컨벤션) · 공통화.
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## 열린 질문

- [Q12] JSP 프로젝트의 실제 정적 폴더 경로 · 셸 JSP 위치 · 서버 forward 설정 (docs/jsp-integration.md는 `webapp/static/<앱>/` · Spring 컨트롤러 예시 가정. 컨텍스트 패스는 셸의 `data-basename`으로 받으므로 빌드와 무관)
- [Q47] IBSheet8 본체 · 라이선스(`ibleaders.js`, 도메인별) 파일 필요 — 상용이라 npm · 공개 다운로드 없음, 업체(IB Leaders)에서 받아야 함. 받으면 `apps/<앱>/public/ibsheet/`(개발) · JSP `static/ibsheet/`(운영)에 두고 index.html · 셸 JSP 주석 해제. 캘린더 어댑터는 매뉴얼 API로 구현 완료(실제 IBSheet로는 미확인: 달력 위치 X · Y가 문서 좌표 기준인지, 최대 기간 초과 안내 방식). 라이선스 파일 커밋 여부는 사내 정책

## 작업 기록

### Phase 0 — 2026-11-10
- 만든 것: Figma 토큰 3종 분석, 확정 결정 표 작성
- 한 가정: 부족한 토큰은 `tokens/custom/*.json`에서 퍼블리셔가 작성, Typography 역할 매핑은 description 기준
- 다음 할 일: Phase 1 — 워크스페이스, build-tokens(figma + custom 병합), base 스타일·Pretendard self-host, Storybook, JSP 연동

### Phase 1 — 2026-11-10
- 만든 것
  - pnpm 워크스페이스(루트 `package.json`, `pnpm-workspace.yaml`), `packages/design-system` 패키지(`@kiwoompay/design-system`)
  - `scripts/build-tokens.mjs`: Figma JSON 3종 + `tokens/custom/*.json` → `_generated.scss`(SCSS 변수 + `--kp-*` CSS 변수 맵). 토큰 245개(Figma 188 / 코드 57). `--check` 옵션, 참조 끊김·이름 충돌·순환 참조 에러 처리
  - `tokens/custom/`: font, typography-roles, semantic-color, dimension(focus ring), breakpoint
  - `src/styles`: `tokens/_index.scss`, mixins(respond-to, ellipsis·line-clamp, focus-ring, typography), base(root, reset, global)
  - ESLint 9(flat) · Prettier · Stylelint 16(하드코딩 값 경고, 요소·ID 선택자 금지, 중첩 2단계), Storybook 10(react-vite, addon-docs) 설정, Vite 라이브러리 빌드(ES + CSS 1개 + 타입 + Pretendard 복사)
  - 문서: `docs/token-workflow.md`, `docs/jsp-integration.md`, `README.md`, Storybook `Introduction.mdx`
- 검증: `tokens:check`, `typecheck`, `lint`(ESLint·Stylelint), `pnpm build` 통과. 에러 케이스·Stylelint 규칙 동작 확인. Storybook 빌드 통과(이 PC는 VC++ 재배포 패키지 설치 필요했음)
- 한 가정
  - 버전: React 18.3, TypeScript 5.9, Vite 7, ESLint 9, Stylelint 16, pnpm 10 (최신 메이저보다 낮추어 호환성 우선)
  - 라이브러리 산출물은 ES 모듈 + CSS 1개(`kiwoompay-ui.css`)이고 React는 peer. JSP에서는 앱 번들(`app.js`·`app.css`, 해시 없음 + `?v=`)을 로드
  - 폰트는 `pretendard` 패키지의 dynamic-subset woff2를 `dist/fonts`로 복사해 `<link>`로 로드 (CSS 번들에 포함하지 않음)
  - 반응형 mixin은 데스크톱 기준 `max-width` 방식, 임시 breakpoint 값 사용
  - 컴포넌트 import는 `@use 'tokens' as t;` / `@use 'mixins' as m;` (Vite `loadPaths`)
- 다음 할 일: Phase 2(Button, Icon, Field, Selection) 시안 확보

### Storybook 사이드바 구조 정리 — 2026-11-11
- 변경: 컴포넌트가 하나인 그룹은 한 단계 줄임 — 가이드 MDX를 스토리에 붙이고(`<Meta of={…} name="Guide" />`) 스토리 title을 `Components/<이름>`으로 변경(Badge · DatePicker · Icon · LNB · Modal · Page Layout · Pagination · Search · Tab · Tooltip · Work Tab). 여러 컴포넌트를 묶는 Button · Field · Selection은 그룹 폴더 유지(`Components/<그룹>/Guide` + 컴포넌트별 스토리)
- `.storybook/preview.ts`에 `storySort` 추가: Introduction → Foundation → Components, 각 컴포넌트 안에서 Guide 먼저
- 규칙(새 컴포넌트): 단일 컴포넌트는 스토리 `title: 'Components/<이름>'` + MDX `<Meta of={Stories} name="Guide" />`. 묶음은 `Components/<그룹>/<컴포넌트>` + MDX `<Meta title="Components/<그룹>/Guide" />`
- 검증: typecheck · lint · Storybook 빌드 통과, 가이드 문서 16개 렌더링(에러 없음) 확인. Storybook 주소(id)가 바뀌어 기존 북마크는 다시 찾아야 함(예: `components-modal-guide--docs` → `components-modal--guide`)

### Storybook Controls 정리 — 2026-11-11
- 문제: 고정 예시 스토리(`render: () =>`, 104개)는 args를 쓰지 않는데 Controls 패널이 보여 바꿔도 변화가 없었음. Playground에서도 `defaultValue`·`defaultOpen` 같은 초기값 컨트롤은 처음 그릴 때만 반영됨
- 변경: 고정 예시 스토리에 `parameters: { controls: { disable: true } }` → Controls는 Playground 등 args를 쓰는 스토리에서만 보임. `.storybook/preview.ts` → `preview.tsx`, 단순 값(글자·숫자·참거짓) args가 바뀌면 스토리를 다시 그리는 데코레이터 추가(`Fragment` key, DOM 변화 없음)
- 규칙(새 스토리): 고정 예시는 `render: () =>` + `controls: { disable: true }`, 조작용은 `args`/`render: (args) =>`
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저에서 Controls 조작 테스트 7개 통과(Tab variant·defaultValue, Button size, 고정 예시는 컨트롤 없음). 기존 테스트 재통과(DatePicker 32 · LNB 23 · Tab 19 · Pagination 20 · 공통 24, Modal · Search는 이후 확정된 폭 620·800 · 라벨 간격 4로 테스트 기대값만 옛 값)

### 앱 뼈대: apps/internal-admin — 2026-11-11
- 만든 것: `directory-structure.md` 기준 내부관리자 앱 폴더 구조. `app/`(main · App) · `router/`(index · RequireAuth · lazy(`lazyPage`) · placeholder · `modules/*.routes.tsx` 10개) · `layouts/`(MainLayout = 디자인 시스템 PageLayout, Header 자리, Lnb = 디자인 시스템 Lnb + constants 메뉴) · `pages/<1depth>/<2depth>/` 48개 · `api/<1depth>` · `types/<1depth>` · `components/{common,search,popups}` · `constants/menu.ts`(화면ID ↔ path 단일 출처). 화면이 없는 2depth는 PlaceholderPage로 연결, 예시로 `transaction/integrated/list`(lazy) · `auth/login`(레이아웃 밖) · 404
- 스택: React 18.3(디자인 시스템 peer와 맞춤 → 같은 날 React 19로 올림) · react-router-dom 6 · zustand 5 · axios · Vite 7. antd 미사용. 빌드는 jsp-integration 방식(app.js · app.css, base `/static/internal-admin/`, `JSP_STATIC_DIR`)
- 검증: typecheck · build 통과. dev 서버 브라우저 확인 8개(/ → 대시보드, integrated → list lazy, placeholder, 404, 로그인 레이아웃 밖, 디자인 시스템 CSS · Pretendard, LNB 클릭 SPA 이동)
- 열린 질문: 기존 프로젝트(React 19 · antd 5)에서 코드 이관 방식 · React 버전, store · http 인터셉터 이관

### JSP 연동을 SPA 방식으로 — 2026-11-11
- 변경: `docs/jsp-integration.md`를 "JSP마다 data-page" → "앱마다 셸 JSP 1개 + React Router"로 다시 씀(흐름 · 산출물 · Vite 설정 · 셸 JSP · Spring forward 예시 · 개발 서버)
- 앱: `src/app/config.ts`(셸의 `data-basename` · `data-api-base`) → BrowserRouter basename · axios baseURL. 빌드 `base: './'`(컨텍스트 패스와 무관), lazy chunk는 `chunks/<이름>-<해시>.js`, `scripts/copy-fonts.mjs`로 폰트 복사. LNB 링크 href에 컨텍스트 패스 포함(새 탭 열기), 클릭은 SPA 이동
- 검증: 컨텍스트 `/admin` 셸 + forward를 흉내 낸 서버에서 빌드 결과 확인 — 화면 URL 직접 진입 시 셸 → 라우트 · lazy chunk 로드, 상대 경로 폰트 로드, LNB href `/admin/...` · SPA 이동, 로그인 안 했으면 `/admin/auth/login`

### React 19 업그레이드 — 2026-11-11
- 변경: 디자인 시스템 peer `^18.3.1 || ^19.0.0`, 개발용 React · `@types/react` 19, `apps/internal-admin` React 19. 타입 수정 1곳(SearchArea submit 핸들러 — 19 타입의 `SubmitEvent`). `forwardRef`는 19에서도 동작해 그대로 둠
- 검증: typecheck(디자인 시스템 · 앱) · lint · build · Storybook 빌드 통과. 전체 스토리 141개 계산된 스타일이 업그레이드 전과 동일(회전 Spinner 2개만 애니메이션 타이밍 차이). 브라우저 테스트 재통과: MultiSelect 27 · Compact Nav 15 · Unread 4 · CPID 12 · DatePicker 32 · LNB 23 · Tab 19 · Pagination 20 · 공통 24 · 앱 8. 실패는 업그레이드 전과 같은 것만(Badge 글자 폭 2px Q30, Modal · Search 테스트의 옛 기대값, favicon)

### IBSheet8 설치 · 캘린더 어댑터 구현 — 2026-11-11
- 설치(npm, MIT): `apps/internal-admin`에 `@ibsheet/react` 1.1.2(공식 React 래퍼, React 18 · 19 지원) · `@ibsheet/interface` 1.0.4(타입). IBSheet8 본체(`ibsheet.js`)와 라이선스(`ibleaders.js`)는 상용이라 받을 수 없음 → 업체에서 받아야 함(Q47)
- 캘린더 어댑터 `app/providers/ibsheetCalendar.ts`: IBSheet8 매뉴얼(공개 문서 static/show-calendar · appx/position) 기준 `IBSheet.showCalendar(calOption, position, callback)` 연결 — Format yyyy-MM-dd, Range(기간) 1, min · max → OnCanEditDate, 필드 아래 8 위치, 콜백 ms → YYYY-MM-DD · "시작~종료" → {start, end}, 최대 기간 초과 무시, 선택 없이 닫힘 → onClose, 필드에서 닫기 → Close(). `window.IBSheet`가 없으면 null(기본 DatePicker)
- 로드 위치: `index.html`(개발, 주석) · `docs/jsp-integration.md` 7절(셸 JSP, app.js보다 먼저)
- 검증: typecheck 통과. 매뉴얼 형식의 가짜 `IBSheet.showCalendar`로 어댑터 변환 테스트 10개 통과(실제 IBSheet로는 미확인)

### 화면 목록 앱 · 임의 작업 표시 — 2026-11-12
- 화면 목록 (임의 작업): 관리자 앱 밖의 별도 앱 `apps/screen-list` (`pnpm screens` → http://localhost:5180). 루트 `pnpm dev`는 내부관리자 앱(5173)과 화면 목록을 함께 띄우고 화면 목록을 브라우저에 자동으로 연다(2026-11-13). 시스템 탭(내부관리자 · 가맹점관리자 · 영업대행사, 탭에 본수) · 작업 현황(총 본수 · 작업중 · 완료 · 삭제 · 보류) · 상태 필터 · 목록(상태 · 1/2/3depth · 화면ID · 화면명 · 경로 링크(새 탭) · 화면타입 · 기획반영버전 · 최종업데이트일). 데이터는 `apps/screen-list/src/screens.ts` — 화면을 만들거나 고치면 한 줄 추가 · 갱신. 시스템별 주소는 `VITE_URL_INTERNAL` · `VITE_URL_MERCHANT` · `VITE_URL_AGENCY`(기본 5173 · 5174 · 5175)
- 규칙: 시안 · 정책 없이 임시로 만든 부분은 "(임의 작업)"으로 표시. Storybook은 스토리 · meta `parameters.tempWork` → 캔버스 오른쪽 위 "(임의 작업: …)" 배지(`.storybook/preview.tsx` tempWorkBadge). 표시한 스토리: Badge · TextButton · Column Picker · CPID List Item · DatePicker · Favorite Menu Picker · Tooltip · LNB · Checkbox · Radio · Tab · Work Tab · Address Search · P01(Initial · Result · Empty · States)
- 상태별 GUI(29426:102820) 확인: 조회 실패 아이콘 · 문구를 시안대로 수정. 확인 필요 — 조회 중 띄어쓰기(시안 "조회 중 입니다"), 검색 조건 접힘 높이(시안 72 ↔ 30056:104296은 74)
- 참고: 배지 표시 스토리는 캔버스에 감싸는 div가 하나 생겨 `#storybook-root > div`를 재던 기존 테스트 일부(DatePicker 패널 · Tab 폭)가 감싸는 div를 잼 — 실제 크기는 같음(DatePicker 336 × 344 확인)

### 개발 환경: 앱이 디자인 시스템 src를 바로 읽기 — 2026-11-12
- `packages/design-system/vite.source.ts`(`designSystemSource()`): 앱 개발 서버(`vite`)에서만 `@kiwoompay/design-system` → `src/index.ts`, `style.css` → `src/styles/index.scss` 별칭 + 디자인 시스템과 같은 SCSS `loadPaths` · CSS Modules 이름 규칙. 운영 빌드(`vite build`)는 그대로 `dist`
- 적용: `apps/internal-admin` · `apps/screen-list` vite.config (`mergeConfig`), 두 앱에 `sass` devDependency 추가
- 효과: 컴포넌트 수정 → 앱 화면에 즉시 반영(HMR, `pnpm build` 불필요). 확인: FormSectionHeader 설명을 주석 처리하면 새로고침 없이 사라지고 되돌리면 다시 보임. 운영 빌드 app.js에 src 경로 없음
- 참고: 앱 타입 검사(tsc)는 여전히 `dist/types`를 본다 — 디자인 시스템에 새 export를 추가하면 앱 typecheck 전에 `pnpm build` 필요

### 앱 검색 조건 파일 구조 정리 — 2026-11-12
- 규칙(사용자 확인): 관리자 화면은 선택지를 대부분 여러 화면이 같이 쓰므로
  - 선택지 → 앱 공통 `apps/internal-admin/src/constants/options/`(`common` 전체 · 시각, `transaction`, `settlement`, `merchant`, `index`에서 모두 export). `Option<V>` 타입
  - 화면마다 다른 검색 항목 · 순서 · 표시 형식 → 화면 `components/searchFields.ts`(`SEARCH_FIELDS`)
  - 화면마다 다른 초기 검색값 → 화면 `components/initialParams.ts`(`createInitialParams()` — 오늘 기준 기간이 있어 함수로, 화면에 들어올 때 만듦. 전에는 앱 로드 시 한 번 계산돼 자정을 넘기면 어제 기준으로 남았음)
  - 한 화면의 UI 목록(CPID 탭 · 정산 원장 Action 등 선택지가 아닌 것)은 화면 파일에 둔다
- 적용: 통합 거래내역(선택지 이동, `SOURCES` → `TX_SOURCES`, 취소 구분 `CANCEL_TYPES` 포함), 가맹점 정산 실행/처리(정산주기 `SETTLEMENT_CYCLES`, 직접 만든 적용 조건 칩 함수 → `SEARCH_FIELDS` + `toAppliedFilters`, 칩 순서 · 문구 그대로), 가맹점 기본/계약 정보(`components/options.ts` 삭제 → 공통 constants, CPID 탭은 화면 파일로). P01 가이드에 파일 배치 · `createInitialParams` 반영
- 검증: 앱 build(tsc 포함), 브라우저 확인(거래내역 초기 기간 최근 1주일 · 선택지 · 칩, 정산 칩 정산주기 전체 · 지급예정일 숨김 · CPID 칩, 가맹점 신규/수정 렌더, 콘솔 에러 없음), 기존 취소 흐름 테스트 13개 재통과

### 공통코드 선택지 (useCodeOptions) — 2026-11-12
- 셀렉트 · 라디오 선택지를 서버 공통코드에서 받는 구조(사용자 선택). API 스펙 미정 → 지금은 임시값을 돌려줌
  - `api/common/code.ts` `fetchCodes(group)` — TODO(API) 주소 · 응답 형식 · 서버 그룹 ID
  - `store/code.ts`(zustand): 그룹별 캐시, 그룹당 한 번만 요청, 실패 시 임시값 유지 후 다음에 재요청. `getCodeOptions(group)`(React 밖)
  - `hooks/useCodeOptions(group, { withAll })`: 받기 전에는 임시값을 바로 반환 → 화면이 비지 않음
  - `utils/code.ts` `codeLabel(group, value)`: searchFields 칩 · 요약 문구, 'all' → 전체
  - 임시값 `constants/codes.ts` `CODE_FALLBACK`(그룹 10개: TX_TYPE · PAY_METHOD · TX_STATUS · TX_SOURCE · CANCEL_TYPE · SETTLEMENT_CYCLE · BIZ_TYPE · MERCHANT_STATUS · COUNTRY · CONTACT_ROLE, "전체" 제외)
  - `constants/options`는 고정 선택지만(전체 · 시각 · 조회기준일)
- 적용: 통합 거래내역(검색 셀렉트 · 거래원천 · 취소 구분 · 칩), 정산 실행(정산주기 MultiSelect · 칩), 가맹점 기본정보(국가 · 사업자구분 · 상태 · 담당자 업무구분 · 제목 옆 사업자구분 이름). P01 가이드 반영
- 검증: 앱 build(tsc 포함), 브라우저 확인(결제수단 선택지 전체 + 4개, 라디오 선택지, 칩, 정산 칩, 가맹점 신규/수정 · 사업자구분 이름, 콘솔 에러 없음), 취소 흐름 테스트 13개 재통과
- [Q40] 공통코드 API 스펙 필요: 주소, 응답 형식(code · name 필드명, 정렬 · 사용 여부), 그룹 ID, 다국어 여부. 받으면 `fetchCodes`만 바꾸면 됨

### Storybook 사이드바 구분 — 2026-11-12
- 그룹(사용자 확인): Introduction → **Foundation**(토큰 가이드) → **Components**(단일 UI 15) → **Composites**(컴포넌트 조합 10: Search · Search Result · Record Form · Lookup Field · Lookup Search · Address Search · Column Picker · Favorite Menu Picker · Action Bar · Dialog) → **Layout**(화면 틀 6: Page Layout · Header · Footer · LNB · Compact Navigation · Work Tab) → **Patterns**(P01 · P02). 각 항목 안에서 Guide 먼저(`.storybook/preview.tsx` storySort)
- 스토리 · 가이드 title만 변경(21개 파일). 코드 폴더 · import 경로는 그대로(코드 폴더는 `components/` · `patterns/` 두 갈래라 Storybook 그룹과 1:1 아님). Introduction에 그룹 설명 추가
- 새 컴포넌트를 만들 때 그룹 기준: 혼자 쓰면 Components, 여러 컴포넌트를 묶은 업무 부품이면 Composites, 화면 틀이면 Layout
- Icon 가이드는 컴포넌트 스토리와 함께 있어 Components에 둠(Foundation은 Typography · Spacing)
- 역할별 섹션 추가(사용자 확인, 같은 날):
  - Components: 섹션 없이 컴포넌트를 바로 나열(사용자 요청으로 Action · Input · Navigation · Display · Feedback 섹션 제거, 같은 날). 이름순(Button · Field · Selection 묶음 폴더는 유지)
  - Composites: **Search**(Search Area · Search Panel · Lookup Field · Lookup Search · Address Search) · **Result**(Result Parts · Status View(테이블 결과 상태) · Action Bar · Column Picker) · **Form**(Record Form) · **Feedback**(Dialog · Favorite Menu Picker)
  - Search Result 가이드를 `docs/SearchPanel.mdx`(Search) · `docs/ResultParts.mdx`(Result)로 나눔(내용 이동만). storySort에 섹션 순서 · 섹션 안 대표 항목 순서 고정

### Storybook 코드 복사 정리 · 케이스 설명 — 2026-11-12
- 코드 복사(Show code): `.storybook/sourceTransform.ts`(`docs.source.transform`) — 고정 예시 스토리는 스토리 객체(parameters 등) 대신 render가 그리는 JSX만, 배치용 감싸기(속성이 style · key뿐인 div, `Case`)는 벗기고 prettier로 정렬. args 스토리는 그대로. prettier(babel 파서)를 Storybook에서만 지연 로드(design-system devDependency)
- 예시 칸 `src/stories/Case.tsx`(`label` · `description` · `width` · `height`, `caseRow`): 칸 위에 케이스 이름 · 설명, 코드 복사에는 `{/* 이름 — 설명 */}` 주석으로 남음. 라이브러리 타입 빌드에서 제외(`tsconfig.build.json`)
- 적용: SelectBox Open(기본 · 불러오는 중 · 항목 없음 나란히), MultiSelect Open(1개 · 여러 개 · 많음 · Small 많음 · 불러오는 중 · 항목 없음 — 줄바꿈 시 패널이 겹치던 문제 해결)
- 규칙(새 스토리): 상태를 나란히 보여 줄 때는 `Case`로 이름 · 설명을 붙인다
- 검증: typecheck · lint 통과, 가이드 37개의 코드 블록 261개에 parameters · 배치용 div 없음, 콘솔 에러 없음

### 레이아웃 패턴 템플릿 페이지 (임의 작업) — 2026-11-13
- 내부관리자 앱 `pages/patterns/`: `P01SearchResultPage`(`/patterns/search-result`, P01 — 검색 조건(조회기간 + 퀵 기간 · 상태 · 검색어) → 적용 조건 → 요약 → 결과(선택 처리 Confirm → 재조회 → Alert) → Total · Pagination, 예시 데이터 27건) · `P02RecordFormPage`(`/patterns/record-form`, P02 — 화면명 + ContextChip · 제목 탭 · 저장, FormSection 안 FormGroup 2개(4쌍 표 · 담당자 추가/선택 삭제), 접힌 카드). 라우트 `router/modules/patterns.routes.tsx`, LNB 메뉴에는 없음
- 화면 목록(`apps/screen-list/src/screens.ts`) 맨 위에 두 페이지 추가(1depth "레이아웃 패턴")
- 검증: 디자인 시스템 build · 앱 typecheck · 화면 목록 typecheck, 브라우저 확인(목록 첫 두 링크, P01 조회 → 10행 · 요약 27, P02 담당자 추가, 페이지 에러 없음)

### 브라우저 탭 제목 = 화면명 — 2026-11-13
- 내부관리자 앱 `constants/screens.ts`(경로 ↔ 화면명, 단일 출처) + `router/useDocumentTitle`(AppRoutes에서 현재 경로로 `document.title` 설정). 페이지 코드는 제목을 정하지 않음 — 경로만 보므로 Work Tab에 숨겨진 화면이 제목을 바꾸지 않음. Work Tab 라벨도 나중에 같은 목록을 쓴다
- 규칙: 화면(3depth)을 만들면 `SCREENS`에 라우트와 같은 경로로 한 줄 추가. 없으면 2depth 메뉴 이름(준비 중 화면 · 로그인), 메뉴 밖 경로는 "페이지를 찾을 수 없습니다", 레이아웃 패턴은 `P01` · `P02`
- 한계: 만든 메뉴 아래의 없는 경로(예: `/transaction/integrated/foo`)는 404 화면이지만 제목은 2depth 메뉴 이름
- 검증: typecheck, 브라우저에서 경로 9개 제목 · SPA 이동 시 변경 확인

### 패턴 페이지는 개발 서버에서만 — 2026-11-13
- `router/modules/patterns.routes.tsx`: `import.meta.env.DEV`일 때만 라우트 생성, `constants/screens.ts`의 P01 · P02 줄도 DEV에서만. 운영 빌드(JSP `app.js`)에는 패턴 라우트 · 페이지 chunk가 없음(빌드 결과에서 확인), 운영 서버에서 `/patterns/*`는 404
- 화면 목록 앱(`apps/screen-list`)은 개발 도구 — 관리자 앱 빌드와 무관. 커밋은 화면 개발과 나눈다(`chore(screen-list)` 등)

### 앱 Work Tab · 기본 레이아웃 페이지 — 2026-11-13
- 앱 MainLayout에 Work Tab 연결(누락이었음): `store/workTabs`(zustand: 열린 화면 · 고정 · 닫기 · 남기기) + `layouts/WorkTabBar`(화면 이동 시 Tab 추가 — 이름은 `screenNameOf`, 최대 10개 초과 Alert, Tab 클릭 이동, 닫으면 이웃 Tab으로, 대시보드 고정 Tab). 오른쪽 "열린 화면 N ⌄"(`WorkTab.ActionMenu`) + 활성 Tab •••: 새 업무 탭으로 열기(브라우저 새 탭) · 탭 고정/해제 · 현재 탭 닫기 · 다른 탭 모두 닫기 · 오른쪽 탭 닫기. TODO: Tab을 바꿔도 화면 상태 유지(keep-alive), 처음 Tab · 고정 정책
- PageLayout: "열린 화면" Trigger를 Tab 줄 위쪽(y86)에 맞춤 — 전에는 Work Tab 영역 세로 가운데(y94). Figma 마이페이지 · 로그인 Work_Tab_Bar 기준
- 기본 레이아웃 페이지 `/patterns/layout`(P00, 개발 서버만): Header · LNB · Work Tab · 화면 타이틀까지. 화면 목록 맨 위
- Modal Footer 버튼 lg 48 (즐겨찾기 편집, 사용자 확정)
- 검증: typecheck · lint, 브라우저: Tab 줄 y86 · 40, Trigger 오른쪽 끝 1896 · y86(Figma), 화면 3개 열기 → 5 Tab · "열린 화면 5", Tab 클릭 이동 · 탭 제목, 활성 Tab 닫기 → 이웃, 메뉴 5개 · 다른 탭 모두 닫기 → 대시보드(고정) + 현재, 에러 없음

### 팝업 모음 페이지 (개발 서버 전용, 임의 작업) — 2026-11-13
- `/patterns/popups`(`pages/patterns/PopupsPage`, 탭 제목 "팝업 모음"): 앱의 팝업을 화면별 묶음(PageLayout.Section) + 버튼(ControlGroup)으로 — KWPC1301 즐겨찾기 편집 · KWPC3000 SMS 인증 / 인증 불가 · KWPC0104 다운로드 요청 상세(완료 · 생성중 · 실패) · KWPC04010100 엑셀 다운로드 설정 · 내 검색조건 관리(기본 · 저장조건 없음) · 패턴 P02(거래 상세정보 · 결제 오류 · 민원 처리 · 접수정보 있음) · P03(표준산업 · 사업자번호 · 주소) · P04(다운로드 사유 · 사업자번호 변경 · 결제한도 · 부분취소) — 20개
- 실제 화면이 쓰는 팝업 컴포넌트를 그대로 불러옴(복사 없음) — P03 · P04 페이지 안 팝업과 LNB 메뉴(`lnbItems`)를 export. 선택 · 저장 결과는 안내(Alert)로만. 새 팝업을 만들면 `GROUPS`에 버튼 한 줄 + 렌더 한 줄 추가
- 화면 목록 맨 위 패턴 줄 다음에 "팝업 모음" 줄
- 검증: 앱 tsc · 화면 목록 tsc, 버튼 20개 모두 해당 팝업(폭 400 · 620 · 880 · 1056 · 1280)이 열리고 닫힘, 케이스(저장조건 없음 · 결제 오류 · 접수정보 3줄 · 다운로드 상태별 Footer) 확인, 에러 없음

### 개발 컨벤션 페이지 (개발 서버 전용, 임의 작업) — 2026-11-14
- 내부관리자 앱 `pages/patterns/ConventionsPage`(`/patterns/conventions`, 탭 제목 "개발 컨벤션"): 확정 결정(status · brief · page-patterns-plan)에서 화면 개발 규칙만 모아 그룹별 표(항목 · 규칙 · 예시)로 — 폴더 · 파일 배치, 이름, 스타일 · 간격, 팝업, 화면 흐름, 임의 작업 · 기록, 커밋
- 규칙: 확정 결정이 바뀌면 status.md를 먼저 고치고 `ConventionsPage.tsx`의 `CONVENTIONS`도 같이 고친다
- 이어서(같은 날, 사용자 요청): Header · LNB · Work Tab 없이 단독 화면 — 라우트를 MainLayout 밖으로(`conventionRoutes`, `router/index.tsx`), 페이지가 슬롯 없는 `PageLayout`으로 감쌈. 폴더 구조 트리 4개(저장소 전체 · 디자인 시스템 · 내부관리자 앱 · 화면 폴더 예시, 줄마다 파일 · 폴더 설명) 추가 — 데이터 `pages/patterns/conventionsTree.ts`(폴더를 옮기면 같이 고친다)
- 이어서(같은 날, 사용자 요청): 화면이 길어 Infobox 아래 라인 탭(`Tab`)으로 한 묶음씩 표시 — 폴더 구조(트리 4개) · 폴더 · 파일 배치 · 이름 · 스타일 · 간격 · 팝업 · 화면 흐름 · 임의 작업 · 기록 · 커밋(8탭, 첫 탭 폴더 구조)
- 화면 목록(`apps/screen-list/src/screens.ts`) 맨 위 줄(1depth "컨벤션")
- 검증: 앱 · 화면 목록 typecheck, 개발 서버 모듈 변환 확인

### 공통화 점검 · 화면 전용 부품 목록 — 2026-11-14
- 점검(내부관리자 앱, patterns 제외): 잘 된 것 — 목록 API는 디자인 시스템 `SearchRequest` · `SearchResultPage`, 조회 흐름 `useSearchResult`(4화면) · 찾기 `useLookup` · 처리 `useAction`(8곳), 선택지 `Option` + `useCodeOptions`, 화면 폴더 배치 규칙 일치
- 중복(공통화 필요): API 예시 지연 `wait` 11개 파일, 페이지 자르기 3곳, 금액 · 빈 값 · 건수 표기(`won` · `dash` · `count`) 7개 파일, 원장 상태 색 `STATUS_TONE` 2곳, 전체 선택 체크 로직 2곳(CpidBasicPanel · ContactTable), 세로 묶음 인라인 스타일(flex column + gap) 16곳 — 세로 묶음 컴포넌트 없음(디자인 시스템 Stack 제안)
- 개별 confirm/alert 직접 호출 5곳(다운로드 센터 · 가맹점 기본정보 · 취소 바 · 내 검색조건 · 즐겨찾기) — `useAction` 이관 여부는 기존 열린 결정
- 개발 컨벤션 페이지에 "화면 전용 부품" 탭 추가(`pages/patterns/conventionsLocal.ts`): 이름 · 위치 · 하는 일 · 판단(필요 · 후보 · 유지) · 올린다면. 코드는 아직 고치지 않음

### 공통화 반영 — 2026-11-14
- 디자인 시스템 `Stack`(`components/layout/Stack`): 세로 묶음, `gap` 0 · 4 · 8 · 12 · 16(기본) · 24, `as` div · section · span. 스토리 `Layout/Stack`(Playground · Nested), Spacing 가이드 3-1에 한 줄. 가로는 `ControlGroup`, 세로는 `Stack` — 인라인 flex column 금지
- 앱: `api/mock.ts`(`wait` · `paginate`) — api 11개 파일의 `wait` · 페이지 자르기 3곳 교체 / `utils/format.ts`(`formatNumber` · `formatWon` · `formatCount` · `orDash`) — `won` · `dash` · `count` · `toLocaleString` 직접 사용 전부 교체(패턴 페이지 포함) / `ledgerStatus.ts` `LEDGER_STATUS_TONE`(정산 목록 · 상세 공용) / `components/common/SelectAllCheckbox` + `utils/selection` `toggleKey`(CpidBasicPanel · ContactTable) / 인라인 세로 묶음 16곳 → `Stack`(값 그대로)
- 컨벤션 페이지: 판단 "완료" 추가(필요 6개 → 완료), 규칙 추가(세로 묶음 · 숫자 · 빈 값 표기 · 전체 선택 · api/mock), 폴더 트리 갱신
- 검증: 디자인 시스템 typecheck · lint · build, 앱 typecheck · build, 개발 서버 모듈 반영 확인. 브라우저 픽셀 비교는 하지 않음(Stack은 같은 flex column + gap에 min-width 0만 추가)
- 이어서(같은 날, 사용자 요청): 컨벤션 폴더 구조 트리를 파일 단위 설명으로 — "내부관리자 앱 · 공통 파일"(pages 밖 파일 전부) · "내부관리자 앱 · 화면 파일"(만든 화면 6개 · patterns · error 파일 전부, 화면ID · 패턴 표시)로 교체(기존 앱 트리 · 화면 폴더 예시 대체), 디자인 시스템 트리 components 설명에 ControlGroup · Stack. 파일을 추가 · 이동하면 `conventionsTree.ts`도 같이 고친다

### 앱 폴더 구조: 계층별 → 1depth 기능별 — 2026-11-15
- 결정(사용자): `pages/<1depth>` · `api/<1depth>` · `types/<1depth>` · `router/modules/<1depth>.routes.tsx`를 `src/features/<1depth>/`(`<1depth>.routes.tsx` · `api/` · `types/` · `<2depth>/` 화면) 한 폴더로. `develop` 브랜치에서 작업
- 이동은 `git mv`(이력 유지) · import 경로만 변경, 코드 내용 그대로. `pages/error` → `features/error`, `pages/patterns` → `features/patterns`(patterns.routes 포함)
- 의존 방향: 기능 폴더끼리 import 없음, 공통 → 기능은 `router/index.tsx`(라우트 조립)만. 예외: 개발 전용 팝업 모음(PopupsPage). 공통 `constants/options/transaction.ts`(조회기준일)는 거래내역만 써서 `features/transaction/constants/options.ts`로 이동 — 한 1depth 전용 상수는 `features/<1depth>/constants/`
- 백엔드 영향 없음: 빌드 산출물(app.js · app.css · chunks 이름) · 셸 JSP · 라우트 URL · API 주소 그대로. `jsp-integration.md` · `page-patterns-plan.md` 경로만 수정
- 컨벤션 페이지: 기능 폴더 · 기능 폴더끼리 규칙 추가, 화면 · API · 라우트 · 선택지 규칙 경로 변경, 폴더 트리(공통 파일 · 기능 폴더) 다시 작성
- 검증: 앱 typecheck · build(화면 chunk 이름 그대로), 개발 서버 새 경로 응답 200
- 참고: Windows에서 개발 서버가 폴더를 잡고 있어 폴더째 이동이 실패하는 경우가 있음 → 파일 단위 `git mv`. 옛 `src/pages/` · `src/router/modules/` 빈 폴더가 디스크에 남을 수 있음(git에는 없음)
- 이어서(같은 날, 사용자 요청 "폴더가 복잡하지 않게"): 기능 폴더 안 `api/` · `types/` · `constants/` 폴더 없앰 → `<이름>.api.ts` · `<이름>.types.ts` · `<1depth>.options.ts` 파일(21개 `git mv`, 빈 자리표시 `.gitkeep` 20개 삭제). 규칙: 기능 폴더 바로 아래 폴더 = 화면, 파일 = 1depth 공용. 공통 `api/common` · `types/common`은 그대로. 컨벤션 · 트리 · page-patterns-plan 반영. 검증: typecheck · build
- `apps/` 폴더 없애기 검토(사용자 요청): 보류 — 루트가 앱 3개 + 화면 목록 + 디자인 시스템으로 붐비고, 줄어드는 깊이는 1단계뿐(실제 깊이는 src 안). 영향: `pnpm-workspace.yaml` · 두 앱 `vite.config.ts`의 `../../packages` 경로 · lockfile 재설치 · 문서 경로. 결정 대기
- 이어서(같은 날): 폴더 정리 — 공통 `api/common/*` · `types/common/*` → `src/api/<이름>.api.ts` · `.types.ts`(기능 폴더와 같은 규칙, `src/types/` 없음), 파일이 있는 폴더의 `.gitkeep` 4개 · 빈 `components/search/` 삭제, 빈 폴더(`src/pages/` · `src/router/modules/` · `features/transaction/constants/`) 정리. src 바로 아래: app · router · layouts · features · api · components · constants · hooks · store · utils (+ assets). 컨벤션에 "공통 폴더" · "빈 폴더 · .gitkeep" 규칙 추가

### 화면 목록: 권한 신청 현황 팝업 → 권한 신청 현황 상세 팝업 — 2026-11-16
- 사용자 요청: 만든 권한 신청 현황 팝업(조회 조건 · 신청 이력 표)을 IA "권한 신청 현황 상세 팝업" KWPC02020101로 연결(전에는 KWPC02020100 줄). 앞서 기획없음 · 삭제로 둔 KWPC02020101 줄은 지움 → IA KWPC02020100(권한 신청현황 화면)은 미작업으로 보임. 팝업 모음 버튼 · 팝업 주석에 화면ID
- 특수권한 신청 사용 희망 기간(사용자 요청, 같은 날): 필수 "필수" 글자(사용자 수정), 안내 문구 "승인 결과에 따라 …"를 날짜 필드 오른쪽에(Figma) — Field `aside`(컨트롤 오른쪽, 사이 12). 글자 · 색은 helper와 같은 클래스(`.helper` + `.helperAside`)라 helper를 고치면 같이 바뀜(사용자 요청). 오류 문구는 그대로 아래
- DateField 기본 폭 140 고정(사용자 지적, 같은 날): 검색 조건(SearchPanel) 밖에서는 내용 폭이라 날짜를 고르면 폭이 줄었음 → FieldBox `.defaultDate` 기본값 auto → 140(`$field-date-width`). `fullWidth` · 직접 준 폭은 그대로(가맹점 기본/계약 정보 저축파일 전송종료일 fullWidth 245 유지). 측정: 특수권한 신청 날짜 입력 전 · 후 140 · 140, 통합 거래내역 140, 설립일자 140, 에러 없음
- 특수권한 상태 4종(사용자 요청, 같은 날): 만료(EXPIRED) 추가 — Badge 미보유 neutral · 승인대기 warning · 사용 중 success · 만료 error(만료 색은 임의 작업), 신청 가능은 미보유 · 만료(사용 중 · 승인대기는 선택 불가). 예시 데이터에 승인대기 · 만료 줄 추가(대량 조회 · 카드번호 전체 조회, 임의 작업) — 팝업 모음 [특수권한 신청]에서 4종 확인
