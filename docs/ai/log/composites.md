# Composites (조합 부품)

> 범위: Search · SearchPanel · Section Heading · CPID · Infobox · Summary Card · Address · Lookup · Column Picker · Action Bar · FormSection. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### Chart & KPI (`components/chart/` — 대시보드 부품)

- 차트는 Recharts(`ComboChart` · `DonutChart`), 막대 목록(`BarList`)은 CSS. 표가 아니므로 IBSheet 안 씀(IBSheet 패키지에 차트 모듈 없음)
- Recharts는 색을 SVG 속성으로 써서 CSS 변수가 풀리지 않음 → `useResolvedColors`가 토큰 값을 읽고 `data-system` 바뀌면 다시 읽음. 축 글자 크기는 CSS(`.recharts-yAxis-tick-labels` — Recharts 3은 눈금 글자를 별도 층에 그림), 글자색은 `tick` prop
- 계열 색 Chart Category 01~09(07~09는 `tokens/custom/dashboard.json`에 Neutral 400 · 500 · 300 추가). 카드 색은 `Dashboard/*` 토큰
- 카드 높이는 `DashboardGrid rowHeight`(시안 값), 폭은 비율 중첩(`[1, 1]` 안에 `[1, 1]`)
- (임의 작업) 정산 대상 강조 값 32 — Figma 텍스트 스타일에 32 Bold 없음(24 Bold + 크기 32, `Kpi.module.scss`). 차트 툴팁 모양(시안 없음)

### SearchPanel (본문 검색 = KWP GUI 검색 카드, SearchArea는 삭제됨)

- `variant`: `card`(화면 본문, 기본) · `plain`(팝업 — 박스 없이 제목 16 아래 필드, [초기화 ↻] · [조회] Neutral, `fieldWidth="lg"`, 줄 사이 12) · `box`(옛 팝업 상자형)
- `actionsPlacement`: `header`(제목 줄 오른쪽, 기본) · `inline`(필드 줄 끝 — 조건이 한 줄인 화면, 접기 없음). plain + `header`면 제목 줄 오른쪽 + 아래 `SearchPanel.Grid`(여러 줄 팝업, 29850:110785)
- `defaultCollapsed`(제목 줄만), `detail`(상세 검색 펼침 배경 Primary 50), `description`(제목 옆 안내), `header`(inline일 때 제목 줄 대신 쓸 내용 — 알림센터 요약)
- 기본 폭(폭을 정하지 않았을 때, CSS 변수로 내려 줌): 입력 · 셀렉트 200, 앞 검색 아이콘 입력(SearchField · LookupField) 228, 날짜 140, 기간 264, 퀵 기간 Segmented 옵션 최소 55 · 늘어나지 않음. 필드는 순서대로 흐름(사이 16, 줄 강제 · flex 금지). CPID · 사업자번호 입력은 150(`fieldWidth="sm"`)
- 라벨은 필드 왼쪽 · 간격 8(`labelPosition="top"`은 Modal Form용)
- `variant="box"`: plain과 같은 구성(제목 아래 필드 줄 + 끝 버튼)에 배경 Primary 50(#F0F7FC) · 테두리 Primary 200(#BDDDF1)만, 반경 8 · 여백 16. 특수권한 코드 관리 팝업(사용자 결정). 카드 안 보조 검색(권한 템플릿 변경 이력 — `title={null}`, [조회]만)에도 씀. 토큰 `search-result/box-*`, Storybook SearchPanel Box

### Section Heading (`components/SectionHeading`)

- `[label] 제목 [description] [addon] ··· [actions]` + 아래 문맥(children). `size` xl 24(화면명) · lg 18 · md 16, `as` h1~h4, `subtle`, `step`(단계 번호), `actionsGrow`, 긴 제목 말줄임. 간격은 `--section-heading-gap`(16) · `--section-heading-actions-gap`(8)
- 쓰는 곳: `PageLayout.Title` · `PageLayout.Section` · `SearchPanel` · `ResultPanel`(md · actionsGrow) · `AppliedFilters` · `ResultSummary` · `FormGroup` · P07 패널 제목 · `Modal.Section`

### Record Form 부품

- `FormSection`(박스) + `FormGroup`(SectionHeading + FormTable) — 자세한 건 `patterns.md` P02. 카드 제목은 18 Bold · 줄 높이 26(사용자 결정, 시안 18 SemiBold와 다름)

### Display

- `CpidListItem`: 높이 58(Figma 56은 테두리 제외) · 반경 8 · 여백 좌우 12 · 위아래 8, CPID 13 SemiBold, 선택 Primary 50 + Primary 500 테두리
- `Infobox`(tone info · neutral) · `Infobox.Item`(제목 생략 가능 · `bullets`) · `Infobox.Link`. 여러 줄은 grid + subgrid로 열 맞춤. **표 · 섹션 안내는 그 카드 안 맨 아래**(neutral) — `PageLayout.Section` 마지막 자식 · `ResultPanel footer`, 화면 전체 안내(info)만 카드 밖(사용자 결정 — 직전 "카드 밖" 규칙 대체). **톤: 화면 전체 안내 = info(#F0F7FC · #BDDDF1), 표 · 섹션 안내 = neutral(#F8FAFC · #D5DCE5)**, 글자 설명 13 Regular #435064 · 제목 13 SemiBold #111827 · 제목 ↔ 설명 8, 점 목록도 13(사용자 확정 — 기존 12 · 설명 Neutral 600 대체, Storybook Infobox Usage). **같은 내용의 안내 여러 개 = `Infobox.Item bullets={[…]}` 하나**(Info 아이콘 하나 + 점 목록, 기준 `LedgerActionModal` notices), 톤은 대상에 따라 — 제목 없는 Item 여러 개 금지, 제목 있는 안내만 줄마다 Item(사용자 결정)
- `NoticePanel`: 제목 + 글머리표 목록(Primary 50 · 테두리 Primary 200 · 반경 8)
- `InfoStrip`: 회색 상자 [이름 값] 쌍(`layout="stacked"`면 이름 위 · 값 18 Bold 아래, 항목 `onClick`이면 값이 링크)
- `InlineFeedback`: 처리 결과 안내 상자(tone error · warning · success · info)
- `SummaryCard`: md 120 · sm 96 높이 고정, 제목 14 Bold · Info 20 · 단위 13 Medium, `loading`(Skeleton) · `empty`
- `AddressSearch` · `AddressResultRow`: 결과 줄 78 · 위아래 12 · 우편번호(13 SemiBold, 최소 46) ↔ 도로명(14 Bold) 8. 주소 API는 화면에서
- `LookupSearch`: 검색 줄(라벨 + SearchField + [조회] Neutral) + 결과(IBSheet), `extraFields` · `header` · `keyword={false}` · `onReset` · `empty`(480 안내) / `LookupSearchEmpty`
- `ColumnPicker`: 항목 칸 200 × 40 · 4열 · 간격 12, 브라우저 기본 드래그로 순서. 드래그 중 표시는 임시, 키보드 순서 변경 없음
- `ActionBar`: 회색 작업 바(Neutral 50 · 반경 4 · 여백 12) + 라벨 11 Bold + 내용. 결과 제목 줄 오른쪽에 넣을 수 있음
- `HighlightText`: 검색어 Primary 강조
- `TreeTable`(`patterns/search-result`): 트리 표 — 펼침 · 접기(`expandedIds` controlled) + 줄 선택(`selectedId` · `onSelect`, Primary 50 · Primary 글자), 열 정의는 GridPlaceholder와 같고 첫 열이 트리 열(단계마다 21 들여쓰기 · chevron 16). `filterTreeTable(nodes, match)` → 맞는 줄 + 상위 경로 · 펼칠 id, `treeTableGroupIds`. 체크박스 고르기는 `TreeOptionTable`. TODO(IBSheet) 실제 화면은 IBSheet8 Tree로 바꿀 수 있음. **하위가 없는 평평한 목록이면 화살표 자리 없이 줄 선택 목록**으로 씀(기능 코드 관리 기능 목록 — IbsheetGrid는 줄 선택 · 강조가 없어서). 열 render에 Checkbox를 넣어 권한 매트릭스로도 씀(권한 템플릿 관리 `PermissionMatrix`, onSelect 없음). **트리에서 고른 개수 표기(예: 메뉴 N · 기능 M)는 기획서에 있어도 넣지 않음**(사용자 결정). **트리 메뉴는 조회 중 상태 없음** — 다시 받는 동안 이전 트리 유지, 상태 안내는 0건 · 오류만(사용자 결정)

## 열린 질문

- [Q35] Header Global Search는 "상세 UI 확인 필요"라 컴포넌트 미제작(가이드에만 정리)
- [Q45] Summary Card: Skeleton 애니메이션 없음(motion 토큰 없음)
- [Q49] Address Search: 결과가 많을 때 목록 높이 · 페이지 나눔, 검색 필드 지우기(x)
- [Q51] Lookup Search: ① Figma 설명 "별도 Footer Action 없음" ↔ 결과 예시의 [닫기] · [확인] — 화면 정책으로 Modal.Footer ② Initial 시안 본문 아래 여백 0 → Modal 기본 20 유지 ③ 결과 행 선택은 IBSheet 이벤트
- [Q73] SearchPanel plain: Figma 칸 사이 20 · 제목 ↔ 필드 12 → 검색 조건 규칙 16 유지. xl 팝업 4칸이면 기간 칸이 264보다 좁아 빈 칸 안내 끝이 잘림
