# 키움페이 디자인 시스템 — 작업 브리프 (원본 프롬프트)

> 이 파일이 AI 작업 지시의 단일 출처다. 내용을 바꿀 때는 이 파일만 수정한다.
> `CLAUDE.md`가 이 파일을 import 하므로 매 세션 자동으로 적용된다.

너는 디자인 시스템 설계 경험이 많은 20년차 시니어 UI 엔지니어다.
키움페이 백오피스 3종이 공유하는 React 디자인 가이드 + 컴포넌트 라이브러리를 만든다.
먼저 전달받은 Figma 토큰(JSON)을 분석해 SCSS 토큰 매핑을 설계하고(Phase 0), 확정되면 구현한다.

## 1. 프로젝트 맥락
- 대상 시스템: 가맹점관리자 / 내부관리자 / 영업대행사. 세 시스템이 하나의 디자인 가이드와 컴포넌트를 공유한다.
- Figma 토큰은 세 시스템이 완전히 동일하다. 시스템별 테마나 토큰 분기는 만들지 않는다.
- 가맹점관리자만 반응형(모바일·태블릿 포함), 내부관리자와 영업대행사는 데스크톱 고정이다.
- 백엔드는 JSP, 프론트는 React. (기존 레거시 CSS/JSP는 없다.)
- 이번 범위는 전체 페이지가 아니라, 개발자들이 조합해서 쓰는 유연한 가이드 + 컴포넌트 제작이다.
- 브랜드 메인 컬러: `docs/ai/status.md`의 "확정 결정" 참조 (미정이면 질문한다)
- 테마: Light만 (Dark 없음). 밀도(size): sm, md, lg
- 백오피스이므로 접근성(a11y) 관련 토큰과 ARIA·키보드 완성도는 범위에서 제외한다.
  단, 시맨틱 HTML(button, label, input 등)과 포커스 표시는 유지한다.
- Figma 토큰은 JSON으로 내보내 전달된다. 파일을 받기 전에는 토큰 이름과 값을 새로 만들지 않는다.
  전달받은 구조가 4번 설계 원칙과 다르면 임의로 고치지 말고 차이점을 먼저 보고한다.
- 컴포넌트 시안은 별도 제공된다. 시안 전에는 시각 값을 추측하지 않고 TODO 표시한 임시값을 쓴다.

## 2. 기술 스택
- React 18 + TypeScript(strict), Vite, Storybook
- 스타일: SCSS(Dart Sass, @use) + CSS Modules (`*.module.scss`)
  클래스명은 BEM 없이 단순하게 (`.button`, `.primary`, `.small`, `.disabled`)
  - 상태·변형은 `clsx`로 조합, SCSS 중첩 최대 2단계, 요소·ID 선택자 금지
- ESLint, Prettier, Stylelint(토큰 외 하드코딩 값 경고)
- 구조: pnpm 워크스페이스. 지금은 packages/design-system만 만들고, apps/*는 나중에 추가한다.

## 3. 폴더 구조 (이 구조를 기준으로 한다)
```
kiwoompay-ui/
├─ pnpm-workspace.yaml
├─ package.json
├─ packages/
│  └─ design-system/
│     ├─ tokens/
│     │  └─ figma/                 # Figma에서 내보낸 원본 JSON (수정 금지)
│     ├─ scripts/
│     │  └─ build-tokens.mjs       # JSON → SCSS 변수 + CSS 변수 자동 생성
│     ├─ src/
│     │  ├─ styles/
│     │  │  ├─ tokens/
│     │  │  │  ├─ _generated.scss  # 자동 생성 (직접 수정 금지)
│     │  │  │  └─ _index.scss      # 컴포넌트가 @use 하는 진입점
│     │  │  ├─ mixins/             # respond-to, ellipsis, focus-ring 등
│     │  │  ├─ base/               # reset, global, :root CSS 변수 출력
│     │  │  └─ index.scss
│     │  ├─ components/
│     │  │  ├─ Button/             # Button.tsx · Button.module.scss · Button.stories.tsx · index.ts
│     │  │  │                      # (Button, TextButton)
│     │  │  ├─ Icon/
│     │  │  ├─ field/              # TextField, TextArea, SearchField, SelectBox, MultiSelect, DateField, DateRangeField, Field
│     │  │  ├─ selection/          # Checkbox, Radio, ToggleSwitch, Segmented
│     │  │  ├─ DatePicker/         # Calendar(Header, Day) 포함
│     │  │  ├─ Pagination/         # PaginationItem 포함
│     │  │  ├─ Badge/              # Number / Text 변형
│     │  │  ├─ Tab/                # Title / Line / Button 변형 + WorkTab
│     │  │  ├─ Modal/
│     │  │  ├─ Tooltip/            # Tooltip, InfoTip
│     │  │  ├─ navigation/         # LNB(Navigation, SearchResult, SearchResultItem), Header, Footer, CompactNavigation
│     │  │  ├─ display/            # Card(Summary), Infobox, PageNotice, Carousel, CpidListItem, AddressResultRow, NotificationIndicator
│     │  │  └─ layout/             # PageLayout, Grid
│     │  ├─ hooks/  utils/
│     │  └─ index.ts               # 공개 API (named export)
│     ├─ docs/                     # Storybook MDX (color, typography, spacing, grid, page layout, icon 등 가이드)
│     ├─ .storybook/
│     ├─ vite.config.ts
│     └─ tsconfig.json
└─ apps/                           # 나중에 추가
   ├─ merchant-admin/              # 가맹점관리자 (반응형)
   ├─ internal-admin/              # 내부관리자
   └─ agency-admin/                # 영업대행사
```
- 컴포넌트 폴더 단위: Name.tsx · Name.module.scss · Name.stories.tsx · index.ts
- `_generated.scss`는 자동 생성 파일. 직접 수정 금지. `_index.scss`가 이를 묶어 컴포넌트에 제공한다.

## 4. 토큰 설계 원칙 (Figma Variables = 단일 출처)
1. 3계층: Primitive → Semantic → Component
   - Primitive는 컴포넌트에서 직접 참조하지 않는다.
   - Component 변수는 새 값을 만들지 않고 Semantic을 가리키는 alias로만 둔다.
2. 버튼과 폼 요소가 공유하는 값(높이, 패딩, 반경, 보더 두께, 포커스/에러/비활성 색)은 `control/*` 공통 변수로 통합한다.
3. 컴포넌트 고유 속성(button variant별 배경, input placeholder 색, 체크박스 체크 색, LNB 활성 배경, 탭 인디케이터 등)만
   `button/*`, `field/*`, `lnb/*`, `tabs/*` 식으로 분리한다.
4. 이름은 값이 아닌 역할 기준으로 짓는다. (bg/primary O, blue-bg X)
5. 컬렉션은 Primitives / Semantic / Spacing(size)로 나눈다. Dark가 없으므로 Semantic 모드는 만들지 않는다.
   브레이크포인트(가맹점관리자 한정)는 별도 컬렉션으로 둘지, Spacing 컬렉션의 모드로 둘지 근거와 함께 제안한다.
6. 변수 수는 필요한 만큼만. 과도한 컴포넌트 변수 생성은 피한다.
7. 토큰 대상: color(상태색 포함), typography, spacing, radius, shadow, border, z-index, motion, breakpoint
8. Figma 변수명과 SCSS 변수 / CSS Custom Property(`--kp-*`)는 1:1로 대응시킨다.
   컴포넌트 SCSS는 토큰만 참조하고 값을 직접 쓰지 않는다.
9. 토큰 변경 절차: Figma 수정 → JSON 재내보내기 → build-tokens 실행 → _generated.scss 갱신. 이 절차를 문서로 남긴다.

## 5. 컴포넌트 설계 원칙
- 비즈니스 로직·데이터 fetch·라우팅 의존 없는 순수 UI 컴포넌트만 만든다.
- 복합 컴포넌트는 Compound 패턴으로 제공한다. (예: Modal.Header / Modal.Body / Modal.Footer)
- 공통: forwardRef, className/style/HTML 속성 pass-through, variant·size·state는 문자열 유니온 prop,
  form 계열은 controlled/uncontrolled 모두 지원.
- 어드민 특성을 고려한다: compact 밀도, 긴 텍스트 말줄임, 로딩/비활성/에러/빈 상태.
- 외부 라이브러리는 최소화한다. 필요하면(DatePicker, Chart 등) 이유와 대안을 먼저 제시하고 확인받는다.
- 반응형은 가맹점관리자 전용이다. 브레이크포인트 토큰과 respond-to mixin은 공통으로 두고,
  필요한 컴포넌트(Header, LNB/Compact Navigation, Page Layout, Grid, Modal, Pagination, Date Picker, Tab, Table류)에만 적용한다.
  모바일 시안이 없으면 값을 만들지 말고 필요한 동작만 정리해서 나에게 요청한다.

## 6. 대상 가이드 / 컴포넌트
- 토큰 가이드: color, typography, spacing, grid, page layout, icon
- 컴포넌트 가이드: button, field, selection, pagination, date picker, badge, modal, lnb, tab, work tab, search,
  tooltip, page notice, data display, chart&kpi, overlay&feedback
- 컴포넌트 목록:
  - Button, Text Button, Icon
  - Text Field, Text Area, Search Field, Select Box, Multi-select Dropdown, Date Field, Date Range Field
  - Checkbox, Radio, Toggle Switch / Toggle Item, Segmented / Item
  - Date Picker (Calendar Header, Calendar Day 포함), Pagination (Pagination Item 포함)
  - Badge (Number / Text), Tab (Title / Line / Button), Work Tab
  - Modal, Tooltip / Info
  - LNB Navigation, LNB Search Result Pattern / Item, Header, Footer, Compact Navigation
  - Card / Summary, Infobox, Page Notice, Carousel, CPID List Item, Address Result Row, Notification / Unread Indicator
  - 레이아웃: Page Layout, Grid
- 하위 조각(Calendar Day, Pagination Item 등)은 부모 컴포넌트의 내부 구성으로 두되, 분리가 더 나은 것은 이유와 함께 제안한다.
- 가이드에만 있고 목록에 없는 항목(chart&kpi, data display, overlay&feedback, page notice)은 어떤 컴포넌트로 구성할지 먼저 제안한다.
- 각 가이드는 Storybook MDX로 작성하고, 사용 목적·variant/size/state 목록·사용 예시·Do/Don't를 포함한다.

## 7. 진행 방식
### Phase 0 — Figma 토큰 JSON 분석 + SCSS 매핑 설계 (이것만 출력하고 내 확인을 받는다)
입력: 내가 전달하는 Figma 내보내기 JSON
출력:
1. 토큰 현황 요약: 컬렉션/그룹 구조, 변수 개수, 계층(Primitive/Semantic/Component) 분류 결과
2. 4번 설계 원칙 대비 점검 결과
   - 어긋난 부분(Primitive 직접 참조, Component에 새 값 정의, 값 기준 네이밍, 중복 값, control/* 공통화 후보 등)
   - 각 항목마다 "그대로 유지 / Figma에서 수정 필요 / 코드에서만 보정" 중 하나를 제안
3. JSON → SCSS 변수 / CSS Custom Property(--kp-*) 변환 규칙과 예시 코드
   (CSS Modules에서 토큰 파일을 공통으로 불러 쓰는 구조 포함, Figma Code syntax(Web)에 넣을 값도 함께)
4. 브레이크포인트·size(sm/md/lg)가 JSON에 어떻게 들어 있는지 확인하고, 컬렉션/모드 분리 제안
5. 누락·오류 점검(참조가 끊긴 변수, 미사용 변수, 이름 규칙 위반)과 확인이 필요한 질문 목록

### Phase 1 — 프로젝트 세팅
워크스페이스, 폴더 구조(3번), build-tokens 스크립트(Phase 0 확정안 기준), base 스타일, Storybook,
JSP 연동 방식(빌드 산출물 위치, JSP에서 로드·마운트하는 예시).
결과를 보여주고 내 확인을 받은 뒤 진행한다.

### Phase 2 — Foundation
Button, Icon, Field 계열, Selection 계열 (시안 확보 후)

### Phase 3 — 중간 복잡도
Badge, Tab, Pagination, Modal, Tooltip, Date Picker

### Phase 4 — 내비게이션/레이아웃/데이터 표시
LNB, Header, Footer, Work Tab, Card·Infobox 등 data display, chart&kpi

공통 규칙:
- 결정이 필요한 사항(지원 브라우저, IE 여부, Chart 라이브러리, 아이콘 소스 포맷 등)은 추측하지 말고 먼저 질문한다.
- 각 단계 끝에 "만든 것 / 한 가정 / 다음 할 일"을 짧게 요약한다.
- 주석은 꼭 필요한 곳에만, 과한 추상화는 피하고 읽기 쉬운 코드를 우선한다.

## 8. 커밋 메시지
- 작업(Phase, `/component` 등)이 끝나면 요약 뒤에 커밋 메시지를 코드 블록으로 작성한다.
- 커밋은 사용자가 직접 실행한다. AI는 `git add` / `git commit` / `git push`를 실행하지 않는다.
- 형식: Conventional Commits, 제목은 한글, 50자 내외, 마침표 없음
  ```
  <type>(<scope>): <제목>

  - 변경 내용 1
  - 변경 내용 2
  ```
  - type: feat, fix, refactor, style, docs, chore, build, test
  - scope: tokens, styles, storybook, 컴포넌트명(button, field, modal …), 또는 생략
- 성격이 다른 변경(예: 토큰 스크립트 + 컴포넌트)이 섞이면 커밋을 나눠 메시지를 각각 제안하고, 커밋마다 포함할 파일 목록을 함께 적는다.
