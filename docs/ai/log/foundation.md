# Foundation (토큰 · 테마 · 글자 · 간격 · 아이콘)

> 범위: build-tokens · 시스템별 키컬러 · Typography · Spacing · Icon.
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## Typography 역할 이름 매핑안 (Figma description 기준, 시안 확인 시 조정)
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

- description이 없는 스타일은 역할 이름 없이 Figma 이름으로만 제공한다.

## 열린 질문

- [Q13] 모바일 시안 확인 후 `tokens/custom/breakpoint.json` 값 확정 (현재 TODO 임시값 tablet 1024 / mobile 768)
- [Q14] 시안 확인 후 TODO 임시값 확정: `tokens/custom/semantic-color.json`(hover·selected·pressed·focus·overlay), `dimension.json`(focus ring). `Bg/Page`(Neutral 50)·`Bg/Surface`(흰색)는 Page Layout Guide로 확정
- [Q24] 아이콘 이름 지정 확인 (Figma 이름만으로 만들 수 없어 코드에서 지정, `scripts/build-icons.mjs`): `1dp(0~6)` → home·card-check·bar-chart·file-text·building·archive·shield-check, `Link-external` 12·`24-1`(↗ 모양) → `arrow-up-right`, `Setting` `20-1`(슬라이더 모양) → `setting-sliders`. Figma 쪽 이름도 맞춰 두면 좋음
- [Q26] 회색으로 내보낸 선 아이콘(eye·eye-off·pin-line·drag-handle·info-circle 16·arrow-up-right)은 규칙(고정 컬러 없음)에 따라 `currentColor`로 바꿈 → 회색이 필요하면 쓰는 쪽에서 color 지정. loading 아이콘 회전 애니메이션은 motion 토큰이 없어 미포함
- [Q39] Spacing 가이드 Usage와 컴포넌트 시안 측정값 차이(현재 시안 값 유지): ① Container Padding 20·24 ↔ Page Layout Section 카드 16(한 줄 12)·Date Picker 패널 16 ② Button group 12·16 ↔ 버튼 간격 8(Search·Modal Footer·Page Title·Button Tab) ③ Icon–Text 8 ↔ Button 아이콘 간격 4. 어느 쪽을 기준으로 할지 확인
- [Q40] 가맹점관리자 Primary는 500(#514FEC)만 확정. 50~400·600~900은 기본 Primary 단계의 밝기·채도 관계(OKLCH)를 500에 적용해 계산한 임시값(TODO, `tokens/custom/themes/merchant.json`) → 디자인에서 10단계 확정 필요. 영업대행사 키컬러 미정(정해지면 `themes/agency.json` 추가)

## 작업 기록

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

### Foundation: Spacing 가이드 — 2026-11-10
- 확인: Spacing Scale 가이드의 12단계(0·4·8·12·16·20·24·32·40·48·64·80)가 Figma `space/*`와 값·이름 모두 일치 → 토큰 수정 없음. 코드 토큰 중 Scale 값과 같은 간격은 모두 `{space.N}` alias, 숫자로 적힌 간격은 Scale 밖 시안 측정값(6·10·14·11·44)뿐
- 만든 것: 가이드 `docs/Spacing.mdx`(Storybook `Foundation/Spacing`) — Scale 표(CSS 변수로 막대 표시), Gap & Padding, Usage 4단계와 현재 컴포넌트 토큰 대응, Scale 밖 값 목록, Do/Don't, 확인 필요(Q39)

### 시스템별 키컬러(테마) — 2026-11-11
- 만든 것: `tokens/custom/themes/merchant.json`(Primary 50~900 + `Shadow/Focus`). `build-tokens.mjs`가 `tokens/custom/themes/*.json`을 읽어 `$themes` 맵 생성(기존 토큰만 덮어쓰기 · typography 불가 · 참조 끊김 · 파일명 규칙은 빌드 에러), `base/_root.scss`가 `:root[data-system='<시스템>']`로 출력. Storybook 툴바 "시스템"(내부관리자 기본 · 가맹점관리자 · 영업대행사). 문서 `docs/token-workflow.md` C절, `docs/jsp-integration.md`(html에 data-system)
- 검증: tokens:check · typecheck · lint · build · Storybook 빌드 통과, 에러 케이스 3개 확인. 브라우저 테스트 18개 통과(속성 없음 · internal · agency는 #2484C6, merchant는 버튼 · 탭 · LNB Active 배경(Primary 100) · 포커스 번짐이 가맹점 색)
- 한 가정: 테마는 html에 붙여야 함(alias 변수가 html에서 계산됨). 가맹점 Primary 9단계는 계산 임시값(Q40)

### 리팩토링: 컴포넌트 전용 크기를 SCSS 변수로 — 2026-11-11
- 변경: 컴포넌트 JSON의 크기 토큰 149개 중 한 SCSS 파일에서만 쓰는 131개를 그 `*.module.scss` 맨 위 SCSS 변수로 옮김(이름 · 값 · TODO 설명 유지, alias는 `t.$space-N` 등으로), 사용처 없는 1개(`lnb/chevron-size`) 삭제. 남긴 17개: 여러 컴포넌트 공유(`field/gap` · `field/label-gap-top` · `field/icon-size/trailing` · `selection/size/*`), 다른 토큰이 참조(`field/radius/*`), JS가 CSS 변수로 읽음(Tooltip 화살표 · 여백, Work Tab 메뉴 위치, Select · DatePicker 팝업 간격). 코드 토큰 549 → 417개
- 문서: `docs/token-workflow.md`(토큰 / SCSS 변수 구분 표), `Spacing.mdx` 규칙, 각 컴포넌트 가이드의 "토큰" 줄, Stylelint 경고 문구
- 검증: tokens:check · typecheck · lint · build · Storybook 빌드 통과. **전체 스토리 129개 · 요소 15,937개의 계산된 스타일(크기 · 위치 · 간격 · 테두리 · 반경 · 색 · 글자 등 36개 속성)이 리팩토링 전과 완전히 동일**(기본 · 가맹점 테마 모두)

### 리팩토링: 글자 스타일을 Figma 이름으로 — 2026-11-11
- 이유(사용자 요청): `@include m.typography(heading-sm)`만 봐서는 크기 · 굵기를 알 수 없어 시안과 대조하기 어려움
- 변경: 컴포넌트 SCSS 58곳을 Figma 스타일 이름(`typo-<크기>-<굵기>`)으로 교체. 컴포넌트 전용 글자 역할 24개(button · badge · lnb · tab · pagination · segmented · cpid-item) 삭제, 역할 이름 11개(heading · body · label · caption)는 앱 화면용으로 유지. `typography` mixin이 없는 이름이면 빌드 에러. DatePicker 제목은 `heading-sm` + `font-weight: 700` 덮어쓰기 → `typo-16-bold`. 가이드 `docs/Typography.mdx`(Storybook `Foundation/Typography`: 스타일 목록 · 크기 · 굵기 · 예시 · 역할 이름 대응) 추가, 각 컴포넌트 가이드의 "글자" 줄 · `docs/token-workflow.md` 갱신
- 검증: tokens · typecheck · lint · build · Storybook 빌드 통과, 오타 이름 빌드 에러 확인. 전체 스토리 141개 계산된 스타일이 변경 전과 동일(회전 중인 Spinner 1개만 애니메이션 타이밍 차이)
