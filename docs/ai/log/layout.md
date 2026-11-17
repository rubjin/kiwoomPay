# Layout (화면 틀)

> 범위: LNB · 즐겨찾기 편집 · Header · Footer · Work Tab · Page Layout · Compact Navigation.
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## 열린 질문

- [Q16] Header Utility Link(Semantic은 Link, 시각은 Primary Line M40) 구현 방식: `Button`에 `href` 지원을 추가할지, 별도 컴포넌트로 둘지
- [Q32] LNB: 3Depth Hover(흰 배경 + 파란 글자 + ↗) · 2Depth 12 Medium · Current 진한 글자 Figma 확정(2026-11-12). 확인 필요: Figma Depth=2 Hover는 Default와 같음(구현은 Neutral 200 배경 유지), Figma Depth=3 Active는 배경 없음 ↔ 전체 LNB 예시는 Primary 100 배경(예시 따름), "모두 접기 · 모두 펼침" 줄 · Active 점(•) · 탭 아래 선(Neutral 200, 사용자 확정)은 반영(2026-11-17). Figma 1Depth 아이콘 ↔ 메뉴명 간격이 하위 없는 행 12 · 있는 행 8로 다름 → 12로 통일(확인 필요). 로고 이미지 파일 필요(예시는 임시 텍스트). 긴 메뉴명 툴팁은 Tooltip 전까지 기본 title 사용
- [Q33] 가맹점관리자 모바일 LNB 시안 없음(Compact Navigation은 모바일 LNB가 아니라 `< 1/3 >` 이동 컨트롤로 확인됨) → 반응형 미적용. 즐겨찾기 편집 Modal은 Figma로 FavoriteMenuPicker 구현(2026-11-12)
- [Q36] Work Tab 시안 확인 필요(`tokens/custom/work-tab.json` TODO): ① State 예시의 Default·Hover Tab은 내용보다 넓지만 Workspace Bar 예시는 내용 폭 → 내용 폭으로 구현, Hover 시 닫기(X)가 나타나며 Tab이 넓어짐 ② ~~Active Tab •••~~ → Figma의 점 3개는 긴 메뉴명 말줄임 이미지(사용자 확인 2026-11-17). Tab 안 더보기 버튼 삭제, Tab 관리 메뉴는 "열린 화면 N ⌄"만 ③ •••로 열 때 Tab ↔ 메뉴 4, 메뉴 항목 Hover·비활성, Trigger ↔ 메뉴 8은 임시값 ④ 고정 Tab 표시(아이콘 등) 시안 없음 → 닫기 숨김만. (Trigger 위치는 Page Layout GUI로 확인: Work Tab 줄 오른쪽 끝, 밑줄 없는 글자 + 화살표 → 반영함)
- [Q37] Page Layout 확인 필요: ① ~~검색 영역 표준~~ → **SearchPanel(KWP GUI 검색 카드)로 통일, SearchArea 삭제**(사용자 결정 2026-11-16). (기록: 실제 GUI의 검색 조건 카드는 제목 줄 오른쪽에 [새로고침]·[조회], 아래에 [상세 검색 ⌄] — Search 가이드의 SearchArea(필드 줄 끝에 초기화·조회·상세조건)와 배치가 다름. 어느 쪽을 표준으로 할지) ② ~~Header·Work Tab 스크롤 고정~~ → Header · Work Tab · 화면 타이틀 고정, 타이틀 아래만 스크롤(사용자 결정 2026-11-17) ③ 페이지 하단 여백(Total·Pagination 줄 ↔ Footer)은 상단과 같은 20으로 둠 ④ 가맹점관리자 반응형 시안 없음 → 미적용 ⑤ 적용된 검색 조건 칩·조회 요약 카드는 Data Display 가이드 때 제작
- [Q41] Compact Navigation(번호 글자 Figma 확정 2026-11-12: 현재 12 Bold · " / 전체" 12 Regular, 공백 간격) · 1페이지 이하면 숨김(2026-11-12 반영) 남은 확인: 화살표 Hover · 누르는 영역 크기(현재 아이콘 16 그대로)
- [Q46] Header(Figma 반영 2026-11-12: 검색 필드 배경 Neutral 50, 사용자 정보 구분선 1 × 32, [다운로드 센터] ↔ 아이콘 10, 아이콘 버튼 반경 6) 남은 확인: 아이콘 버튼 Hover 배경(Figma에 없음, Bg/Hover 임시), 마스킹 해제 사유 입력 Modal, Global Search 결과 패널
- [Q48] 로고는 **앱별로 둔다**(디자인 시스템은 logo prop만 받음): `apps/<앱>/src/assets/logo/`. 내부관리자 `logo-footer.svg`(110 × 16) · `logo-lnb.svg`(125 × 23) 적용 완료. 다른 시스템 앱은 만들 때 같은 위치. Footer 항목 ↔ 구분선 9 확정
- [Q52] 즐겨찾기 편집(검색창 lg 48 반영 2026-11-12) 남은 확인: 개수 숫자 색 Figma secondary/500(#8B5CF6) → Chart/Category/02 연결. 트리 화살표 색은 Figma #123B59 = Primary 900으로 확정(2026-11-17)

## 작업 기록

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

### Component: Compact Navigation (Phase 4) — 2026-11-11
- 만든 것: `navigation/CompactNavigation` — `< 1 / 3 >` 이전 · 다음 이동(`total` · `page`/`defaultPage`/`onChange` · `loop` · `disabled`), 처음 · 마지막에서 화살표 비활성. 토큰 `tokens/custom/compact-navigation.json`(색 모두 alias: 화살표 Primary 700 · 비활성 Text/Disabled · 번호 Text/Secondary · / Text/Disabled). stories(Playground · States · InCard), 가이드 `docs/CompactNavigation.mdx`(Storybook `Components/Compact Navigation`)
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 15개 통과(아이콘 16 · 간격 4, 번호 12 SemiBold · 색, 처음/중간/마지막 비활성, 이동 · loop · disabled, 키보드 포커스).
- 한 가정: Q41. 숫자 글자는 12 SemiBold(`caption-strong`) — 크기 12는 사용자 확인

### Component: Header (Phase 4) — 2026-11-11
- 만든 것: `navigation/Header`(Compound) — `Header.Search`(SearchField md, 남는 폭) · `Header.UserInfo`(항목 이름 위 · 값 아래 · 구분선) · `Header.Divider` · `Header.Session`(남은 시간 HH:MM:SS 빨강 + [연장]) · `Header.Masking`([마스킹 해제] / 해제 중 초록 상자: MM:SS · [연장] · [마스킹 적용]) · `Header.Download`(Primary Line + 건수) · `Header.Actions` · `Header.IconButton`(32 · 아이콘 24 · dot → bell-on). 시간은 초로 받고 카운트다운은 화면이 관리, `formatRemaining` export. 토큰 `tokens/custom/header.json`(색 모두 alias). stories(States · Interactive), 가이드 `docs/Header.mdx`. 앱 `apps/internal-admin`의 임시 헤더를 이 컴포넌트로 교체
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 테스트 14개 통과(검색 위치 · 간격 40, 구분선 위치(시안 ±7), 버튼 폭(±2) · 간격, 아이콘 위치(시안과 일치), 해제 중 상자 279 × 40, 글자 · 색, 카운트다운 · 해제 · 적용 동작, 아이콘 버튼 aria-label · 포커스). 렌더링 캡처가 시안과 일치
- 한 가정: Q46 · Q47

### Header 확인 반영 · IBSheet 캘린더 연결 구조 — 2026-11-11
- Header: 세션 · 마스킹 남은 시간 숫자를 고정폭(tabular-nums)으로 — 카운트다운 중 글자 폭이 흔들리지 않음. Q46 ①② 확인 완료
- 캘린더 = IBSheet(사용자 결정): `DatePicker/CalendarProvider`(`CalendarAdapter.open(options) → close`, single · range, anchor · value · min · max · maxRangeDays · onSelect · onClose). DateField · DateRangeField는 어댑터가 있으면 기본 패널 대신 외부 달력을 열고(바깥 클릭 · Esc는 외부 달력 담당), 다시 누르거나 사라지면 닫기 함수 호출. 어댑터가 없으면 기존 DatePicker. 예시 `mockCalendarAdapter` + DateField 스토리 ExternalCalendar, DatePicker 가이드 0절. 앱: `app/providers/ibsheetCalendar.ts`(IBSheet 받기 전까지 null) + App을 CalendarProvider로 감쌈
- 검증: typecheck · lint · build(디자인 시스템 · 앱) · Storybook 빌드 통과. 외부 달력 테스트 9개(필드 · 아이콘으로 열기, 선택 반영 · 닫힘, 선택 없이 닫기, 다시 누르면 닫기, 기간 모드, 어댑터 없으면 기본 패널) · DatePicker 32 · 공통 24 재통과

### Component: Footer (Phase 4) — 2026-11-11
- 만든 것: `navigation/Footer` — `logo` · `items`(사이 구분선 자동) · `copyright`, 가운데 한 줄 · 좁으면 항목 단위 줄바꿈. 토큰 `tokens/custom/footer.json`(배경 Neutral 700 · 글자 Text/Inverse · 구분선 Neutral 500). stories(Playground · Narrow), 가이드 `docs/Footer.mdx`. Page Layout 스토리의 Header · Footer 자리 표시를 실제 컴포넌트로 교체. 앱 `layouts/Footer` 추가 · MainLayout에 연결
- 검증: typecheck · lint · build · Storybook 빌드 통과. 브라우저 테스트 7개 통과(1680 × 74 · 배경, 글자 12 Regular 흰색, 구분선 1 × 10 · 색 · 세로 가운데, 간격 12 · 8, 가운데 정렬, 좁은 폭 줄바꿈). 렌더링 캡처가 시안과 일치
- 한 가정: Q48

### LNB Search Result Item · Pattern 시안 반영 — 2026-11-12
- 좌우 여백 12 → 16, 행 높이 61 → 60(아래 여백 11), 구분선을 행 사이 → 행마다 아래(마지막 포함), Hover 배경 Neutral 50 → Primary 50(토큰 `lnb/result-hover` 추가, 키보드 Focus 포함), 결과 없음 위아래 여백 16 → 20 · 좌우 16. 글자(12 SemiBold · 10 Regular) · 색 · 강조는 이미 일치. LNB 가이드 검색 절에 규격 추가
- 검증: lint · Storybook 빌드 통과. 시안과 같은 방식(글자 픽셀)으로 측정한 테스트 7개 통과(행 60 + 선 1, 이름 · 경로 글자 위치 ±1 · 왼쪽 16, 글자 · 색 · 강조, Hover 배경, 결과 없음 위치 · 글자). 기존 LNB 23 · 테마 18 재통과
- 한 가정: Q50

### Component: Favorite Menu Picker (즐겨찾기 편집) — 2026-11-12
- 만든 것: `navigation/FavoriteMenuPicker` — Figma Modal_Favorite Edit Modal 본문. 안내 · 메뉴 검색(일치 메뉴만 남기고 모두 펼침) · 1Depth 펼침 상자(접힘 62 · 펼침 머리 40) · 2Depth 펼침 · 3Depth 체크박스(최대 `max` 10, 다 차면 비활성). `FavoriteCount`("선택한 메뉴 N / 10"). `Modal.Header`에 `addon` 추가(제목 · addon · 닫기 간격 8 → 12). 토큰 `tokens/custom/favorite-menu.json`. 스토리(FavoriteEdit · Full), 가이드 `docs/FavoriteMenuPicker.mdx`. LNB Interactive 스토리의 임시 편집 Modal을 이 컴포넌트로 교체(Q33)
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 10개 통과(모달 620 · 개수 표시 글자 · 색, 안내, 1Depth 62 · 배경 · 16 Bold Primary 900, 펼침 머리 40, 2Depth 14 Bold · 3Depth 14 Medium, 선택 · 개수, 펼침, 검색 필터, 10개 차면 비활성). LNB 테스트 23개 재통과(편집 → 검색 → 선택 → 저장). 렌더링이 Figma 스크린샷과 일치(검색창 높이 제외)
- 한 가정: Q52

### Work Tab 메뉴명 · 검색 영역 라벨 배치 — 2026-11-12
- Work Tab(Q36 ⓪, 사용자 확정): 메뉴명 최대 12자(`WORK_TAB_LABEL_MAX`), 넘으면 12자 + … (전체 이름은 title). Figma대로 메뉴명 영역 최소 99 · 왼쪽 여백 14 · 오른쪽 12 · 간격 Hover 8 / Active 4 · Active 13 SemiBold. 기존 말줄임 폭 160 제거
- 라벨 배치(Q53, 사용자 확정): 검색 영역 라벨은 위가 아니라 **필드 왼쪽 · 간격 8**. SearchArea · Page Layout 예시 · Search 가이드를 왼쪽 배치로 바꾸고 버튼을 내리던 여백 제거. `labelPosition="top"`(Modal Form용)도 간격 4 → 8(`field/label-gap-top`)
- 검증: tokens · typecheck · lint · Storybook 빌드 통과. 브라우저 측정(짧은 메뉴명 Tab 127 = 14 + 99 + 12 + 테두리, 긴 메뉴명 12자 + … · title 전체, Active 13 SemiBold, 검색 라벨 ↔ 필드 8 · 같은 줄, [조회] ↔ 필드 위치 같음, 콘솔 에러 없음)

### PageLayout.Title → SectionHeading — 2026-11-13
- `SectionHeading`에 `size="xl"`(24 Bold) · `as="h1"` 추가, `PageLayout.Title`이 SectionHeading xl로 그림(높이 40 · 제목 ↔ addon 12 · Action 사이 8, props 그대로). 중복 토큰 `page-layout/title` 삭제(section-heading/title과 같은 Text/Heading)
- 검토만(변경 없음): `FormSection` 대상 표시(label · title)는 이미 SectionHeading. 제목 탭 줄(`tabs` · `tabActions`)은 제목 자리가 탭 목록이라 h2 제목으로 묶지 않음
- 검증: typecheck · lint · tokens 통과, **변경 전/후 픽셀 비교 16장 모두 동일**(Storybook Page Layout 4 · P01 5 · P02 1, 앱 다운로드 센터 · 통합 거래내역 · 정산 실행 · 가맹점 신규/수정 · Placeholder)
- 이어서(같은 날): 화면에서 넣던 탭 묶음 보정값(`marginTop: -17` · `-5`)을 `FormSection`으로 옮김 — 기본 위 카드 ↔ 탭 줄 버튼 7, `underTitle`(화면명 바로 아래 첫 묶음) 화면명 ↔ 제목 탭 10 · 버튼은 화면명 줄과 겹침. 가맹점 기본/계약 정보 · P02 스토리에서 보정값 제거. 픽셀 비교(P02 스토리 · 가맹점 신규/수정 · 거래내역 · 다운로드 센터) 모두 동일
- 이어서(같은 날, 사용자 요청): 화면 코드에서도 `SectionHeading`이 보이도록 `FormSection` API 변경 — `title` · `label` · `context` · `description` · `actions` 대신 **`heading={<SectionHeading … />}`**(접기 버튼은 FormSection이 오른쪽 끝에 붙임), `FormSection.Heading` 삭제 → 본문 중간 제목도 `<SectionHeading>` 직접(아래 표 8 · 오른쪽 항목 사이 16은 FormSection 본문이 `data-section-heading`으로 맞춤). 스토리 · 가이드 · 가맹점 기본/계약 정보 화면 교체. 픽셀 비교 11장(FormSection 스토리 4 · P02 · 앱 6) 모두 동일
- 이어서(같은 날, 사용자 결정): **박스와 "제목 + 폼" 묶음을 분리** — `FormSection`은 박스(배경 · 테두리 · 여백 · 위 제목 탭 · 접기 상태)만, 내용은 `FormGroup`(`<SectionHeading>` + `FormTable`)으로. `heading` prop · 접기 버튼 끼워 넣기(cloneElement) · `data-section-heading` 삭제. 접기는 **카드 전체**(Figma 그대로, 사용자 선택): 첫 제목 줄 `actions`에 `<FormSection.Toggle />`, 접으면 첫 묶음의 제목 줄만 그림. 간격: 묶음 사이 16, 묶음 안 제목 ↔ 폼 첫 묶음 16 · 아래 묶음 8, 제목 줄 오른쪽 항목 사이 16. FormSection 스토리 `SameLevelTitles` · `Heading` → `Groups` · `Target`. 픽셀 비교(P02 · Tabbed · 가맹점 신규/수정 · 거래내역) 동일, 앱에서 접기/열기 동작 확인

### 즐겨찾기 편집 칩 줄 좌우 화살표 — 2026-11-16
- 문제(사용자): 즐겨찾기 메뉴 칩이 넘칠 때 → 화살표만 있고 왼쪽으로 돌아가는 화살표가 없음
- 수정: `FavoriteMenuPicker` 칩 줄에 ← 추가 — 스크롤 위치를 보고 앞에 더 있으면 ←, 뒤에 더 있으면 → (처음이면 ← 숨김 · 끝이면 → 숨김, 각각 200씩 이동). 클래스 `scrollRight` → `scrollButton`
- 검증: typecheck · lint · build, 앱 팝업 모음 즐겨찾기 편집: 10개 선택 → →만, → 누름 → ← · →, 끝 → ←만, ← 누름 → ← · →, 에러 없음

### LNB Figma 재대조 (28042:3258) — 2026-11-17
- 사용자 지적: View Tab 글자가 12가 아니었음(13 Medium)
- 반영: View Tab 높이 40 → 32 · 12 Regular / Active 12 SemiBold · 탭마다 아래 선 Neutral 200(`Line/Subtle`, 사용자 확정) · Active 밑줄 2 · 폭 216(좌우 여백 안) · 개수 좌우 6 · 이름 ↔ 개수 6. 위 여백 20 · 로고 줄(햄버거 ↔ 로고 10) ↔ 검색 20 · 검색 ↔ Tab 8. **모두 접기 · 모두 펼침 줄 추가**(전체 메뉴 View, 높이 40 · 11 Medium · 아래 선, 펼친 메뉴가 있으면 모두 접기). 1 · 2Depth 화살표 · 3Depth 이동 아이콘 16 → 12. 3Depth 앞 점을 글자 •(11 Medium · Primary 500, Active만 보임) + 간격 4로. 즐겨찾기 항목 사이 12 → 16 · 메뉴명 ↔ 경로 2, 비어 있음 상자 여백 16 → 12 · 제목 Neutral 800. 접은 모드 폭 48 → 44 · 햄버거 왼쪽 12 · 검색 · Tab 자리(115) 비우고 아래 선 32
- 토큰: `lnb/TabDivider` → Line/Subtle(TODO 해제), `lnb/Bullet` · `lnb/EmptyTitle` 추가
- 검증: tokens · typecheck · lint 통과. Storybook에서 측정 — Tab 12px 400/600 · 32 · 아래 선 #D5DCE5 · 밑줄 2, 모두 접기 40, 행 45/42/33, 3Depth Active 글자 x53(Figma 44 + • + 4), 즐겨찾기 간격 51(35 + 16), 접은 모드 44 · 햄버거 (12, 20) · 선 y135 · 첫 아이콘 행 y136(Figma와 같음)
- 확인 필요: Q32(1Depth 아이콘 간격 12 · 8), [편집] 글자 굵기(Figma 12 Medium ↔ TextButton sm SemiBold)
- 이어서(같은 날, 사용자 확정): 3Depth Active 점(•) 크기 확인 완료, 탭 아래 선 Neutral 200 → Storybook LNB "(임의 작업)" 표시 삭제. 아이콘 `Chevron-up-double 12` 추가(모두 접기, Neutral 500). 남은 아이콘: Chevron-down-double 12 · Search 16 · Link-external(□↗) 12 — 지금은 큰 아이콘을 줄여 그림

### 즐겨찾기 편집 팝업 Figma 재대조 (29348:37) — 2026-11-17
- 대조: 검색 48 · 즐겨찾기 메뉴 상자(N50 · 테두리 N200 · 반경 8 · 개수 14 Medium/Bold Accent) · 칩 32 · 13 Medium · 트리 1Depth 44(N50 · 16 Medium) · 2Depth 40(N100 · 14 Medium) · 3Depth 40(체크박스 · 14 Regular) · 들여쓰기 40/65는 이미 일치
- 반영: 트리 화살표 색 `favorite-menu/Chevron` Text/Label(TODO) → Primary 900(#123B59, Figma 아이콘). 앱 팝업 트리에서 하위 메뉴 없는 1Depth(대시보드) 제외 — Figma 트리는 업무 1Depth부터
- 그대로 둔 것(확정 결정): Modal 폭 Figma 820 → lg 880, 여백 24 → 20, Footer 버튼 40 → lg 48
- 남은 차이: 앱 메뉴(constants/menu.ts)는 2Depth까지라 2Depth가 체크박스 줄로 그려짐. Figma처럼 2Depth 묶음 + 3Depth 체크박스는 서버 메뉴(3Depth) 이관 후
- 이어서(같은 날): 팝업 트리 화살표를 Figma 팝업 전용 아이콘으로 — 펼침 `chevron-expanded`(20 · 16), 접힘 `chevron-collapsed`(16, 1Depth는 20 칸 가운데). 기존 `chevron-down` 20(셀렉트 등)은 그대로

### LNB 3Depth 메뉴 · LNB · 즐겨찾기 편집 팝업 완료 — 2026-11-17
- 앱 `constants/menu3.ts`: IA 3Depth 151개(화면 목록 앱 IA 데이터에서 옮김). LNB 2Depth 접힘 · 펼침, 현재 화면 3Depth 강조, 즐겨찾기 3Depth 선택. 없는 3Depth 화면은 2Depth 경로/번호(예: /transaction/integrated/02) → 준비 중 화면(제목 · 탭 제목 3Depth 이름)
- 앱 LNB 구성: 대시보드(단독 1Depth) → 거래내역 · 통계내역 · 정산내역 · 운영관리 · 부가서비스 · RM관리. 메인 · 마이페이지 · 로그인 · 시스템관리는 LNB 밖
- 화면 목록: KWPC01030000 LNB · KWPC01030001 즐겨찾기 편집 팝업 완료 (남은 것: 메뉴 · 즐겨찾기 API 연결)
- 화면 목록: KWPC01020000 헤더 완료 (남은 것: 세션 · 마스킹 · 알림 · 다운로드 건수 API, 마스킹 해제 사유 팝업(Q46), 전역 검색 결과 패널(Q35))
