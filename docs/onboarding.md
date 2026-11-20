# 개발 시작 안내 (처음 받는 개발자용)

키움페이 백오피스 3종(내부관리자 · 가맹점관리자 · 영업대행사)이 함께 쓰는 **디자인 시스템 + 관리자 앱** 저장소입니다.
지금은 디자인 시스템과 내부관리자 앱이 있고, 가맹점관리자 · 영업대행사 앱은 같은 구조로 추가할 예정입니다.

## 1. 처음 설정 (한 번)

| 준비물       | 내용                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Node.js      | 20 이상                                                                                                                                                                  |
| pnpm         | 10 — `corepack enable` 또는 `npm i -g pnpm@10`. **npm · yarn으로 설치하지 않는다** (lockfile은 `pnpm-lock.yaml` 하나)                                                    |
| IBSheet8     | 상용이라 git에 없다. 받은 파일을 `vendor/ibsheet/`에 넣는다 — 목록은 [vendor/README.md](../vendor/README.md). 없어도 앱은 뜨고 표 · 달력이 기본 컴포넌트로 대신 그려진다 |
| VS Code 확장 | 프로젝트를 열면 권장 확장 설치 알림이 뜬다(Prettier · ESLint · Stylelint · EditorConfig). 저장할 때 자동 정리(들여쓰기 2칸)는 Prettier 확장이 있어야 동작                |

```bash
pnpm install     # 저장소 어디서 실행해도 전체(디자인 시스템 · 앱)가 설치된다
```

`git pull` 후 `package.json`이나 `pnpm-lock.yaml`이 바뀌었으면 `pnpm install`을 다시 한다.

## 2. 실행

| 명령 (루트)      | 하는 일                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`       | 내부관리자 앱 http://localhost:5173 + 화면 목록 http://localhost:5180(자동으로 열림) + 디자인 시스템 타입 자동 빌드 |
| `pnpm storybook` | 디자인 가이드 · 컴포넌트 http://localhost:6006                                                                      |
| `pnpm build`     | 디자인 시스템 빌드(`packages/design-system/dist`)                                                                   |
| `pnpm lint`      | ESLint + Stylelint                                                                                                  |
| `pnpm format`    | 전체 Prettier 정리                                                                                                  |

- 앱 개발 서버는 디자인 시스템 **소스를 바로 읽는다** — 컴포넌트를 고치면 앱 화면에 바로 반영(빌드 불필요)
- 앱 운영 빌드: `pnpm --filter @kiwoompay/kwp2-center-admin-fe build` (먼저 `pnpm build`)
- 화면 목록(5180)에서 만든 화면 · 팝업을 한눈에 보고 바로 열 수 있다. 개발 서버에서만 보이는 확인용 페이지: 팝업 모음 `/patterns/popups` · 개발 컨벤션 `/patterns/conventions` · IBSheet 샘플 `/patterns/ibsheet`

## 3. 저장소 구조

```
kiwoompay-ui/
├─ packages/design-system/      디자인 시스템 (@kiwoompay/design-system) — 세 앱 공용
│  ├─ tokens/figma/             Figma 토큰 원본 (수정 금지)
│  ├─ tokens/custom/            코드에서 추가한 토큰
│  ├─ src/components/           단일 컴포넌트 (Button · Field · Modal …)
│  ├─ src/patterns/             화면 패턴 부품 · 흐름 훅 (조회 · 등록 · 찾기 · 처리 …)
│  ├─ src/ibsheet/              IBSheet 연결 (@kiwoompay/design-system/ibsheet)
│  └─ docs/                     Storybook 가이드 (MDX)
├─ apps/kwp2-center-admin-fe/   내부관리자 앱
│  └─ src/features/<1depth>/    메뉴 1depth 단위 기능 폴더 (폴더 = 화면, 파일 = 1depth 공용 api · types · routes)
├─ apps/screen-list/            화면 목록 (개발 확인용)
├─ vendor/                      IBSheet8 (git 제외)
└─ docs/                        연동 · 절차 문서
```

## 4. 화면을 만들 때 지킬 것

전체 규칙은 앱의 **개발 컨벤션 페이지**(`/patterns/conventions`)에 표로 모아 두었다. 자주 쓰는 것만:

- **디자인 시스템 컴포넌트를 조합한다.** 새 UI가 필요하면 Storybook에서 먼저 찾는다. 인라인 `style`로 폭 · 간격을 만들지 않는다
  - 라벨 + 입력은 항상 `Field`, 입력 + 버튼 · 버튼 묶음은 `ControlGroup`(사이 8), 세로 묶음은 `Stack`, 입력 폭은 `fieldWidth`
- **화면 패턴을 따른다** (Storybook `Patterns`)
  - 조회 화면: `SearchPanel` → `ResultPanel` → `ResultFooter` + `useSearchResult` (최초 진입 시 조회하지 않음)
  - 처리 버튼: `useAction` (확인 → 처리 → 완료 · 실패 Alert, 중복 클릭 방지). 앱 버튼에는 "처리 중" 표시를 하지 않는다
  - 찾기 팝업: `useLookup`, 설정 팝업: `useConfigDraft`
- **팝업**: `Modal` 크기 sm 400 · md 620 · lg 880 · xl 1280 · xxl 1680, 하단 버튼은 항상 lg. 팝업 안 조회 조건은 `SearchPanel variant="plain"`
- **결과 표**: 조회 화면의 표는 `IbsheetGrid`(IBSheet), 팝업 안 표는 `GridPlaceholder`
- **조회 결과 제목 줄 버튼 배치**(디자인 없이 기획서만 있을 때도): 왼쪽 Grid 기능 · 오른쪽 처리 → 상태 변경 → 등록 — [기준](ai/references/result-panel-actions.md)
- **선택지**: 서버 공통코드 `useCodeOptions(그룹)` (API 스펙 확정 전이라 지금은 임시값)
- **화면을 만들면** 탭 제목 `constants/screens.ts`와 화면 목록 `apps/screen-list/src/screens.ts`에 한 줄 추가

## 5. 아직 정해지지 않은 것 · 임시인 것

- API: 모든 `*.api.ts`는 예시 데이터를 돌려준다(`TODO(API)`). 서버 주소 · 응답 형식이 정해지면 그 함수만 바꾼다
- 시안이 없어 임시로 정한 부분은 코드에 `TODO(시안)`, Storybook에 "(임의 작업)" 배지로 표시돼 있다
- JSP 연동(정적 폴더 · 셸 JSP · 서버 forward): [jsp-integration.md](jsp-integration.md)의 경로는 예시 — 실제 JSP 프로젝트에 맞춰 확인 필요
- 영역별 확인 필요 항목: [docs/ai/log/](ai/log/) 각 파일의 "열린 질문"

## 6. 문서

| 문서                                                                          | 내용                                        |
| ----------------------------------------------------------------------------- | ------------------------------------------- |
| Storybook (6006)                                                              | 컴포넌트 · 패턴 사용법 · Do/Don't           |
| [screen-from-spec.md](screen-from-spec.md)                                    | 화면기획서만으로 화면 만들기 (시안 없을 때) |
| [jsp-integration.md](jsp-integration.md)                                      | JSP 셸 · 빌드 산출물 · IBSheet 로드         |
| [token-workflow.md](token-workflow.md) · [icon-workflow.md](icon-workflow.md) | 토큰 · 아이콘 추가 절차                     |
| [vendor/README.md](../vendor/README.md)                                       | IBSheet 파일 배치                           |
| [docs/ai/status.md](ai/status.md)                                             | 확정 결정 (모든 작업에 적용되는 규칙)       |

## 7. 커밋

Conventional Commits, 제목은 한글 50자 안팎 · 마침표 없음. 예: `feat(field): 입력 폭 옵션 fieldWidth 추가`
type: feat · fix · refactor · style · docs · chore · build · test / scope: 컴포넌트 이름 · tokens · storybook 등
