# 화면기획서로 화면 만들기 (시안 없이 퍼블리싱할 때)

> 대상: 화면기획서(화면설계서)만 받고 Figma 시안 없이 화면을 만드는 앱 개발자.
> 처음이면 [onboarding.md](onboarding.md)로 실행 환경부터 맞춘다. 전체 규칙 표는 앱 개발 서버의 **개발 컨벤션**(`/patterns/conventions`), 결정 사항 원문은 [ai/status.md](ai/status.md) "확정 결정".

> **이 문서에서 시작해서, 작업하는 요소마다 [9. 참조 문서 지도](#9-참조-문서-지도)의 문서를 열어 세부 규칙을 확인한다.** 확정 결정(`ai/status.md`)은 항상 우선한다.

## 0. 원칙

| 무엇을                                                                             | 어디서 가져오나                                                                         |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 업무 조건 — 검색 조건 · 열 · 버튼 이름 · 권한 · 상태 전이 · 문구 · API             | **화면기획서**                                                                          |
| 화면 골격 — 영역 배치 · 순서 · 상태 흐름(조회 전 · 0건 · 오류, 확인 → 처리 → 결과) | **페이지 패턴** P01~P07 (Storybook `Patterns`) — **기획서의 화면 배치는 따르지 않는다** |
| 모양 — 색 · 크기 · 간격 · 폭 · 버튼 모양                                           | **디자인 시스템 컴포넌트** (이 문서 3절 기본값)                                         |

- **화면 문구는 기획서 화면(와이어프레임)에 그려진 것만, 그대로** 쓴다. 오른쪽 Description(기획 설명)은 동작 · 검증 · 권한 규칙을 구현할 때 참고하고, 안내 상자(Infobox) · 입력칸 도움말 · ※ 문구로 옮기지 않는다
- 시안이 없다고 값을 새로 만들지 않는다. **기존 컴포넌트 조합 + 기본값**으로 만들고, 기획서에 없어서 정한 것은 `TODO`로 표시한다(5절)
- 인라인 `style`로 폭 · 간격 · 배치 · 색을 만들지 않는다(앱 ESLint 경고) — 배치는 `Stack`(`direction="row"` · `justify="between"` · `columns={2}` · `paddingBlock`), 묶음은 `ControlGroup`, 남는 폭은 `Field grow` · `ControlGroup grow` · `ActionBar grow`, 폭은 `fieldWidth`, 글자는 `Text`(`tone="error"` · `nowrap`). 시안 폭이 옵션과 다르면 **가장 가까운 기존 크기**를 쓰고 숫자 폭을 새로 만들지 않는다. 필요한 옵션이 없으면 디자인 시스템 담당에게 요청한다. 꼭 필요한 곳(외부 라이브러리 크기 · 시안 고정 칸 폭)만 `// eslint-disable-next-line … -- 사유`

## 1. 작업 순서

1. **기획서 읽고 패턴 고르기** (2절) — 화면이 여러 패턴이면(조회 + 처리 팝업) 각각 고른다
2. **Storybook `Patterns/P0N …` 참조 화면의 코드를 복사**해서 시작한다. 이미 만든 앱 화면 중 같은 패턴이 있으면 그 화면을 본뜬다 (4절)
3. **기획서 요소를 컴포넌트로 옮긴다** (3절 대응표) — 쓰는 컴포넌트마다 9절 지도의 가이드 · 기록을 열어 세부 규칙(크기 · 톤 · 배치 · 예외)을 확인
4. **패턴 체크리스트의 상태를 모두 구현한다** (6절)
5. **불명확한 것은 TODO로 표시**하고 확인 요청 목록을 만든다 (5절)
6. **등록** — 라우트 · 탭 제목 · 화면 목록 (7절)
7. 제출 전 점검 (8절)

## 2. 패턴 고르기

| 기획서에서 이렇게 보이면                                       | 패턴                              | 핵심 부품 · 훅                                                                                                                                                                                                                              | 참조 화면                                                              |
| -------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 검색 조건 + [조회] + 결과 목록(Total · 페이지)                 | **P01** Search → Result           | `SearchPanel` → `ResultPanel` → `ResultFooter` + `useSearchResult`                                                                                                                                                                          | 통합 거래내역 · 다운로드 센터 · 가맹점 정산 실행                       |
| 상세 조회 · 등록 · 수정 폼(라벨-값 표)                         | **P02** Record → Form             | `FormSection` · `FormGroup` · `FormTable` · 상세 팝업 `DetailTarget` · `DetailSection` · `DetailCard`                                                                                                                                       | 가맹점 기본/계약 정보 관리                                             |
| [찾기] 버튼으로 팝업에서 골라 값 넣기(사업자 · 주소 · 업종)    | **P03** Lookup → Apply            | `LookupField` + `useLookup` · 본문 `LookupSearch` · `AddressSearch`                                                                                                                                                                         | 사업자 찾기 팝업                                                       |
| 검색 + 목록에서 하나 골라 옆에서 보기 · 편집(트리 · 목록 관리) | **P01 + P02** 목록 + 상세         | `SearchPanel`(전체 폭) → `PageLayout.Split`(왼쪽 `ResultPanel` + `TreeTable` · `IbsheetGrid`, 오른쪽 `PageLayout.Section` 폼). 트리는 조회 중 상태 없음, Split 기본 높이로 들썩임 방지, 선택 전 · 0건 안내(`StatusView`)는 카드 세로 가운데 | 메뉴관리 · 기능 코드 관리(3열은 Split 안에 Split, `sideWidth` sm · md) |
| 버튼 → 확인 → 처리 → 완료/실패 안내                            | **P04** Action → Feedback         | `useAction` · `useDialog` · 일괄 처리 `ActionTargetBar` · `ActionStats`                                                                                                                                                                     | 정산 실행의 지급보류 · 지급예정일 변경                                 |
| 로그인 · 인증번호                                              | **P05** Login → Auth              | `AuthLayout` · `AuthForm` · `VerifyCodeField`                                                                                                                                                                                               | 로그인 · SMS 인증                                                      |
| 알림 목록 · 읽음 처리                                          | **P06** Notification Feed         | `NotificationFeed` · `NotificationAccordion`                                                                                                                                                                                                | 알림센터 · 마이페이지 Hub                                              |
| 즐겨찾기 · 표시항목 · 엑셀 항목 · 저장 조건 설정 팝업          | **P07** Selection & Configuration | `useConfigDraft` · `ColumnPicker` · `TransferList` · `SavedConditionList`                                                                                                                                                                   | 즐겨찾기 편집 · 엑셀 다운로드 설정 · 내 검색조건 관리                  |

- 맞는 패턴이 없으면 새 구조를 만들기 전에 먼저 문의한다(패턴 Variant로 흡수할 수 있는지 확인)
- 패턴별 상세 규칙 · Do/Don't: Storybook `Patterns/P0N` 가이드, 설계 배경: [ai/page-patterns-plan.md](ai/page-patterns-plan.md)

## 3. 기획서 요소 → 컴포넌트 대응표

### 화면 틀

| 기획서                                | 쓰는 것                            | 기본값 · 규칙                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 화면명 · 화면명 옆 버튼               | `PageLayout.Title title actions`   | 타이틀까지 고정, 그 아래만 스크롤. **화면명 옆 설명(description)은 기획서에 있어도 넣지 않는다**                                                                                                                                                                                                                                  |
| 상단 안내 문구                        | `Infobox` + `Infobox.Item`         | 화면 전체 안내는 카드 밖 위 `tone="info"`(파랑), 표 · 섹션 안내는 **그 카드 안 맨 아래** `tone="neutral"`(회색, 카드에 내용이 없으면 안 보임) — `PageLayout.Section` 마지막 자식 · `ResultPanel footer`. 같은 내용의 안내가 여러 개면 `Infobox.Item bullets={[…]}` 하나(아이콘 하나 + 점 목록, 기준: 정산 일괄 처리 팝업 notices) |
| 카드(영역 박스) 제목                  | `PageLayout.Section title actions` | **제목 아래 구분선(`divider`) 넣지 않는다** — 기획서에 선이 있어도 무시. `divider`는 시안에 있는 화면만. 목록 · 상세처럼 `ResultPanel`(제목 md)과 나란한 카드는 제목도 **md** — `title` 대신 안에 `<SectionHeading size="md" title actions />`                                                                                    |
| 영역 제목(소제목)                     | `SectionHeading`                   | 팝업 안 소제목 + 내용은 `Modal.Section`                                                                                                                                                                                                                                                                                           |
| 세로로 쌓기                           | `Stack gap`                        | 0 · 4 · 8 · 12 · 16(기본) · 24                                                                                                                                                                                                                                                                                                    |
| 화면 전체가 바뀌는 탭(화면명 아래)    | `Tab variant="title"`              | **화면 전체가 바뀔 때만** 제목 탭. 바로 아래 박스(카드)는 탭과 붙인다 — `<Stack gap={0}>` 안에 탭 + 박스, 탭 아래 여백 없음                                                                                                                                                                                                       |
| 영역 안 탭 (화면 전체 전환이 아닌 탭) | `Tab variant="button"`             | **페이지에서는 항상 버튼 탭** — Line 탭 쓰지 않음. 가맹점관리자는 예외(화면별 확인)                                                                                                                                                                                                                                               |

### 검색 조건 (P01)

| 기획서                        | 쓰는 것                                                                               | 기본 폭 (따로 정하지 않았을 때)            |
| ----------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------ |
| 검색 영역 전체                | 화면 본문 `SearchPanel`(카드) / 팝업 안 `SearchPanel variant="plain" fieldWidth="lg"` | 필드는 순서대로 흐르고 넘치면 다음 줄      |
| 라벨 + 입력                   | `Field label` + `TextField`                                                           | 200 (팝업 270)                             |
| 셀렉트(단일 · 복수)           | `SelectBox` · `MultiSelect`, 선택지는 `useCodeOptions('<그룹>', { withAll: true })`   | 200 (팝업 270)                             |
| 키워드 검색(아이콘 있는 입력) | `SearchField`                                                                         | 228                                        |
| 날짜 · 기간                   | `DateField` · `DateRangeField`                                                        | 날짜 140 · 기간 264 고정                   |
| 퀵 기간(오늘 · 1주 · 1개월)   | `Segmented`                                                                           | 옵션 최소 55                               |
| 상세 조건 접기                | `SearchPanel detail`                                                                  |                                            |
| 초기값 · [초기화] 기준        | 화면 `components/initialParams.ts`의 `createInitialParams()`                          | 기본 기간은 기획서 값, 없으면 `TODO(정책)` |

- 폭을 바꿔야 하면 `fieldWidth`(auto · xs 72 · sm 150 · md 200 · lg 270 — 시안 값과 가장 가까운 것) 또는 `fullWidth` — `style={{ width }}` 금지. 줄의 남는 폭을 채우는 긴 입력(파일명 · 검색어)은 `<Field grow>` + `fullWidth`
- **최초 진입 시 조회하지 않는다**(`autoSearch` 기본 false). 들어오자마자 조회해야 하는 화면은 기획서 근거를 주석으로 남긴다

### 조회 결과 (P01)

| 기획서                   | 쓰는 것                                                                     | 규칙                                                                                                          |
| ------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 결과 표                  | `IbsheetGrid` (`@kiwoompay/design-system/ibsheet`)                          | 열 정의는 화면 `components/<이름>Columns.tsx`. 열 `width`는 기획서 · 시안 값, 없으면 비워 두면 남는 폭을 나눔 |
| 체크박스 선택            | `IbsheetGrid selectable selectedKeys onSelectionChange`                     |                                                                                                               |
| 칸 안 상태 · 링크 · 버튼 | 열 `render`에 `Badge` · `TextLink` · `Button size="sm"`                     | 상태 → Badge 색 표는 화면 `components/`에 한 곳                                                               |
| 금액 · 건수 · 빈 값      | `utils/format.ts` — `formatNumber` · `formatWon` · `formatCount` · `orDash` | 빈 값은 `-`                                                                                                   |
| Total · 페이지           | `ResultFooter total` + `Pagination`                                         | 조회 전 · 0건이면 Pagination `disabled` — **건수는 여기에만**, 위쪽 "총 N건" 없음                             |
| 결과 제목 줄 버튼        | `ResultPanel titleActions`(왼쪽) · `actions`(오른쪽)                        | 아래 표                                                                                                       |
| 팝업 안 표               | `GridPlaceholder` (IBSheet 아님)                                            |                                                                                                               |

결과 제목 줄 버튼 배치 — 상세: [ai/references/result-panel-actions.md](ai/references/result-panel-actions.md)

| 자리                | 기획서 버튼 예                               | 모양                                                                                            |
| ------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 왼쪽 `titleActions` | 표시항목설정 · 엑셀 다운로드 (Grid 도구)     | `size="sm" variant="neutral" appearance="line"`                                                 |
| 오른쪽 ①            | 일괄 변경 · 보류 · 재산출 (선택 데이터 처리) | `size="sm" variant="neutral" appearance="line"`                                                 |
| 오른쪽 ②            | 확정 · 승인 (상태 변경)                      | `size="sm" variant="dark"`                                                                      |
| 오른쪽 ③ 맨 끝      | 등록 · 추가                                  | `size="sm"`(Primary) + `leadingIcon={<Icon name="plus" size={20} />}` — **Primary는 이것 하나** |

### 폼 · 상세 (P02)

| 기획서                   | 쓰는 것                                                  | 규칙               |
| ------------------------ | -------------------------------------------------------- | ------------------ |
| 라벨-값 표               | `FormSection` > `FormGroup` > `FormTable`                | 라벨 칸 138, 줄 52 |
| 표 칸 안 라벨 + 입력     | `FormTable.InlineField` (= `Field variant="inline"`)     | 라벨 ↔ 입력 12     |
| 조회 전용 값             | 텍스트 그대로 (비활성 입력 X)                            |                    |
| 입력 + 버튼(중복확인 등) | `ControlGroup`                                           | 사이 8             |
| 입력 + [찾기]            | `LookupField`                                            | 취소하면 값 그대로 |
| 버튼 묶음 + 버튼 묶음    | `ControlGroup spacing="lg"` 안에 묶음마다 `ControlGroup` | 묶음 사이 16       |
| 예/아니오 · 선택지       | `RadioGroup` · `Checkbox` · `ToggleSwitch`               |                    |

### 팝업 · 처리 (P03 · P04)

| 기획서                  | 쓰는 것                                                              | 규칙                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 팝업                    | `Modal` + `Modal.Header` · `Modal.Body` · `Modal.Footer`             | 크기 sm 400 · md 620 · lg 880 · xl 1280 · xxl 1680 — 기획서 폭에 가장 가까운 것                                                   |
| 팝업 안 목록 + 상세     | `HubGrid columns={[왼, 오]}` 안에 `Modal.Section` 둘                 | 조회 조건은 `SearchPanel variant="plain"` 위에, 목록은 `TreeTable`(줄 선택) · 표는 `GridPlaceholder`. 예: 특수권한 코드 관리 팝업 |
| 팝업 하단 버튼          | `Modal.Footer` [취소][확인]                                          | **항상 lg**, 확인이 오른쪽                                                                                                        |
| 확인 · 완료 · 실패 안내 | `useDialog().confirm()` · `alert()`                                  | Toast 없음                                                                                                                        |
| 버튼 처리 흐름          | `useAction({ validate, confirm, run, onSuccess, success, failure })` | 중복 클릭은 훅이 막음. 버튼에 "처리 중" 표시 하지 않음                                                                            |
| 처리 후 목록 갱신       | `await result.refresh()` → 완료 Alert                                |                                                                                                                                   |

## 4. 코드 배치

```
features/<1depth>/
  <1depth>.routes.tsx            라우트
  <이름>.api.ts · <이름>.types.ts   1depth 안 여러 화면 공용 API · 타입
  <2depth>/
    <화면>Page.tsx                화면 = 패턴 부품 조립 + API 연결
    components/                   그 화면 전용 (initialParams.ts · searchFields.ts · <이름>Columns.tsx · 팝업)

mocks/                           예시 데이터 한곳 (TODO(API) — 실제 API로 바꾸면 폴더째 삭제)
  utils.ts                       wait · paginate · 날짜(pad · parseDateTime · toYmdHm · DAY) · 마스킹(mask*)
  common/<이름>.mock.ts            src/api 공용 API의 예시 데이터
  <1depth>/<이름>.mock.ts          features/<1depth>/<이름>.api.ts가 쓰는 예시 데이터
```

- 기능 폴더끼리 가져다 쓰지 않는다. 두 1depth 이상이 쓰면 `src/api` · `src/components` · `src/utils`로
- API는 지금 `// TODO(API)` + 예시 데이터. **예시 데이터(목록 · 시드 · 만드는 함수)는 api 파일에 두지 않고 `src/mocks/<1depth>/<이름>.mock.ts`에** — api 파일은 조회 조건 거르기 · 페이지 자르기 · 저장 같은 동작만. 응답 형식이 정해지면 api 함수 안쪽을 `http.get` / `http.post`로 바꾸고 그 mock 파일을 지운다
- mock 파일 쓰는 법: 맨 위 두 줄 = `// 예시 데이터: <무엇 몇 건>` · `// <api 파일>가 쓴다. TODO(API) …`, **export는 api가 쓰는 것만**(만드는 도구 · 원본 행은 export 없이), 이름은 데이터 이름(`NOTIFICATIONS` · `SETTLEMENT_LEDGERS` — `SAMPLE` · `rows` 같은 일반 이름 금지)
- mocks는 기능 폴더의 타입 · 초기값을 가져다 써도 된다(임시 폴더라 "공통 → 기능 import 금지"의 예외). 기능 폴더 api 값을 가져오면 순환 import가 되니 상수는 `*.types.ts`에 둔다(예: `SYSTEM_MENU_ID`)
- **중복 처리** — 같은 도구 · 상수 · 부품이 **두 곳 이상**에 생기면 새로 만들지 말고 쓰는 범위에 맞는 한곳으로 올린다. 만들기 전에 아래 위치에 이미 있는지 먼저 찾는다

  | 쓰는 곳                               | 둘 곳                                                                     | 예                                             |
  | ------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------- |
  | 화면 모양(버튼 · 표 · 검색 · 팝업 틀) | 디자인 시스템 `@kiwoompay/design-system`                                  | `ResultPanel` · `useAction`                    |
  | mock 파일끼리                         | `src/mocks/utils.ts`                                                      | `pad` · `parseDateTime` · `maskId`             |
  | 한 1depth 안 여러 화면                | `features/<1depth>/` 바로 아래 파일 · `components/`                       | `mypage/components/PermissionRequestModal.tsx` |
  | 여러 1depth                           | `src/utils`(형식 · 날짜) · `src/api` · `src/components` · `src/constants` | `formatWon` · `toYmd` · `BizFinderModal`       |
  - 올린 것은 컨벤션 페이지 "공통화" 목록(`features/patterns/conventionsLocal.ts`)에 한 줄 남긴다
  - 이름이 같아도 하는 일이 다르면 합치지 않는다(예: IBSheet 달력의 날짜만 읽는 `parse`는 mock의 `parseDateTime`과 다름)
  - 실제 코드(화면 · api)가 mock 도구를 쓰는 것은 예시 동작 흉내일 때만 — API를 연결하면 함께 지운다

- 본뜰 화면: P01 [DownloadCenterPage.tsx](../apps/kwp2-center-admin-fe/src/features/main/download-center/DownloadCenterPage.tsx) · [IntegratedTransactionPage.tsx](../apps/kwp2-center-admin-fe/src/features/transaction/integrated/IntegratedTransactionPage.tsx), 패턴 템플릿 [features/patterns/](../apps/kwp2-center-admin-fe/src/features/patterns/)

## 5. 기획서에 없는 것 표시하기

| 상황                                                         | 코드 표시                     | 화면 목록                  |
| ------------------------------------------------------------ | ----------------------------- | -------------------------- |
| 모양 값(폭 · 높이 · 문구 배치)을 기본값에서 벗어나 정함      | `// TODO(시안) <무엇을 · 왜>` | `tempWork: '임의 작업: …'` |
| 업무 정책(기본 기간 · 최대 기간 · 권한 · 예외 동작)을 가정함 | `// TODO(정책) <가정한 내용>` | 〃                         |
| API 미정 · 예시 데이터                                       | `// TODO(API)`                |                            |
| 버튼 종류(처리 · 상태 변경 · 등록)가 애매함                  | 3절 표로 분류 후 `TODO(정책)` | 〃                         |

- 화면에 없는 안내 · 도움말은 만들지 않는다(Description 내용 포함). Alert(확인 · 완료 · 실패)와 빈 상태 안내만 기획서에 없으면 같은 패턴 참조 화면의 문구를 쓴다(조회 전 "내역을 조회해주세요" 등 — `StatusView` 기본 문구)
- 확인 요청은 "기획서 위치 · 가정한 내용 · 질문" 한 줄씩 묶어 기획 담당에게 전달한다

## 6. 상태 체크리스트

### 공통

- [ ] 카드(섹션)에 내용이 없을 때(선택 전 · 0건 · 오류) 그 카드의 안내 상자(Infobox · ※ 문구)는 보이지 않는다 — 상태 안내(StatusView)만

### P01 조회 화면

- [ ] 조회 전(들어왔을 때) · 조회 중 · 0건 · 오류 — `ResultPanel status={result.status}`가 그림
- [ ] 조회 후 조건을 바꿔도 [조회] 전까지 결과 유지
- [ ] [초기화] → `createInitialParams()` 값
- [ ] 조회 전 · 0건이면 결과 제목 줄 버튼 · Pagination 비활성
- [ ] 선택이 필요한 처리 — 선택 없으면 안내 Alert

### P02 폼

- [ ] 필수 항목 · 검증 오류 문구(Field `error`)
- [ ] 저장 안 하고 Work Tab · 브라우저 닫을 때 확인
- [ ] 조회 전용 값은 텍스트

### P04 처리

- [ ] 검증 실패 → Alert 후 중단 / 확인 → 처리 → 완료 Alert → 목록 `refresh`
- [ ] 실패 시 입력 값 유지, 실패 Alert
- [ ] 처리 중 팝업 닫기 · Esc 막힘

## 7. 등록

1. `features/<1depth>/<1depth>.routes.tsx`에 라우트 (`lazyPage`, 주석에 화면ID)
2. 탭 제목: `src/constants/screens.ts`에 `{ id, name, path }`
3. 화면 목록: `apps/screen-list/src/screens.ts`에 IA 화면ID(12자리)로 한 줄 — `pattern` · `status` · `updatedAt` · `tempWork`(임의 작업)
   - **작업을 마치면 `status: '완료'`로 바꾼다**(완료 처리까지가 작업). 화면ID는 IA 기준 — 기획서 머리 화면ID와 다르면 IA ID를 쓰고 열린 질문에 남긴다
4. 팝업: 팝업 모음(`features/patterns/PopupsPage.tsx`)에 버튼 추가 → 화면 목록 경로는 `/patterns/popups?open=<키>`
5. 파일 머리 주석: 화면(`…Page.tsx`) · 팝업(`…Modal.tsx`) 파일 **맨 첫 줄**(import 위)에 화면ID · 위치 — 화면ID나 경로로 전체 검색하면 바로 나오게

   ```tsx
   /**
    * 화면ID: KWPC06010201 가맹점 정산 실행/처리
    * 위치: 정산내역 > 가맹점 정산 관리 > 정산 실행/처리 · /settlement/merchant/execute
    */
   ```

   - 화면ID는 IA 12자리를 `[ ]`로 감싼다(눈에 띄게 · `[KWPC06010201]`로 검색하면 머리 주석만 나옴), 화면명은 화면 목록(`screens.ts`)의 `name`. 위치 = IA 메뉴 단계(`>`) · 앱 경로
   - 팝업은 위치에 **여는 화면**의 메뉴 · 경로 + `(팝업)`, 여러 화면 공용이면 `(팝업, 여러 화면 공통)`
   - 한 파일에 화면ID가 여럿이면(팝업 여러 개 · 탭 화면) `화면ID:` 아래 줄에 하나씩 맞춰 적는다
   - 함수 설명 주석(구성 · 동작)은 머리 주석과 별도로 그 함수 위에 둔다 — 머리에는 화면ID · 위치만

## 8. 제출 전 점검

- [ ] 인라인 `style`로 폭 · 간격 · 배치 · 색을 만들지 않았다 (`fieldWidth` · `Stack` · `ControlGroup` · `grow` · `Text`) — `pnpm lint` 경고 0
- [ ] 라벨이 있는 입력은 모두 `Field`, 라벨 + 입력 + 붙는 버튼은 한 묶음
- [ ] 결과 제목 줄에 Primary 버튼은 등록 하나
- [ ] 팝업 크기는 5단계 중 하나, 하단 버튼 lg
- [ ] 6절 상태를 모두 확인했다 (Storybook 없이 앱에서 직접)
- [ ] 디자인 시스템 컴포넌트 · 테마 · 아이콘을 고쳤다면 Storybook 스토리 · 가이드(MDX)에도 반영하고 Storybook에서 그려지는 것까지 확인했다 (확정 결정 "디자인 시스템 변경 → Storybook")
- [ ] `TODO(시안 · 정책 · API)` 표시 + 화면 목록 `tempWork` 작성
- [ ] 화면 · 팝업 파일 첫 줄에 화면ID · 위치 머리 주석 (7절 5)
- [ ] `pnpm lint` 통과, 앱 `tsc` 새 오류 없음

## 9. 참조 문서 지도

작업하는 요소의 줄만 연다. **가이드**는 사용법 · Do/Don't(Storybook과 같은 내용), **기록**은 이후에 정한 세부 규칙 · 예외 · 임의 작업. 둘이 다르면 기록이 최신이다.

| 작업 요소                                                 | 가이드 (Storybook MDX)                                                                                                                                                                              | 기록 (`docs/ai/log`)                                                            |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 화면 틀 · 화면명 · 카드 · 좌우 분할(`PageLayout.Split`)   | [PageLayout](../packages/design-system/docs/PageLayout.mdx) · [SectionHeading](../packages/design-system/docs/SectionHeading.mdx) · [Spacing](../packages/design-system/docs/Spacing.mdx)           | [layout.md](ai/log/layout.md)                                                   |
| 제목 탭 · 영역 탭                                         | [Tab](../packages/design-system/docs/Tab.mdx)                                                                                                                                                       | [components.md](ai/log/components.md) · [layout.md](ai/log/layout.md)           |
| 검색 조건 (화면 `card` · 팝업 `plain` · `box`)            | [SearchPanel](../packages/design-system/docs/SearchPanel.mdx) · [Search](../packages/design-system/docs/Search.mdx)                                                                                 | [composites.md](ai/log/composites.md)                                           |
| 조회 결과 카드 · Total · Pagination · 표                  | [ResultParts](../packages/design-system/docs/ResultParts.mdx) · [Pagination](../packages/design-system/docs/Pagination.mdx) · [P01](../packages/design-system/docs/patterns/P01SearchResult.mdx)    | [patterns.md](ai/log/patterns.md) · [setup.md](ai/log/setup.md)(IBSheet)        |
| 트리 · 줄 선택 목록(`TreeTable`)                          | Storybook `Composites/Result/Tree Table`                                                                                                                                                            | [composites.md](ai/log/composites.md)                                           |
| 빈 상태 · 조회 전 · 오류 안내(`StatusView`)               | [StatusView](../packages/design-system/docs/StatusView.mdx)                                                                                                                                         | [patterns.md](ai/log/patterns.md)                                               |
| 안내 상자 · ※ 문구(`Infobox`)                             | [Infobox](../packages/design-system/docs/Infobox.mdx)                                                                                                                                               | [composites.md](ai/log/composites.md)                                           |
| 입력 · 라벨 · 폭 · 도움말(`Field` 계열)                   | [Field](../packages/design-system/docs/Field.mdx) · [Selection](../packages/design-system/docs/Selection.mdx) · [DatePicker](../packages/design-system/docs/DatePicker.mdx)                         | [components.md](ai/log/components.md)                                           |
| 버튼 · 버튼 묶음(`ControlGroup`) · 결과 제목 줄 버튼 배치 | [Button](../packages/design-system/docs/Button.mdx) · [result-panel-actions](ai/references/result-panel-actions.md)                                                                                 | [components.md](ai/log/components.md) · [setup.md](ai/log/setup.md)             |
| 상태 표시 · 배지                                          | [Badge](../packages/design-system/docs/Badge.mdx)                                                                                                                                                   | [components.md](ai/log/components.md)                                           |
| 등록 · 수정 폼 · 상세 팝업                                | [RecordForm](../packages/design-system/docs/RecordForm.mdx) · [P02](../packages/design-system/docs/patterns/P02RecordForm.mdx)                                                                      | [patterns.md](ai/log/patterns.md) · [composites.md](ai/log/composites.md)       |
| 찾기 팝업 · 값 넣기                                       | [LookupField](../packages/design-system/docs/LookupField.mdx) · [LookupSearch](../packages/design-system/docs/LookupSearch.mdx) · [P03](../packages/design-system/docs/patterns/P03LookupApply.mdx) | [patterns.md](ai/log/patterns.md)                                               |
| 팝업 · 확인 · 완료 알림 · 처리 흐름                       | [Modal](../packages/design-system/docs/Modal.mdx) · [Dialog](../packages/design-system/docs/Dialog.mdx) · [P04](../packages/design-system/docs/patterns/P04ActionFeedback.mdx)                      | [components.md](ai/log/components.md) · [patterns.md](ai/log/patterns.md)       |
| 설정 팝업(즐겨찾기 · 표시항목 · 저장 조건)                | [P07](../packages/design-system/docs/patterns/P07SelectionConfig.mdx) · [ColumnPicker](../packages/design-system/docs/ColumnPicker.mdx)                                                             | [patterns.md](ai/log/patterns.md)                                               |
| 대시보드 카드 · KPI · 차트(chart&kpi)                     | [ChartKpi](../packages/design-system/docs/ChartKpi.mdx)                                                                                                                                             | [composites.md](ai/log/composites.md) · [screen-main.md](ai/log/screen-main.md) |
| 글자 · 보조 설명                                          | [Typography](../packages/design-system/docs/Typography.mdx) · [Text](../packages/design-system/docs/Text.mdx)                                                                                       | [foundation.md](ai/log/foundation.md)                                           |
| 같은 1depth의 기존 화면                                   | —                                                                                                                                                                                                   | `docs/ai/log/screen-<1depth>.md` (status.md 문서 지도)                          |

- 지도에 없는 요소는 Storybook 목록에서 이름으로 찾고, 없으면 새로 만들기 전에 문의한다(0절)
- 새 가이드 · 기록이 생기면 이 표에 한 줄 추가한다
