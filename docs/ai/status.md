# 진행 현황 · 확정 결정

> 세션이 바뀌어도 이어서 작업할 수 있도록 AI가 단계 종료 시마다 갱신한다.
> 사람이 직접 고쳐도 된다. 여기 적힌 확정 결정은 `brief.md`보다 우선한다.

## 현재 단계
- Phase 2 완료(MultiSelect 포함). Phase 3 완료 — Pagination · Date Picker · Badge · Modal · Tab · Tooltip. Search 가이드(SearchArea) 완료
- Phase 4 진행 중 — LNB · Work Tab · Page Layout · Compact Navigation · Header · Footer · display(CPID List Item · Infobox · Summary Card · Address Search) · LNB Search Result · Tab Title · Lookup Search 완료. · Column Picker(엑셀 다운로드) · Favorite Menu Picker(즐겨찾기 편집) · Action Bar(취소사유입력) 완료. 남은 것: Grid(IBSheet 영역), chart&kpi
- 페이지 패턴: 설계안 확정(`docs/ai/page-patterns-plan.md`, P-1~P-6). **P01 Search → Result 완료** + 적용 화면 KWPC06010201 가맹점 정산 실행/처리 · KWPC04010100 통합 거래내역(`apps/internal-admin`). 다음: P04 `useAction` → P03 → P02 …
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
| Typography 이름 | **컴포넌트 SCSS는 Figma 스타일 이름을 그대로 사용**(`Typo / 16 / SemiBold` → `@include m.typography(typo-16-semi-bold)`) — 이름만 보고 크기 · 굵기를 확인할 수 있게. 없는 이름은 빌드 에러. 컴포넌트 전용 글자 역할(`badge-md` 등)은 만들지 않음. 역할 이름(`heading-sm` 등, 아래 표)은 앱 화면용 alias로만 유지 | 2026-11-11 (변경, 기존 "역할 이름만 사용" 대체) |
| Pretendard 로딩 | 웹폰트. 패키지에 woff2(dynamic subset) self-host — 사내망·CDN 차단 대비. fallback: `Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif` | 2026-11-10 |
| size(sm/md/lg) | 이름에 넣은 단일 변수 (`control/height/sm` 등). 모드 사용 안 함 | 2026-11-10 |
| Figma Code syntax(Web) | 입력하지 않음 (Figma 토큰 추가 없음, 이름 변환 규칙으로 대응) | 2026-11-10 |
| 지원 브라우저 / IE | 최신 Chrome·Edge(데스크톱). 가맹점관리자는 iOS Safari·Android Chrome 최신 2버전 추가. IE 미지원 (React 18도 IE 미지원) | 2026-11-10 |
| 아이콘 소스 포맷 | Figma에서 SVG 내보내기(`Name=<이름>, Size=<크기>.svg`) → `scripts/build-icons.mjs`가 React 데이터(`icons.generated.tsx`)로 변환. svgr 대신 자체 스크립트(의존성 없음). 선 아이콘은 `currentColor`, 상태 아이콘만 토큰 색 | 2026-11-10 |
| Chart 라이브러리 | Recharts (React 친화·SVG·백오피스 차트 종류 충분). Phase 4에서 도입 | 2026-11-10 |
| DatePicker 외부 라이브러리 | **캘린더는 IBSheet 캘린더**(그리드 셀 · 검색 영역 날짜 필드 모두). DateField · DateRangeField는 그대로 두고 `CalendarProvider`(어댑터)로 외부 달력을 연결. 어댑터가 없으면 직접 구현한 DatePicker로 동작(Storybook · IBSheet 연결 전). 기존 "사용 안 함" 대체 | 2026-11-11 |
| 앱 구조 · 라우팅 | 시스템별 앱 3개(`apps/internal-admin` · `merchant-admin` · `agency-admin`), 폴더는 `directory-structure.md`. **SPA**: react-router-dom(코드 기반 라우트, 1depth별 모듈 + lazy) + 앱마다 셸 JSP 1개. 서버는 `/api` · `/static` 외 GET을 셸 JSP로 forward. 이유: Work Tab(열린 화면 상태 유지) · LNB 유지 · 기존 프로젝트가 SPA. `docs/jsp-integration.md` | 2026-11-11 |
| React 버전 | **React 19** (기존 내부관리자 프로젝트와 맞춤). 디자인 시스템 peer `^18.3.1 || ^19.0.0`, 개발 · 앱은 19. Phase 1의 "React 18.3" 가정 대체 | 2026-11-11 |
| 그리드 · 캘린더 | **IBSheet(IBSheet8)** 사용. Table/Grid 컴포넌트는 만들지 않고 디자인 시스템은 영역 · 여백 · 테마(토큰 색 · 글자)만 다룸. 검색 영역 날짜 필드도 IBSheet 캘린더(어댑터) | 2026-11-11 |
| 페이지 패턴 | 디자인 시스템 `src/patterns/`에 패턴 템플릿 · 흐름 훅(fetch 없음). 성공/실패 안내는 Alert(Modal)로 통일, Toast 없음. 조회 화면은 최초 진입 시 조회하지 않음. 미저장 이탈 확인은 Work Tab 닫기 · 브라우저 닫기. 조회 전용 값은 텍스트. 시안 없는 신규 UI는 기존 토큰 · 컴포넌트 조합 + `TODO(시안)` 임시값. 상세는 `docs/ai/page-patterns-plan.md` | 2026-11-12 |
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

- description이 없는 스타일은 역할 이름 없이 Figma 이름으로만 제공한다.

## 열린 질문
- [Q12] JSP 프로젝트의 실제 정적 폴더 경로 · 셸 JSP 위치 · 서버 forward 설정 (docs/jsp-integration.md는 `webapp/static/<앱>/` · Spring 컨트롤러 예시 가정. 컨텍스트 패스는 셸의 `data-basename`으로 받으므로 빌드와 무관)
- [Q13] 모바일 시안 확인 후 `tokens/custom/breakpoint.json` 값 확정 (현재 TODO 임시값 tablet 1024 / mobile 768)
- [Q14] 시안 확인 후 TODO 임시값 확정: `tokens/custom/semantic-color.json`(hover·selected·pressed·focus·overlay), `dimension.json`(focus ring). `Bg/Page`(Neutral 50)·`Bg/Surface`(흰색)는 Page Layout Guide로 확정
- [Q15] Neutral Text Action은 Figma에 없음 → `Neutral/700` 임시값 유지(`tokens/custom/button.json`, TODO). Hover는 Figma대로 Primary 50 배경(밑줄 없음)으로 확정(2026-11-12)
- [Q16] Header Utility Link(Semantic은 Link, 시각은 Primary Line M40) 구현 방식: `Button`에 `href` 지원을 추가할지, 별도 컴포넌트로 둘지
- [Q17] 가이드(Hierarchy 설명)는 Hover를 "한 단계 어두운 배경"이라 쓰지만 시안 값은 Neutral Solid Hover가 더 밝은 회색(Neutral/500). 시안 값을 따름 — 디자인 확인 필요
- [Q18] MultiSelect(시안 변경 반영 2026-11-11: 전체 행 배경 없음 · 항목 36 · 여러 개 선택 시 쉼표 나열 · 패널 최대 높이 md 276 / sm 210 · 항목 글자 md 14 / sm 13 확정) 확인 필요: ① 시안은 전부 선택해도 "전체"가 일부 선택(–)으로 그려짐 → 구현은 체크(✓) ② 열림 상태 트리거 글자가 회색인 예시가 있으나 다른 예시는 진한 색 → 진한 색
- [Q19] 시안에 없는 항목: 필드 hover 표현, Field 세로(라벨 위) 배치, SelectBox 키보드 이동(↑↓), Small 드롭다운 항목 글자 크기 → 현재 hover·세로 배치는 미구현, 항목 글자는 14px 고정
- [Q20] Select 패널 최대 높이 190 · 로딩/빈 상태 174 Figma 확정(2026-11-12). 남은 임시값: `z-index/dropdown`
- [Q21] 시안 불일치 확인: SelectBox Negative 상태의 화살표만 진한 색(#1E293B)이고 나머지 상태는 Neutral/500. 현재 Neutral/500로 통일함. Date Field 날짜 ↔ 달력 아이콘 간격은 Figma 4로 반영(2026-11-12)
- [Q22] Selection 시안에 없는 항목(임시값, `tokens/custom/selection.json` TODO): 비활성 라벨 색, 가로 그룹 간격. (Segmented는 Figma로 확정 2026-11-12: 최소 60 · 좌우 12 · 옵션 붙임, 비활성 미선택 배경 확정) sm 라벨 글자 크기 md 14 · sm 13 확정(2026-11-12), 체크박스 sm 체크 아이콘 크기(20 프레임을 0.8배)
- [Q23] Checkbox·Radio·Toggle·Segmented의 hover 표현은 시안에 없어 미구현. 토글 이동 애니메이션은 motion 토큰이 없어 미구현
- [Q24] 아이콘 이름 지정 확인 (Figma 이름만으로 만들 수 없어 코드에서 지정, `scripts/build-icons.mjs`): `1dp(0~6)` → home·card-check·bar-chart·file-text·building·archive·shield-check, `Link-external` 12·`24-1`(↗ 모양) → `arrow-up-right`, `Setting` `20-1`(슬라이더 모양) → `setting-sliders`. Figma 쪽 이름도 맞춰 두면 좋음
- [Q26] 회색으로 내보낸 선 아이콘(eye·eye-off·pin-line·drag-handle·info-circle 16·arrow-up-right)은 규칙(고정 컬러 없음)에 따라 `currentColor`로 바꿈 → 회색이 필요하면 쓰는 쪽에서 color 지정. loading 아이콘 회전 애니메이션은 motion 토큰이 없어 미포함
- [Q28] Pagination 반응형(가맹점관리자 모바일) 시안 없음 → 미적용. 결과가 1페이지 이하일 때 숨길지는 화면 정책으로 정함(컴포넌트는 그대로 표시)
- [Q29] Date Picker: Figma로 336 × 344 · 반경 12 · 헤더 40 확정(2026-11-12). 필드 ↔ 패널 간격 8은 임시값(TODO). 기간 선택 중 마우스 위치까지 미리 보여주는 표시는 시안에 없어 미구현
- [Q30] Badge 임시값(TODO): Neutral 상태 점 색(Neutral/500, Figma는 이미지라 값 확인 불가), Primary · Neutral 외 tone의 Line 테두리(각 Status Border, Neutral은 Neutral 100 확정), Number 두 자리 이상 좌우 여백 6·글자(12 SemiBold). 3글자 이상 배지는 시안보다 2px 넓게 렌더링됨(글자 폭 반올림 차이로 판단, 2글자는 정확히 일치)
- [Q31] Modal(테두리 없음 · 반경 12 · 그림자 0 8px 24px rgba(0,0,0,.12) 확정 2026-11-12) 임시값(TODO): z-index 체계(모달 1000 · 팝업 1100). 시안의 제목→본문 간격이 19(측정)라 높이가 시안보다 1~2px 큼. Tab 키 포커스 가두기(focus trap)는 a11y 범위 밖이라 미구현
- [Q32] LNB: 3Depth Hover(흰 배경 + 파란 글자 + ↗) · 2Depth 12 Medium · Current 진한 글자 Figma 확정(2026-11-12). 확인 필요: Figma Depth=2 Hover는 Default와 같음(구현은 Neutral 200 배경 유지), Figma Depth=3 Active는 배경 없음 ↔ 전체 LNB 예시는 Primary 100 배경(예시 따름), 전체 LNB 예시의 "모두 펼침" 줄은 미구현. 남은 임시값(TODO): Active 점 크기 3, 탭 아래 구분선. 로고 이미지 파일 필요(예시는 임시 텍스트). 긴 메뉴명 툴팁은 Tooltip 전까지 기본 title 사용
- [Q33] 가맹점관리자 모바일 LNB 시안 없음(Compact Navigation은 모바일 LNB가 아니라 `< 1/3 >` 이동 컨트롤로 확인됨) → 반응형 미적용. 즐겨찾기 편집 Modal은 Figma로 FavoriteMenuPicker 구현(2026-11-12)
- [Q34] Tab(Figma 반영 2026-11-12: Line md 14 Regular/Active 14 Bold · 좌우 12, sm 12 Regular/Active 12 SemiBold · 좌우 10, Button Tab 14 Regular/Active 14 Bold · 좌우 md 26 · sm 12) 임시값(TODO): Line Tab 사이 간격 0, Button Tab 간격 8, 비활성 Tab Badge 색. Hover 표현 시안 없음(미구현). Title Tab은 Figma로 구현(2026-11-12, Tab 사이 간격 8 임시). Tab Guide는 "Small 32 = LNB처럼 밀도 높은 영역"인데 LNB 시안의 탭 높이는 40 → LNB는 기존 40 유지, 확인 필요
- [Q35] Header Global Search는 "상세 UI 확인 필요"라 컴포넌트 미제작(가이드에만 정리). Search 가이드의 회색 박스는 다른 섹션과 같은 설명용 카드로 보고 SearchArea에 넣지 않음 — 검색 영역에 박스가 필요한지 확인 필요

- [Q36] Work Tab 시안 확인 필요(`tokens/custom/work-tab.json` TODO): ① State 예시의 Default·Hover Tab은 내용보다 넓지만 Workspace Bar 예시는 내용 폭 → 내용 폭으로 구현, Hover 시 닫기(X)가 나타나며 Tab이 넓어짐 ② Active Tab의 •••와 "열린 화면 N ⌄" Trigger가 같은 Tab 관리 메뉴를 여는 것으로 해석(둘 다 Active Tab 대상) ③ •••로 열 때 Tab ↔ 메뉴 4, 메뉴 항목 Hover·비활성, Trigger ↔ 메뉴 8은 임시값 ④ 고정 Tab 표시(아이콘 등) 시안 없음 → 닫기 숨김만. (Trigger 위치는 Page Layout GUI로 확인: Work Tab 줄 오른쪽 끝, 밑줄 없는 글자 + 화살표 → 반영함)
- [Q37] Page Layout 확인 필요: ① 실제 GUI의 검색 조건 카드는 제목 줄 오른쪽에 [새로고침]·[조회], 아래에 [상세 검색 ⌄] — Search 가이드의 SearchArea(필드 줄 끝에 초기화·조회·상세조건)와 배치가 다름. 어느 쪽을 표준으로 할지 ② Header·Work Tab을 스크롤 시 고정(sticky)할지(현재 본문과 함께 스크롤, LNB만 고정) ③ 페이지 하단 여백(Total·Pagination 줄 ↔ Footer)은 상단과 같은 20으로 둠 ④ 가맹점관리자 반응형 시안 없음 → 미적용 ⑤ 적용된 검색 조건 칩·조회 요약 카드는 Data Display 가이드 때 제작
- [Q38] Tooltip(Figma 반영 2026-11-12: 포인터 높이 8 · 기준 요소 바깥 8) 임시값(TODO, `tokens/custom/tooltip.json`·`field.json`): 화면 경계 최소 간격 8, `z-index/tooltip` 1200, 비활성 Info 아이콘 색. 표시 애니메이션은 motion 토큰 없어 미포함. LNB 긴 메뉴명(Q32)은 아직 기본 title — Tooltip으로 바꿀지 확인
- [Q39] Spacing 가이드 Usage와 컴포넌트 시안 측정값 차이(현재 시안 값 유지): ① Container Padding 20·24 ↔ Page Layout Section 카드 16(한 줄 12)·Date Picker 패널 16 ② Button group 12·16 ↔ 버튼 간격 8(Search·Modal Footer·Page Title·Button Tab) ③ Icon–Text 8 ↔ Button 아이콘 간격 4. 어느 쪽을 기준으로 할지 확인
- [Q41] Compact Navigation(번호 글자 Figma 확정 2026-11-12: 현재 12 Bold · " / 전체" 12 Regular, 공백 간격) · 1페이지 이하면 숨김(2026-11-12 반영) 남은 확인: 화살표 Hover · 누르는 영역 크기(현재 아이콘 16 그대로)
- [Q45] Summary Card(Figma 반영 2026-11-12: 제목 14 Bold · Info 20 · 단위 13 Medium · 빈 상태 제목 14 Medium) 남은 확인: Skeleton 애니메이션 없음(motion 토큰 없음)
- [Q46] Header(Figma 반영 2026-11-12: 검색 필드 배경 Neutral 50, 사용자 정보 구분선 1 × 32, [다운로드 센터] ↔ 아이콘 10, 아이콘 버튼 반경 6) 남은 확인: 아이콘 버튼 Hover 배경(Figma에 없음, Bg/Hover 임시), 마스킹 해제 사유 입력 Modal, Global Search 결과 패널
- [Q47] IBSheet8 본체 · 라이선스(`ibleaders.js`, 도메인별) 파일 필요 — 상용이라 npm · 공개 다운로드 없음, 업체(IB Leaders)에서 받아야 함. 받으면 `apps/<앱>/public/ibsheet/`(개발) · JSP `static/ibsheet/`(운영)에 두고 index.html · 셸 JSP 주석 해제. 캘린더 어댑터는 매뉴얼 API로 구현 완료(실제 IBSheet로는 미확인: 달력 위치 X · Y가 문서 좌표 기준인지, 최대 기간 초과 안내 방식). 라이선스 파일 커밋 여부는 사내 정책
- [Q48] 로고는 **앱별로 둔다**(디자인 시스템은 logo prop만 받음): `apps/<앱>/src/assets/logo/`. 내부관리자 `logo-footer.svg`(110 × 16) · `logo-lnb.svg`(125 × 23) 적용 완료. 다른 시스템 앱은 만들 때 같은 위치. Footer 항목 ↔ 구분선 9 확정
- [Q49] Address Search(Figma 반영 2026-11-12: 결과 줄 78 · 위아래 12 · 우편번호 ↔ 도로명 8, 예시 항목 13 Bold, 결과 없음 14 Bold · 간격 6, Modal 닫기(X) 표시) 남은 확인: 결과가 많을 때 목록 높이 · 페이지 나눔, 검색 필드 지우기(x)
- [Q51] Lookup Search(찾기 방식 Button Tab 40 반영 2026-11-12) 남은 확인: ① Figma 설명 "별도 Footer Action 없음" ↔ 결과 예시의 [닫기] · [확인] — 화면 정책으로 Modal.Footer ② Initial 시안 본문 아래 여백 0 → Modal 기본 20 유지 ③ 결과 행 선택은 IBSheet 이벤트
- [Q52] 즐겨찾기 편집(검색창 lg 48 반영 2026-11-12) 남은 확인: 개수 숫자 색 Figma secondary/500(#8B5CF6) → Chart/Category/02 연결, 화살표 색 Text/Label 임시
- [Q54] P01(KWPC06010201) 확인 필요: ① 조회 전 문구는 KWPC04010100 Figma("거래내역을 조회해주세요 / 검색조건을 설정한 후 [조회] 버튼을 눌러주세요")로 통일 — KWPC06010201 최초진입 시안은 0건 문구라 다름(확인 필요) ② 상세 검색 펼침 내용 · 검색 조건 접힘 모양 시안 없음 ③ 오류 · 권한 없음 문구(TODO) ④ 퀵 기간(1주일 등)의 기준일 · 종료일 포함 여부(오늘 기준 이전 N일/개월로 구현) ⑤ Grid 머리 · 행 높이는 IBSheet 테마로(임시 미리보기 56 · 40) ⑥ Search 가이드의 SearchArea와 KWP GUI 검색 카드(SearchPanel)가 공존 — Q37 ①에서 GUI(SearchPanel)를 표준으로 볼지 확인
- [Q40] 가맹점관리자 Primary는 500(#514FEC)만 확정. 50~400·600~900은 기본 Primary 단계의 밝기·채도 관계(OKLCH)를 500에 적용해 계산한 임시값(TODO, `tokens/custom/themes/merchant.json`) → 디자인에서 10단계 확정 필요. 영업대행사 키컬러 미정(정해지면 `themes/agency.json` 추가)

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

### Component: Tooltip / InfoTip (Phase 3) — 2026-11-10
- 만든 것
  - `Tooltip`: 기준 요소 1개(children)에 붙임. Hover 200ms(`delay`) 후 · 키보드 Focus 즉시 표시, Pointer 이탈 · Focus 해제 · Esc(모달보다 먼저) 닫기. `placement` bottom(기본) · top · left · right, 공간이 모자라면 bottom → top → left → right 순서로 자동 전환, 어디에도 안 들어가면 화면 안으로 밀어 넣음. document.body에 그려 카드 clip 영향 없음. `open`·`defaultOpen`·`onOpenChange`·`disabled`, `role="tooltip"` + `aria-describedby`
  - `InfoTip`: Info 아이콘(20, Neutral 500) 버튼 + Tooltip
  - 몸체 Neutral 800 · 반경 8 · 여백 12/10 · 12 Regular 흰 글자 · Hug(최대 320, 줄바꿈). 포인터 12×6, 위·아래 배치는 몸체 왼쪽에서 20 · 좌우 배치는 세로 가운데, 기준 요소 가운데에 맞추고 끝 간격 0
  - 토큰 `tokens/custom/tooltip.json`, `z-index/tooltip`(field.json). stories(Playground · SizeAndWrap · ContentExamples(시안 문구 4개) · Placement · ViewportBoundary · ContainerClip · OnButton), 가이드 `docs/Tooltip.mdx`(Storybook `Components/Tooltip/Guide`)
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 테스트 25개 통과(색 · 글자 · 여백 · 반경, Short Hug · Long 320 줄바꿈, 포인터 크기 · 위치 · 간격 0(4방향), 오른쪽 끝 → Left, 아래 부족 → Top, 카드 밖 표시, 200ms 지연, 이탈 · Focus · Esc 닫기, 클릭 Focus는 즉시 표시 안 함, 버튼에 붙이기). 이 과정에서 왼쪽 배치 포인터가 0.2px 어긋나는 문제(offsetWidth 반올림)를 찾아 수정. 렌더링이 시안 문구 줄바꿈까지 일치

### Foundation: Spacing 가이드 — 2026-11-10
- 확인: Spacing Scale 가이드의 12단계(0·4·8·12·16·20·24·32·40·48·64·80)가 Figma `space/*`와 값·이름 모두 일치 → 토큰 수정 없음. 코드 토큰 중 Scale 값과 같은 간격은 모두 `{space.N}` alias, 숫자로 적힌 간격은 Scale 밖 시안 측정값(6·10·14·11·44)뿐
- 만든 것: 가이드 `docs/Spacing.mdx`(Storybook `Foundation/Spacing`) — Scale 표(CSS 변수로 막대 표시), Gap & Padding, Usage 4단계와 현재 컴포넌트 토큰 대응, Scale 밖 값 목록, Do/Don't, 확인 필요(Q39)

### Modal 패턴(Type × Action) 반영 — 2026-11-10
- 시안 확인: Alert · Confirm 400 / Information 620 / Form 800, 각 Type마다 Action None · Single · Double. Form 본문은 조회 필드(검색 + [조회] Neutral Solid, 라벨 위 또는 왼쪽) + 라벨 왼쪽 입력(폭 200), 줄 간격 12
- 변경
  - 토큰 `modal/width` → `modal/width/sm·md·lg`(400 · 620 · 800). `Modal`에 `size`(sm 기본 · md · lg) 추가, `width`는 예외 폭(Lookup 등)용으로 유지
  - `Field` 본문이 라벨 옆 남은 폭을 차지하도록 수정 → `fullWidth` 컨트롤이 Field 안에서도 폭을 채움(기존엔 내용 폭에 갇혀 채우지 못함). 컨트롤 기본 폭은 그대로
  - Modal stories: `Patterns`(12종 매트릭스) 추가, Types · Form 예시에 size 적용. 가이드 `docs/Modal.mdx`에 "3. Pattern (Type × Action)"과 Form 본문 배치 규칙, Spec 폭 갱신
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 측정 11개 통과(폭 400 × 6 · 620 × 3 · 800 × 3, Action 0/1/2 버튼, [조회] 오른쪽 여백 20 · 검색 ↔ 조회 8, 라벨 위 4 / 왼쪽 8, 필드 40, 입력 폭 200). Field 변경 후 기존 테스트(Page Layout · Work Tab 28 · Tooltip 25) 재통과, SearchArea 화면은 수정 전과 배치 동일(픽셀 비교, 글자 안티앨리어싱 차이만)

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

### 시스템별 키컬러(테마) — 2026-11-11
- 만든 것: `tokens/custom/themes/merchant.json`(Primary 50~900 + `Shadow/Focus`). `build-tokens.mjs`가 `tokens/custom/themes/*.json`을 읽어 `$themes` 맵 생성(기존 토큰만 덮어쓰기 · typography 불가 · 참조 끊김 · 파일명 규칙은 빌드 에러), `base/_root.scss`가 `:root[data-system='<시스템>']`로 출력. Storybook 툴바 "시스템"(내부관리자 기본 · 가맹점관리자 · 영업대행사). 문서 `docs/token-workflow.md` C절, `docs/jsp-integration.md`(html에 data-system)
- 검증: tokens:check · typecheck · lint · build · Storybook 빌드 통과, 에러 케이스 3개 확인. 브라우저 테스트 18개 통과(속성 없음 · internal · agency는 #2484C6, merchant는 버튼 · 탭 · LNB Active 배경(Primary 100) · 포커스 번짐이 가맹점 색)
- 한 가정: 테마는 html에 붙여야 함(alias 변수가 html에서 계산됨). 가맹점 Primary 9단계는 계산 임시값(Q40)

### 리팩토링: 컴포넌트 전용 크기를 SCSS 변수로 — 2026-11-11
- 변경: 컴포넌트 JSON의 크기 토큰 149개 중 한 SCSS 파일에서만 쓰는 131개를 그 `*.module.scss` 맨 위 SCSS 변수로 옮김(이름 · 값 · TODO 설명 유지, alias는 `t.$space-N` 등으로), 사용처 없는 1개(`lnb/chevron-size`) 삭제. 남긴 17개: 여러 컴포넌트 공유(`field/gap` · `field/label-gap-top` · `field/icon-size/trailing` · `selection/size/*`), 다른 토큰이 참조(`field/radius/*`), JS가 CSS 변수로 읽음(Tooltip 화살표 · 여백, Work Tab 메뉴 위치, Select · DatePicker 팝업 간격). 코드 토큰 549 → 417개
- 문서: `docs/token-workflow.md`(토큰 / SCSS 변수 구분 표), `Spacing.mdx` 규칙, 각 컴포넌트 가이드의 "토큰" 줄, Stylelint 경고 문구
- 검증: tokens:check · typecheck · lint · build · Storybook 빌드 통과. **전체 스토리 129개 · 요소 15,937개의 계산된 스타일(크기 · 위치 · 간격 · 테두리 · 반경 · 색 · 글자 등 36개 속성)이 리팩토링 전과 완전히 동일**(기본 · 가맹점 테마 모두)

### Component: MultiSelect (Phase 2) — 2026-11-11
- 만든 것: `field/MultiSelect` — 옵션 검색(SearchField sm) · 전체 선택(indeterminate) · 항목 Checkbox sm, `value: string[]`(옵션 순서) · controlled/uncontrolled, 선택 시 패널 유지, 트리거 요약(1개 이름 · `외 N` · `전체`, `renderValue`), loading · empty · 검색 결과 없음, `name` → 값마다 hidden input. 패널 안 검색은 바깥 Field Context와 분리(id · 피드백 중복 방지). SelectBox의 Spinner를 공용 `field/Spinner`로 분리. 토큰 `select/all-bg`(TODO). stories(Playground · States · Open · Wide · Controlled), Field 가이드 4-1절
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 27개 통과(패널 200 · 190 · 여백 8 · 트리거 ↔ 패널 8, 검색 32 · 항목 30 · 간격 4 · 체크박스 16 · 글자 14, 전체/선택 배경, indeterminate, 스크롤 강조, Loading · Empty 190, md 40 · sm 32, 선택 · 해제 · 순서, 전체 선택/해제, 검색 필터 · 검색 중 전체, 결과 없음, Esc · 바깥 클릭, 검색어 초기화, Field 안 id 중복 없음)
- 한 가정: Q18 ①~⑤

### Component: Compact Navigation (Phase 4) — 2026-11-11
- 만든 것: `navigation/CompactNavigation` — `< 1 / 3 >` 이전 · 다음 이동(`total` · `page`/`defaultPage`/`onChange` · `loop` · `disabled`), 처음 · 마지막에서 화살표 비활성. 토큰 `tokens/custom/compact-navigation.json`(색 모두 alias: 화살표 Primary 700 · 비활성 Text/Disabled · 번호 Text/Secondary · / Text/Disabled). stories(Playground · States · InCard), 가이드 `docs/CompactNavigation.mdx`(Storybook `Components/Compact Navigation`)
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 15개 통과(아이콘 16 · 간격 4, 번호 12 SemiBold · 색, 처음/중간/마지막 비활성, 이동 · loop · disabled, 키보드 포커스).
- 한 가정: Q41. 숫자 글자는 12 SemiBold(`caption-strong`) — 크기 12는 사용자 확인

### Component: Unread Indicator — 2026-11-11
- 만든 것: `Badge/UnreadIndicator` — 읽지 않은 항목 옆 "N"(기본 `aria-label` "읽지 않음", 글자 변경 가능). 토큰 `badge/unread`(Text/Accent), 타이포 역할 `badge-unread`(Typo/11/Bold). Badge stories `Unread`, Badge 가이드 4절에 DotBadge(신규 기능 · 메뉴)와 구분 설명
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 4개 통과(N · 11 Bold · #2484C6 · 8 × 16.5, 가이드 렌더링)
- 한 가정: Q42

### MultiSelect 시안 변경 반영 — 2026-11-11
- 변경: 전체 행 배경 제거(토큰 `select/all-bg` 삭제), 항목 높이 30 → 36 · 좌우 여백 8 → 10, 패널 아래 여백 12 → 8, 최대 높이 210(항목 4개), 트리거 요약 "외 N"/"전체" → 선택한 이름 쉼표 나열(말줄임). Open 스토리에 여러 개 선택 예시 추가, Field 가이드 갱신
- 검증: typecheck · lint · Storybook 빌드 통과, 브라우저 테스트 27개 통과(새 값 기준)

### Component: CPID List Item (Phase 4 display) — 2026-11-11
- 만든 것: `display/CpidListItem`(새 폴더 `display/`) — 버튼 카드: `cpid` · `merchantName` · `status`(Badge sm · dot 슬롯) · `selected`(Primary 50 배경 · Primary 500 테두리, aria-pressed), 한 줄 말줄임. 토큰 `tokens/custom/cpid-item.json`(색 모두 alias), 타이포 역할 `cpid-item-title`(Typo/13/Bold) · `cpid-item-name`(Typo/12/Regular). stories(Playground · States · SelectableList), 가이드 `docs/CpidListItem.mdx`(Storybook `Components/CPID List Item`)
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 12개 통과(288 × 58 · 반경 6 · 간격 8, 기본/선택 색 · 테두리, 글자 · 색, Badge 위치(시안 좌표와 일치), 가맹점명 위치, 선택 이동, 말줄임, 포커스, 가이드)
- 한 가정: Q43

### MultiSelect 크기별 패널 높이 · 글자 — 2026-11-11
- 변경(사용자 확정): 패널 최대 높이 md 276 · sm 210, 항목 글자 md 14(body-md) · sm 13(body-sm). Loading · Empty 패널 190은 그대로. Open 스토리에 sm 스크롤 예시 추가, Field 가이드 갱신
- 검증: typecheck · Storybook 빌드 통과, 브라우저 측정(md 최대 276 · 14px, sm 최대 210 · 13px, 넘치면 목록 스크롤) + 기존 테스트 27개 재통과

### 리팩토링: 글자 스타일을 Figma 이름으로 — 2026-11-11
- 이유(사용자 요청): `@include m.typography(heading-sm)`만 봐서는 크기 · 굵기를 알 수 없어 시안과 대조하기 어려움
- 변경: 컴포넌트 SCSS 58곳을 Figma 스타일 이름(`typo-<크기>-<굵기>`)으로 교체. 컴포넌트 전용 글자 역할 24개(button · badge · lnb · tab · pagination · segmented · cpid-item) 삭제, 역할 이름 11개(heading · body · label · caption)는 앱 화면용으로 유지. `typography` mixin이 없는 이름이면 빌드 에러. DatePicker 제목은 `heading-sm` + `font-weight: 700` 덮어쓰기 → `typo-16-bold`. 가이드 `docs/Typography.mdx`(Storybook `Foundation/Typography`: 스타일 목록 · 크기 · 굵기 · 예시 · 역할 이름 대응) 추가, 각 컴포넌트 가이드의 "글자" 줄 · `docs/token-workflow.md` 갱신
- 검증: tokens · typecheck · lint · build · Storybook 빌드 통과, 오타 이름 빌드 에러 확인. 전체 스토리 141개 계산된 스타일이 변경 전과 동일(회전 중인 Spinner 1개만 애니메이션 타이밍 차이)

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

### Component: Infobox (Phase 4 display) — 2026-11-11
- 만든 것: `display/Infobox`(Compound) — `Infobox`(tone info · neutral) · `Infobox.Item`(아이콘 · title · 설명 · `actionLabel` · `action` · `icon`) · `Infobox.Link`. 상자 전체를 grid + 줄은 subgrid로 여러 줄의 제목 · 설명 열 맞춤. 토큰 `tokens/custom/infobox.json`(색 모두 alias). stories(Playground · Types · Variations), 가이드 `docs/Infobox.mdx`(Storybook `Components/Infobox`)
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 12개 통과(높이 46 · 74, 색 · 테두리 · 반경 8, 아이콘 20 · 위치, 제목 · 라벨 · 링크 위치가 시안 좌표와 1px 이내, 글자 · 색, 줄 간격 8 · 열 맞춤, 오른쪽 영역 없음, 좁은 폭 줄바꿈)
- 한 가정: Q44

### Component: Summary Card (Phase 4 display) — 2026-11-11
- 만든 것: `display/SummaryCard` — `title` · `info`(InfoTip 16) · `value`(숫자는 천 단위 쉼표) · `unit` · `meta`(• 자동) · `size` md 120 / sm 96(높이 고정) · `loading`(Skeleton) · `empty`(기본 문구). 값 · Skeleton · 빈 상태는 카드 아래에 붙여 상태가 바뀌어도 높이 같음. 토큰 `tokens/custom/summary-card.json`(색 모두 alias). stories(Playground · States · InGrid), 가이드 `docs/SummaryCard.mdx`(Storybook `Components/Summary Card`)
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 12개 통과(크기 320×120 · 280×96, 색 · 테두리 · 반경, 제목 · Info 위치, 값 · 단위 · 보조 글자 · 색, Skeleton 크기 · 위치(시안과 일치), 빈 상태). 렌더링 캡처가 시안과 일치(글자 위치 1~2px 이내)
- 한 가정: Q45

### Component: Header (Phase 4) — 2026-11-11
- 만든 것: `navigation/Header`(Compound) — `Header.Search`(SearchField md, 남는 폭) · `Header.UserInfo`(항목 이름 위 · 값 아래 · 구분선) · `Header.Divider` · `Header.Session`(남은 시간 HH:MM:SS 빨강 + [연장]) · `Header.Masking`([마스킹 해제] / 해제 중 초록 상자: MM:SS · [연장] · [마스킹 적용]) · `Header.Download`(Primary Line + 건수) · `Header.Actions` · `Header.IconButton`(32 · 아이콘 24 · dot → bell-on). 시간은 초로 받고 카운트다운은 화면이 관리, `formatRemaining` export. 토큰 `tokens/custom/header.json`(색 모두 alias). stories(States · Interactive), 가이드 `docs/Header.mdx`. 앱 `apps/internal-admin`의 임시 헤더를 이 컴포넌트로 교체
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 테스트 14개 통과(검색 위치 · 간격 40, 구분선 위치(시안 ±7), 버튼 폭(±2) · 간격, 아이콘 위치(시안과 일치), 해제 중 상자 279 × 40, 글자 · 색, 카운트다운 · 해제 · 적용 동작, 아이콘 버튼 aria-label · 포커스). 렌더링 캡처가 시안과 일치
- 한 가정: Q46 · Q47

### Header 확인 반영 · IBSheet 캘린더 연결 구조 — 2026-11-11
- Header: 세션 · 마스킹 남은 시간 숫자를 고정폭(tabular-nums)으로 — 카운트다운 중 글자 폭이 흔들리지 않음. Q46 ①② 확인 완료
- 캘린더 = IBSheet(사용자 결정): `DatePicker/CalendarProvider`(`CalendarAdapter.open(options) → close`, single · range, anchor · value · min · max · maxRangeDays · onSelect · onClose). DateField · DateRangeField는 어댑터가 있으면 기본 패널 대신 외부 달력을 열고(바깥 클릭 · Esc는 외부 달력 담당), 다시 누르거나 사라지면 닫기 함수 호출. 어댑터가 없으면 기존 DatePicker. 예시 `mockCalendarAdapter` + DateField 스토리 ExternalCalendar, DatePicker 가이드 0절. 앱: `app/providers/ibsheetCalendar.ts`(IBSheet 받기 전까지 null) + App을 CalendarProvider로 감쌈
- 검증: typecheck · lint · build(디자인 시스템 · 앱) · Storybook 빌드 통과. 외부 달력 테스트 9개(필드 · 아이콘으로 열기, 선택 반영 · 닫힘, 선택 없이 닫기, 다시 누르면 닫기, 기간 모드, 어댑터 없으면 기본 패널) · DatePicker 32 · 공통 24 재통과

### IBSheet8 설치 · 캘린더 어댑터 구현 — 2026-11-11
- 설치(npm, MIT): `apps/internal-admin`에 `@ibsheet/react` 1.1.2(공식 React 래퍼, React 18 · 19 지원) · `@ibsheet/interface` 1.0.4(타입). IBSheet8 본체(`ibsheet.js`)와 라이선스(`ibleaders.js`)는 상용이라 받을 수 없음 → 업체에서 받아야 함(Q47)
- 캘린더 어댑터 `app/providers/ibsheetCalendar.ts`: IBSheet8 매뉴얼(공개 문서 static/show-calendar · appx/position) 기준 `IBSheet.showCalendar(calOption, position, callback)` 연결 — Format yyyy-MM-dd, Range(기간) 1, min · max → OnCanEditDate, 필드 아래 8 위치, 콜백 ms → YYYY-MM-DD · "시작~종료" → {start, end}, 최대 기간 초과 무시, 선택 없이 닫힘 → onClose, 필드에서 닫기 → Close(). `window.IBSheet`가 없으면 null(기본 DatePicker)
- 로드 위치: `index.html`(개발, 주석) · `docs/jsp-integration.md` 7절(셸 JSP, app.js보다 먼저)
- 검증: typecheck 통과. 매뉴얼 형식의 가짜 `IBSheet.showCalendar`로 어댑터 변환 테스트 10개 통과(실제 IBSheet로는 미확인)

### Component: Footer (Phase 4) — 2026-11-11
- 만든 것: `navigation/Footer` — `logo` · `items`(사이 구분선 자동) · `copyright`, 가운데 한 줄 · 좁으면 항목 단위 줄바꿈. 토큰 `tokens/custom/footer.json`(배경 Neutral 700 · 글자 Text/Inverse · 구분선 Neutral 500). stories(Playground · Narrow), 가이드 `docs/Footer.mdx`. Page Layout 스토리의 Header · Footer 자리 표시를 실제 컴포넌트로 교체. 앱 `layouts/Footer` 추가 · MainLayout에 연결
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 테스트 7개 통과(1680 × 74 · 배경, 글자 12 Regular 흰색, 구분선 1 × 10 · 색 · 세로 가운데, 간격 12 · 8, 가운데 정렬, 좁은 폭 줄바꿈). 렌더링 캡처가 시안과 일치
- 한 가정: Q48

### Component: Address Result Row · Address Search (Phase 4 display) — 2026-11-11
- 만든 것: `display/AddressResultRow`(우편번호 · 도로명 / [지번] 지번 · [선택] Primary Line sm, 말줄임) · `display/AddressSearch`(Modal lg Body용 Lookup 내용: SearchField + [조회] Neutral Solid, 조회 전 = 검색 예시 · 결과 = "검색결과 N 건" + 목록 · `[]` = 결과 없음, `query` controlled/uncontrolled, `onSearch` · `onSelect` · `loading` · `total` · `examples`). 주소 API는 화면에서. 토큰 `tokens/custom/address.json`(색 모두 alias). stories(States · ResultRow · Interactive), 가이드 `docs/AddressSearch.mdx`
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 14개 통과(패널 높이 시안 ±3, 제목 · 검색 · 예시 · 결과 · 안내 글자 줄 위치가 시안과 픽셀 일치(±1), 목록 선 위치 153 · 줄 79, 검색 필드 · [조회], Row 글자 · 색 · 태그 · 간격 · [선택], Enter 조회 · 결과 4건 · 선택 시 닫힘 · 값 반영 · 결과 없음)
- 한 가정: Q49

### Modal 모양 · Address Search 글자 확정 반영 — 2026-11-12
- Modal: 테두리 제거(토큰 `modal/border` 삭제), 반경 10 → 12, 그림자 `0 8px 24px 0 rgba(0,0,0,.12)`(TODO 해제), 배경 Base White(`Bg/Surface` 그대로). Modal을 쓰는 모든 화면(Lookup · Address Search 등)에 적용
- Address Result Row: 우편번호 13 SemiBold · 최소 폭 46, 도로명 14 Bold, 두 줄 간격 3 → 4(줄 높이 79)
- 검증: tokens · typecheck · lint · build · Storybook 빌드 통과. 브라우저 확인 5개(Modal 반경 12 · 테두리 없음 · 그림자 하나, 우편번호 · 도로명 글자 · 최소 폭 · 간격 16, 두 줄 간격 4 · 줄 높이 79). 기존 Modal · Address 테스트의 반경 10 · 테두리 · 줄 78 기대값은 옛 값

### LNB Search Result Item · Pattern 시안 반영 — 2026-11-12
- 기존 LNB 메뉴 검색 결과를 시안(`temp/컴포넌트/Search Result Item · Pattern.png`)에 맞춤: 좌우 여백 12 → 16, 행 높이 61 → 60(아래 여백 11), 구분선을 행 사이 → 행마다 아래(마지막 포함), Hover 배경 Neutral 50 → Primary 50(토큰 `lnb/result-hover` 추가, 키보드 Focus 포함), 결과 없음 위아래 여백 16 → 20 · 좌우 16. 글자(12 SemiBold · 10 Regular) · 색 · 강조는 이미 일치. LNB 가이드 검색 절에 규격 추가
- 검증: lint · Storybook 빌드 통과. 시안과 같은 방식(글자 픽셀)으로 측정한 테스트 7개 통과(행 60 + 선 1, 이름 · 경로 글자 위치 ±1 · 왼쪽 16, 글자 · 색 · 강조, Hover 배경, 결과 없음 위치 · 글자). 기존 LNB 23 · 테마 18 재통과
- 한 가정: Q50

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

### Component: Lookup Search (Phase 4 display) — 2026-11-12
- 만든 것: `display/LookupSearch` — 조회형 Lookup Modal 본문(Figma Modal/Lookup 사업자번호 · 원가정보, Select Box/Modal/Search Result (Lookup) · Empty). 검색 줄(`label` 왼쪽 + SearchField + [조회] Neutral Solid, `extraFields` · `header` 슬롯) + 결과(children = IBSheet8 그리드) · `empty`(높이 480 안내). query controlled/uncontrolled, `onSearch` · `loading`. 토큰 `tokens/custom/lookup.json`. stories(Initial · Result(예시 그리드 + Footer) · Empty(표준산업분류: Button Tab + 조건 2개, 폭 880) · Interactive), 가이드 `docs/LookupSearch.mdx`
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 11개 통과(Figma 값: 폭 800 · 제목 20 SemiBold · 닫기, 검색창 x 20 · y 68 · 40 · [조회] 오른쪽 20 · 간격 8, 라벨 13 Bold · 간격 8, 검색 ↔ 그리드 12, 결과 없음 480 · 글자 · 간격 6, Empty 폭 880 · Tab · 조건 2, Enter 조회 → 그리드 · 결과 없음 · 닫기). 렌더링 캡처가 Figma 스크린샷과 일치
- 한 가정: Q51

### Component: Column Picker (엑셀 다운로드) — 2026-11-12
- 만든 것: `display/ColumnPicker` — Figma Modal/Modal_Excel Download 본문. 안내 · 전체선택(일부 선택 표시) · 항목 칸(200 × 40, 이동 아이콘 · 이름 · 체크박스) 4열 그리드, 드래그로 순서 변경(브라우저 기본 Drag and Drop, 라이브러리 없음). `items` · `onItemsChange` · `value`(항목 순서대로) · `columns`. 토큰 `tokens/custom/column-picker.json`. 스토리 ExcelDownload(Modal 876 + Footer), 가이드 `docs/ColumnPicker.mdx`
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 10개 통과(모달 876 × 418 = Figma, 안내 위치 · 글자, 항목 200 × 40 · 반경 8 · 테두리 · 4열 · 간격 12, 글자 · 아이콘 20, 전체선택 indeterminate · 전체 선택 · 해제, 항목 선택, 드래그 순서 변경). 렌더링이 Figma 스크린샷과 일치
- 한 가정: 드래그 중 표시(반투명 · 놓을 칸 Primary 테두리)는 시안 없어 임시. 키보드 순서 변경 미지원

### Component: Favorite Menu Picker (즐겨찾기 편집) — 2026-11-12
- 만든 것: `navigation/FavoriteMenuPicker` — Figma Modal_Favorite Edit Modal 본문. 안내 · 메뉴 검색(일치 메뉴만 남기고 모두 펼침) · 1Depth 펼침 상자(접힘 62 · 펼침 머리 40) · 2Depth 펼침 · 3Depth 체크박스(최대 `max` 10, 다 차면 비활성). `FavoriteCount`("선택한 메뉴 N / 10"). `Modal.Header`에 `addon` 추가(제목 · addon · 닫기 간격 8 → 12). 토큰 `tokens/custom/favorite-menu.json`. 스토리(FavoriteEdit · Full), 가이드 `docs/FavoriteMenuPicker.mdx`. LNB Interactive 스토리의 임시 편집 Modal을 이 컴포넌트로 교체(Q33)
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 10개 통과(모달 620 · 개수 표시 글자 · 색, 안내, 1Depth 62 · 배경 · 16 Bold Primary 900, 펼침 머리 40, 2Depth 14 Bold · 3Depth 14 Medium, 선택 · 개수, 펼침, 검색 필터, 10개 차면 비활성). LNB 테스트 23개 재통과(편집 → 검색 → 선택 → 저장). 렌더링이 Figma 스크린샷과 일치(검색창 높이 제외)
- 한 가정: Q52

### Component: Action Bar (취소사유입력) — 2026-11-12
- 만든 것: `display/ActionBar` — Figma 취소사유입력(29406:96321): 회색 작업 바(Neutral 50 · Line/Subtle · 반경 4 · 여백 12 테두리 안쪽 · 간격 12) + 라벨(11 Bold Text/Label) + 내용 슬롯. 취소사유 구성(입력 sm 200 · 라디오 sm 가로 · [선택 취소] Dark sm)은 스토리 CancelReason. 토큰 `tokens/custom/action-bar.json`. 가이드 `docs/ActionBar.mdx`
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 확인(배경 · 테두리 · 반경, 높이 58(테두리 제외 56 = Figma), 라벨 글자 · 위치, 입력 200 × 32 · 버튼 32 Dark · 오른쪽 12, 입력 · 라디오 선택 반영, 콘솔 에러 없음). Figma 설명은 Address Row 설명이 복사돼 있어 용도는 이름으로 판단
- 한 가정: Figma sm 라디오 이름 14px ↔ 현재 13px(Q22)

### Q51 · Q52 · Q22 반영 — 2026-11-12
- Button Tab 크기: md 40(기본) · sm 32 (`size`). 기존 Button Tab 기본 높이가 32 → 40으로 바뀜(sm으로 32 유지 가능). ButtonTab 스토리에 md · sm
- 필드 크기 `lg`(48) 추가: md와 글자(14) · 여백 14 · 반경 8 같고 높이만 48 (FieldBox · Field 라벨). 즐겨찾기 편집 검색을 lg로
- Radio · Checkbox 이름 글자 md 14 · sm 13 확정(코드 변경 없음)

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

### Work Tab 메뉴명 · 검색 영역 라벨 배치 — 2026-11-12
- Work Tab(Q36 ⓪, 사용자 확정): 메뉴명 최대 12자(`WORK_TAB_LABEL_MAX`), 넘으면 12자 + … (전체 이름은 title). Figma대로 메뉴명 영역 최소 99 · 왼쪽 여백 14 · 오른쪽 12 · 간격 Hover 8 / Active 4 · Active 13 SemiBold. 기존 말줄임 폭 160 제거
- 라벨 배치(Q53, 사용자 확정): 검색 영역 라벨은 위가 아니라 **필드 왼쪽 · 간격 8**. SearchArea · Page Layout 예시 · Search 가이드를 왼쪽 배치로 바꾸고 버튼을 내리던 여백 제거. `labelPosition="top"`(Modal Form용)도 간격 4 → 8(`field/label-gap-top`)
- 검증: tokens · typecheck · lint · Storybook 빌드 통과. 브라우저 측정(짧은 메뉴명 Tab 127 = 14 + 99 + 12 + 테두리, 긴 메뉴명 12자 + … · title 전체, Active 13 SemiBold, 검색 라벨 ↔ 필드 8 · 같은 줄, [조회] ↔ 필드 위치 같음, 콘솔 에러 없음)

### Pattern: P01 Search → Result + KWPC06010201 — 2026-11-12
- 만든 것 (디자인 시스템 `src/patterns/`, Storybook `Patterns/P01 Search Result`)
  - 공통: `StatusView`(조회 전 · 조회 중 · 0건 · 오류 · 권한 없음, Figma Grid State / Empty 18 SemiBold · 14 Regular · 높이 220), `DialogProvider` · `useDialog`(alert · confirm Promise, Modal sm — 성공/실패 안내 Alert 통일)
  - P01: `SearchPanel`(KWP GUI 검색 카드: 제목 18 Bold + 접기, [초기화 ↻] · [조회], 구분선, 필드 줄 간격 16, 아래 붙은 [상세 검색] 16 Bold Primary), `AppliedFilters`(칩 32 · Primary 50 · 13 Medium, 조회 전 안내), `ResultSummary`(항목 60 · 24 Bold 숫자 + 단위, 조회 전 -), `ResultPanel`(제목 줄 64 · 16 Bold + 공통/업무 Action, success 외에는 StatusView), `ResultFooter`(Total + 가운데 Pagination), `GridPlaceholder`(IBSheet 연결 전 임시 미리보기, 선택 체크박스), `useSearchResult`(입력/조회 조건 분리, 늦은 응답 무시, autoSearch 기본 false)
  - 토큰 `tokens/custom/search-result.json`(색 모두 Semantic alias). `Segmented size="md"`(40, 폭은 글자 + 12). PageLayout Section 제목 18/16 SemiBold → Bold(Figma). 날짜 입력 폭 11ch → 글자 폭(field-sizing: content, 미지원 브라우저 10ch) → Date Range Field 246(Figma 253)
  - 가이드 `docs/patterns/P01SearchResult.mdx`(구성 순서 · 흐름 · 상태 체크리스트 · 선택 Action · 기본값 · Do/Don't)
- 앱: `pages/settlement/merchant/execute/MerchantSettlementExecutePage`(`/settlement/merchant/execute`, `/settlement/merchant`은 이동), `api/settlement/merchantSettlement`(예시 데이터, TODO API), `types/settlement/merchantSettlement`, App에 `DialogProvider`
- 검증: tokens · typecheck · lint · build(디자인 시스템 · 앱) · Storybook 빌드 통과. 1680 화면에서 카드 위치 · 높이가 Figma와 일치(검색 147 · 상세 58 · 적용 조건 58 · 요약 86, y 72/218/288/358/456, 요약 항목 213 × 60, 칩 32). 앱 브라우저 테스트 15개 통과(경로, 최초진입 조회 전 · Action 비활성, 1주일 → 날짜, 조회 → 칩 · 10행 · Total 28 · 요약, 선택 없이 Action → Alert, 2건 선택 → Confirm → 완료 Alert, 3페이지 8행, Enter 0건, 초기화 → 입력만 비움, 상세 검색 · 접기). 기존 테스트 재통과(공통 24 · step5 22 · MultiSelect 27 · 가이드 28 · Q36/Q53 · Modal 스크롤), 실패는 옛 기대값(Date Picker 340 · 검색 라벨 위 배치)뿐
- 참고: Storybook 빌드가 가끔 깨진 결과(L7[e] is not a function)를 내는데 다시 빌드하면 정상 — 코드 문제 아님
- 한 가정: Q54

### Screen: KWPC04010100 통합 거래내역 (P01) — 2026-11-12
- 시안: 최초진입_검색조건접힘(30056:104296). 숨김 레이어로 펼친 검색 조건 2줄 · 상세 검색 구조 확인
- 디자인 시스템
  - `SearchPanel.Row`(줄 나누기), `defaultCollapsed`로 최초 접힘(제목 줄 74, 상세 검색 줄도 숨김)
  - `ResultSummary` 항목 `values`(건 • 원), `ResultPanel` 제목 묶음 ↔ 오른쪽 Action 20(Action Bar 앞), Grid 미리보기 머리 40
  - `StatusView` 조회 전 기본 문구를 Figma로("내역을 조회해주세요 / 검색조건을 설정한 후 [조회] 버튼을 눌러주세요", 제목은 화면별)
  - `LookupField`(P03 호출 필드: 검색 아이콘 입력 + [찾기]), `Segmented fullWidth`
  - Field: 라벨 왼쪽 배치에서 본문 높이를 필드 높이(40)로 잡아 라디오 등 낮은 컨트롤을 라벨 줄 가운데에
  - 날짜 입력 폭: `width: 10ch`가 field-sizing을 막고 있어 `auto`로(글자 폭, 미지원 브라우저는 size 10자)
- 앱: `pages/transaction/integrated/IntegratedTransactionPage`(TODO 자리 교체), `api/transaction/integratedTransaction`(예시 데이터), `types/transaction/integratedTransaction`, 퀵 기간 공통화 `utils/period`(정산 화면도 사용)
- 검증: lint · typecheck · build(디자인 시스템 · 앱) · Storybook 빌드 통과. 앱 브라우저 테스트 15개 통과(최초진입 접힘 74 · 위치 y 72/158/228/326가 Figma와 일치, 결과 머리 90 · Grid 머리 40, 조회 전 문구, 요약 - 건 • - 원, 펼침 2줄 40/40, 조회 10행 · Total 23 · 금액, 적용 조건, 선택 없음 · 사유 없음 Alert, 상계취소 Confirm → 완료 Alert, 1개월 퀵 기간, 콘솔 에러 없음). 기존 테스트 재통과(공통 24 · 가이드 28 · MultiSelect 27 · step5 22 · P01 위치), 실패는 옛 기대값뿐
- 한 가정 / 확인 필요: 민원접수 · 전체취소 · 부분취소 칸 표시 방식(Y / - 로 임시), 시각 선택 옵션(정시 + 23:59), 거래구분 · 결제수단 · 거래상태 코드(임시), 상세 검색 내용 시안 없음, 취소 처리 가능 조건 · 금액 영향 미리보기는 화면설계서

### KWPC04010100 상세검색 · 검색 조건 정리 — 2026-11-12
- 시안: 최초진입(29406:101527) · 상세검색(29406:97669) · 목록(29395:79807) · 내 검색조건 관리 저장조건 있음/없음(29503:90470 · 91203). 하단 Grid 스타일은 IBSheet로 하므로 보류
- 디자인 시스템: 상세 검색 펼침 배경 Primary 50(토큰 `search-result/detail-bg`). 검색 조건 정의 `SearchFieldDef` + `toAppliedFilters` · `summarizeSearch` · `optionLabel` · `textValue` — 적용 조건 칩과 내 검색조건 요약을 같은 정의로. P01 가이드에 "검색 조건 폼 정리"(params · 기본값 · 정의, 폼 유형 표)
- 앱: 통합 거래내역 `components/searchFields`(선택지 · INITIAL_PARAMS · SEARCH_FIELDS), 상세 검색 2줄(고객명 · 구매자 ID · 카드번호 · 승인번호 · 전화번호 / 예금주명 · 가상계좌번호 · 상품권 · 결제요청코드 + 개인정보 포함 검색), 적용 조건 칩 "조회기간 …"(Figma), 취소사유 바는 행 선택 시에만 활성
- 검증: tokens · typecheck · lint · build 통과. 앱 브라우저 테스트 18개 통과(상세 검색 영역 높이 170 · 배경 · 2줄 40 · 2줄 필드 306 · 체크박스 오른쪽 17 = Figma, 칩에 고객명 · 개인정보 제외, 선택 전 취소사유 바 비활성 → 선택 후 활성 등)
- 다음: 내 검색조건 관리 Modal(P07 V03) — 저장된 조건 목록 · 선택한 조건 요약(summarizeSearch) · 현재 조건 덮어쓰기 · 삭제 · 적용 · 신규 등록

### 화면 목록 앱 · 임의 작업 표시 — 2026-11-12
- 화면 목록 (임의 작업): 관리자 앱 밖의 별도 앱 `apps/screen-list` (`pnpm screens` → http://localhost:5180). 시스템 탭(내부관리자 · 가맹점관리자 · 영업대행사, 탭에 본수) · 작업 현황(총 본수 · 작업중 · 작업완료 · 삭제 · 보류) · 상태 필터 · 목록(상태 · 1/2/3depth · 화면ID · 화면명 · 경로 링크(새 탭) · 화면타입 · 기획반영버전 · 최종업데이트일). 데이터는 `apps/screen-list/src/screens.ts` — 화면을 만들거나 고치면 한 줄 추가 · 갱신. 시스템별 주소는 `VITE_URL_INTERNAL` · `VITE_URL_MERCHANT` · `VITE_URL_AGENCY`(기본 5173 · 5174 · 5175)
- 규칙: 시안 · 정책 없이 임시로 만든 부분은 "(임의 작업)"으로 표시. Storybook은 스토리 · meta `parameters.tempWork` → 캔버스 오른쪽 위 "(임의 작업: …)" 배지(`.storybook/preview.tsx` tempWorkBadge). 표시한 스토리: Badge · TextButton · Column Picker · CPID List Item · DatePicker · Favorite Menu Picker · Tooltip · LNB · Checkbox · Radio · Tab · Work Tab · Address Search · P01(Initial · Result · Empty · States)
- 상태별 GUI(29426:102820) 확인: 조회 실패 아이콘 · 문구를 시안대로 수정. 확인 필요 — 조회 중 띄어쓰기(시안 "조회 중 입니다"), 검색 조건 접힘 높이(시안 72 ↔ 30056:104296은 74)
- 참고: 배지 표시 스토리는 캔버스에 감싸는 div가 하나 생겨 `#storybook-root > div`를 재던 기존 테스트 일부(DatePicker 패널 · Tab 폭)가 감싸는 div를 잼 — 실제 크기는 같음(DatePicker 336 × 344 확인)

### Pattern: P02 Record → Form + KWPC07010101 가맹점 기본/계약 정보 관리 — 2026-11-12
- 시안: 신규등록_Collapsed(28459:11020) · 조회수정(28298:50)
- 디자인 시스템 `src/patterns/record-form/` (Storybook `Patterns/P02 Record Form`)
  - `FormTable`(+ Row · Label(required *) · Cell(colSpan) · Head · InlineLabel): 라벨 138 + 값 칸 4쌍 격자(`pairs`) 또는 직접 열 구성(`template`, 담당자 표 36 + 5칸). 줄 52 · 머리 44, 라벨 12 Bold Neutral 100 배경, 테두리는 줄 높이 안(Figma)
  - `FormSection`(+ Header 소제목 18 Bold + 설명 12 · Heading 선택 CPID): 카드(여백 16 − 테두리 1), 제목 18 SemiBold, 접기/열기(13 Bold + ⌃⌄), 위에 붙는 제목 탭 `tabs` + 오른쪽 `tabActions`(카드 위 8)
  - `ContextChip`(현재 사업자 | 사업자번호 …, 흰색 · muted 회색), `PageLayout.Title titleAddon`(제목 옆 12)
  - 토큰 `tokens/custom/record-form.json`. Title Tab 사이 간격 8(TODO) → 0 (Figma 붙어 있음, Q34 일부 해소)
- 앱: 최소 폭 1920(MainLayout). `/operation/merchant-contract/basic/new`(신규등록) · `/basic/edit`(조회수정) — 기본 정보 8줄 · 담당자 표(추가 · 선택 삭제) · 저장(Confirm → Alert) · 가맹점 정보관리(선택 CPID 문맥, 신규는 접힘)
- 검증: typecheck · lint · build · Storybook 빌드 통과. 1920 화면에서 Figma와 1px 이내(제목 탭 y70 · 버튼 y55 · 기본 정보 카드 y103 h793(Figma 792) · 줄 52 · 라벨 138/값 262 · 아래 버튼 y903 · CPID 카드 y951 h64 · 국가 192). 1600 화면은 가로 스크롤(최소 폭 1920)
- (임의 작업): 고객 확인 정보 · 결제 오픈 현황 탭 내용, CPID 상세 영역(9개 탭), 선택지 값, 필수 검증(사업자구분만), 찾기 · 주소 · 사업자번호 수정 팝업 연결, 예시 데이터
- 화면 목록(`apps/screen-list`)에 신규등록 · 조회수정 추가 (작업중)
- Storybook 정리(같은 날): 패턴 부품을 Components에도 스토리 · 가이드로 추가 — `Components/Search Result`(Guide · SearchPanel(Playground · Rows · DetailGrid · Collapsed) · Result Parts(AppliedFilters · ResultSummary · ResultPanel · 상태)), `Components/Record Form`(Guide · FormTable(Pairs · ColSpan · Matrix · ReadOnly) · FormSection(Playground · Tabbed · SubHeader · Heading) · ContextChip), `Components/Lookup Field` · `Components/Status View` · `Components/Dialog`(각 Guide), `Patterns/P02 Record Form` Guide. 기존 보강: Segmented Sizes · FullWidth(Selection 가이드), Page Layout TitleAddon(가이드). 새 스토리 · 가이드 33개 렌더링 확인

### 개발 환경: 앱이 디자인 시스템 src를 바로 읽기 — 2026-11-12
- `packages/design-system/vite.source.ts`(`designSystemSource()`): 앱 개발 서버(`vite`)에서만 `@kiwoompay/design-system` → `src/index.ts`, `style.css` → `src/styles/index.scss` 별칭 + 디자인 시스템과 같은 SCSS `loadPaths` · CSS Modules 이름 규칙. 운영 빌드(`vite build`)는 그대로 `dist`
- 적용: `apps/internal-admin` · `apps/screen-list` vite.config (`mergeConfig`), 두 앱에 `sass` devDependency 추가
- 효과: 컴포넌트 수정 → 앱 화면에 즉시 반영(HMR, `pnpm build` 불필요). 확인: FormSectionHeader 설명을 주석 처리하면 새로고침 없이 사라지고 되돌리면 다시 보임. 운영 빌드 app.js에 src 경로 없음
- 참고: 앱 타입 검사(tsc)는 여전히 `dist/types`를 본다 — 디자인 시스템에 새 export를 추가하면 앱 typecheck 전에 `pnpm build` 필요

### FormSection 제목 줄 통일 — 2026-11-12
- 카드 제목(기본 정보)도 소제목(담당자 정보)과 같은 `FormSection.Heading`으로 그린다 — 접기/열기는 제목 줄 오른쪽 Action 끝. `FormSection`에 `description` prop 추가. 기본 정보 · 담당자 정보는 같은 레벨(h2) — 소제목 개념 없음
- 글자: 둘 다 **18 Bold · 줄 높이 26** (사용자 결정. 시안의 기본 정보 18 SemiBold · 21과 다름 → 기본 정보 카드 793 → 798)
- API 정리: `FormSection.Header` 삭제 → 본문 중간 제목 줄은 `FormSection.Heading`(title · description · actions). 대상 표시(선택 CPID)는 `FormSection`의 `label` + `title` + `context`(아래 줄 ContextChip · Badge) — 옛 `Heading value` 사용처(스토리 · 가이드 · 가맹점 기본/계약 정보 화면) 교체. 제목 줄은 label · description · context만 있어도 그린다
- 검증: 디자인 시스템 typecheck · lint · build, 앱 build(tsc 포함), Storybook 빌드 통과

### KWPC04010100 통합 거래내역 코드 정리 — 2026-11-12
- 화면 분리: `components/TransactionSearchPanel`(검색 조건 · 상세 검색 격자), `components/TransactionCancelBar`(취소사유 · 취소 구분 · 선택 취소, 상태와 처리 흐름을 직접 가짐). 페이지는 조합만(405 → 약 140줄)
- 디자인 시스템 `useSearchResult.refresh()`: 마지막 조회 조건 · 현재 페이지로 재조회(Promise). 행이 빠져 현재 페이지가 비면 마지막 페이지로. 취소 후 `result.setPage(result.page)` 대신 사용하고, 완료 Alert는 재조회 뒤에 띄움(전에는 옛 목록 위에 Alert). P01 가이드에 한 줄 추가
- 타입 단언 제거: 조회기준일 `v as …` → `isDateBasis` 타입 가드(`searchFields`), 라디오는 `DATE_BASIS`로 그림. 반복되는 `flex: '1 1 0'` · 폭만 상수로 묶음(화면 고유 폭은 다른 화면처럼 인라인 유지)
- 동작 변경: 취소 처리 중에도 표시항목설정 · 엑셀 버튼은 활성(처리 중 비활성은 취소 바만). "선택 없음" Alert는 바가 비활성이라 도달할 수 없어 삭제
- 검증: 디자인 시스템 typecheck · lint · build, 앱 build, 브라우저 테스트 13개 통과(조회 전 · 선택 전 비활성, 조회기준일 라디오, 사유 없음 Alert, Confirm, 처리 중 비활성, 완료 Alert 시점에 재조회 끝남, 사유 비움, 2페이지에서 취소 후 2페이지 유지, 콘솔 에러 없음)
- 정산 실행 화면(`MerchantSettlementExecutePage`)도 처리 후 `refresh()` → 완료 Alert 순서로 변경

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

### Component: Section Heading — 2026-11-12
- 만든 것: `components/SectionHeading` — 영역 제목 줄 `[label] 제목 [description] [addon] ··· [actions]` + 아래 줄 문맥(children). `size` lg 18 Bold · md 16 Bold, `subtle`(한 줄 카드), `as` h2~h4, `actionsGrow`(ActionBar처럼 오른쪽이 남는 폭을 채움 — 제목 묶음은 줄지 않음), 긴 제목 말줄임. 간격은 쓰는 곳이 CSS 변수 `--section-heading-gap`(기본 16) · `--section-heading-actions-gap`(기본 8)로 지정. stories · 가이드 `docs/SectionHeading.mdx`
- 내부 교체: `PageLayout.Section`(stack lg · inline md) · `SearchPanel` · `ResultPanel`(md · actionsGrow) · `AppliedFilters` · `ResultSummary`(md subtle) · `FormSection.Heading`(이제 SectionHeading 래퍼). 화면 코드 · props는 그대로
- 토큰: `tokens/custom/section-heading.json`(title · title-subtle · label · description) 추가, 중복 삭제 — `page-layout/section/title`, `search-result/title` · `sub-title`, `record-form/title` · `description`
- 검증: typecheck · lint · build(디자인 시스템 · 앱) · Storybook 빌드. **바꾸기 전/후 픽셀 비교 25장 모두 동일** — Storybook 20(Page Layout · FormSection · Result Parts · SearchPanel · P01 · P02, 정적 빌드 2개 비교)과 앱 5(통합 거래내역 · 정산 실행 조회 후, 가맹점 신규/수정, Placeholder). 새 스토리 5개 · 가이드 렌더, 긴 제목 말줄임 확인, 취소 흐름 테스트 13개 재통과
- 참고: 이미 떠 있던 Storybook(6006)은 deps 캐시가 깨져 모든 스토리가 "Failed to fetch dynamically imported module" — 재시작 필요(`node_modules/.cache/storybook` 삭제 후 `pnpm storybook`)

### Storybook 사이드바 구분 — 2026-11-12
- 그룹(사용자 확인): Introduction → **Foundation**(토큰 가이드) → **Components**(단일 UI 15) → **Composites**(컴포넌트 조합 10: Search · Search Result · Record Form · Lookup Field · Lookup Search · Address Search · Column Picker · Favorite Menu Picker · Action Bar · Dialog) → **Layout**(화면 틀 6: Page Layout · Header · Footer · LNB · Compact Navigation · Work Tab) → **Patterns**(P01 · P02). 각 항목 안에서 Guide 먼저(`.storybook/preview.tsx` storySort)
- 스토리 · 가이드 title만 변경(21개 파일). 코드 폴더 · import 경로는 그대로(코드 폴더는 `components/` · `patterns/` 두 갈래라 Storybook 그룹과 1:1 아님). Introduction에 그룹 설명 추가
- 새 컴포넌트를 만들 때 그룹 기준: 혼자 쓰면 Components, 여러 컴포넌트를 묶은 업무 부품이면 Composites, 화면 틀이면 Layout
- Icon 가이드는 컴포넌트 스토리와 함께 있어 Components에 둠(Foundation은 Typography · Spacing)
- 역할별 섹션 추가(사용자 확인, 같은 날):
  - Components: **Action**(Button) · **Input**(Field · Selection · DatePicker) · **Navigation**(Tab · Pagination) · **Display**(Badge · Infobox · Summary Card · CPID List Item · Section Heading) · **Feedback**(Modal · Tooltip) · Icon(섹션 없음)
  - Composites: **Search**(Search Area · Search Panel · Lookup Field · Lookup Search · Address Search) · **Result**(Result Parts · Status View(테이블 결과 상태) · Action Bar · Column Picker) · **Form**(Record Form) · **Feedback**(Dialog · Favorite Menu Picker)
  - Search Result 가이드를 `docs/SearchPanel.mdx`(Search) · `docs/ResultParts.mdx`(Result)로 나눔(내용 이동만). storySort에 섹션 순서 · 섹션 안 대표 항목 순서 고정

