# Foundation (토큰 · 테마 · 글자 · 간격 · 아이콘)

> 범위: build-tokens · 시스템별 키컬러 · Typography · Spacing · Icon. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### 토큰

- 원본 `tokens/figma/*`(수정 금지) + `tokens/custom/*.json`(퍼블리셔 작성, DTCG) → `scripts/build-tokens.mjs` → `_generated.scss`(SCSS 변수 + `--kp-*`). 이름 충돌 · 참조 끊김 · 순환은 빌드 에러. 절차는 `docs/token-workflow.md`
- 토큰으로 두는 것: 색 전부 · typography · shadow · z-index · breakpoint · 여러 컴포넌트 공유 크기 · JS가 CSS 변수로 읽는 값(Tooltip 화살표 · Work Tab 메뉴 위치 · Select · DatePicker 팝업 간격). 한 컴포넌트 전용 크기는 그 `*.module.scss` 맨 위 SCSS 변수
- Spacing Scale 12단계(0·4·8·12·16·20·24·32·40·48·64·80) = Figma `space/*`. Scale 값과 같은 간격은 `t.$space-N`, Scale 밖은 시안 측정값

### 시스템별 키컬러

- `tokens/custom/themes/<시스템>.json`이 기존 토큰 값만 덮어씀(typography 불가) → `:root[data-system='<시스템>']`. 속성은 **html에** 붙인다(alias 변수가 html에서 계산됨). Storybook 툴바 "시스템"으로 확인

### Typography

- 컴포넌트 SCSS는 Figma 스타일 이름 `@include m.typography(typo-<크기>-<굵기>)` — 없는 이름은 빌드 에러. 컴포넌트 전용 글자 역할은 만들지 않는다
- 역할 이름(앱 화면용 alias, Figma description 기준). description이 없는 스타일은 Figma 이름으로만 제공

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

### Icon

- `src/assets/icons/Name=<이름>, Size=<크기>.svg` → `scripts/build-icons.mjs`(`pnpm icons`, build · storybook이 자동 실행) → `icons.generated.tsx`. 절차 `docs/icon-workflow.md`
- 색 변환: 흰 선 → `currentColor`, 상태 채움 → 토큰 색, 색 도형 위 글리프 → on-color. 선 아이콘은 고정 색 없음(회색이 필요하면 쓰는 쪽에서 color)
- 요청 크기 variant가 없으면 가장 가까운 큰 variant를 줄여 그림. 크기별 모양이 다른 아이콘(filter 16 깔때기 / 24 슬라이더, edit)은 그대로
- Icon 데이터는 한 모듈이라 tree-shaking 안 됨(라이브러리 JS 약 +56KB)
- 아이콘은 디자인 시스템, 로고 · 그림은 앱(`apps/<앱>/src/assets/`)

## 열린 질문

- [Q13] 모바일 시안 확인 후 `tokens/custom/breakpoint.json` 값 확정 (현재 TODO 임시값 tablet 1024 / mobile 768)
- [Q14] 시안 확인 후 TODO 임시값 확정: `tokens/custom/semantic-color.json`(hover·selected·pressed·focus·overlay), `dimension.json`(focus ring)
- [Q24] 아이콘 이름 지정 확인 (Figma 이름만으로 만들 수 없어 `scripts/build-icons.mjs`에서 지정): `1dp(0~6)` → home·card-check·bar-chart·file-text·building·archive·shield-check, `Link-external` 12·`24-1`(↗) → `arrow-up-right`, `Setting` `20-1`(슬라이더) → `setting-sliders`. Figma 쪽 이름도 맞춰 두면 좋음
- [Q26] 회색으로 내보낸 선 아이콘(eye·eye-off·pin-line·drag-handle·info-circle 16·arrow-up-right)은 `currentColor`로 바꿈. loading 아이콘 회전 애니메이션은 motion 토큰이 없어 미포함
- [Q39] Spacing 가이드 Usage ↔ 시안 측정값 차이(현재 시안 값 유지): ① Container Padding 20·24 ↔ Section 카드 16(한 줄 12)·Date Picker 패널 16 ② Button group 12·16 ↔ 버튼 간격 8 ③ Icon–Text 8 ↔ Button 아이콘 간격 4
- [Q40] 가맹점관리자 Primary는 500(#514FEC)만 확정. 나머지 단계는 OKLCH로 계산한 임시값(`themes/merchant.json`) → 디자인 10단계 확정 필요. 영업대행사 Primary 500 #9C59BE · 전자계약 Primary 500 #00ADA5 확정(500만) — 테마 파일(`themes/agency.json` · 전자계약)은 아직 없음. 만들 때 merchant처럼 나머지 단계 계산 임시값으로 할지, 디자인 10단계를 받을지 확인 필요. 전자계약은 시스템 구분값(`data-system`) · 앱 이름도 정해야 함
