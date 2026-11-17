# Composites (조합 부품)

> 범위: Search · SearchPanel · Section Heading · CPID · Infobox · Summary Card · Address · Lookup · Column Picker · Action Bar.
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## 열린 질문

- [Q35] Header Global Search는 "상세 UI 확인 필요"라 컴포넌트 미제작(가이드에만 정리). Search 가이드의 회색 박스는 다른 섹션과 같은 설명용 카드로 보고 SearchArea에 넣지 않음 — 검색 영역에 박스가 필요한지 확인 필요
- [Q45] Summary Card(Figma 반영 2026-11-12: 제목 14 Bold · Info 20 · 단위 13 Medium · 빈 상태 제목 14 Medium) 남은 확인: Skeleton 애니메이션 없음(motion 토큰 없음)
- [Q49] Address Search(Figma 반영 2026-11-12: 결과 줄 78 · 위아래 12 · 우편번호 ↔ 도로명 8, 예시 항목 13 Bold, 결과 없음 14 Bold · 간격 6, Modal 닫기(X) 표시) 남은 확인: 결과가 많을 때 목록 높이 · 페이지 나눔, 검색 필드 지우기(x)
- [Q51] Lookup Search(찾기 방식 Button Tab 40 반영 2026-11-12) 남은 확인: ① Figma 설명 "별도 Footer Action 없음" ↔ 결과 예시의 [닫기] · [확인] — 화면 정책으로 Modal.Footer ② Initial 시안 본문 아래 여백 0 → Modal 기본 20 유지 ③ 결과 행 선택은 IBSheet 이벤트

## 작업 기록

### Search 가이드 — 2026-11-10
- 만든 것: `SearchArea`(form role=search) — 기본 조건(children) + 상세 조건(`detail`·`detailActions`), [초기화](`onReset`) · [조회](`onSearch`, Enter도 조회, `loading`) · [상세조건]/[상세조건 닫기](`expanded`·`defaultExpanded`·`onExpandedChange`), 문구 변경 `labels`. `Field`에 `labelPosition="top"` 추가(Q19 세로 배치 해소). 토큰 `tokens/custom/search.json`, `field/label-gap-top`. stories, 가이드 `docs/Search.mdx`(Search Type Map · Header Global Search 개념 · LNB Menu Search · Body Search Area · Common Rule & Scope)
- 검증: 브라우저 테스트 14개 통과(라벨 위 배치·간격, 필드·버튼 32·아래선 맞춤, 펼침/접힘·aria-expanded, detail 없으면 버튼 없음, Enter·조회·초기화·로딩, Validation). 기존 테스트(공통 24 · Modal 21 · LNB 23 · Badge 18/21 기존 Q30) 재통과
- 한 가정: 버튼은 라벨 한 줄 높이 + 간격만큼 내려 필드 줄에 맞춤(오류 문구가 생겨도 위치 유지). 필드 폭은 화면에서 지정

### Search 가이드 시안 실측 반영 — 2026-11-10
- 추가: 상세 조건을 펼치면 기본 조건 아래 16에 구분선(`Line/Subtle` 1px, 내용 폭 전체), 구분선 아래 24에 상세 조건 줄. `search-area/row-gap` 삭제 → `detail-gap`·`detail-padding`·`color/search-area/divider`
- 검증: typecheck · lint · build · Storybook 빌드 통과. DetailExpanded 렌더링을 같은 방식으로 측정해 간격·구분선 일치 확인(라벨 ↔ 필드, 구분선 ↔ 다음 줄은 1px 차이 — 라벨 줄 높이 19.5px 반올림)

### Component: CPID List Item (Phase 4 display) — 2026-11-11
- 만든 것: `display/CpidListItem`(새 폴더 `display/`) — 버튼 카드: `cpid` · `merchantName` · `status`(Badge sm · dot 슬롯) · `selected`(Primary 50 배경 · Primary 500 테두리, aria-pressed), 한 줄 말줄임. 토큰 `tokens/custom/cpid-item.json`(색 모두 alias), 타이포 역할 `cpid-item-title`(Typo/13/Bold) · `cpid-item-name`(Typo/12/Regular). stories(Playground · States · SelectableList), 가이드 `docs/CpidListItem.mdx`(Storybook `Components/CPID List Item`)
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 12개 통과(288 × 58 · 반경 6 · 간격 8, 기본/선택 색 · 테두리, 글자 · 색, Badge 위치(시안 좌표와 일치), 가맹점명 위치, 선택 이동, 말줄임, 포커스, 가이드)
- 한 가정: Q43

### Component: Infobox (Phase 4 display) — 2026-11-11
- 만든 것: `display/Infobox`(Compound) — `Infobox`(tone info · neutral) · `Infobox.Item`(아이콘 · title · 설명 · `actionLabel` · `action` · `icon`) · `Infobox.Link`. 상자 전체를 grid + 줄은 subgrid로 여러 줄의 제목 · 설명 열 맞춤. 토큰 `tokens/custom/infobox.json`(색 모두 alias). stories(Playground · Types · Variations), 가이드 `docs/Infobox.mdx`(Storybook `Components/Infobox`)
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 12개 통과(높이 46 · 74, 색 · 테두리 · 반경 8, 아이콘 20 · 위치, 제목 · 라벨 · 링크 위치가 시안 좌표와 1px 이내, 글자 · 색, 줄 간격 8 · 열 맞춤, 오른쪽 영역 없음, 좁은 폭 줄바꿈)
- 한 가정: Q44

### Component: Summary Card (Phase 4 display) — 2026-11-11
- 만든 것: `display/SummaryCard` — `title` · `info`(InfoTip 16) · `value`(숫자는 천 단위 쉼표) · `unit` · `meta`(• 자동) · `size` md 120 / sm 96(높이 고정) · `loading`(Skeleton) · `empty`(기본 문구). 값 · Skeleton · 빈 상태는 카드 아래에 붙여 상태가 바뀌어도 높이 같음. 토큰 `tokens/custom/summary-card.json`(색 모두 alias). stories(Playground · States · InGrid), 가이드 `docs/SummaryCard.mdx`(Storybook `Components/Summary Card`)
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 12개 통과(크기 320×120 · 280×96, 색 · 테두리 · 반경, 제목 · Info 위치, 값 · 단위 · 보조 글자 · 색, Skeleton 크기 · 위치(시안과 일치), 빈 상태). 렌더링 캡처가 시안과 일치(글자 위치 1~2px 이내)
- 한 가정: Q45

### Component: Address Result Row · Address Search (Phase 4 display) — 2026-11-11
- 만든 것: `display/AddressResultRow`(우편번호 · 도로명 / [지번] 지번 · [선택] Primary Line sm, 말줄임) · `display/AddressSearch`(Modal lg Body용 Lookup 내용: SearchField + [조회] Neutral Solid, 조회 전 = 검색 예시 · 결과 = "검색결과 N 건" + 목록 · `[]` = 결과 없음, `query` controlled/uncontrolled, `onSearch` · `onSelect` · `loading` · `total` · `examples`). 주소 API는 화면에서. 토큰 `tokens/custom/address.json`(색 모두 alias). stories(States · ResultRow · Interactive), 가이드 `docs/AddressSearch.mdx`
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 14개 통과(패널 높이 시안 ±3, 제목 · 검색 · 예시 · 결과 · 안내 글자 줄 위치가 시안과 픽셀 일치(±1), 목록 선 위치 153 · 줄 79, 검색 필드 · [조회], Row 글자 · 색 · 태그 · 간격 · [선택], Enter 조회 · 결과 4건 · 선택 시 닫힘 · 값 반영 · 결과 없음)
- 한 가정: Q49

### Modal 모양 · Address Search 글자 확정 반영 — 2026-11-12
- Modal: 테두리 제거(토큰 `modal/border` 삭제), 반경 10 → 12, 그림자 `0 8px 24px 0 rgba(0,0,0,.12)`(TODO 해제), 배경 Base White(`Bg/Surface` 그대로). Modal을 쓰는 모든 화면(Lookup · Address Search 등)에 적용
- Address Result Row: 우편번호 13 SemiBold · 최소 폭 46, 도로명 14 Bold, 두 줄 간격 3 → 4(줄 높이 79)
- 검증: tokens · typecheck · lint · build · Storybook 빌드 통과. 브라우저 확인 5개(Modal 반경 12 · 테두리 없음 · 그림자 하나, 우편번호 · 도로명 글자 · 최소 폭 · 간격 16, 두 줄 간격 4 · 줄 높이 79). 기존 Modal · Address 테스트의 반경 10 · 테두리 · 줄 78 기대값은 옛 값

### Component: Lookup Search (Phase 4 display) — 2026-11-12
- 만든 것: `display/LookupSearch` — 조회형 Lookup Modal 본문(Figma Modal/Lookup 사업자번호 · 원가정보, Select Box/Modal/Search Result (Lookup) · Empty). 검색 줄(`label` 왼쪽 + SearchField + [조회] Neutral Solid, `extraFields` · `header` 슬롯) + 결과(children = IBSheet8 그리드) · `empty`(높이 480 안내). query controlled/uncontrolled, `onSearch` · `loading`. 토큰 `tokens/custom/lookup.json`. stories(Initial · Result(예시 그리드 + Footer) · Empty(표준산업분류: Button Tab + 조건 2개, 폭 880) · Interactive), 가이드 `docs/LookupSearch.mdx`
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 11개 통과(Figma 값: 폭 800 · 제목 20 SemiBold · 닫기, 검색창 x 20 · y 68 · 40 · [조회] 오른쪽 20 · 간격 8, 라벨 13 Bold · 간격 8, 검색 ↔ 그리드 12, 결과 없음 480 · 글자 · 간격 6, Empty 폭 880 · Tab · 조건 2, Enter 조회 → 그리드 · 결과 없음 · 닫기). 렌더링 캡처가 Figma 스크린샷과 일치
- 한 가정: Q51

### Component: Column Picker (엑셀 다운로드) — 2026-11-12
- 만든 것: `display/ColumnPicker` — Figma Modal/Modal_Excel Download 본문. 안내 · 전체선택(일부 선택 표시) · 항목 칸(200 × 40, 이동 아이콘 · 이름 · 체크박스) 4열 그리드, 드래그로 순서 변경(브라우저 기본 Drag and Drop, 라이브러리 없음). `items` · `onItemsChange` · `value`(항목 순서대로) · `columns`. 토큰 `tokens/custom/column-picker.json`. 스토리 ExcelDownload(Modal 876 + Footer), 가이드 `docs/ColumnPicker.mdx`
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 테스트 10개 통과(모달 876 × 418 = Figma, 안내 위치 · 글자, 항목 200 × 40 · 반경 8 · 테두리 · 4열 · 간격 12, 글자 · 아이콘 20, 전체선택 indeterminate · 전체 선택 · 해제, 항목 선택, 드래그 순서 변경). 렌더링이 Figma 스크린샷과 일치
- 한 가정: 드래그 중 표시(반투명 · 놓을 칸 Primary 테두리)는 시안 없어 임시. 키보드 순서 변경 미지원

### Component: Action Bar (취소사유입력) — 2026-11-12
- 만든 것: `display/ActionBar` — Figma 취소사유입력(29406:96321): 회색 작업 바(Neutral 50 · Line/Subtle · 반경 4 · 여백 12 테두리 안쪽 · 간격 12) + 라벨(11 Bold Text/Label) + 내용 슬롯. 취소사유 구성(입력 sm 200 · 라디오 sm 가로 · [선택 취소] Dark sm)은 스토리 CancelReason. 토큰 `tokens/custom/action-bar.json`. 가이드 `docs/ActionBar.mdx`
- 검증: typecheck · lint · Storybook 빌드 통과. 브라우저 확인(배경 · 테두리 · 반경, 높이 58(테두리 제외 56 = Figma), 라벨 글자 · 위치, 입력 200 × 32 · 버튼 32 Dark · 오른쪽 12, 입력 · 라디오 선택 반영, 콘솔 에러 없음). Figma 설명은 Address Row 설명이 복사돼 있어 용도는 이름으로 판단
- 한 가정: Figma sm 라디오 이름 14px ↔ 현재 13px(Q22)

### Q51 · Q52 · Q22 반영 — 2026-11-12
- Button Tab 크기: md 40(기본) · sm 32 (`size`). 기존 Button Tab 기본 높이가 32 → 40으로 바뀜(sm으로 32 유지 가능). ButtonTab 스토리에 md · sm
- 필드 크기 `lg`(48) 추가: md와 글자(14) · 여백 14 · 반경 8 같고 높이만 48 (FieldBox · Field 라벨). 즐겨찾기 편집 검색을 lg로
- Radio · Checkbox 이름 글자 md 14 · sm 13 확정(코드 변경 없음)

### FormSection 제목 줄 통일 — 2026-11-12
- 카드 제목(기본 정보)도 소제목(담당자 정보)과 같은 `FormSection.Heading`으로 그린다 — 접기/열기는 제목 줄 오른쪽 Action 끝. `FormSection`에 `description` prop 추가. 기본 정보 · 담당자 정보는 같은 레벨(h2) — 소제목 개념 없음
- 글자: 둘 다 **18 Bold · 줄 높이 26** (사용자 결정. 시안의 기본 정보 18 SemiBold · 21과 다름 → 기본 정보 카드 793 → 798)
- API 정리: `FormSection.Header` 삭제 → 본문 중간 제목 줄은 `FormSection.Heading`(title · description · actions). 대상 표시(선택 CPID)는 `FormSection`의 `label` + `title` + `context`(아래 줄 ContextChip · Badge) — 옛 `Heading value` 사용처(스토리 · 가이드 · 가맹점 기본/계약 정보 화면) 교체. 제목 줄은 label · description · context만 있어도 그린다
- 검증: 디자인 시스템 typecheck · lint · build, 앱 build(tsc 포함), Storybook 빌드 통과

### Component: Section Heading — 2026-11-12
- 만든 것: `components/SectionHeading` — 영역 제목 줄 `[label] 제목 [description] [addon] ··· [actions]` + 아래 줄 문맥(children). `size` lg 18 Bold · md 16 Bold, `subtle`(한 줄 카드), `as` h2~h4, `actionsGrow`(ActionBar처럼 오른쪽이 남는 폭을 채움 — 제목 묶음은 줄지 않음), 긴 제목 말줄임. 간격은 쓰는 곳이 CSS 변수 `--section-heading-gap`(기본 16) · `--section-heading-actions-gap`(기본 8)로 지정. stories · 가이드 `docs/SectionHeading.mdx`
- 내부 교체: `PageLayout.Section`(stack lg · inline md) · `SearchPanel` · `ResultPanel`(md · actionsGrow) · `AppliedFilters` · `ResultSummary`(md subtle) · `FormSection.Heading`(이제 SectionHeading 래퍼). 화면 코드 · props는 그대로
- 토큰: `tokens/custom/section-heading.json`(title · title-subtle · label · description) 추가, 중복 삭제 — `page-layout/section/title`, `search-result/title` · `sub-title`, `record-form/title` · `description`
- 검증: typecheck · lint · build(디자인 시스템 · 앱) · Storybook 빌드. **바꾸기 전/후 픽셀 비교 25장 모두 동일** — Storybook 20(Page Layout · FormSection · Result Parts · SearchPanel · P01 · P02, 정적 빌드 2개 비교)과 앱 5(통합 거래내역 · 정산 실행 조회 후, 가맹점 신규/수정, Placeholder). 새 스토리 5개 · 가이드 렌더, 긴 제목 말줄임 확인, 취소 흐름 테스트 13개 재통과
- 참고: 이미 떠 있던 Storybook(6006)은 deps 캐시가 깨져 모든 스토리가 "Failed to fetch dynamically imported module" — 재시작 필요(`node_modules/.cache/storybook` 삭제 후 `pnpm storybook`)

### Search 가이드 정리 — SearchArea 삭제 · SearchPanel 통일 — 2026-11-16
- 문제(사용자): Storybook Composites/Search/Search Area가 디자인과 다름 — 예전 Search 가이드 PNG 기준(카드 없음 · 입력 32 · [초기화][조회][상세조건] 한 줄)이라 실제 화면의 KWP GUI 검색 카드(SearchPanel)와 달랐음
- 결정(사용자): SearchPanel로 통일. `components/SearchArea`(컴포넌트 · 스토리) · 토큰 `tokens/custom/search.json`(`search-area/divider`) · index export 삭제. 앱에서는 쓰지 않던 컴포넌트
- 교체: Page Layout TradeList 스토리(검색 Section + SearchArea → SearchPanel 카드), Search 가이드(`docs/Search.mdx`, Storybook `Composites/Search/Guide`로 독립 — 4절 Body Search를 SearchPanel 사용법 · 규칙 표 · Rows · DetailGrid · InlineActions 예시로), Page Layout 가이드 코드 예시, Spacing 가이드 예시(`$sr-gap`), Storybook 정렬(Search: Guide → Search Panel), page-patterns-plan 표기
- 검증: tokens · typecheck · lint · build(디자인 시스템) · 앱 tsc, Storybook 색인에 search-area 없음 · Search 가이드 렌더(SearchPanel 예시 3개) · Page Layout TradeList 검색 카드 · 상세 검색 펼침, 에러 없음
- 검색 조건 기본 폭(사용자 확정, 같은 날): SearchPanel이 CSS 변수 `--field-default-width` 200 · `--date-field-default-width` 140을 내려 줌 → FieldBox `defaultWidth`(TextField = text · DateField = date) · SelectBox · MultiSelect 루트가 폭을 정하지 않았을 때 그 값(`fullWidth` · 인라인 폭 우선, 값이 없는 곳은 auto = 기존 내용 폭). SearchPanel · Search 가이드에 규칙. 측정: 통합 거래내역 시작일 · 종료일 140, 직접 폭 · fullWidth 필드는 그대로(사업자번호 210 · CPID 185 · 거래번호 200 · 거래구분 205 등 Figma 측정값), 다운로드 센터 · 정산 실행 · P01 패턴 변화 없음(모두 fullWidth · 기간 필드), 에러 없음
- 검색 아이콘 입력 228(사용자 확정, 같은 날): FieldBox `defaultWidth="text"`에 앞 아이콘이 있으면 `--search-field-default-width`(SearchPanel 228). 측정: Storybook SearchPanel Rows의 사업자번호(LookupField) 228 · 일반 입력 200, 검색 조건 밖 SearchField는 내용 폭 그대로(243)
- 퀵 기간(사용자 확정, 같은 날): SearchPanel 안 Segmented md 옵션 최소 55(`--segmented-item-min-width`, 밖은 0 = 글자 폭), 검색 조건 안에서는 fullWidth여도 늘어나지 않음(`--segmented-full-width` auto · `--segmented-item-flex` none). 통합 거래내역 검색 패널 · SearchPanel Rows 스토리의 fullWidth · flex 제거. 측정: 통합 거래내역 · 정산 실행 · P01 패턴 217(55 × 4 − 겹친 테두리), Rows 스토리 109, 검색 조건 밖 FullWidth 스토리 360 그대로, 에러 없음
- 필드 흐름(사용자 확정, 같은 날): `SearchPanel.Row` · `.fieldLine` 삭제 — 필드를 순서대로 나열하면 폭이 남을 때 다음 필드가 같은 줄로 올라오고 모자라면 내려감(사이 16). 통합 거래내역 검색 패널: Row 2개 풀기, 거래구분 · 결제수단 · 거래상태의 flex · fullWidth와 거래번호 · 주문번호 폭 200 · 사업자번호 210 · CPID 185 직접 폭 제거(기본 폭 200 · 228 사용). SearchPanel 스토리 Rows → Flow, Search · SearchPanel · P01 가이드 갱신. SelectBox · MultiSelect 안 상자가 항상 루트 폭을 채우게(검색 조건 기본 폭 200에서 상자가 82로 그려지던 문제) — 검색 조건 밖 셀렉트 폭은 그대로(측정 비교 동일). 측정: Flow 스토리 1500 → 2줄 · 1100 → 2줄 · 800 → 3줄, 통합 거래내역 1920 → 3줄(사업자번호 · CPID · 조회기준일 / 퀵 기간 · 거래번호 · 주문번호 · 거래구분 · 결제수단 · 거래상태 / 거래원천) · 2560 → 2줄, 에러 없음
