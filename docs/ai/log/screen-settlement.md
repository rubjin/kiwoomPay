# 화면: 정산 (settlement)

> 범위: KWPC06010201 가맹점 정산 실행/처리와 팝업(사업자 찾기 · 일괄 처리 · 원장 상세). 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### KWPC06010201 가맹점 정산 실행/처리 (`features/settlement/merchant/execute/`)

- 경로 `/settlement/merchant/execute`. P01 첫 적용 화면. 원장 상태 색은 `ledgerStatus.ts` `LEDGER_STATUS_TONE`(목록 · 상세 공용)
- 결과 제목 줄 오른쪽: 처리 Line(지급예정일 일괄 변경 · 지급보류 · 보류해제 · 선택 원장 재산출) → [지급확정] Dark → 등록 버튼. 조회 결과 Action 배치 기준(`docs/ai/references/result-panel-actions.md`)과 다른 점: [+ 상계 원장 등록]이 Dark — 확인 필요
- 정산원장 ID 링크(`createLedgerColumns`) → 원장 상세 팝업

### 사업자 찾기 (KWPC06010203, `components/popups/BizFinderModal`, 앱 공통 팝업)

- Modal lg: `LookupSearch`(사업자명 · 사업자번호) → 단일 선택 표(`GridPlaceholder selectable="single"`) · 고른 줄만 CPID 조회 범위 `TableMultiSelect`(나머지는 "전체 N개" 비활성) → [취소] · [조회 조건 적용]. 조회 전에는 Footer 없음
- `useLookup`으로 열고, 사업자번호 · CPID(전체면 비움, 일부는 쉼표)를 화면 조건에 반영

### 정산원장 일괄 처리 (KWPC06010204~08, `components/actions/`)

- 공통 틀 `LedgerActionModal`(Modal lg): 요약(`ActionTargetBar`, `summaryVariant="question"`) → (`ActionStats` 상자) → 대상 표 + [제외] → 안내(`Infobox.Item bullets`) → 입력 → [취소] · [처리]. `useAction`으로 대상 0건 · 입력 · 처리 불가 검사 → 처리 → 재조회 → 완료 안내. `total`(`ActionTotal` 합계 줄) · `notices` · `successMessage`
- `LedgerActionModals`: 지급예정일 일괄 변경 · 지급보류(공통코드 `PAY_HOLD_REASON`) · 보류 해제(불가 원장이 있으면 막음). `LedgerConfirmModals`: 지급확정 · 선택 원장 재산출 · 지급예정일 변경 저장·재산출
- 지급예정일 흐름: [변경 예정 적용] → 안내 → 저장·재산출 팝업(적용한 원장 · 변경 지급일, 재조회로 선택이 풀려도 유지) → [저장 후 재산출] → 재조회 · 완료 안내
- 금액 · 검증 결과는 예시(`ledgerActionRows`, TODO API)

### 일반 원장 상세 (KWPC06010209 · 10, `components/detail/LedgerDetailModal`)

- Modal xl: 원장 기본정보(상태별 [지급보류] · [보류해제] · [지급확정], FormTable 4쌍 읽기 전용, 지급예정일 연필) → 원장 요약(`ActionStats` 5칸) → 상세 내역 Button Tab(산출 근거 표 + [비고 저장] / 정산대상 거래 + Pagination / 메모 · 이력 안내만)
- 상세의 처리 버튼 · 연필 → 화면의 일괄 처리 팝업을 이 원장 하나로 연다(상세는 뒤에 열린 채)

## 열린 질문

- [Q54] 정산 실행/처리 확인 필요: ① 조회 전 문구는 KWPC04010100 Figma로 통일 — KWPC06010201 최초진입 시안은 0건 문구라 다름 ② 상세 검색 펼침 내용 · 검색 조건 접힘 모양 시안 없음 ③ 오류 · 권한 없음 문구(TODO) ④ 퀵 기간 기준일 · 종료일 포함 여부(오늘 기준 이전 N일/개월로 구현) ⑤ Grid 머리 · 행 높이는 IBSheet 테마로
- [Q68] 사업자 찾기 확인 필요: ① 폭 시안 1056 → lg 880 ② 사업자를 고르면 CPID 조회 범위를 전체 선택으로 시작 ③ 여러 CPID를 화면 조건으로 넘기는 방식(지금 쉼표) — CPID 다중 필드가 필요한지 ④ 1만 개 CPID 사업자의 패널 목록(서버 검색 · 페이지 나눔) ⑤ 조회 결과 없음 문구 ⑥ 패널 그림자(시안은 약한 그림자, 다른 드롭다운과 맞춰 없음)
- [Q69] 일괄 처리 확인 필요: ① 폭 시안 723 → lg 880 ② 원장 금액 · 보류 정보 API ③ 보류 해제: 불가 원장이 있으면 막음 — 불가 원장만 빼고 진행할지 ④ 보류사유 선택지 ⑤ 저장·재산출은 시트에 화면ID 없음, 원장별 검증 결과 API ⑥ 전체 [제외]로 0건이면 처리 버튼은 그대로, 누르면 안내
- [Q70] 원장 상세 확인 필요: ① 폭 시안 1360 → xl 1280 ② 처리 버튼 가능 조건(지급보류: 보류 · 완료가 아니면 / 보류해제: 지급보류 / 지급확정: 지급대기) ③ 연계 ID · 상계그룹 ID · 거래번호 링크 이동 대상 ④ 메모 · 이력 탭 시안 ⑤ 비고 저장은 산출 근거 탭에서만, 바뀐 것이 없어도 저장됨 ⑥ 원장 상세 API
- [Q71] [+ 상계 원장 등록]이 Dark — 조회 결과 Action 배치 기준(등록은 Primary 하나)과 다름. 둘 다 Primary인지 하나를 다른 모양으로 둘지
