# 화면: 거래내역 (transaction)

> 범위: KWPC04010100 통합 거래내역과 팝업.
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## 열린 질문

- 없음

## 작업 기록

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

### KWPC04010100 통합 거래내역 코드 정리 — 2026-11-12
- 화면 분리: `components/TransactionSearchPanel`(검색 조건 · 상세 검색 격자), `components/TransactionCancelBar`(취소사유 · 취소 구분 · 선택 취소, 상태와 처리 흐름을 직접 가짐). 페이지는 조합만(405 → 약 140줄)
- 디자인 시스템 `useSearchResult.refresh()`: 마지막 조회 조건 · 현재 페이지로 재조회(Promise). 행이 빠져 현재 페이지가 비면 마지막 페이지로. 취소 후 `result.setPage(result.page)` 대신 사용하고, 완료 Alert는 재조회 뒤에 띄움(전에는 옛 목록 위에 Alert). P01 가이드에 한 줄 추가
- 타입 단언 제거: 조회기준일 `v as …` → `isDateBasis` 타입 가드(`searchFields`), 라디오는 `DATE_BASIS`로 그림. 반복되는 `flex: '1 1 0'` · 폭만 상수로 묶음(화면 고유 폭은 다른 화면처럼 인라인 유지)
- 동작 변경: 취소 처리 중에도 표시항목설정 · 엑셀 버튼은 활성(처리 중 비활성은 취소 바만). "선택 없음" Alert는 바가 비활성이라 도달할 수 없어 삭제
- 검증: 디자인 시스템 typecheck · lint · build, 앱 build, 브라우저 테스트 13개 통과(조회 전 · 선택 전 비활성, 조회기준일 라디오, 사유 없음 Alert, Confirm, 처리 중 비활성, 완료 Alert 시점에 재조회 끝남, 사유 비움, 2페이지에서 취소 후 2페이지 유지, 콘솔 에러 없음)
- 정산 실행 화면(`MerchantSettlementExecutePage`)도 처리 후 `refresh()` → 완료 Alert 순서로 변경
