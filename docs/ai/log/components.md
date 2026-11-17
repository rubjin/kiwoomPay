# Components (단일 컴포넌트)

> 범위: Button · Field 계열 · Selection · Pagination · Date Picker · Badge · Modal · Tab · Tooltip · Text 등.
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## 열린 질문

- [Q15] ~~Neutral Text Action 색~~ → Figma 마이페이지(28762:69925) Text Button = Neutral 600으로 반영(2026-11-13). Hover는 Primary 50 배경(밑줄 없음) 확정(2026-11-12)
- [Q17] 가이드(Hierarchy 설명)는 Hover를 "한 단계 어두운 배경"이라 쓰지만 시안 값은 Neutral Solid Hover가 더 밝은 회색(Neutral/500). 시안 값을 따름 — 디자인 확인 필요
- [Q18] MultiSelect(시안 변경 반영 2026-11-11: 전체 행 배경 없음 · 항목 36 · 여러 개 선택 시 쉼표 나열 · 패널 최대 높이 md 276 / sm 210 · 항목 글자 md 14 / sm 13 확정) 확인 필요: ① 시안은 전부 선택해도 "전체"가 일부 선택(–)으로 그려짐 → 구현은 체크(✓) ② 열림 상태 트리거 글자가 회색인 예시가 있으나 다른 예시는 진한 색 → 진한 색
- [Q19] 시안에 없는 항목: 필드 hover 표현, Field 세로(라벨 위) 배치, SelectBox 키보드 이동(↑↓), Small 드롭다운 항목 글자 크기 → 현재 hover·세로 배치는 미구현, 항목 글자는 14px 고정
- [Q20] Select 패널 최대 높이 190 · 로딩/빈 상태 174 Figma 확정(2026-11-12). 남은 임시값: `z-index/dropdown`
- [Q21] 시안 불일치 확인: SelectBox Negative 상태의 화살표만 진한 색(#1E293B)이고 나머지 상태는 Neutral/500. 현재 Neutral/500로 통일함. Date Field 날짜 ↔ 달력 아이콘 간격은 Figma 4로 반영(2026-11-12)
- [Q22] Selection 시안에 없는 항목(임시값, `tokens/custom/selection.json` TODO): 비활성 라벨 색, 가로 그룹 간격. (Segmented는 Figma로 확정 2026-11-12: 최소 60 · 좌우 12 · 옵션 붙임, 비활성 미선택 배경 확정) sm 라벨 글자 크기 md 14 · sm 13 확정(2026-11-12), 체크박스 sm 체크 아이콘 크기(20 프레임을 0.8배)
- [Q23] Checkbox·Radio·Toggle·Segmented의 hover 표현은 시안에 없어 미구현. 토글 이동 애니메이션은 motion 토큰이 없어 미구현
- [Q28] Pagination 반응형(가맹점관리자 모바일) 시안 없음 → 미적용. 결과가 1페이지 이하일 때 숨길지는 화면 정책으로 정함(컴포넌트는 그대로 표시)
- [Q29] Date Picker: Figma로 336 × 344 · 반경 12 · 헤더 40 확정(2026-11-12). 필드 ↔ 패널 간격 8은 임시값(TODO). 기간 선택 중 마우스 위치까지 미리 보여주는 표시는 시안에 없어 미구현
- [Q30] Badge 임시값(TODO): Neutral 상태 점 색(Neutral/500, Figma는 이미지라 값 확인 불가), Primary · Neutral 외 tone의 Line 테두리(각 Status Border, Neutral은 Neutral 100 확정), Number 두 자리 이상 좌우 여백 6·글자(12 SemiBold). 3글자 이상 배지는 시안보다 2px 넓게 렌더링됨(글자 폭 반올림 차이로 판단, 2글자는 정확히 일치)
- [Q31] Modal(테두리 없음 · 반경 12 · 그림자 0 8px 24px rgba(0,0,0,.12) 확정 2026-11-12) 임시값(TODO): z-index 체계(모달 1000 · 팝업 1100). 시안의 제목→본문 간격이 19(측정)라 높이가 시안보다 1~2px 큼. Tab 키 포커스 가두기(focus trap)는 a11y 범위 밖이라 미구현
- [Q34] Tab(Figma 반영 2026-11-12: Line md 14 Regular/Active 14 Bold · 좌우 12, sm 12 Regular/Active 12 SemiBold · 좌우 10, Button Tab 14 Regular/Active 14 Bold · 좌우 md 26 · sm 12) 임시값(TODO): Line Tab 사이 간격 0, Button Tab 간격 8, 비활성 Tab Badge 색. Hover 표현 시안 없음(미구현). Title Tab은 Figma로 구현(2026-11-12, Tab 사이 간격 8 임시). Tab Guide는 "Small 32 = LNB처럼 밀도 높은 영역"인데 LNB 시안의 탭 높이는 40 → LNB는 기존 40 유지, 확인 필요
- [Q38] Tooltip(Figma 반영 2026-11-12: 포인터 높이 8 · 기준 요소 바깥 8) 임시값(TODO, `tokens/custom/tooltip.json`·`field.json`): 화면 경계 최소 간격 8, `z-index/tooltip` 1200, 비활성 Info 아이콘 색. 표시 애니메이션은 motion 토큰 없어 미포함. LNB 긴 메뉴명(Q32)은 아직 기본 title — Tooltip으로 바꿀지 확인

## 작업 기록

### Component: Button / TextButton — 2026-11-10
- 만든 것
  - `Button`: variant(primary·neutral·dark·danger) × appearance(solid·line) × size(sm·md·lg) × state(default·hover·pressed·disabled·loading), Text Only / Leading / Trailing / Icon Only. forwardRef, HTML 속성 pass-through, `loading` 시 클릭 차단·크기 유지, 긴 텍스트 말줄임
  - `TextButton`(primary·neutral, sm·md), `TextLink`(<a>, 항상 밑줄, disabled)
  - 토큰(`tokens/custom`): `control.json`(높이 32/40/48, radius 4/6/8, 아이콘 16/20/24, 아이콘 간격, 패딩 = space alias, 테두리 1px), `button.json`(Button 56개 + TextButton 5개, 모두 Figma 색 alias), `typography-roles.json`에 `Button/LG·MD·SM` 추가
  - Storybook: `Button.stories.tsx`, `TextButton.stories.tsx`, 가이드 `docs/Button.mdx`
- 검증: typecheck · lint(경고 0) · build · Storybook 빌드 통과. 빌드 CSS에 하드코딩 색 없음. 헤드리스 Chrome 캡처로 variants/sizes/icons/states를 시안과 대조 확인(색은 시안 PNG 픽셀값이 기존 토큰과 모두 일치)
- 한 가정
  - 시안의 Type(Solid/Line)은 HTML `type` 속성과 겹쳐서 prop 이름을 `appearance`로 함. 기본값 variant=primary, appearance=solid, size=md, HTML type=button
  - Semantic 레이어에 "액션 색"이 없어, `button/*` 컴포넌트 토큰이 Figma Primitive/Status 색을 직접 alias (컴포넌트 SCSS는 토큰만 참조)
  - 글자: Button Guide Spec(14 Bold / 13 SemiBold / 12 SemiBold)을 따름 (Figma 텍스트 스타일 설명의 "버튼 = 13 Medium"과 다름)
  - 아이콘은 `ReactNode`로 받음(Icon 컴포넌트 전). 아이콘 자식은 영역을 꽉 채우도록 `> *` 규칙 사용
  - Stylelint `selector-class-pattern`을 camelCase 허용으로 변경 (`styles.iconOnly` 접근용, BEM은 계속 금지)
  - Hover/Pressed는 Storybook에서 마우스로 확인 (강제 상태 애드온 없음). 전환(transition)은 motion 토큰이 없어 넣지 않음
- 다음 할 일: 열린 질문 Q15~Q17 확인, Icon 컴포넌트(아이콘 SVG 소스 필요), Field 계열 시안

### Component: Field 계열 — 2026-11-10
- 만든 것
  - `field/`: `Field`(라벨·컨트롤·헬퍼 래퍼, Context로 id·size·feedback·disabled 전달), `TextField`(leading/trailing 아이콘·suffix·clearable), `SearchField`(onSearch), `TextArea`(rows, 카운터), `SelectBox`(옵션 목록·로딩·빈 상태·스크롤·hidden input·바깥 클릭/Esc), `DateField`·`DateRangeField`(숫자 입력 시 YYYY-MM-DD 자동 정렬, `onCalendarClick`으로 Picker 호출)
  - 내부 공통: `FieldBox`(박스·입력·접미사·아이콘 버튼·카운터), `fieldContext`, 임시 아이콘(`icons.tsx`)
  - `hooks/useControllableState`, `hooks/useOutsideClick`, `utils/mergeRefs`, `utils/formatDate`
  - 토큰(`tokens/custom/field.json`): radius 8/6, 패딩 14/12, 간격, 피드백·강조(strong) 테두리 2px, 아이콘 크기, 색(모두 Figma 색 alias), 포커스 번짐(확정), 드롭다운 규격, z-index
  - Storybook: 컴포넌트별 stories 7개, 가이드 `docs/Field.mdx`
- 검증: typecheck · lint(경고 0) · build · Storybook 빌드 통과, `formatDateInput` 8케이스 확인. 헤드리스 Chrome 캡처로 시안(Text Field·Select·Date·Range·Search+Button·Textarea·Label+Helper)과 대조. 시안 PNG 픽셀값이 기존 토큰과 모두 일치. **클릭·입력 같은 상호작용 동작은 브라우저에서 직접 확인하지 못함(자동 테스트 없음)**
- 한 가정
  - 폭은 내용 기준(`inline-flex`), 부모 폭은 `fullWidth`. 날짜 입력은 `size=10`으로 YYYY-MM-DD 10자 기준
  - 라벨은 시안대로 필드 왼쪽 가로 배치만 제공(세로 배치는 시안 없어 미구현). 라벨 높이는 필드 높이에 맞춰 세로 가운데 정렬
  - SelectBox가 열린 상태에서 스크롤(목록이 최대 높이 초과)·로딩·빈 상태이면 트리거 테두리를 Primary 2px·번짐 없음으로 표시(시안 Dropdown State). 그 외 열림은 1px + 번짐. 피드백이 있으면 피드백 색이 우선
  - 피드백 테두리 2px는 레이아웃이 밀리지 않도록 1px 테두리 + inset 그림자 1px로 구현. 피드백은 포커스보다 우선 표시
  - 필드 높이는 `control/height/*`를 Button과 공유하고, radius·패딩은 Button과 값이 달라 `field/*`로 분리
  - 헬퍼 문구 색은 시안대로 Status의 Border 색(초록 #22C55E / 빨강 #EF4444)
  - DateField 형식·범위 검증, Date Picker는 포함하지 않음(Phase 3)
  - Field 안 컨트롤은 `React.useId`로 id를 자동 연결
- 다음 할 일: Q18~Q21 확인, Selection 계열 시안, Icon 컴포넌트(SVG 소스) 후 `field/icons.tsx` 교체

### Component: Selection 계열 — 2026-11-10
- 만든 것
  - `selection/`: `Checkbox`(indeterminate, label·helperText), `Radio`·`RadioGroup`(그룹이 선택값·name 관리), `ToggleSwitch`(role=switch), `Segmented`·`Segmented.Item`(Compound, 내부 native radio), `SelectionGroup`(세로/가로 묶음 레이아웃)
  - 내부 공통 `SelectionItem`(컨트롤 + 라벨 + 부가 설명 레이아웃). native input을 투명하게 덮어 클릭·키보드·포커스를 그대로 받고, 모양은 형제 요소(`input:checked + .box`)가 그림
  - 토큰(`tokens/custom/selection.json`): 크기 20/16, 체크박스 반경 4, 라디오 링 2px·점 10/8, 토글 36×20·28×16·손잡이 16/12, Segmented 높이 32·반경 6, 색(모두 Figma 색 alias). 타이포 역할 `segmented-item`(12 Medium) 추가
  - Storybook: stories 4개, 가이드 `docs/Selection.mdx`
- 검증: typecheck · lint(경고 0) · build · Storybook 빌드 통과. 시안 대조(크기·색 픽셀 일치). **브라우저 상호작용 테스트 24개 통과**(임시 puppeteer 스크립트, 저장소에는 포함하지 않음): Checkbox 전체 선택·indeterminate, RadioGroup, Toggle, Segmented, SelectBox(열기·선택·disabled 항목·Esc·바깥 클릭), DateField·DateRangeField 자동 정렬, SearchField(Enter·지우기), TextArea 카운터, Button loading. 이 과정에서 SelectBox Esc가 안 닫히던 버그를 찾아 수정(포커스가 밖으로 나가면 키 입력이 컴포넌트에 안 닿음 → 문서 전체에서 Esc를 듣고, 항목 mousedown에서 포커스 이동을 막음)
- 한 가정
  - 시안의 체크박스 반경은 모서리 윤곽을 이론값과 비교해 4로 확정. 토글 손잡이는 트랙 안쪽 2px 여백
  - 컨트롤은 라벨 첫 줄의 세로 가운데에 맞춤(`1lh` 단위 사용 — 최신 Chrome·Edge·Safari 16.4+)
  - Checkbox·Radio·Toggle은 `label`·`helperText` prop으로 Toggle Item/Content 구성을 대신함(별도 Item 컴포넌트 없음)
  - Radio는 RadioGroup 안에서 그룹이 checked를 제어(controlled)하고, 밖에서는 native 속성을 그대로 사용
- 다음 할 일: Q22~Q23 확인, Icon 컴포넌트(SVG 소스) 후 `field/icons.tsx`·체크 아이콘 교체, MultiSelect 시안, Phase 3

### Button 시안 재확인(상태 전체) — 2026-11-10
- 확인: 4 variant × solid/line × Default·Hover·Pressed·Disabled·Loading 배경색을 픽셀로 측정 → 기존 토큰과 모두 일치(Dark Pressed #000 포함)
- 변경: Loading 표현을 시안대로 변경 — 내용을 숨기고 원형 스피너를 겹치던 방식 → `loading` 아이콘(lg 24·md 20·sm 16, 회전) + "처리 중" 문구. 폭은 내용에 맞춤. `loadingText` prop 추가, 아이콘 전용은 아이콘만 교체. prefers-reduced-motion에서는 회전 안 함
- 토큰: `tokens/custom/motion.json` `motion/duration/spin` 1s (TODO)
- 정리: 새로 올라온 `src/assets/icons/Icon.svg`는 `Name=Loading, Size=24.svg`와 바이트까지 동일해 제거(이미 `loading` 아이콘으로 제공)

### Component: Pagination (Phase 3) — 2026-11-10
- 만든 것
  - `Pagination`: `totalPages` · `page`/`defaultPage`/`onChange`(controlled·uncontrolled) · `siblingCount`·`boundaryCount`(기본 1) · `prevLabel`/`nextLabel` · `disabled`. `<nav aria-label>` + 현재 페이지 `aria-current="page"`. 첫·마지막 페이지에서 이전·다음 비활성. 생략(…)은 누를 수 없음
  - `getPageItems`: 처음·끝 1개 + 현재 양옆 1개를 보여주고 사이를 생략. 칸 수 일정(7칸) — 12개 케이스 검증
  - 토큰 `tokens/custom/pagination.json`(크기 40·이전/다음 최소 폭 62·간격 4·반경 8·색 모두 Figma alias), 타이포 역할 `pagination-item`(14 Medium)
  - Storybook: stories(Structure·Ellipsis·FewPages·Disabled), 가이드 `docs/Pagination.mdx`
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 테스트 20개 통과(크기 40×40·62×40·간격 4, Active·Hover·Pressed·Disabled 색, 클릭·이전·다음 이동, 생략 위치 변화, 전체 disabled). 시안 색은 모두 기존 토큰과 일치
- 한 가정: 이전·다음은 최소 폭 62(기본 문구일 때 정확히 62), 긴 문구면 늘어남. 번호 100 이상은 폭이 글자에 맞춰 늘어남. 아이콘은 `chevron-left/right`(20 variant가 없는 left는 24를 축소)

### Button 로딩 애니메이션 제거 — 2026-11-10
- 사용자 요청으로 로딩 아이콘 회전 애니메이션 제거(정지된 `loading` 아이콘 + "처리 중"). 회전 속도 토큰 `motion/duration/spin`(`tokens/custom/motion.json`)도 삭제 → Q27 해소

### Component: Date Picker (Phase 3) — 2026-11-10
- 만든 것
  - `DatePicker`: `mode` single(기본) · range, 값은 'YYYY-MM-DD' / {start,end}, controlled·uncontrolled. 일요일 시작, 첫 주는 지난달 날짜(회색·선택 불가). 이전·다음 달 이동해도 선택 유지. `min`·`max`·`isDateDisabled`·`maxRangeDays`(정책), `today`(서버 날짜 주입·테스트용). Range는 시작 → 종료 순서, 종료를 시작보다 앞으로 고르면 새 시작일, 종료까지 골라야 onChange
  - `dateUtils`(존재하지 않는 날짜 거르기, 월 이동, 달력 칸 계산) — 2026년 8월 배치가 시안과 동일
  - DateField · DateRangeField 연결: 필드·달력 아이콘 클릭 → 패널 열림(필드 Focus), 선택 → 값 반영·닫힘, 바깥 클릭·Esc 닫기, readOnly·disabled는 안 열림, `picker={false}`로 끔. `DateRange` 타입은 DatePicker로 이동
  - 토큰 `tokens/custom/datepicker.json`(패널 336·셀 40·간격 4/12·반경 8·헤더 34, 색 모두 alias: 토요일 Info Text, 일요일 Error Text)
  - Storybook stories, 가이드 `docs/DatePicker.mdx`
- 검증: 브라우저 테스트 32개 통과(패널 336×340, 셀 40·간격 4, 상태별 색, 월 이동 후 선택 유지, 기간 선택 흐름, maxRangeDays, min·max·주말 비활성, 필드 열기·선택·Esc·바깥 클릭·readOnly). 렌더링 캡처가 시안과 동일

### Component: Badge (Phase 3) — 2026-11-10
- 만든 것: `Badge`(tone 6 · soft/line · md 24/sm 20 · 상태 점 기본 숨김), `NumberBadge`(primary/error, max 99 → 99+, 0은 숨김·showZero), `DotBadge`(6×6 신규 표시). 토큰 `tokens/custom/badge.json`(색 모두 Status 토큰 alias), 타이포 역할 `badge-md`·`badge-sm`·`badge-number`. stories, 가이드 `docs/Badge.mdx`
- 검증: 브라우저 측정 21개 중 18개 일치(6개 톤 색·높이·글자·점·Line·Number·Dot). 3개는 글자 폭 2px 차이(Q30)

### Component: Modal (Phase 3) — 2026-11-10
- 만든 것
  - `Modal`(Compound): `Modal.Header`(title · closeButton) · `Modal.Body`(넘치면 여기만 스크롤) · `Modal.Description` · `Modal.InfoList`(Information 정보 영역) · `Modal.Footer`. `open` · `onClose` · `width`(기본 400) · `closeOnEsc`(기본 true) · `closeOnDimClick`(기본 false) · `initialFocusRef` · `inline`(가이드 미리보기)
  - 동작: document.body에 그려 전체 Viewport 기준 가운데, 딤(검정 48%, LNB·Header 포함), 여백 40 → 최대 높이 calc(100vh - 80px), Header·Footer 고정, 배경 스크롤 잠금(중첩 모달 대응), 열리면 모달 안 포커스·닫히면 연 요소로 복귀, Esc는 가장 위 모달만
  - 토큰 `tokens/custom/modal.json`(폭 400·여백 20·반경 10·버튼 간격 8·정보 영역, 색 모두 alias), `overlay/dim` 측정값 0.48로 갱신, `z-index/modal` 추가
  - 테두리는 시안(Figma 안쪽 테두리)과 같은 크기가 되도록 안쪽 그림자로 그림
  - Storybook stories(Types · Actions · Interactive), 가이드 `docs/Modal.mdx`
- 공통 수정(모달 검증 중 발견): SelectBox 드롭다운·DatePicker 달력이 모달 Body 스크롤 영역에 잘리던 문제 → 팝업을 document.body에 띄우고 위치 계산(`hooks/useFloatingPosition`, 아래 공간 부족 시 위로), `useOutsideClick`이 여러 ref를 받도록 변경, `z-index/dropdown` 100 → 1100(모달 위). 팝업을 닫는 Esc가 모달까지 닫던 문제 → 팝업은 캡처 단계에서 먼저 처리하고 모달은 이미 처리된 Esc를 무시
- 검증: 브라우저 테스트 21개 통과(크기·반경·테두리·제목, 딤 색, 스크롤 잠금·해제, 포커스 이동·복귀, 가운데 배치, 딤 클릭 무시, Esc·X·저장으로 닫기, 모달 안 날짜 팝업 보임, 최대 높이 640·Body 스크롤·Footer 고정, Lookup 폭 560·선택 후 닫기). 기존 테스트(공통 24 · Pagination 20 · DatePicker 32) 재통과

### Component: Tab (Phase 3) — 2026-11-10
- 만든 것: `Tab`(Compound, `Tab.Item`) — variant line(밑줄)·button, size md 40·sm 32, `fullWidth`(Equal Width), `count`(Number Badge soft, 99+ · 0 표시), controlled·uncontrolled. `NumberBadge`에 `appearance="soft"` 추가(Primary 100 배경 + Primary 글자). 토큰 `tokens/custom/tab.json`(색 모두 alias), 타이포 역할 `tab-md`·`tab-active-md`·`tab-sm`·`tab-count-md`. stories, 가이드 `docs/Tab.mdx`
- 검증: 브라우저 테스트 19개 통과(높이 40/32, 글자 14 Medium·Active 14 SemiBold·Small 13 Medium, 색, 밑줄 2px, Badge 20·간격 6, Button Tab 76×32·반경 6·색, Equal Width, 선택·비활성 클릭 무시)
- 한 가정: 측정값 — Medium Active만 굵게, Small은 Active도 같은 굵기, Medium Badge 숫자 14px(Small은 12px)

### Component: Tooltip / InfoTip (Phase 3) — 2026-11-10
- 만든 것
  - `Tooltip`: 기준 요소 1개(children)에 붙임. Hover 200ms(`delay`) 후 · 키보드 Focus 즉시 표시, Pointer 이탈 · Focus 해제 · Esc(모달보다 먼저) 닫기. `placement` bottom(기본) · top · left · right, 공간이 모자라면 bottom → top → left → right 순서로 자동 전환, 어디에도 안 들어가면 화면 안으로 밀어 넣음. document.body에 그려 카드 clip 영향 없음. `open`·`defaultOpen`·`onOpenChange`·`disabled`, `role="tooltip"` + `aria-describedby`
  - `InfoTip`: Info 아이콘(20, Neutral 500) 버튼 + Tooltip
  - 몸체 Neutral 800 · 반경 8 · 여백 12/10 · 12 Regular 흰 글자 · Hug(최대 320, 줄바꿈). 포인터 12×6, 위·아래 배치는 몸체 왼쪽에서 20 · 좌우 배치는 세로 가운데, 기준 요소 가운데에 맞추고 끝 간격 0
  - 토큰 `tokens/custom/tooltip.json`, `z-index/tooltip`(field.json). stories(Playground · SizeAndWrap · ContentExamples(시안 문구 4개) · Placement · ViewportBoundary · ContainerClip · OnButton), 가이드 `docs/Tooltip.mdx`(Storybook `Components/Tooltip/Guide`)
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 테스트 25개 통과(색 · 글자 · 여백 · 반경, Short Hug · Long 320 줄바꿈, 포인터 크기 · 위치 · 간격 0(4방향), 오른쪽 끝 → Left, 아래 부족 → Top, 카드 밖 표시, 200ms 지연, 이탈 · Focus · Esc 닫기, 클릭 Focus는 즉시 표시 안 함, 버튼에 붙이기). 이 과정에서 왼쪽 배치 포인터가 0.2px 어긋나는 문제(offsetWidth 반올림)를 찾아 수정. 렌더링이 시안 문구 줄바꿈까지 일치

### Modal 패턴(Type × Action) 반영 — 2026-11-10
- 시안 확인: Alert · Confirm 400 / Information 620 / Form 800, 각 Type마다 Action None · Single · Double. Form 본문은 조회 필드(검색 + [조회] Neutral Solid, 라벨 위 또는 왼쪽) + 라벨 왼쪽 입력(폭 200), 줄 간격 12
- 변경
  - 토큰 `modal/width` → `modal/width/sm·md·lg`(400 · 620 · 800). `Modal`에 `size`(sm 기본 · md · lg) 추가, `width`는 예외 폭(Lookup 등)용으로 유지
  - `Field` 본문이 라벨 옆 남은 폭을 차지하도록 수정 → `fullWidth` 컨트롤이 Field 안에서도 폭을 채움(기존엔 내용 폭에 갇혀 채우지 못함). 컨트롤 기본 폭은 그대로
  - Modal stories: `Patterns`(12종 매트릭스) 추가, Types · Form 예시에 size 적용. 가이드 `docs/Modal.mdx`에 "3. Pattern (Type × Action)"과 Form 본문 배치 규칙, Spec 폭 갱신
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 측정 11개 통과(폭 400 × 6 · 620 × 3 · 800 × 3, Action 0/1/2 버튼, [조회] 오른쪽 여백 20 · 검색 ↔ 조회 8, 라벨 위 4 / 왼쪽 8, 필드 40, 입력 폭 200). Field 변경 후 기존 테스트(Page Layout · Work Tab 28 · Tooltip 25) 재통과, SearchArea 화면은 수정 전과 배치 동일(픽셀 비교, 글자 안티앨리어싱 차이만)

### Component: MultiSelect (Phase 2) — 2026-11-11
- 만든 것: `field/MultiSelect` — 옵션 검색(SearchField sm) · 전체 선택(indeterminate) · 항목 Checkbox sm, `value: string[]`(옵션 순서) · controlled/uncontrolled, 선택 시 패널 유지, 트리거 요약(1개 이름 · `외 N` · `전체`, `renderValue`), loading · empty · 검색 결과 없음, `name` → 값마다 hidden input. 패널 안 검색은 바깥 Field Context와 분리(id · 피드백 중복 방지). SelectBox의 Spinner를 공용 `field/Spinner`로 분리. 토큰 `select/all-bg`(TODO). stories(Playground · States · Open · Wide · Controlled), Field 가이드 4-1절
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 27개 통과(패널 200 · 190 · 여백 8 · 트리거 ↔ 패널 8, 검색 32 · 항목 30 · 간격 4 · 체크박스 16 · 글자 14, 전체/선택 배경, indeterminate, 스크롤 강조, Loading · Empty 190, md 40 · sm 32, 선택 · 해제 · 순서, 전체 선택/해제, 검색 필터 · 검색 중 전체, 결과 없음, Esc · 바깥 클릭, 검색어 초기화, Field 안 id 중복 없음)
- 한 가정: Q18 ①~⑤

### Component: Unread Indicator — 2026-11-11
- 만든 것: `Badge/UnreadIndicator` — 읽지 않은 항목 옆 "N"(기본 `aria-label` "읽지 않음", 글자 변경 가능). 토큰 `badge/unread`(Text/Accent), 타이포 역할 `badge-unread`(Typo/11/Bold). Badge stories `Unread`, Badge 가이드 4절에 DotBadge(신규 기능 · 메뉴)와 구분 설명
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 4개 통과(N · 11 Bold · #2484C6 · 8 × 16.5, 가이드 렌더링)
- 한 가정: Q42

### MultiSelect 시안 변경 반영 — 2026-11-11
- 변경: 전체 행 배경 제거(토큰 `select/all-bg` 삭제), 항목 높이 30 → 36 · 좌우 여백 8 → 10, 패널 아래 여백 12 → 8, 최대 높이 210(항목 4개), 트리거 요약 "외 N"/"전체" → 선택한 이름 쉼표 나열(말줄임). Open 스토리에 여러 개 선택 예시 추가, Field 가이드 갱신
- 검증: typecheck · lint · Storybook 빌드 통과, 브라우저 테스트 27개 통과(새 값 기준)

### MultiSelect 크기별 패널 높이 · 글자 — 2026-11-11
- 변경(사용자 확정): 패널 최대 높이 md 276 · sm 210, 항목 글자 md 14(body-md) · sm 13(body-sm). Loading · Empty 패널 190은 그대로. Open 스토리에 sm 스크롤 예시 추가, Field 가이드 갱신
- 검증: typecheck · Storybook 빌드 통과, 브라우저 측정(md 최대 276 · 14px, sm 최대 210 · 13px, 넘치면 목록 스크롤) + 기존 테스트 27개 재통과

### Figma 대조 반영 (커밋 전) — 2026-11-12
- Figma MCP 연결 후 컴포넌트 페이지(node 2-4)에서 PNG 글자 폭으로 추정했던 값을 대조
- 일치(변경 없음): Infobox · Unread Indicator · LNB Search Result(두 번째 행 = Hover 확인) · Footer 글자 · 간격
- 반영
  - Modal 제목 20 Bold → **20 SemiBold**(모든 Modal 공통)
  - Summary Card: 제목 14 SemiBold → 14 Bold, Info 아이콘 16 → 20, 단위 md 14 Bold · sm 14 Regular → 13 Medium, 빈 상태 제목 14 Regular → 14 Medium
  - CPID List Item: 높이 58 유지(Figma H56은 테두리 제외, 사용자 확인), 반경 6 → 8, 여백 12 / 14 → 좌우 12 · 위아래 8(테두리 안쪽), CPID 13 Bold → 13 SemiBold
  - Address: 결과 줄 79 → 78(위아래 16 → 12, 세로 가운데), 우편번호 ↔ 도로명 16 → 8, 예시 항목 이름 13 SemiBold → 13 Bold, 결과 없음 제목 14 SemiBold → 14 Bold · 간격 8 → 6, 스토리 Modal에 닫기(X)
  - Compact Navigation: "1/3"(12 SemiBold, 간격 2) → "1 / 3"(현재 번호 12 Bold · 나머지 12 Regular, 공백)
  - Header: 검색 필드 배경 Neutral 50(토큰 `header/search-bg`, 영역 안에서 `--kp-color-field-bg` 덮어쓰기), 사용자 정보 구분선 1 × 32(항목 높이 → 32), [다운로드 센터] ↔ 아이콘 12 → 10, 아이콘 버튼 반경 4 → 6
  - Footer 좌우 여백 24 → 20
- 검증: tokens · typecheck · lint · build · Storybook 빌드 통과. Figma 값 대조 테스트 12개 통과. 기존 테스트 재통과(공통 24 · Infobox 12 · LNB 23 · LNB 검색 7 · DatePicker 32 · MultiSelect 27 · Footer 7 · 가이드 24, Compact Nav 동작). 실패는 이번에 바꾼 값을 옛 값으로 기대하는 테스트뿐(CPID 58 · 반경 6, Summary 글자, Header 위치)

### Q41 · Q44 처리 — 2026-11-12
- Compact Navigation: 전체가 1페이지 이하(`total <= 1`)면 컨트롤을 그리지 않음(Figma 설명 "one page hides control"). 가이드 반영
- Q44(Infobox 두 줄 제목 열 · tone 이름) 확인 완료 → 현재 구현 유지

### Component: Tab / Title — 2026-11-12
- 만든 것: `Tab`에 `variant="title"` 추가(Figma `Tab/Title` 28300:5560) — 높이 34(글자 영역 30 + 밑줄 4) · 좌우 여백 10, 기본 14 Regular Neutral 700 · Active 14 Bold Primary 500 + 밑줄 4 · 비활성 Neutral 400. Figma는 Active만 34(나머지 32)라 선택 시 높이가 바뀜 → 모두 34 고정. TitleTab 스토리, Tab 가이드 1 · 4절
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 확인 6개(높이 · 여백, 상태별 글자 · 색 · 밑줄, 세로 가운데, 폭 = 글자 + 20(Figma 44 · 45), 클릭 이동). 기존 Tab 테스트 19개 재통과
- 한 가정: Title Tab 사이 간격 8(TODO, Q34)

### 기존 컴포넌트 Figma 재대조 — 2026-11-12
- 일치(변경 없음): Pagination · Calendar Day/Header 색 · Checkbox · Toggle · Text Field(크기 · 글자 · 포커스 · 비활성 · 읽기전용 · 피드백 · 헬퍼) · Search Field · Text Area · Button(크기 · 글자 · 여백 · 반경) · MultiSelect(항목 36 · 여백 10 · 패널 높이) · LNB 행 높이 45/42/33
- 반영
  - Segmented: 옵션을 테두리 겹쳐 붙임(바깥 모서리만 반경) · 최소 폭 60 · 좌우 12 · 선택 12 SemiBold
  - Tab: Line md 14 Regular / Active 14 Bold · 좌우 12, sm 12 Regular / Active 12 SemiBold · 좌우 10, Button Tab 14 Regular / Active 14 Bold · 좌우 md 26 · sm 12, 최소 폭 제거, Count 14 Bold
  - Badge: Line Neutral 테두리 Neutral 100
  - Tooltip: 포인터 높이 6 → 8, 기준 요소 바깥 간격 0 → 8(`tooltip/offset`)
  - Text Button: md 13 Bold, Hover 밑줄 → Primary 50 배경(`text-button/hover-bg`)
  - Field: 필수 표시(*) 12 Bold
  - Select Box: 로딩 · 빈 상태 패널 172 → 174, sm 항목 13 Medium(md 14 Regular)
  - MultiSelect: 항목 반경 6 → 4
  - Date Field · Date Range Field: 날짜 ↔ 달력 아이콘 8 → 4(~ 양옆 8 유지)
  - Date Picker: 336 × 340 → 336 × 344, 반경 8 → 12, 헤더 34 → 40, 이전 · 다음 아이콘 20 → 24(누르는 영역 24)
  - LNB: 2Depth 13 → 12 Medium · 기본 Text/Secondary · Current Text/Heading, 3Depth Hover 흰 배경(`lnb/depth3-hover-bg`)
- 검증: tokens · typecheck · lint · Storybook 빌드 통과. 반영값 측정 22개 통과. 기존 테스트 재통과(공통 24 · MultiSelect 27 · 가이드 28 · Figma 대조 12 · Pagination · DatePicker 31/32 · LNB 22/23 · Tab 12/19) — 실패는 이번에 바꾼 값(Date Picker 340 · LNB 2Depth 13px · Tab 글자 · 여백)을 옛 값으로 기대하는 테스트와 기존 Q30(Badge 폭 2px)뿐
- 확인 필요: Q32(LNB Depth 컴포넌트 ↔ 전체 예시 차이)

### 표 테두리 규칙 — 2026-11-13
- FormTable(`.row > :not(:last-child)`) · GridPlaceholder(`.gridHead` · `.gridCell` `:not(:last-child)`)에 칸 사이 세로선. 양 끝은 선 없음. 적용 범위: P02 기본 정보 · 담당자 표, 가맹점 기본/계약 정보(앱), P04 결제한도 표, P01 · P03 · 앱 목록 화면의 그리드 미리보기
- 검증: lint · typecheck, 브라우저(P04 결제한도 · P02 기본 정보 · P03 결과 · P01 결과): 행마다 마지막 칸 제외 오른쪽 선, 왼쪽 선 없음
- 다음: IBSheet 테마 연결 시 같은 규칙(바깥 세로선 없음)으로

### Radio 선택 점 찌그러짐 수정 — 2026-11-15
- 증상: 브라우저 창 폭을 바꿀 때 선택 점이 살짝 찌그러짐(통합 거래내역 취소 구분 등). 원인: 점을 `::after`로 따로 그려, 라디오가 소수점 좌표에 놓이면 바깥 원과 점이 따로 반올림됨
- 수정: 점 요소 없이 원 하나에 선택색 배경 + 안쪽 링(`inset box-shadow`, 두께 = (원 − 테두리 × 2 − 점) / 2)으로 그림. 크기 · 색은 그대로(md 원 20 · 점 10 · 선택 테두리 2, sm 16 · 8, 비활성 선택 테두리 1). 크기는 CSS 변수 `--radio-size` · `--radio-dot` · `--radio-border`
- 검증: stylelint · 디자인 시스템 build. 브라우저 확인은 사용자

### 반복 UI 디자인 시스템으로 — Modal.Section · Text · SelectAllCheckbox — 2026-11-17
- 점검(사용자 요청 "페이지에 반복되는 패턴 UI 중 Storybook 컴포넌트에 없는 것"): 디자인 시스템 공개 컴포넌트 88개는 스토리 · 가이드 모두 있음(상수 `WORK_TAB_LABEL_MAX` · 내부 훅 `useCalendarAdapter`만 스토리 없음). 화면에서 반복되는데 없던 것 4가지 중 3가지 반영. Codex 검토(읽기 전용) 의견 참고 — Text · SelectAll은 보류 의견이었으나 사용자가 진행 결정
- 디자인 시스템
  - `Modal.Section`: 팝업 본문 영역 = 소제목(SectionHeading h3, size md 기본 · lg) + 내용, `description` · `step` · `addon` · `actions`, 소제목 ↔ 내용 `gap` 16(기본) · 8. TODO(시안) 간격 — 지금 화면 값 기준. 스토리 Modal Sections, Modal 가이드 "본문 영역" 절
  - `Text`(components/Text): 보조 설명 글자 — `variant` 역할 이름(caption-md 기본 · caption-strong · body-sm · label-strong · body-md) · `tone`(secondary 기본 · body · heading) · `as`. TODO(시안) 글자 규칙. 스토리 · 가이드 `docs/Text.mdx`
  - `SelectAllCheckbox` · `toggleKey`(selection): 앱 `components/common` · `utils/selection`에서 옮김(동작 같음). 스토리 · Selection 가이드 절
- 앱: 팝업 11개 중 10개 17곳 → `Modal.Section`(간격 값 그대로, 다운로드 상세의 `Section` 래퍼 삭제). 내 검색조건 관리는 `ConfigSplit` 오른쪽 칸 첫 줄 맞춤 때문에 그대로. 권한관리 보조 설명 3곳 · 요청 조건 이름 → `Text`(요청 조건 값 14 SemiBold는 역할 이름에 없어 측정값 유지). 담당자 표 · CPID 패널 → 디자인 시스템 `SelectAllCheckbox` · `toggleKey`
- 보류: `Field grow`(검색 필드 남는 폭 채우기) — 확정 결정 "검색 조건 기본 폭"(필드는 흐름, flex로 늘리지 않음)과 반대 방향. 남은 flex(다운로드 센터 파일명 · 정산 가맹점명 · 사업자 찾기)를 지울지 결정 필요
- 컨벤션: 규칙 추가(보조 설명 글자 · 본문 영역), 전체 선택 규칙 위치 변경, 화면 전용 부품에 완료 3 · 후보 4(검색 필드 폭 · 양 끝 정렬 줄 · 2열 그리드 · 표 칸 여백), 폴더 트리 갱신
- 검증: 디자인 시스템 typecheck · lint · build · Storybook 빌드(새 스토리 · 가이드 색인 확인), 앱 typecheck · build. 브라우저 화면 비교는 하지 않음 — Modal.Section은 기존과 같은 flex column + gap, Text는 줄 높이가 역할 이름 값으로 바뀌어 권한관리 보조 문구 줄 높이가 1~2px 다를 수 있음

### 입력 · 셀렉트 폭 옵션 fieldWidth — 2026-11-17
- 사용자 요청: 셀렉트 · 입력 컴포넌트에 같은 폭 옵션. HTML input의 width 속성과 겹치지 않게 SearchPanel과 같은 이름 `fieldWidth`: auto 값에 맞는 폭(시각 셀렉트 00:00 · 23:00 → 95, 2026-11-17 추가) · md 200 · lg 270 (토큰 `field/width/md` · `lg`, fullWidth가 우선)
- 적용: TextField(SearchField · PasswordField · LookupField 포함) · SelectBox · MultiSelect · TableMultiSelect. TableMultiSelect도 다른 셀렉트처럼 감싸는 영역 기본 폭을 따르고 상자가 루트를 채움. SearchPanel 기본 폭 200 · lg 270도 같은 토큰(앞 검색 아이콘 입력 +28)
- 날짜(DateField) · 기간(DateRangeField)은 고정 폭이라 옵션 없음. Field 스토리 FieldWidth · Field 가이드 1절
- 이어서(같은 날): SearchPanel plain에 버튼 위치 분기 — 기본 inline(필드 줄 끝), `actionsPlacement="header"`면 제목 줄 오른쪽(클래스 `.plainHeader`, 제목 줄 높이 40). 스토리 Plain · PlainHeaderActions를 Modal 안에 그려 팝업 전용임을 표시. Figma 차이: 칸 사이 20 · 줄 사이 12 · 제목 ↔ 필드 12 → 검색 조건 규칙 16 유지. xl 팝업 4칸이면 기간 칸이 264보다 좁아 빈 칸 안내(YYYY-MM-DD) 끝이 잘림(확인 필요)
