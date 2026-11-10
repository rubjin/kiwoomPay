# 진행 현황 · 확정 결정

> 세션이 바뀌어도 이어서 작업할 수 있도록 AI가 단계 종료 시마다 갱신한다.
> 사람이 직접 고쳐도 된다. 여기 적힌 확정 결정은 `brief.md`보다 우선한다.

## 현재 단계
- Phase 2 완료(MultiSelect만 시안 대기). Phase 3 진행 중 — Pagination · Date Picker · Badge · Modal · Tab 완료. 남은 것: Tooltip (시안 필요). Search 가이드(SearchArea) 완료
- Phase 4 진행 중 — LNB · Work Tab · Page Layout 완료. 남은 것: Header, Footer, Compact Navigation, Grid(layout), display, chart&kpi (시안 필요)
- Phase 1 완료·커밋됨 (Storybook 빌드 확인 완료)

## 확정 결정
| 항목 | 결정 | 확정일 |
| --- | --- | --- |
| Figma 토큰 범위 | **Figma 토큰은 위 3개 파일로 고정. 더 추가하지 않는다.** 부족한 토큰(radius·border·shadow·z-index·motion·breakpoint·control·추가 Semantic 색)은 퍼블리셔가 코드에서 직접 변수화한다. brief 4번의 "Figma = 단일 출처"·토큰 변경 절차(4-9)보다 우선 | 2026-11-10 |
| 코드 토큰 위치 | `tokens/figma/*`(원본, 수정 금지)와 별도로 `tokens/custom/*.json`(퍼블리셔 작성, Figma 내보내기와 같은 DTCG 형식)을 둔다. build-tokens가 둘을 합쳐 SCSS 변수 + `--kp-*` CSS 변수를 1:1로 생성. 이름 충돌 시 빌드 에러 | 2026-11-10 |
| 코드 토큰 값 | 시안에서 확인한 값만 넣는다. 시안이 없으면 `TODO` 주석이 달린 임시값 | 2026-11-10 |
| 브랜드 메인 컬러 | `Primary/500` `#2484C6` | 2026-11-10 |
| 시스템별 토큰 | 가맹점관리자·내부관리자·영업대행사 모두 같은 토큰 사용 (파일명의 "Internal_Admin"과 무관) | 2026-11-10 |
| 계층 분류 | Figma 컬렉션은 1개 그대로 둔다. 코드에서 Primitive(`Primary`·`Neutral`·`Base`) / Semantic(`Text`·`Line`·`Status`·`Chart`)으로 분류. 컴포넌트는 Semantic·Component 토큰만 참조 | 2026-11-10 |
| 추가 Semantic 색 | 코드(`tokens/custom`)에서 Primitive alias로 추가: 배경(surface·page·hover·selected), primary hover/pressed, focus ring, overlay(dim). 매핑은 시안 확인 후 | 2026-11-10 |
| Status·Chart raw hex | 값 그대로 유지 (Primitive로 올리지 않음). `Chart/Previous`(=Neutral/400 값)도 그대로 | 2026-11-10 |
| Typography 이름 | Figma 이름(`Typo/14/Regular`)을 그대로 생성하고, 역할 이름(예: `body/md`)을 코드에서 alias로 추가. 컴포넌트는 역할 이름만 사용. 매핑안은 아래 | 2026-11-10 |
| Pretendard 로딩 | 웹폰트. 패키지에 woff2(dynamic subset) self-host — 사내망·CDN 차단 대비. fallback: `Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif` | 2026-11-10 |
| size(sm/md/lg) | 이름에 넣은 단일 변수 (`control/height/sm` 등). 모드 사용 안 함 | 2026-11-10 |
| Figma Code syntax(Web) | 입력하지 않음 (Figma 토큰 추가 없음, 이름 변환 규칙으로 대응) | 2026-11-10 |
| 지원 브라우저 / IE | 최신 Chrome·Edge(데스크톱). 가맹점관리자는 iOS Safari·Android Chrome 최신 2버전 추가. IE 미지원 (React 18도 IE 미지원) | 2026-11-10 |
| 아이콘 소스 포맷 | Figma에서 SVG 내보내기(`Name=<이름>, Size=<크기>.svg`) → `scripts/build-icons.mjs`가 React 데이터(`icons.generated.tsx`)로 변환. svgr 대신 자체 스크립트(의존성 없음). 선 아이콘은 `currentColor`, 상태 아이콘만 토큰 색 | 2026-11-10 |
| Chart 라이브러리 | Recharts (React 친화·SVG·백오피스 차트 종류 충분). Phase 4에서 도입 | 2026-11-10 |
| DatePicker 외부 라이브러리 | 사용 안 함. Calendar 직접 구현(네이티브 Date) | 2026-11-10 |
| 브레이크포인트 구조 | `tokens/custom`의 별도 그룹 `breakpoint/*` (space와 섞지 않음). 값은 모바일 시안 확인 후 | 2026-11-10 |

### Typography 역할 이름 매핑안 (Figma description 기준, 시안 확인 시 조정)
| 역할 이름 | Figma 스타일 | 용도 |
| --- | --- | --- |
| `heading/xl` | Typo/24/Bold | 페이지 최상위 제목 |
| `heading/lg` | Typo/20/Bold | 팝업 제목, 주요 수치 |
| `heading/md` | Typo/18/SemiBold | 섹션 제목, 카드 제목 |
| `heading/sm` | Typo/16/SemiBold | 하위 영역 제목 |
| `body/md` | Typo/14/Regular | 본문, 테이블, 입력값 |
| `body/sm` | Typo/13/Regular | 보조 본문 |
| `label/md` | Typo/13/Medium | 버튼, 탭, 메뉴 |
| `label/strong` | Typo/13/SemiBold | 선택 상태 |
| `label/field` | Typo/13/Bold | 필드 레이블 |
| `caption/md` | Typo/12/Regular | 도움말, 캡션 |
| `caption/strong` | Typo/12/SemiBold | 소형 강조 |

- 11·10px 스타일(LNB 전용)은 역할 이름 대신 `lnb/*` Component 토큰으로 둔다.
- description이 없는 스타일은 역할 이름 없이 Figma 이름으로만 제공한다.

## 열린 질문
- [Q12] JSP 프로젝트의 실제 정적 폴더 경로·컨텍스트 패스 (docs/jsp-integration.md는 `webapp/static/<앱>/` 가정)
- [Q13] 모바일 시안 확인 후 `tokens/custom/breakpoint.json` 값 확정 (현재 TODO 임시값 tablet 1024 / mobile 768)
- [Q14] 시안 확인 후 TODO 임시값 확정: `tokens/custom/semantic-color.json`(hover·selected·pressed·focus·overlay), `dimension.json`(focus ring). `Bg/Page`(Neutral 50)·`Bg/Surface`(흰색)는 Page Layout Guide로 확정
- [Q15] Neutral Text Action 색: 시안에서 값을 읽지 못해 `Neutral/700` 임시값(`tokens/custom/button.json`, TODO). Text Action hover 표현도 시안 확인 필요(현재 밑줄)
- [Q16] Header Utility Link(Semantic은 Link, 시각은 Primary Line M40) 구현 방식: `Button`에 `href` 지원을 추가할지, 별도 컴포넌트로 둘지
- [Q17] 가이드(Hierarchy 설명)는 Hover를 "한 단계 어두운 배경"이라 쓰지만 시안 값은 Neutral Solid Hover가 더 밝은 회색(Neutral/500). 시안 값을 따름 — 디자인 확인 필요
- [Q18] MultiSelect(Multi-select Dropdown)는 Field 시안에 없어 만들지 않음. 시안 필요
- [Q19] 시안에 없는 항목: 필드 hover 표현, Field 세로(라벨 위) 배치, SelectBox 키보드 이동(↑↓), Small 드롭다운 항목 글자 크기 → 현재 hover·세로 배치는 미구현, 항목 글자는 14px 고정
- [Q20] TODO 임시값(시안 픽셀로 근사, `shadow/focus`는 `0 0 4px 0 rgba(36,132,198,0.30)`로 확정됨): `select/panel-max-height 190`, `select/status-min-height 172`, `z-index/dropdown 100` (`tokens/custom/field.json`)
- [Q21] 시안 불일치 확인: SelectBox Negative 상태의 화살표만 진한 색(#1E293B)이고 나머지 상태는 Neutral/500. 현재 Neutral/500로 통일함. Date Field Default(40)는 시안에서 내용 폭에 딱 붙어 있으나 구현은 아이콘 앞 간격 8px 유지
- [Q22] Selection 시안에 없는 항목(임시값, Radio sm 선택 점 8은 확정됨, `tokens/custom/selection.json` TODO): 비활성 라벨 색·비활성 미선택 배경, 가로 그룹 간격, Segmented 최소 폭 96·좌우 패딩 16·옵션 간 간격 8(시안은 단일 옵션만 보여줌), sm 라벨 글자 크기(13px), 체크박스 sm 체크 아이콘 크기(20 프레임을 0.8배)
- [Q23] Checkbox·Radio·Toggle·Segmented의 hover 표현은 시안에 없어 미구현. 토글 이동 애니메이션은 motion 토큰이 없어 미구현
- [Q24] 아이콘 이름 지정 확인 (Figma 이름만으로 만들 수 없어 코드에서 지정, `scripts/build-icons.mjs`): `1dp(0~6)` → home·card-check·bar-chart·file-text·building·archive·shield-check, `Link-external` 12·`24-1`(↗ 모양) → `arrow-up-right`, `Setting` `20-1`(슬라이더 모양) → `setting-sliders`. Figma 쪽 이름도 맞춰 두면 좋음
- [Q26] 회색으로 내보낸 선 아이콘(eye·eye-off·pin-line·drag-handle·info-circle 16·arrow-up-right)은 규칙(고정 컬러 없음)에 따라 `currentColor`로 바꿈 → 회색이 필요하면 쓰는 쪽에서 color 지정. loading 아이콘 회전 애니메이션은 motion 토큰이 없어 미포함
- [Q28] Pagination 반응형(가맹점관리자 모바일) 시안 없음 → 미적용. 결과가 1페이지 이하일 때 숨길지는 화면 정책으로 정함(컴포넌트는 그대로 표시)
- [Q29] Date Picker: 시안 표기 패널 높이 380 ≠ 측정 340(6줄, 테두리 포함) → 측정값 사용. 필드 ↔ 패널 간격 8은 임시값(TODO). 기간 선택 중 마우스 위치까지 미리 보여주는 표시는 시안에 없어 미구현
- [Q30] Badge 임시값(TODO): Neutral 상태 점 색(Neutral/500), Primary 외 tone의 Line 테두리(각 Status Border), Number 두 자리 이상 좌우 여백 6·글자(12 SemiBold). 3글자 이상 배지는 시안보다 2px 넓게 렌더링됨(글자 폭 반올림 차이로 판단, 2글자는 정확히 일치)
- [Q31] Modal 임시값(TODO): 그림자(0 4px 20px rgba(0,0,0,.1) 근사), z-index 체계(모달 1000 · 팝업 1100). 시안의 제목→본문 간격이 19(측정)라 높이가 시안보다 1~2px 큼. Tab 키 포커스 가두기(focus trap)는 a11y 범위 밖이라 미구현
- [Q32] LNB 임시값(TODO, `tokens/custom/lnb.json`): 3Depth Hover 표현(파란 글자 + ↗로 해석 — ↗가 "이동" 표시인지 외부 링크 표시인지 확인 필요, 외부 링크는 link-external 아이콘으로 구분), Active 점 크기 3, 탭 아래 구분선. 로고 이미지 파일 필요(예시는 임시 텍스트). 긴 메뉴명 툴팁은 Tooltip 전까지 기본 title 사용
- [Q33] 가맹점관리자 모바일 LNB(Compact Navigation) 시안 없음 → 반응형 미적용. 즐겨찾기 편집 Modal 내용(메뉴 트리 + 체크박스)은 시안이 없어 Storybook 예시로만 제공
- [Q34] Tab 임시값(TODO, `tokens/custom/tab.json`): Item 좌우 여백 4 · 간격 24, Button Tab 최소 폭 76 · 좌우 여백 16 · 간격 8, 비활성 Tab Badge 색. Hover 표현 시안 없음(미구현). Title Tab 변형 시안 없음(미구현). Tab Guide는 "Small 32 = LNB처럼 밀도 높은 영역"인데 LNB 시안의 탭 높이는 40 → LNB는 기존 40 유지, 확인 필요
- [Q35] Header Global Search는 "상세 UI 확인 필요"라 컴포넌트 미제작(가이드에만 정리). Search 가이드의 회색 박스는 다른 섹션과 같은 설명용 카드로 보고 SearchArea에 넣지 않음 — 검색 영역에 박스가 필요한지 확인 필요

- [Q36] Work Tab 시안 확인 필요(`tokens/custom/work-tab.json` TODO): ① State 예시의 Default·Hover Tab은 내용보다 넓지만 Workspace Bar 예시는 내용 폭 → 내용 폭으로 구현, Hover 시 닫기(X)가 나타나며 Tab이 넓어짐 ② Active Tab의 •••와 "열린 화면 N ⌄" Trigger가 같은 Tab 관리 메뉴를 여는 것으로 해석(둘 다 Active Tab 대상) ③ 메뉴명 말줄임 폭 160, •••로 열 때 Tab ↔ 메뉴 4, 메뉴 항목 Hover·비활성, Trigger ↔ 메뉴 8은 임시값 ④ 고정 Tab 표시(아이콘 등) 시안 없음 → 닫기 숨김만. (Trigger 위치는 Page Layout GUI로 확인: Work Tab 줄 오른쪽 끝, 밑줄 없는 글자 + 화살표 → 반영함)
- [Q37] Page Layout 확인 필요: ① 실제 GUI의 검색 조건 카드는 제목 줄 오른쪽에 [새로고침]·[조회], 아래에 [상세 검색 ⌄] — Search 가이드의 SearchArea(필드 줄 끝에 초기화·조회·상세조건)와 배치가 다름. 어느 쪽을 표준으로 할지 ② Header·Work Tab을 스크롤 시 고정(sticky)할지(현재 본문과 함께 스크롤, LNB만 고정) ③ 페이지 하단 여백(Total·Pagination 줄 ↔ Footer)은 상단과 같은 20으로 둠 ④ 가맹점관리자 반응형 시안 없음 → 미적용 ⑤ 적용된 검색 조건 칩·조회 요약 카드는 Data Display 가이드 때 제작

## 단계별 요약
<!-- 각 Phase 종료 시 아래 형식으로 추가
### Phase N — YYYY-MM-DD
- 만든 것:
- 한 가정:
- 다음 할 일:
-->

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

### Component: Icon — 2026-11-10
- 만든 것
  - `scripts/build-icons.mjs`(`pnpm icons` / `icons:check`): `Name=…, Size=….svg` → `src/components/Icon/icons.generated.tsx`. 이름 kebab-case 변환, 크기·viewBox 검증, 색 변환(선 → currentColor, 상태 채움 → 토큰 변수, 색 위 글리프 → on-color), clipPath id 고유화. `pnpm build`·`pnpm storybook`이 자동 실행
  - `Icon` 컴포넌트: `name`(70개, 타입 검사) · `size`(12/16/20/24, 기본 24). 해당 크기 variant가 없으면 가장 가까운 큰 variant를 줄여서 그림. `aria-label`이 있으면 role=img, 없으면 aria-hidden. `iconNames`·`getIconSizes` 제공
  - 토큰 `tokens/custom/icon.json`: icon-muted·accent·info·success·warning·error·on-color (모두 Figma 색 alias)
  - Field(Search·Select 화살표·Calendar)와 Button stories의 임시 아이콘을 Icon으로 교체. 필드 지우기 아이콘만 필드 전용으로 유지(시안 색이 Delete 아이콘과 다름)
  - Storybook: `Icon.stories.tsx`(Playground·Sizes·Colors·Status·검색 가능한 Gallery), 가이드 `docs/Icon.mdx`, 절차 문서 `docs/icon-workflow.md`
- 검증: typecheck · lint · build · Storybook 빌드 · `icons:check` 통과. 올바른 색으로 내보낸 `Icon-N.svg`와 Icon 컴포넌트 렌더링을 **픽셀 비교해 62개 모두 일치**(임시 puppeteer 스크립트). 기존 상호작용 테스트 24개 재통과
- 한 가정
  - 이름 있는 `Name=…` 파일(91개 variant)을 원본으로 사용. 이 파일들은 선이 흰색으로 내보내져 있어, 색 도형 앞의 흰색은 currentColor, 뒤의 흰색은 글리프로 판단
  - 크기별로 모양이 다른 아이콘은 그대로 둠(filter 16 깔때기 / 24 슬라이더, edit 16 / 24)
  - Icon 데이터는 한 모듈(약 52KB, gzip 전 소스)로 묶여 tree-shaking되지 않음. 라이브러리 JS가 31KB → 87KB(gzip 24KB)로 증가
- 정리(사용자 요청): 이름이 잘못 내보내진 중복 `Icon.svg`~`Icon-69.svg` 70개를 저장소에서 제거(`Name=…` 91개만 원본으로 유지), 내용이 생긴 폴더의 `.gitkeep` 7개 제거. 가이드에 화이트 버전(어두운 배경) 예시와 갤러리 배경 전환 추가
- 다음 할 일: Q24·Q26 확인, MultiSelect 시안, Phase 3

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

### Component: LNB (Phase 4) — 2026-11-10
- 만든 것
  - `navigation/Lnb`: 로고 · 접기(햄버거), 메뉴 검색(SearchField sm), View Tab(전체 메뉴 / 즐겨찾기 + 개수), 1 · 2 · 3Depth 트리(Accordion). Props: `items` · `activeId` · `onNavigate` · `collapsed`/`defaultCollapsed`/`onCollapsedChange` · `view`/`defaultView`/`onViewChange` · `favoriteIds` · `onFavoriteEdit` · `logo`
  - 상태: Active(현재 화면, `aria-current`) · Current(상위 Branch 펼침 유지) · Hover. `activeId`가 바뀌면 상위 메뉴를 같은 렌더에서 펼침(사용자가 연 메뉴는 유지)
  - Collapsed(폭 48): 1Depth 아이콘 + Current 배경, 아이콘 클릭 시 펼치고 해당 메뉴 열기. 접기·펼치기 후에도 메뉴 상태 유지
  - 즐겨찾기 View: 메뉴명 + 경로, Empty 안내 + [즐겨찾기 편집]. 편집은 `onFavoriteEdit` → 화면에서 Modal로 처리
  - 검색: 하위 메뉴 없는 메뉴 중 이름 일치, 키워드 Primary 강조 + 경로(말줄임), 결과 선택 시 이동 · 검색어 비움, 결과 없음 안내
  - `href`가 있으면 `<a>`(JSP 페이지 이동), `external`이면 새 창 + link-external 아이콘
  - `lnbUtils`: `findPath` · `searchMenu`. 토큰 `tokens/custom/lnb.json`(색 모두 Figma alias), 타이포 역할 `lnb-*` 9개
  - Storybook stories(Expanded · Collapsed · Favorites · FavoritesEmpty · Interactive(즐겨찾기 편집 Modal 포함)), 가이드 `docs/Lnb.mdx`
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 테스트 23개 통과(폭 240/48, 행 높이 45/42/33, 글자·색, Active·Current·Hover, Accordion, 접기 상태 유지, 검색 강조·경로·없음, 결과 선택 시 이동·상위 펼침, 즐겨찾기 탭·편집 Modal·Empty). 기존 테스트(공통 24 · Pagination 20 · DatePicker 32 · Modal 21) 재통과
- 한 가정: 1Depth만 아이콘을 받음. 검색 대상은 실제 화면 메뉴(하위 없음)만. 3Depth Hover·Active 점·탭 구분선은 임시값(Q32)


### Component: Tab (Phase 3) — 2026-11-10
- 만든 것: `Tab`(Compound, `Tab.Item`) — variant line(밑줄)·button, size md 40·sm 32, `fullWidth`(Equal Width), `count`(Number Badge soft, 99+ · 0 표시), controlled·uncontrolled. `NumberBadge`에 `appearance="soft"` 추가(Primary 100 배경 + Primary 글자). 토큰 `tokens/custom/tab.json`(색 모두 alias), 타이포 역할 `tab-md`·`tab-active-md`·`tab-sm`·`tab-count-md`. stories, 가이드 `docs/Tab.mdx`
- 검증: 브라우저 테스트 19개 통과(높이 40/32, 글자 14 Medium·Active 14 SemiBold·Small 13 Medium, 색, 밑줄 2px, Badge 20·간격 6, Button Tab 76×32·반경 6·색, Equal Width, 선택·비활성 클릭 무시)
- 한 가정: 측정값 — Medium Active만 굵게, Small은 Active도 같은 굵기, Medium Badge 숫자 14px(Small은 12px)

### Search 가이드 — 2026-11-10
- 만든 것: `SearchArea`(form role=search) — 기본 조건(children) + 상세 조건(`detail`·`detailActions`), [초기화](`onReset`) · [조회](`onSearch`, Enter도 조회, `loading`) · [상세조건]/[상세조건 닫기](`expanded`·`defaultExpanded`·`onExpandedChange`), 문구 변경 `labels`. `Field`에 `labelPosition="top"` 추가(Q19 세로 배치 해소). 토큰 `tokens/custom/search.json`, `field/label-gap-top`. stories, 가이드 `docs/Search.mdx`(Search Type Map · Header Global Search 개념 · LNB Menu Search · Body Search Area · Common Rule & Scope)
- 검증: 브라우저 테스트 14개 통과(라벨 위 배치·간격, 필드·버튼 32·아래선 맞춤, 펼침/접힘·aria-expanded, detail 없으면 버튼 없음, Enter·조회·초기화·로딩, Validation). 기존 테스트(공통 24 · Modal 21 · LNB 23 · Badge 18/21 기존 Q30) 재통과
- 한 가정: 버튼은 라벨 한 줄 높이 + 간격만큼 내려 필드 줄에 맞춤(오류 문구가 생겨도 위치 유지). 필드 폭은 화면에서 지정

### Search 가이드 시안 실측 반영 — 2026-11-10
- `temp/가이드/Search_Guide.png`(1x)로 Body Search Area 픽셀 측정 → 임시값 확정: 필드 간격 12 → 16(필드 ↔ 버튼 묶음도 16), 버튼 간격 8 유지, 라벨(위) ↔ 필드 8 → 4
- 추가: 상세 조건을 펼치면 기본 조건 아래 16에 구분선(`Line/Subtle` 1px, 내용 폭 전체), 구분선 아래 24에 상세 조건 줄. `search-area/row-gap` 삭제 → `detail-gap`·`detail-padding`·`color/search-area/divider`
- 검증: typecheck · lint · build · Storybook 빌드 통과. DetailExpanded 렌더링을 같은 방식으로 측정해 간격·구분선 일치 확인(라벨 ↔ 필드, 구분선 ↔ 다음 줄은 1px 차이 — 라벨 줄 높이 19.5px 반올림)

### Component: Work Tab (Phase 4) — 2026-11-10
- 만든 것
  - `Tab/WorkTab`(Compound): `WorkTab`(Workspace Bar, `value`·`defaultValue`·`onChange` · `onClose` · `actions`) · `WorkTab.Item`(메뉴명 · `closable`) · `WorkTab.ActionMenu`("열린 화면 N ⌄" Trigger + 메뉴 레이어). `WORK_TAB_LIMIT`(10) export — 초과 얼럿은 화면에서 처리
  - 상태: Default(메뉴명만) · Hover(Neutral 100 + 닫기) · Active(Primary 100 · Primary 200 테두리 · 아래 선 2px + 더보기(•••) + 닫기, 1개만). Item 사이 Gap 없이 테두리 공유, 긴 메뉴명 말줄임 + title
  - Tab 관리 메뉴: Modal이 아닌 Trigger 종속 레이어(body에 띄움), 바깥 클릭 · Esc(모달보다 먼저) 닫기, 선택 시 닫고 `onSelect`
  - `useFloatingPosition`에 `align: 'end'`(오른쪽 맞춤) 추가
  - 토큰 `tokens/custom/work-tab.json`(색 모두 Figma alias, z-index-active 1). 타이포는 기존 역할(label-md · body-md · heading-sm) 사용
  - Storybook stories(Playground · States · WorkspaceBar · LongLabelAndFixed · ActionMenu · Interactive — 열기 · 닫기 · 고정 · 10개 초과 얼럿), 가이드 `docs/WorkTab.mdx`(Storybook `Components/Tab/Work Tab Guide`)
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 테스트 28개 통과(높이 40 · 테두리 공유 · 모서리 8, 상태별 색 · 글자, 아이콘 24 · 간격 4 · 여백 12, Hover 닫기, 선택, 더보기 메뉴 열기 · Esc · 바깥 클릭, 메뉴 200 · 항목 33, Trigger 아래 16 · 오른쪽 맞춤, 10개 초과 얼럿, Active 닫기 후 이웃 Active, 다른 탭 모두 닫기, 고정). 렌더링 캡처가 시안과 일치
- 한 가정: 시안 측정값 사용(Q36의 임시값 제외). 메뉴 항목 동작(새 탭 · 고정 · 닫기)은 화면 정책이라 `actions`로 받음

### Component: Page Layout (Phase 4) — 2026-11-10
- 만든 것
  - `layout/PageLayout`(Compound): App Shell 슬롯 `lnb` · `header`(66) · `workTab` + `workTabActions`(60, Tab 40은 아래 선에 붙음) · `footer`(74), Page Content(좌우 24 · 상단 20 · Section 간격 12). `PageLayout.Title`(화면명 24 Bold + 화면별 Action, 높이 40) · `PageLayout.Section`(흰 카드 · 반경 8 · 여백 16, `layout="inline"`(제목 옆 한 줄, 제목 16) · `compact`(여백 12) · `divider`(제목 줄 아래 선) · `plain`(카드 없음) · `titleAddon` · `actions`)
  - LNB는 화면 높이에 고정(sticky), 본문은 문서 스크롤. Grid(IBSheet8)는 슬롯 — 자체 스크롤
  - 토큰 `tokens/custom/page-layout.json`(색은 Semantic alias). `Bg/Page`·`Bg/Surface` TODO 해제
  - Work Tab 수정: "열린 화면 N" Trigger를 GUI대로 밑줄 없는 글자 + 화살표로 변경(`trigger/padding-bottom`·`trigger/line` 토큰 삭제, 메뉴 간격 16 → 8 TODO). Work Tab 가이드의 선은 Bar 아래 선으로 해석
  - Storybook stories(Structure · TradeList(1920 예시, 상세조건 Push Down) · ContentOnly), 가이드 `docs/PageLayout.mdx`(Storybook `Components/Layout/Guide`)
- 검증: typecheck · lint · build · Storybook 빌드 통과. 1920 화면에서 브라우저 측정 17개 통과(LNB 240 · Main 1680 · Content 1632, Header 66 · Work Tab 60 · Title 40 · Footer 74, 여백 24/20, Section 간격 12 · 카드 반경 8 · 여백 16/12 · 제목 18/16, 상세조건 펼침 시 아래 Section이 같은 거리만큼 밀림, 스크롤 시 LNB 고정). Work Tab 테스트 28개 재통과
- 한 가정: 측정은 가이드 02(1920 GUI, 1:1)를 기준으로 함. Header·Footer 내용은 자리 표시(컴포넌트 시안 대기)
