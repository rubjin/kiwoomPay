# Patterns P01~P07

> 범위: 페이지 패턴 부품 · 흐름 훅 · 패턴 페이지. 설계안은 `docs/ai/page-patterns-plan.md`. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### 공통

- 위치: 디자인 시스템 `src/patterns/<패턴>/`, Storybook `Patterns/P0N …`(가이드 `docs/patterns/P0N*.mdx`), 앱 패턴 페이지 `features/patterns/`(`/patterns/*`, **개발 서버에서만** — `import.meta.env.DEV`)
- 성공 · 실패 안내는 `DialogProvider` · `useDialog`(alert · confirm Promise, Modal sm). 앱 App에 `DialogProvider`
- 결과 상태 표시 `StatusView`(조회 전 · 조회 중 · 0건 · 오류 · 권한 없음). **문구는 영역 세로 가운데** — StatusView가 부모(카드 · ResultPanel 본문)의 남는 높이를 채움(flex 1, 최소 220), ResultPanel 본문도 남는 높이를 채움(사용자 결정, 메뉴관리 "메뉴를 선택해주세요"). 조회 전 기본 문구 "내역을 조회해주세요 / 검색조건을 설정한 후 [조회] 버튼을 눌러주세요"(제목은 화면별)
- P01 결과 표는 `IbsheetGrid` + `filterable` · `sortable`이 기본(앱 `/patterns/search-result`). Storybook `Patterns/P01` 예시는 정산 원장과 같은 옵션(지급예정일 편집 · 조정 원장 비활성 선택 · 머리 56 · textSize sm), 비교용 GridPlaceholder 없음. 옵션 설명은 P01 가이드 6절 · Result Parts "표 (IbsheetGrid)"
- 표 미리보기 `GridPlaceholder`(IBSheet 연결 전): 글자 14(머리 14 SemiBold · 칸 14 Regular, 확정 결정 "데이터 표 글자") · 머리 Neutral 100, `selectable`(체크박스) · `selectable="single"`(라디오) · `isRowSelectable` · `empty`(머리 남기고 아래 안내) · `maxHeight`(주면 표 안에서 위아래 · 좌우 스크롤 + 머리 sticky, 이때만 테두리 separate — collapse 테두리는 sticky 칸에 안 붙음). 페이지 결과 표는 IbsheetGrid, GridPlaceholder는 팝업 안 표 · IBSheet 없을 때

### P01 Search → Result

- 부품: `SearchPanel` → `AppliedFilters` → `ResultSummary` → `ResultPanel`(`footer` — 카드 맨 아래 섹션 안내 자리, 여백 16) → `ResultFooter`(Total + Pagination). 흐름 `useSearchResult`(입력 `params` ↔ 조회 `appliedParams` 분리, 늦은 응답 무시, `autoSearch` 기본 false, 처리 후 `await refresh()` → 완료 Alert)
- 검색 조건 정의 `SearchFieldDef` + `toAppliedFilters` · `summarizeSearch`(칩과 내 검색조건 요약을 같은 정의로). 앱은 화면 `components/searchFields.ts` · `initialParams.ts`(`createInitialParams()`)
- 결과 제목 줄 Action 배치: `docs/ai/references/result-panel-actions.md`
- `IbsheetGrid` 칸 링크 · 버튼은 칸 클릭으로 render 요소의 onClick을 부른다. 행 키는 문자열로 비교 — IBSheet가 숫자로만 된 키(예: 신청번호 1031)를 숫자로 바꿔 두기 때문(2026-11-18 수정, 일반 메뉴·기능 권한에서 발견)
- **표 안 폼 요소(버튼 · 입력) 높이 30**: IBSheet 자체 버튼 · 편집 칸뿐 아니라 `IbsheetGrid`가 칸에 그린 디자인 시스템 컴포넌트(`.kpIbHtml` 안 button · input)도 30 — Button sm 32를 표 테마(`ibsheet-theme.scss`)에서 30으로 덮음(2026-11-18, 특수권한 결재 현황 [권한 부여]에서 발견)
- `ResultPanel footer`(표 아래 카드 안 영역)가 있으면 footer 위 선이 표 마지막 줄 아래 선 — 표 테마는 마지막 줄 아래 선을 따로 그리지 않고, footer가 없으면 카드 테두리가 그 선(2026-11-18 수정)

### P02 Record → Form

- `FormSection`(박스 · 위 제목 탭 · 접기 상태) 안에 `FormGroup`(`SectionHeading` + `FormTable`). 접기는 카드 전체(첫 제목 줄 `actions`에 `<FormSection.Toggle />`). 간격: 묶음 사이 16, 제목 ↔ 폼 16, 아래 묶음 8
- `FormTable`: 라벨 138 + 값 칸 4쌍(`pairs`) 또는 `template`. 줄 52 · 머리 44(`Head size="sm"` 36), 라벨 12 Bold Neutral 100. 칸 안 라벨 + 입력은 `FormTable.InlineField`
- 상세 팝업 부품(`RecordDetail`): `DetailTarget` · `DetailTabs` · `DetailSection` · `DetailCard`(칸은 카드 폭을 똑같이, `span` · `tone: 'error'`(#EF4444, 사용자 확정) · `form` · `plain` · `labelGap`) · `DetailSummary`
- 거래 상세정보 팝업: Modal md 620 · **높이 고정 655**(탭을 바꿔도 같은 크기, 가장 긴 결제 오류 케이스 기준 — 사용자 확정). 처음 탭 = 기본정보
- 민원 처리 팝업: `Modal.Footer start`(왼쪽 보조 버튼), 접수 내역 표 가운데 정렬

### P03 Lookup → Apply

- `useLookup<T>()`: `open()` → 고른 값 / 취소 시 `null`. 호출 필드는 `LookupField`(취소하면 값 그대로)
- 찾기 방식이 둘 이상일 때만 Button Tab. 분류로 찾기는 `LookupSearch keyword={false}` + `extraFields`, 키워드는 검색어 + 버튼 한 묶음(`extraFields` Field에 `grow`로 반반)
- 결과 없음: 그리드 머리 남기고 안내(`LookupSearchEmpty`). 주소 검색은 `AddressSearch` + Modal lg
- (임의 작업) 사업자 · 주소 예시 데이터와 열 구성

### P04 Action → Feedback

- `useAction({ validate, confirm, confirmOptions, run, onSuccess, success, failure })` → `{ execute, loading }`: Check(문구 → Alert 후 중단) → Confirm → Process(중복 실행 무시) → Result. `failure`가 null이면 Alert 없음(입력 아래 문구 등)
- sm 입력 팝업: Modal sm · Field 라벨 왼쪽(폭 통일, 120 임시) · 줄 12 · 현재 값은 읽기 전용 · Footer [취소][확인] lg · 처리 중 닫기 · Esc 막음
- xl 입력 표 팝업(결제한도): Button Tab + FormTable, 숫자만 · 쉼표, Tab별 입력 유지
- 일괄 처리 팝업 부품: `ActionTargetBar`(`variant="question"`) · `ActionStats` · `ActionTotal` · `Infobox.Item bullets`. 금액 요약 상자 `DetailSummary`
- (임의 작업) 다운로드 사유 선택지 · 검증 문구 · 실패 예시

### P05 Login → Auth

- 부품 `AuthLayout` · `AuthForm`(`error` 불일치 문구) · `AuthField` · `AuthNotice` · `AuthVerifyBody` · `AuthInfoRow`(`empty`) · `VerifyCodeField`(`error` · `resendDisabled`). 상태별 처리는 `screen-auth.md`

### P06 Notification Feed

- `NotificationFeed`(Hub 카드: 미확인 요약 · 칩 · 목록 44 · 빈 상태) · `NotificationSummary` · `NotificationCountChips`(Hub · 알림센터 공용) · `NotificationAccordion` · `NotificationDetail` · `HighlightText`
- Hub 부품: `HubGrid` · `HubCard` · `HubInfoList` · `HubInfo`(`hint` · `labelWidth`) · `HubDivider` · `HubSubtitle` · `HubPanel` · `HubLinkRow` · `HubStats`(`onClick`이면 값이 Primary 버튼) · `HubEmpty`
- 권한 없음 · 알림 없음: 특수권한이 없으면 권한 신청 현황 → 빈 상태 순서, 알림 빈 상태에도 칩 0건 유지 · [모두 읽음 처리] 숨김

### P07 Selection & Configuration

- `useConfigDraft(saved)`: 초안 · `dirty` · `begin` · `reset`. 바뀐 것이 없으면 [저장] 비활성, 변경 후 닫기는 확인
- V01 즐겨찾기 편집: `FavoriteMenuPicker`(`layout.md`), 저장은 Confirm 없이 바로 → 완료 Alert
- V02 엑셀 다운로드 설정: `TransferList`(전체 ⇄ 선택, 끌어서 순서). 출력 항목 = Grid 열 가정, [추가] 버튼 Chart/Positive 초록(사용자 확정)
- V03 내 검색조건 관리: `SavedConditionList`(빈 상태 · 검색) · `ConditionSummary` · `ConfigSplit`(왼쪽 318 | 오른쪽) · `ConfigField` · `ConfigHint` · `ConfigDivider`. 패널 제목은 모두 `SectionHeading size="md" as="h3"`. 저장조건 없음이면 오른쪽 "신규 검색조건 등록"(이름 필수)
- 트리 선택: `TreeOptionTable`(`treeGroupIds` · `filterTree`) · `SelectedOptionList`, 단계 번호 `SectionHeading step`
- Figma 폭 820은 lg 880으로, 안내 ↔ 본문 24 · 라벨 ↔ 내용 30은 Figma 값

## 열린 질문

- [Q56] P03 Lookup: ① Figma 분류 Select의 "대분류 · 중분류 · 소분류"가 진한 글자 — 지금 placeholder(회색). 선택 전 문구를 진하게 할지 ② 읽기 전용 호출 필드의 지우기(x) — 읽기 전용이면 숨김 ③ 결과 그리드 행 48 · 세로선은 IBSheet 테마로 ④ 중분류 값은 예시
- [Q59] P07 즐겨찾기 편집: ① Figma 폭 820 · 여백 24 ↔ lg 880 · Modal 여백 20 ② 검색 상태는 Figma 노드 없음(사용자 이미지 기준) ③ 바뀐 것이 없을 때 [저장] 비활성 · 닫기 확인 문구 · 저장 완료 문구
- [Q60] P07 V02 · V03: ① [추가] 버튼 Hover 배경 · 비활성 색 임시 ② 엑셀 템플릿 불러오기 · 저장 · 삭제 동작 · 다운로드 요청 후 안내 문구 ③ 엑셀 출력 항목 = Grid 열, 기본 선택 10개 ④ [선택 조건 적용]은 [저장] 때 화면 검색 조건에 넣음(조회는 사용자가) — 즉시 적용인지 ⑤ [신규 등록]은 현재 화면 조건 + 이름 "새 검색조건"
- [Q61] P02 거래 상세정보: ① 고정 높이 655(임시) — 부분취소 이력이 여러 건이면 본문 스크롤 ② 통합 거래내역 행 선택 → 팝업 연결(IBSheet 행 이벤트)
- [Q62] P02 민원 처리: ① 폭 Figma 720 → md 620 ② 민원구분 · 민원유형 · 회신방법 선택지, 필수 항목(지금 민원구분 · 민원내용) ③ 등록 후 닫을지, 남아서 접수정보에 새 줄을 보여 줄지(지금 닫기 + 완료 안내) ④ [등록 후 메일 발송] 받는 사람 · 확인 창 필요 여부
- [Q63] P04 부분취소: ① 폭 Figma 720 → md 620 ② 요청 후 팝업 유지 · 취소내역 반영(지금) vs 닫기 ③ 새 요청 처리상태 문구(지금 "요청") ④ 검증 · 확인 문구 ⑤ 취소유형별 조건(상계 · 강제 · 카드사직권) ⑥ 잔여 금액 0이면 입력 · 버튼 비활성
