# 페이지 패턴(P01~P08) 구조 설계안

> 출처: Figma Pattern Library (`28263:4869`) — 00 개요 · P01~P08. 2026-11-12 작성 · P-1~P-6 확정(2026-11-12).
> 목표: 화면별 시안이 없어도 화면설계서(업무 조건)만으로 페이지를 만들 수 있게 한다.

## 0. 원칙 (Figma 00 문서 기준)

- **UI 규격 = Design Guide / 컴포넌트**, **업무 조건(권한 · 금액 · 상태 전이 · API) = 화면설계서**, **패턴 = 화면 골격 · 영역 순서 · 상태 흐름**.
- Loading · Empty · Error · 권한 없음 · 중복 요청 · 미저장 이탈은 **독립 패턴이 아니라 공통 상태**로 두고 각 패턴에서 쓴다.
- 패턴은 "Variant 먼저": 구조가 같으면 새 패턴 대신 Variant(옵션 prop · 슬롯)로 흡수한다.
- 패턴은 정책 수치(재시도 횟수, 선택 제한 수, 만료 시간 등)를 정하지 않는다 → 전부 prop으로 받는다.

## 1. 디자인 없이 작업하기 위한 장치

| 장치 | 내용 |
| --- | --- |
| ① 패턴 템플릿(골격 컴포넌트) | 영역 순서 · 간격 · 카드 구분을 고정한 Compound 컴포넌트. 화면 개발자는 슬롯에 필드 · 버튼 · 그리드만 넣는다 |
| ② 흐름 훅 | 상태 흐름(조회 전/조회 중/결과/0건/오류, 확인 → 처리 → 결과 등)을 훅으로 제공. API 함수만 넘기면 상태 표시가 자동으로 맞음 |
| ③ 공통 상태 표시 | `StatusView`(조회 전 · 0건 · 오류 · 권한 없음 · 로딩) 한 곳에서 문구 · 아이콘 · 높이를 정함 |
| ④ 기본값 표 | 시안이 없을 때 쓰는 기본값(필드 폭, 버튼 순서 · 이름, 문구, 그리드 높이 등)을 가이드에 표로 고정 |
| ⑤ 화면 체크리스트 | 패턴마다 "반드시 구현할 상태" 목록. 화면설계서에서 이 항목만 채우면 됨 |
| ⑥ Storybook `Patterns/*` | 패턴별 참조 화면(가짜 데이터) + 사용 코드. 새 화면은 이 코드를 복사해 시작 |

## 2. 위치 · 책임 분리

```
packages/design-system/src/
  patterns/                     ← 신규. 순수 UI 템플릿 + 흐름 훅(API 함수는 인자로 받음, fetch 없음)
    common/   StatusView, ResultToolbar, AppliedFilters, PageNotice, DialogProvider(useDialog)
    search-result/   SearchResult(Compound), useSearchResult
    record-form/     RecordHeader, FormSection, InfoGrid, FormFooter, SidePanel, useRecordForm
    lookup/          LookupField, useLookup
    action/          useAction, FileStatusBadge, ImpactPreview
    feed/            NotificationFeed(Compound)
    config/          ConfigModal, SavedConditionList, useConfigDraft
    overview/        DashboardModule, DashboardGrid
    auth/            AuthLayout, VerifyCodeField
  docs/patterns/*.mdx           ← 패턴별 가이드 (Storybook `Patterns/P01 Search → Result` …)

apps/<앱>/src/
  pages/<1depth>/<2depth>/      ← 화면 = 패턴 템플릿 조립 + API 연결
  components/popups/            ← 업무 Lookup · 설정 팝업 (예: BusinessLookupModal)
  api/ · types/                 ← 화면별 API · 타입 (기존 구조 유지)
```

- 디자인 시스템 `patterns/`는 세 앱이 공유. 업무 문구 · API · 권한 판단은 앱에.
- IBSheet 그리드는 계속 **슬롯**(디자인 시스템은 영역 · 높이 · 테마만).

## 3. 패턴별 설계

### 공통(먼저 만듦)
| 이름 | 역할 | 비고 |
| --- | --- | --- |
| `StatusView` | `status`: idle(조회 전) · loading · empty(0건) · error · forbidden. 문구 · 재시도 버튼 슬롯 | P01 "최초 진입 시 조회 전/0건 구분" 해결 |
| `ResultToolbar` | 왼쪽 `총 N건`(+선택 N건) · 오른쪽 Action(열 설정 · 엑셀 · 업무 버튼) | P01 V05 선택 Action 포함 |
| `AppliedFilters` | 조회에 쓴 조건 요약(칩/텍스트) + 초기화 | P01 V04 |
| `PageNotice` | 페이지 상단 안내(정보 · 경고 · 오류) | 컴포넌트 목록의 Page Notice. 시안 없으면 Infobox 스타일 재사용 |
| `DialogProvider` · `useDialog()` | `alert()` · `confirm()`을 Promise로(Modal sm 기반) | P04 확인 · 결과 안내 |

### P01 Search → Result
```tsx
const sr = useSearchResult({ fetch: api.list, defaults, autoSearch: false });
<PageLayout.Title title="…" actions={…} />
<PageLayout.Section title="검색 조건">
  <SearchArea {...sr.searchProps} detail={…}>{필드}</SearchArea>
</PageLayout.Section>
<SearchResult status={sr.status}>
  <SearchResult.Summary>{SummaryCard…}</SearchResult.Summary>      // 옵션
  <ResultToolbar total={sr.total} selected={n} actions={…} />
  <SearchResult.Body>{IBSheet}</SearchResult.Body>                   // status ≠ success면 StatusView
  <Pagination {...sr.pageProps} />
</SearchResult>
```
- `useSearchResult`: 입력 조건(draft) ↔ 적용 조건(applied) 분리, 페이지 · 정렬, 조회 중 중복 요청 무시, 초기화, `status`.
- Variant: V01 페이지 · V02 Modal 안(같은 부품을 `Modal.Body`에) · V03 상세조건(기존 SearchArea) · V04 적용 조건 요약 · V05 선택 + 상황별 Action.
- 체크리스트: 조회 전 / 조회 중 / 0건 / 오류 / 권한 없음, 조회 후 조건 변경 시 결과 유지, 초기화.

### P02 Record → Form
- `RecordHeader`: 대상 식별(사업자 · CPID · 상태 Badge) + 화면 Action.
- `FormSection`(PageLayout.Section 확장): 접기/펼치기, 제목 · 설명.
- `InfoGrid`: 라벨-값 격자(1~4열). **`mode`(read · create · edit)를 Context로** 내려 read면 값 텍스트, 그 외 Field 표시 → 같은 화면 구조로 조회/등록/수정 공용.
- `FormFooter`: 취소 · 저장(페이지 하단 또는 Modal.Footer).
- `SidePanel`: CPID 목록 같은 보조 패널 열림/닫힘(상태 Variant).
- `useRecordForm`: 원래 값 · 변경 여부(dirty) · 검증 오류 첫 항목 스크롤 · 미저장 이탈 확인(Work Tab 닫기 · 메뉴 이동).
- Variant: V01 조회 전용 · V02 등록/수정 · V03 대형 Form/패널 · V04 편집 Matrix(=IBSheet 편집, 컴포넌트 없음) · V05 일괄 변경(항목 체크 + 변경값: `BulkEditRow`) · V06 Tab 연결 상세(Tab + Section) · V07 메모(목록 + 인라인 편집).

### P03 Lookup → Apply
- `LookupField`: 읽기 전용 값 + [찾기] + 지우기. 취소 · 0건이면 **원래 값 유지**.
- `useLookup(Component)` → `const picked = await open(props)`; 선택 확정 시 값, 취소 시 `null`.
- 본문은 기존 `LookupSearch` · `AddressSearch` 재사용. V02 복수 선택은 [적용] Footer, V04 계층(사업자 → 하위 CPID)은 2단계 본문.

### P04 Action → Feedback
- `useAction({ validate, confirm, run, onSuccess })`: Check → Confirm(옵션) → Process(버튼 loading · 중복 실행 방지) → Result(성공 / 실패 / 부분 성공 안내). 실패 시 입력 보존.
- 비동기 파일: `FileStatusBadge`(요청 · 생성 중 · 완료 · 실패 · 만료 → Badge tone)와 상태별 가능한 Action 표(다운로드 · 재요청)는 앱에서 상태값만 매핑.
- 금전 Action: `ImpactPreview`(현재값 · 변경값 · 반영 후 예상, Modal.InfoList 확장), 일괄 대상 목록 + 건수 · 총액.
- 재시도 · 만료 · 부분 성공 정책은 prop/콜백(패턴에서 정하지 않음).

### P05 Login → Auth
- `AuthLayout`(LNB · Header 없음, 가운데 카드, 가맹점관리자 반응형 대상), 로그인 폼, `VerifyCodeField`(인증번호 + 남은 시간 · 재발송, 기존 `formatRemaining` 재사용). 실패 · 잠금 · 만료는 Field 오류 + Alert.

### P06 Notification Feed
- `NotificationFeed` Compound: `.Summary`(미확인 건수 · 유형별 건수 · 모두 읽음) · 검색은 SearchArea · `.Item`(분류 Badge · 제목 · 일시 · UnreadIndicator, 펼치면 본문 + 관련 업무 이동) · 상태는 StatusView.
- `compact` + `limit`: 마이페이지 Hub에 넣는 축약형.

### P07 Selection & Configuration
- V01 메뉴 선택 = `FavoriteMenuPicker`(있음), V02 선택 · 순서 = `TransferList`(엑셀 다운로드 설정, 표시항목은 `ColumnPicker`), V03 저장 조건 = `SavedConditionList`(완료 2026-11-13).
- `ConfigModal` + `useConfigDraft`: 초안 ↔ 저장값, 변경 여부, 기본값 복원, 저장/적용 결과는 P04.

### P08 Overview & Dashboard
- `DashboardGrid`(12열, Grid 컴포넌트와 함께) + `DashboardModule`(제목 · 기준 시점 · [더보기] · 모듈별 loading/empty/error/forbidden).
- 내용: `SummaryCard`(있음) · Chart(Recharts, chart&kpi 단계) · 공지/알림 목록(P06 compact 재사용).

## 4. 진행 순서 (제안)
1. 공통: StatusView · ResultToolbar · DialogProvider · PageNotice
2. P01 + `useSearchResult` → 통합 거래 내역(`IntegratedTransactionPage`)에 적용해 검증
3. P04 `useAction` (P01 · P02가 의존)
4. P03 `LookupField` · `useLookup`
5. P02 Record Form 세트
6. P07 `SavedConditionList` · `ConfigModal`
7. P06 Feed → P08 Dashboard(chart&kpi와 같이) → P05 Auth
- 각 단계: 컴포넌트 + `Patterns/*` 스토리(가짜 데이터 참조 화면) + 가이드 MDX(체크리스트 · 기본값 표 · Do/Don't).

## 5. 확정 결정 (2026-11-12)
- [P-1] 성공 · 실패 안내는 **Alert(Modal sm)로 통일**. Toast는 사용하지 않음 → `useDialog().alert()`
- [P-2] `patterns/`는 **디자인 시스템**(`packages/design-system/src/patterns/`)에 둔다. 세 앱 공유
- [P-3] 최초 진입 시 **조회하지 않음**(결과 영역은 조회 전 상태). `useSearchResult` 기본 `autoSearch: false`
- [P-4] 미저장 이탈 확인은 **Work Tab 닫기 · 브라우저 닫기(beforeunload)**. 문구 · 구성은 임의(TODO 시안)
- [P-5] 조회 전용(read) 값은 **텍스트로 표시**(Figma P02 V01 "값 표현을 기본")
- [P-6] 시안 없는 신규 UI(AppliedFilters 칩, FeedItem, DashboardModule, AuthLayout 등)는 **기존 토큰 · 컴포넌트 조합 + `TODO(시안)` 임시값**으로 진행
