# 진행 현황 · 확정 결정

> 매 세션 자동으로 읽는 파일 — 현재 단계 · 확정 결정 · 문서 지도만 둔다. 여기 적힌 확정 결정은 `brief.md`보다 우선한다.
> 영역별 참조(앞으로 필요한 기준 · 가정 · 파일 위치)와 열린 질문은 `docs/ai/log/*.md`(아래 문서 지도)에 있고, 그 영역을 작업할 때만 읽는다. 완료 내역은 남기지 않는다(git log).
> 사람이 직접 고쳐도 된다.


## 현재 단계
- Phase 2 완료(MultiSelect 포함). Phase 3 완료 — Pagination · Date Picker · Badge · Modal · Tab · Tooltip. Search 가이드(SearchArea) 완료
- Phase 4 진행 중 — LNB · Work Tab · Page Layout · Compact Navigation · Header · Footer · display(CPID List Item · Infobox · Summary Card · Address Search) · LNB Search Result · Tab Title · Lookup Search 완료. · Column Picker(엑셀 다운로드) · Favorite Menu Picker(즐겨찾기 편집) · Action Bar(취소사유입력) 완료. 남은 것: Grid(IBSheet 영역), chart&kpi
- 페이지 패턴: 설계안 확정(`docs/ai/page-patterns-plan.md`, P-1~P-6). **P01 Search → Result 완료** + 적용 화면 KWPC06010201 가맹점 정산 실행/처리 · KWPC04010100 통합 거래내역 · KWPC0104 다운로드 센터(`apps/internal-admin`). P02 Record → Form · **P03 Lookup → Apply · P04 Action → Feedback · P05 Login → Auth · P06 Notification Feed · P07 Selection & Configuration(V01 즐겨찾기 편집 · V02 엑셀 다운로드 설정 · V03 내 검색조건 관리) 완료**(2026-11-13). 다음: 기존 화면(정산 실행 · 통합 거래내역 · 다운로드 센터 · 가맹점 기본정보)의 직접 쓴 confirm/alert 흐름을 `useAction`으로 옮길지 결정 → P05 …
- Phase 1 완료·커밋됨 (Storybook 빌드 확인 완료)

## 확정 결정
| 항목 | 결정 | 확정일 |
| --- | --- | --- |
| Figma 토큰 범위 | **Figma 토큰은 위 3개 파일로 고정. 더 추가하지 않는다.** 부족한 토큰(radius·border·shadow·z-index·motion·breakpoint·control·추가 Semantic 색)은 퍼블리셔가 코드에서 직접 변수화한다. brief 4번의 "Figma = 단일 출처"·토큰 변경 절차(4-9)보다 우선 | 2026-11-10 |
| 코드 토큰 위치 | `tokens/figma/*`(원본, 수정 금지)와 별도로 `tokens/custom/*.json`(퍼블리셔 작성, Figma 내보내기와 같은 DTCG 형식)을 둔다. build-tokens가 둘을 합쳐 SCSS 변수 + `--kp-*` CSS 변수를 1:1로 생성. 이름 충돌 시 빌드 에러 | 2026-11-10 |
| 코드 토큰 값 | 시안에서 확인한 값만 넣는다. 시안이 없으면 `TODO` 주석이 달린 임시값 | 2026-11-10 |
| 토큰 vs 컴포넌트 SCSS 변수 | 토큰(`tokens/custom` → `--kp-*`)은 색 전부 · typography · shadow · z-index · breakpoint · 여러 컴포넌트 공유 크기(`control/*` 등) · JS가 읽는 값만. **한 컴포넌트에서만 쓰는 크기·간격·반경은 그 `*.module.scss` 맨 위 SCSS 변수**(Scale과 같으면 `t.$space-N`). 선언에는 값을 직접 쓰지 않음(Stylelint). brief 4-8 "컴포넌트 SCSS는 토큰만 참조"보다 우선 | 2026-11-11 |
| 브랜드 메인 컬러 | `Primary/500` `#2484C6` | 2026-11-10 |
| 시스템별 토큰 | 컴포넌트·토큰은 세 시스템 공통, **키컬러(Primary 10단계 + 포커스 번짐)만 시스템별**. Figma 토큰 구조는 그대로 두고 코드 테마 파일 `tokens/custom/themes/<시스템>.json`(기존 토큰 값만 덮어씀)으로 처리 → `:root[data-system='<시스템>']`. 내부관리자 = 기본(속성 없음, #2484C6), 가맹점관리자 `merchant` Primary 500 #514FEC, 영업대행사 `agency` 미정(기본색). 키컬러 외 시스템별 차이 없음. brief 1번 "시스템별 테마 없음"보다 우선 | 2026-11-11 |
| 계층 분류 | Figma 컬렉션은 1개 그대로 둔다. 코드에서 Primitive(`Primary`·`Neutral`·`Base`) / Semantic(`Text`·`Line`·`Status`·`Chart`)으로 분류. 컴포넌트는 Semantic·Component 토큰만 참조 | 2026-11-10 |
| 추가 Semantic 색 | 코드(`tokens/custom`)에서 Primitive alias로 추가: 배경(surface·page·hover·selected), primary hover/pressed, focus ring, overlay(dim). 매핑은 시안 확인 후 | 2026-11-10 |
| Status·Chart raw hex | 값 그대로 유지 (Primitive로 올리지 않음). `Chart/Previous`(=Neutral/400 값)도 그대로 | 2026-11-10 |
| Typography 이름 | **컴포넌트 SCSS는 Figma 스타일 이름을 그대로 사용**(`Typo / 16 / SemiBold` → `@include m.typography(typo-16-semi-bold)`) — 이름만 보고 크기 · 굵기를 확인할 수 있게. 없는 이름은 빌드 에러. 컴포넌트 전용 글자 역할(`badge-md` 등)은 만들지 않음. 역할 이름(`heading-sm` 등, `docs/ai/log/foundation.md` 표)은 앱 화면용 alias로만 유지 | 2026-11-11 (변경, 기존 "역할 이름만 사용" 대체) |
| Pretendard 로딩 | 웹폰트. 패키지에 woff2(dynamic subset) self-host — 사내망·CDN 차단 대비. fallback: `Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif` | 2026-11-10 |
| size(sm/md/lg) | 이름에 넣은 단일 변수 (`control/height/sm` 등). 모드 사용 안 함 | 2026-11-10 |
| Figma Code syntax(Web) | 입력하지 않음 (Figma 토큰 추가 없음, 이름 변환 규칙으로 대응) | 2026-11-10 |
| 지원 브라우저 / IE | 최신 Chrome·Edge(데스크톱). 가맹점관리자는 iOS Safari·Android Chrome 최신 2버전 추가. IE 미지원 (React 18도 IE 미지원) | 2026-11-10 |
| 아이콘 소스 포맷 | Figma에서 SVG 내보내기(`Name=<이름>, Size=<크기>.svg`) → `scripts/build-icons.mjs`가 React 데이터(`icons.generated.tsx`)로 변환. svgr 대신 자체 스크립트(의존성 없음). 선 아이콘은 `currentColor`, 상태 아이콘만 토큰 색 | 2026-11-10 |
| Chart 라이브러리 | Recharts (React 친화·SVG·백오피스 차트 종류 충분). Phase 4에서 도입 | 2026-11-10 |
| DatePicker 외부 라이브러리 | **캘린더는 IBSheet 캘린더**(그리드 셀 · 검색 영역 날짜 필드 모두). DateField · DateRangeField는 그대로 두고 `CalendarProvider`(어댑터)로 외부 달력을 연결. 어댑터가 없으면 직접 구현한 DatePicker로 동작(Storybook · IBSheet 연결 전). 기존 "사용 안 함" 대체 | 2026-11-11 |
| 앱 구조 · 라우팅 | 시스템별 앱 3개(`apps/internal-admin` · `merchant-admin` · `agency-admin`). **폴더는 1depth 단위 기능별 구조**(`src/features/<1depth>/` 바로 아래 **폴더 = 화면(2depth), 파일 = 1depth 공용**(`<1depth>.routes.tsx` · `<이름>.api.ts` · `<이름>.types.ts` · `<1depth>.options.ts`), 공통은 `api`(여러 1depth 공용 `<이름>.api.ts` · `.types.ts`) · `components` · `constants` · `hooks` · `store` · `utils`; 기능 폴더끼리 가져다 쓰지 않음 — 2026-11-15 사용자 결정, 기존 `directory-structure.md` 계층 분리 대체). **SPA**: react-router-dom(코드 기반 라우트, 1depth별 모듈 + lazy) + 앱마다 셸 JSP 1개. 서버는 `/api` · `/static` 외 GET을 셸 JSP로 forward. 이유: Work Tab(열린 화면 상태 유지) · LNB 유지 · 기존 프로젝트가 SPA. `docs/jsp-integration.md` | 2026-11-11 |
| React 버전 | **React 19** (기존 내부관리자 프로젝트와 맞춤). 디자인 시스템 peer `^18.3.1 || ^19.0.0`, 개발 · 앱은 19. Phase 1의 "React 18.3" 가정 대체 | 2026-11-11 |
| 그리드 · 캘린더 | **IBSheet(IBSheet8)** 사용. Table/Grid 컴포넌트는 만들지 않고 디자인 시스템은 영역 · 여백 · 테마(토큰 색 · 글자)만 다룸. 검색 영역 날짜 필드도 IBSheet 캘린더(어댑터) | 2026-11-11 |
| 페이지 패턴 | 디자인 시스템 `src/patterns/`에 패턴 템플릿 · 흐름 훅(fetch 없음). 성공/실패 안내는 Alert(Modal)로 통일, Toast 없음. 조회 화면은 최초 진입 시 조회하지 않음. 미저장 이탈 확인은 Work Tab 닫기 · 브라우저 닫기. 조회 전용 값은 텍스트. 시안 없는 신규 UI는 기존 토큰 · 컴포넌트 조합 + `TODO(시안)` 임시값. 상세는 `docs/ai/page-patterns-plan.md` | 2026-11-12 |
| 팝업 하단 버튼 | **Modal Footer 버튼은 항상 lg 48** (사용자 확정 — Figma에 40으로 그려진 팝업이 있어도 디자인 오류로 보고 48) | 2026-11-13 |
| 컨트롤 간격 | **입력 + 버튼 · 버튼 + 버튼 8, 칸 안 라벨 + 입력 12, 형태가 다른 묶음 사이 16** (예: 이력조회 ↔ [추가][삭제] 16, [추가] ↔ [삭제] 8). 묶음은 디자인 시스템 `ControlGroup`(사이 8, `grow`), 버튼 세트 + 버튼 세트는 `ControlGroup spacing="lg"`(16) 안에 세트마다 `ControlGroup` — **인라인 스타일로 간격을 만들지 않음**. Spacing 가이드 3-1 | 2026-11-13 |
| 라벨 + 폼 필드 묶음 | **라벨 + 폼 필드(+ 붙는 버튼)는 항상 하나의 묶음으로** (사용자 지시, 앞으로 모든 작업). **라벨이 있으면 항상 `Field`** — 표 칸 안은 `variant="inline"`(= `FormTable.InlineField`, 라벨 ↔ 입력 12 · 묶음끼리 16 · `grow`). 검색 입력 + [조회]는 `SearchField searchLabel`, 검색 입력 + [찾기]는 `LookupField`(둘 다 내부 `FieldButtonGroup` 하나), 그 밖의 입력 + 버튼 · 버튼 묶음은 `ControlGroup`. 한 Field 안 컨트롤이 여럿이면 첫 컨트롤만 Field id(라벨이 가리킴) — id 겹침 없음. 폭은 `fieldWidth`(auto · xs 72 · sm 150 · md 200 · lg 270) — 인라인 `style` 폭 · 간격 금지 | 2026-11-17 |
| 본문 검색 | **SearchPanel(KWP GUI 검색 카드)로 통일** — 예전 SearchArea(카드 없는 한 줄 · 높이 32) 삭제. Search 가이드 4절 · Page Layout 예시도 SearchPanel | 2026-11-16 |
| 버튼 처리 중 표시 | **앱 화면에서는 버튼에 처리 중(로딩 아이콘 · "처리 중") 표시를 하지 않음** (사용자 결정). Button `loading` 모양은 디자인 시스템 · Storybook에 남기되 앱은 쓰지 않는다. 중복 요청은 `useAction`(또는 처리 중이면 무시), SearchPanel · LookupSearch · SearchField · VerifyCodeField는 `loading` 중 제출만 무시(버튼 모양 그대로) | 2026-11-17 |
| 화면 스크롤 | **화면 높이에 고정, LNB 오른쪽 영역만 스크롤 — Header · Work Tab · 화면 타이틀은 고정, 타이틀 아래부터 스크롤** (사용자 결정). LNB는 스크롤 영역 밖(끝까지 내려도 안 움직임). 최소 폭은 `PageLayout contentMinWidth`(내부관리자 1680 = 1920 − LNB 240), 좁은 창은 그 영역 안에서 가로 스크롤. 화면명 줄 버튼은 `PageLayout.Title actions`(타이틀과 같이 고정), `FormSection underTitle`에는 탭만 | 2026-11-17 |
| 팝업 안 조회 조건 | **박스 없는 스타일 `SearchPanel variant="plain" fieldWidth="lg"`** — 카드 · 회색 상자 없이 제목(16) 아래 필드 한 줄, 끝에 [초기화 ↻] · [조회](Neutral, 파란 조회 버튼 없음). 입력 · 셀렉트 270, 기간 264, **필드 줄 사이 12**(칸 사이 16). 화면 본문은 카드(variant="card"), 팝업은 plain (사용자 결정). 필드가 여러 줄인 팝업은 `actionsPlacement="header"`로 제목 줄 오른쪽에 버튼 + 아래 `SearchPanel.Grid`(정산원장 찾기 29850:110785) | 2026-11-17 |
| 검색 조건 기본 폭 | **SearchPanel 안 입력 · 셀렉트 200, 앞에 검색 아이콘이 있는 입력(SearchField · LookupField) 228, 날짜(DateField) 140(날짜는 검색 조건 밖에서도 140 — 2026-11-16)**, 퀵 기간(Segmented) 옵션 최소 55 · 늘어나지 않음 (폭을 정하지 않았을 때). **필드는 순서대로 흐름** — 폭이 남으면 다음 줄 필드가 올라오고 길어지면 내려감(SearchPanel.Row 삭제, flex로 늘리지 않음). `fullWidth` · 직접 준 폭이 우선, **기간(DateRangeField)은 264 고정(검색 조건 밖에서도, 빈 칸 안내가 다 보이는 폭 — 2026-11-17)**, 팝업 조회 조건은 `fieldWidth="lg"`(입력 · 셀렉트 270), 검색 조건 밖은 내용 폭 그대로 | 2026-11-17 |
| 조회 결과 Action 배치 | **디자인 없이 기획서로 개발할 때도 이 기준** (사용자 참조 이미지, `docs/ai/references/result-panel-actions.md`): 제목 옆 왼쪽 `titleActions` = Grid 기능(표시항목설정 · 엑셀 등, sm Neutral Line) · 오른쪽 `actions` = Data 업무(화면별) — 처리 Line → 상태 변경 Dark → 등록 Primary + plus 아이콘(맨 끝, Primary는 등록 하나). 조회 전 · 0건이면 비활성 | 2026-11-17 |
| 표 테두리 | **칸 사이에는 세로선, 표 양 끝(첫 칸 왼쪽 · 마지막 칸 오른쪽)에는 선 없음** (사용자 결정). FormTable(라벨-값 표 · 목록형 표 모두) · GridPlaceholder 적용, IBSheet 테마도 같은 규칙 | 2026-11-13 |
| Modal 크기 | **sm 400 · md 620 · lg 880 · xl 1280 · xxl 1680** (사용자 결정). lg는 800 → 880(기존 lg 사용처 모두 880), 기존 xl 880 사용처(표준산업분류 Lookup)는 lg로. xl은 넓은 입력 표(결제한도 설정), xxl은 본문 폭에 가까운 큰 표 · 화면형 팝업 | 2026-11-13 |
| 브레이크포인트 구조 | `tokens/custom`의 별도 그룹 `breakpoint/*` (space와 섞지 않음). 값은 모바일 시안 확인 후 | 2026-11-10 |

## 문서 지도 (필요한 것만 읽는다)

작업 전에 **해당 영역 파일 하나(+ 관련 참조)만** 읽는다. 영역이 여럿이면 해당 파일만 더 읽는다.

| 작업 | 읽을 파일 |
| --- | --- |
| 워크스페이스 · Storybook 설정 · 앱 뼈대 · JSP · IBSheet 설치 · 폴더 구조 · 화면 목록 · 팝업 모음 · 컨벤션 페이지 · 공통코드 | `docs/ai/log/setup.md` (+ `docs/jsp-integration.md`) |
| 토큰 · 테마(키컬러) · Typography · Spacing · Icon | `docs/ai/log/foundation.md` (+ `docs/token-workflow.md` · `docs/icon-workflow.md`) |
| 단일 컴포넌트: Button · Field 계열 · Selection · Pagination · Date Picker · Badge · Modal · Tab · Tooltip · Text | `docs/ai/log/components.md` |
| 화면 틀: LNB · 즐겨찾기 편집 · Header · Footer · Work Tab · Page Layout · Compact Navigation | `docs/ai/log/layout.md` |
| 조합 부품: Search · SearchPanel · Section Heading · CPID · Infobox · Summary Card · Address · Lookup · Column Picker · Action Bar · FormSection | `docs/ai/log/composites.md` |
| 페이지 패턴 P01~P07 · 패턴 페이지 | `docs/ai/log/patterns.md` (+ `docs/ai/page-patterns-plan.md`) |
| 화면 — 로그인(auth) | `docs/ai/log/screen-auth.md` |
| 화면 — 마이페이지(mypage) | `docs/ai/log/screen-mypage.md` |
| 화면 — 거래내역(transaction) | `docs/ai/log/screen-transaction.md` |
| 화면 — 정산(settlement) | `docs/ai/log/screen-settlement.md` |
| 화면 — 운영관리(operation) | `docs/ai/log/screen-operation.md` |
| 화면 — 메인(main) | `docs/ai/log/screen-main.md` |
| 새 1depth 화면 | `docs/ai/log/screen-<1depth>.md`를 새로 만들고 이 표에 한 줄 추가 |

### 기획서만 있고 디자인이 없을 때 참조 기준

| 대상 | 기준 문서 |
| --- | --- |
| 조회 결과 제목 줄 Action 배치 (P01) | `docs/ai/references/result-panel-actions.md` |

새 참조 이미지 · 기준을 받으면 `docs/ai/references/<이름>.md`(+ 이미지)로 두고 이 표와 확정 결정에 한 줄씩 추가한다.

## 기록 규칙

- 결정이 확정되면 → 이 파일 "확정 결정" 표에 한 줄 (모든 작업에 적용되는 규칙만)
- 작업이 끝나면 → 해당 영역 `docs/ai/log/<영역>.md`의 "참조"에 **앞으로 참조가 필요한 것만** 추가 · 수정 (규칙 · 값 · 가정 · (임의 작업) · 파일 위치). 만든 것 · 검증 · 완료 내역은 적지 않는다(커밋 메시지 · git log). 바뀐 내용은 옛 줄을 고치고, 더 이상 필요 없는 줄은 지운다
- 확인 필요한 것 → 해당 영역 파일의 "열린 질문"에 `- [Qnn]` (번호는 전체에서 이어서). 해결되면 지운다(결정은 확정 결정 · 참조로 옮김)
- 단계가 바뀌면 → 이 파일 "현재 단계"

### Work Tab 대시보드 기본 Tab 삭제 — 2026-11-17
- 사용자 요청: 처음에 고정으로 들어가 있던 대시보드 Tab 삭제(`store/workTabs` 처음 Tab 없음). 대시보드도 다른 화면처럼 들어가면 Tab이 생기고 닫을 수 있음(고정 아님)
- 마지막 Tab을 닫으면 대시보드로 이동(그 Tab이 다시 생김), 대시보드 Tab이 마지막이면 닫은 뒤 Tab 없이 그 화면에 머묾
- 검증: 앱 typecheck(새 오류 없음 — 기존 오류는 디자인 시스템 dist 타입이 옛 것이라 나는 것). 브라우저 확인은 하지 않음

### 화면 목록 표 스크롤 · 머리 고정 — 2026-11-17
- 문제(사용자): 화면 목록 좌우 스크롤 안 됨 — 표가 행 수만큼 길어 가로 스크롤바가 목록 맨 아래에만 있었음
- 디자인 시스템 `GridPlaceholder maxHeight`: 주면 표 안에서 위아래 · 좌우 스크롤 + 머리(th) sticky 고정(이때만 테두리 separate — collapse 테두리는 sticky 칸에 안 붙음). 안 주면 기존과 같음
- 화면 목록: `maxHeight="max(320px, calc(100vh - 420px))"`(420은 위 영역 · Total 줄 어림값)
- 검증: stylelint · typecheck · eslint · 디자인 시스템 build · 화면 목록 tsc. 브라우저 확인은 하지 않음
