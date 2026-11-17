# 화면: 거래내역 (transaction)

> 범위: KWPC04010100 통합 거래내역과 팝업. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### KWPC04010100 통합 거래내역 (`features/transaction/integrated/`)

- 시안: 최초진입(29406:101527 · 검색조건 접힘 30056:104296) · 상세검색(29406:97669) · 목록(29395:79807) · 내 검색조건 관리(29503:90470 · 저장조건 없음 91203 · 29509:94307) · 엑셀 다운로드 설정(29495:87846)
- 구성: 페이지는 조합만 — `components/TransactionSearchPanel`(검색 조건 · 상세 검색), `components/TransactionCancelBar`(취소사유 · 취소 구분 · 선택 취소, 행 선택 시에만 활성, 처리 흐름을 직접 가짐)
- 검색 조건: `components/searchFields.ts`(`SEARCH_FIELDS` — 적용 조건 칩과 내 검색조건 요약을 같은 정의로), `initialParams.ts`(`createInitialParams()` — 오늘 기준 기간), 조회기준일 선택지는 `transaction.options.ts`(`DATE_BASIS` · `isDateBasis`)
- 최초 진입은 검색 조건 접힘(`defaultCollapsed`). 상세 검색: 고객명 · 구매자 ID · 카드번호 · 승인번호 · 전화번호 / 예금주명 · 가상계좌번호 · 상품권 · 결제요청코드 + 개인정보 포함 검색. 칩에는 고객명 · 개인정보 제외
- 처리 후 목록 갱신은 `await result.refresh()` → 완료 Alert(재조회 뒤). 처리 중 비활성은 취소 바만
- 결과 제목 줄: 왼쪽 [표시항목설정] [엑셀 다운로드](→ `ExcelDownloadModal`), 제목 옆 [내 검색조건 선택] · [내 검색조건 관리](→ `SavedSearchModal`). 저장 조건은 화면 안 상태(TODO API). `?example=empty`로 저장조건 없음 확인
- (임의 작업) 민원접수 · 전체취소 · 부분취소 칸 표시(Y / -), 시각 선택 옵션, 거래구분 · 결제수단 · 거래상태 코드, 취소 처리 가능 조건 · 금액 영향 미리보기(화면설계서 대기)
- 거래 상세정보 · 민원 처리 · 부분취소 팝업은 P02 · P04 패턴 페이지에 있음(`patterns.md`) — 목록 행 선택 → 팝업 연결은 IBSheet 행 이벤트(Q61)

## 열린 질문

- 없음 (패턴 쪽 Q61 · Q62 · Q63 참고)
