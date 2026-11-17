# Layout (화면 틀)

> 범위: LNB · 즐겨찾기 편집 · Header · Footer · Work Tab · Page Layout · Compact Navigation. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### Page Layout (`layout/PageLayout`)

- 슬롯 `lnb` · `header`(66) · `workTab` + `workTabActions`(60, Tab 40은 아래 선에 붙음) · `footer`(74). 본문 좌우 24 · 상단 20 · Section 간격 12
- 스크롤: 화면 높이 고정, `.main`(LNB 오른쪽)만 스크롤. Header · Work Tab · `PageLayout.Title` sticky, LNB는 스크롤 영역 밖. 최소 폭 `contentMinWidth`(내부관리자 1680), 좁으면 그 영역 안에서 가로 스크롤
- `PageLayout.Title` = `SectionHeading size="xl" as="h1"`(높이 40, `titleAddon` · `actions`). 화면명 줄 버튼은 `actions`, `FormSection underTitle`에는 탭만
- `PageLayout.Section`: 흰 카드 · 반경 8 · 여백 16, `layout="inline"` · `compact`(12) · `divider` · `plain`
- 페이지 하단 여백(Total · Pagination ↔ Footer) 20

### LNB (`navigation/Lnb`, 시안 28042:3258)

- 폭 240 · 접은 모드 44. 위 여백 20 · 로고 줄 ↔ 검색 20 · 검색 ↔ View Tab 8. View Tab 32 · 12 Regular / Active 12 SemiBold · 아래 선 Neutral 200 · Active 밑줄 2
- 전체 메뉴 View에 "모두 접기 · 모두 펼침" 줄(40 · 11 Medium). 행 높이 1 · 2 · 3Depth 45 / 42 / 33, 화살표 · 이동 아이콘 12. 1Depth 화살표 Neutral 500, 2Depth 화살표 Neutral 900, 3Depth 바로가기 Hover 아이콘 Neutral 600
- 3Depth: Active 점 •(11 Medium · Primary 500, Active만) + 4, Hover 흰 배경 + 파란 글자 + ↗. 2Depth도 접힘 · 펼침
- 검색: 하위 없는 메뉴 중 이름 일치, 결과 행 60 · 좌우 16 · Hover Primary 50, 선택 시 이동 · 검색어 비움
- 즐겨찾기 View: 항목 사이 16 · 메뉴명 ↔ 경로 2, Empty 안내 + [편집] → `onFavoriteEdit`(앱 `layouts/Lnb/FavoriteEditModal`)
- `href`면 `<a>`, `external`이면 새 창. 1Depth만 아이콘
- 앱 메뉴: `constants/menu.ts`(1 · 2Depth, 화면ID ↔ path) + `constants/menu3.ts`(IA 3Depth 151개). 없는 3Depth 화면은 2Depth 경로/번호 → 준비 중 화면. LNB 구성: 대시보드(단독) → 거래내역 · 통계내역 · 정산내역 · 운영관리 · 부가서비스 · RM관리. 메인 · 마이페이지 · 로그인 · 시스템관리는 LNB 밖
- 남은 것: 메뉴 · 즐겨찾기 API 연결

### 즐겨찾기 편집 (`navigation/FavoriteMenuPicker`, 시안 29348:37)

- Modal lg 880(Figma 820), Footer lg 48. 검색(lg 48) → 즐겨찾기 메뉴 상자(N / 10 + 칩, 넘치면 ← · → 200씩) → 메뉴 트리(1Depth 44 Neutral 50 · 2Depth 40 Neutral 100 · 3Depth 체크박스 40, 최대 445 · 안에서 스크롤). 10개 차면 나머지 비활성
- 트리 화살표: 펼침 `chevron-expanded` · 접힘 `chevron-collapsed`, 색 Primary 900. 하위 없는 1Depth(대시보드)는 트리에서 제외
- 검색 중에는 일치 메뉴 목록(이름 강조 + 경로, 체크박스와 글자 세로 가운데)

### Work Tab (`Tab/WorkTab`)

- 메뉴명 공백 제외 12자까지 그대로, 넘으면 말줄임 이미지(•••, 버튼 아님, 텍스트 … 없음). 12자 이하는 내용 폭(패딩 기준)
- Hover 시 닫기(X) 나타나며 넓어짐. Tab 안 더보기 버튼 없음 — Tab 관리 메뉴는 줄 오른쪽 끝 "열린 화면 N ⌄"(`WorkTab.ActionMenu`)만
- 최대 10개(`WORK_TAB_LIMIT`, 초과 Alert는 화면). 앱 `store/workTabs` + `layouts/WorkTabBar`(이름은 `screenNameOf`, 대시보드 고정). TODO: Tab 전환 시 화면 상태 유지(keep-alive)

### Header (`navigation/Header`)

- `Header.Search` · `UserInfo` · `Divider` · `Session`(HH:MM:SS 빨강 + [연장]) · `Masking` · `Download`(건수) · `IconButton`(dot → bell-on). 시간은 초로 받고 카운트다운은 화면, 숫자는 tabular-nums
- 앱: 처음부터 마스킹 해제 중(60:00) · [마스킹 적용] · 0초면 자동 마스킹, [마스킹 해제]는 바로 해제(사유 Modal Q46). 실제 상태 · 시간은 TODO API

### Footer · Compact Navigation · 로고

- Footer: 배경 Neutral 700 · 12 Regular 흰색 · 구분선 1 × 10, 항목 ↔ 구분선 9, 좁으면 항목 단위 줄바꿈
- Compact Navigation `< 1 / 3 >`: 현재 12 Bold · " / 전체" 12 Regular, `total <= 1`이면 숨김
- 로고는 앱별 `apps/<앱>/src/assets/logo/`(디자인 시스템은 `logo` prop만). 내부관리자 `logo-header.svg` · `logo-lnb.svg`(125 × 23) · `logo-footer.svg`(110 × 16)

## 열린 질문

- [Q16] Header Utility Link(Semantic은 Link, 시각은 Primary Line M40) 구현 방식: `Button`에 `href`를 추가할지, 별도 컴포넌트로 둘지
- [Q32] LNB: Figma Depth=2 Hover는 Default와 같음(구현은 Neutral 200 배경 유지), Figma Depth=3 Active는 배경 없음 ↔ 전체 LNB 예시는 Primary 100 배경(예시 따름). 1Depth 아이콘 ↔ 메뉴명 간격 하위 없는 행 12 · 있는 행 8 → 12로 통일. [편집] 글자 굵기 Figma 12 Medium ↔ TextButton sm SemiBold. 긴 메뉴명은 기본 title(Tooltip으로 바꿀지). 남은 아이콘(Chevron-down-double 12 · Search 16 · Link-external 12)은 큰 아이콘을 줄여 그림
- [Q33] 가맹점관리자 모바일 LNB 시안 없음 → 반응형 미적용
- [Q36] Work Tab(`tokens/custom/work-tab.json` TODO): 메뉴 항목 Hover · 비활성, Trigger ↔ 메뉴 8 임시값, 고정 Tab 표시 시안 없음(닫기 숨김만)
- [Q37] Page Layout: 가맹점관리자 반응형 시안 없음 → 미적용
- [Q41] Compact Navigation: 화살표 Hover · 누르는 영역 크기(지금 아이콘 16)
- [Q46] Header: 아이콘 버튼 Hover 배경(Bg/Hover 임시), 마스킹 해제 사유 입력 Modal, Global Search 결과 패널(Q35)
- [Q52] 즐겨찾기 편집: 개수 숫자 색 Figma secondary/500(#8B5CF6) → Chart/Category/02 연결. 앱 메뉴가 서버 3Depth로 바뀌면 2Depth 묶음 + 3Depth 체크박스(지금은 2Depth가 체크박스 줄인 곳 있음)
