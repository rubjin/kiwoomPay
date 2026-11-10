# 진행 현황 · 확정 결정

> 세션이 바뀌어도 이어서 작업할 수 있도록 AI가 단계 종료 시마다 갱신한다.
> 사람이 직접 고쳐도 된다. 여기 적힌 확정 결정은 `brief.md`보다 우선한다.

## 현재 단계
- Phase 2 진행 중 — Button·TextButton, Field 계열(Field·TextField·SearchField·TextArea·SelectBox·DateField·DateRangeField) 완료. 다음: Icon, Selection 계열(Checkbox·Radio·ToggleSwitch·Segmented), MultiSelect(시안 없음)
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
| 아이콘 소스 포맷 | Figma에서 SVG 내보내기 → 빌드 시 React 컴포넌트로 변환(svgr, devDependency만). 색은 `currentColor` | 2026-11-10 |
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
- [Q14] 시안 확인 후 TODO 임시값 확정: `tokens/custom/semantic-color.json`(배경·hover·pressed·focus·overlay), `dimension.json`(focus ring)
- [Q15] Neutral Text Action 색: 시안에서 값을 읽지 못해 `Neutral/700` 임시값(`tokens/custom/button.json`, TODO). Text Action hover 표현도 시안 확인 필요(현재 밑줄)
- [Q16] Header Utility Link(Semantic은 Link, 시각은 Primary Line M40) 구현 방식: `Button`에 `href` 지원을 추가할지, 별도 컴포넌트로 둘지
- [Q17] 가이드(Hierarchy 설명)는 Hover를 "한 단계 어두운 배경"이라 쓰지만 시안 값은 Neutral Solid Hover가 더 밝은 회색(Neutral/500). 시안 값을 따름 — 디자인 확인 필요
- [Q18] MultiSelect(Multi-select Dropdown)는 Field 시안에 없어 만들지 않음. 시안 필요
- [Q19] 시안에 없는 항목: 필드 hover 표현, Field 세로(라벨 위) 배치, SelectBox 키보드 이동(↑↓), Small 드롭다운 항목 글자 크기 → 현재 hover·세로 배치는 미구현, 항목 글자는 14px 고정
- [Q20] TODO 임시값(시안 픽셀로 근사, `shadow/focus`는 `0 0 4px 0 rgba(36,132,198,0.30)`로 확정됨): `select/panel-max-height 190`, `select/status-min-height 172`, `z-index/dropdown 100` (`tokens/custom/field.json`)
- [Q21] 시안 불일치 확인: SelectBox Negative 상태의 화살표만 진한 색(#1E293B)이고 나머지 상태는 Neutral/500. 현재 Neutral/500로 통일함. Date Field Default(40)는 시안에서 내용 폭에 딱 붙어 있으나 구현은 아이콘 앞 간격 8px 유지

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
