# 화면: 정산 (settlement)

> 범위: KWPC06010201 가맹점 정산 실행/처리와 팝업(사업자 찾기 · 일괄 처리 · 원장 상세).
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## 열린 질문

- [Q54] P01(KWPC06010201) 확인 필요: ① 조회 전 문구는 KWPC04010100 Figma("거래내역을 조회해주세요 / 검색조건을 설정한 후 [조회] 버튼을 눌러주세요")로 통일 — KWPC06010201 최초진입 시안은 0건 문구라 다름(확인 필요) ② 상세 검색 펼침 내용 · 검색 조건 접힘 모양 시안 없음 ③ 오류 · 권한 없음 문구(TODO) ④ 퀵 기간(1주일 등)의 기준일 · 종료일 포함 여부(오늘 기준 이전 N일/개월로 구현) ⑤ Grid 머리 · 행 높이는 IBSheet 테마로(임시 미리보기 56 · 40) ⑥ ~~SearchArea · SearchPanel 공존~~ → SearchPanel로 통일(2026-11-16)
- [Q68] 사업자 찾기 팝업 확인 필요: ① 폭 시안 1056 → lg 880 ② 사업자를 고르면 CPID 조회 범위를 전체 선택으로 시작 ③ 여러 CPID를 화면 조회 조건으로 넘기는 방식(지금 CPID 입력칸에 쉼표로) — 화면 조건에 CPID 다중 필드가 필요한지 ④ 1만 개 CPID 사업자의 패널 목록(예시는 200개까지, 서버 검색 · 페이지 나눔 필요) ⑤ 조회 결과 없음 문구 ⑥ 패널 그림자(시안은 약한 그림자, 다른 드롭다운과 맞춰 없음)
- [Q69] 정산원장 일괄 처리 팝업 확인 필요: ① 폭 시안 723 → lg 880(md 620은 표 6열이 넘침) ② 원장 금액 · 보류 정보 API(지금 거래건수로 예시 금액) ③ 보류 해제: 해제 불가 원장이 남아 있으면 처리를 막음 — 불가 원장만 빼고 진행할지 ④ 보류사유 선택지 ⑤ ~~실행 팝업2~~ → 반영(2026-11-14). 저장·재산출은 시트에 화면ID 없음, 원장별 검증 결과 API ⑥ 전체 [제외]로 0건이면 처리 버튼은 그대로, 누르면 안내
- [Q70] 일반 원장 상세 팝업 확인 필요: ① 폭 시안 1360 → xl 1280 ② 처리 버튼 가능 조건(지급보류: 보류 · 완료가 아니면 / 보류해제: 지급보류 / 지급확정: 지급대기) ③ 연계 ID · 상계그룹 ID · 거래번호 링크 이동 대상(조정 · 상계 원장 상세, 거래 상세) ④ 메모 · 이력 탭 시안 ⑤ 비고 저장은 산출 근거 탭에서만(시안), 바뀐 것이 없어도 저장됨 ⑥ 원장 상세 API(지금 예시)

## 작업 기록

### 사업자 찾기 팝업 (KWPC06010203) — 2026-11-14
- 디자인 시스템 (공통화)
  - `TableMultiSelect`(field) — 표로 보며 여러 개 고르는 드롭다운: 제목 · Total(N건 · M행 표시) · 검색 · 전체(검색결과) · 표(머리 34 · 줄 37, `visibleRows` 넘으면 표 안 스크롤 · 머리 고정) · 스크롤 안내 · 선택 N개. 트리거 요약 전체 N개 / N개 선택. `panelWidth`(오른쪽 끝 맞춤). 동작은 MultiSelect와 같음. 스토리 States · Open, Field 가이드 4-2
  - `GridPlaceholder selectable="single"` — 라디오 열(머리 '선택') · 선택 줄 Primary 50(토큰 `SearchResult.GridRowSelected`). 기존 체크박스 선택은 그대로
- 앱 공통 팝업 `components/popups/BizFinderModal`(Modal lg 880): `LookupSearch`(사업자명 · 사업자번호 두 칸 + [조회]) → 조회 결과(단일 선택 표 · 고른 줄만 CPID 조회 범위 TableMultiSelect, 나머지는 "전체 N개" 비활성) → Total · Pagination → [취소] · [조회 조건 적용](선택 없음 · CPID 0개 안내). 조회 전에는 검색 줄만(Footer 없음). `api/common/bizLookup` · `types/common/bizLookup`
- 연결: 정산 실행/처리 [사업자 찾기] → `useLookup` → 사업자번호 · CPID(전체면 비움, 일부는 쉼표) 반영. 팝업 모음 · 화면 목록(KWPC06010203)
- 검증: 디자인 시스템 tokens · typecheck · lint · build, 앱 tsc, 브라우저 흐름(조회 전 128 높이 · 5건 · 미선택 안내 · 선택 → 전체 12개 · 다른 줄 비활성 전체 N개 · 패널 591 · 12행 중 6행 · 일부 선택 3개 · Esc는 패널만 · 적용 → 조건 반영 · 팝업 닫힘), 에러 없음
- 한 가정: Q68

### 정산원장 일괄 처리 팝업 (KWPC06010204~06) — 2026-11-14
- 디자인 시스템 (공통화, P04 action)
  - `ActionTargetBar` — 선택 대상 요약 줄(회색 · 숫자 Primary SemiBold, 가운뎃점), `ActionStats` — 처리 가능/불가 건수 · 금액 상자(이름 12 위 · 숫자 24 Bold + 단위). 토큰 `tokens/custom/action-summary.json`
  - `Infobox.Item bullets` — 점 목록 안내(12 Regular), 아이콘은 첫 줄에
  - 스토리 P04 BatchParts, P04 가이드 5절(일괄 처리 팝업 구성)
- 앱: 공통 틀 `execute/components/actions/LedgerActionModal`(Modal lg: 요약 → (상자) → 대상 표 + [제외] → 안내 → 입력 → 안내 → [취소] · [처리], `useAction`으로 대상 0건 · 입력 · 처리 불가 검사 → 처리 → 재조회 → 완료 안내) + 공통 열 `ledgerActionColumns` · 예시 금액 `ledgerActionRows`(TODO API). 팝업 3개 `LedgerActionModals`: 지급예정일 일괄 변경(변경 지급예정일 · 변경사유) · 지급보류(보류사유 공통코드 `PAY_HOLD_REASON` · 상세 보류사유) · 보류 해제(해제 가능/불가 상자 · 해제사유, 불가 원장이 있으면 막음)
- 연결: 정산 실행/처리 조회 결과 [지급예정일 일괄 변경] · [지급보류] · [보류해제] → 선택 확인 후 팝업 (재산출 · 지급확정은 기존 Confirm 유지). 팝업 모음 · 화면 목록(KWPC06010204~06)
- 검증: 디자인 시스템 tokens · typecheck · lint · build, 앱 tsc, 브라우저: 3건 선택 → 각 팝업 880 · 요약 · 표 3행, 입력 없이 처리 → 안내, [제외] → 2건 · 합계 갱신, 보류 해제 불가 원장 안내, 지급보류 사유 선택 · 입력 → 처리 → 완료 안내 · 팝업 닫힘, 에러 없음
- 한 가정: Q69

- 디자인 시스템: `ActionTargetBar variant="question"`(상자 없이 16 SemiBold 질문, 숫자 Primary), `ActionTotal`(표 아래 합계 줄: 이름 13 · 숫자 20 Bold Primary + 단위), `Infobox.Item` 제목 + bullets면 제목을 목록 위 줄에. 스토리 BatchParts · P04 가이드 5절
- 앱: 공통 틀 `LedgerActionModal`에 `summaryVariant` · `total` · `notices`(배열이 아니면 그대로 — 안내 상자 2개) · `successMessage` 추가. `LedgerConfirmModals`: 원장 지급확정(검증 결과 열 · 합계) · 선택 원장 재산출(처리 대상 열 · 안내 상자 2개) · 지급예정일 변경 저장·재산출(기존/변경 지급일 · 합계)
- 흐름: 화면 [선택 원장 재산출] · [지급확정]도 팝업으로(기존 Confirm 처리 함수 삭제). 지급예정일 일괄 변경 [변경 예정 적용] → "변경 예정이 적용되었습니다" 안내 → 저장·재산출 팝업(적용한 원장 · 변경 지급일, 재조회로 선택이 풀려도 유지) → [저장 후 재산출] → 재조회 · 완료 안내
- 팝업 모음 · 화면 목록(KWPC06010207 · 08, 저장·재산출은 KWPC06010204 아래) 링크 `?open=`
- 검증: 디자인 시스템 typecheck · lint · build, 앱 tsc, 브라우저: 재산출 880 × 465 · 지급확정 880 × 500(합계 줄), 일괄 변경 → 안내 → 저장·재산출(변경 지급일 2026-11-20 반영) → 완료 · 닫힘, 에러 없음

### 일반 원장 상세 팝업 (KWPC06010209 · 10) — 2026-11-14
- 앱 `execute/components/detail/LedgerDetailModal`(Modal xl 1280): 원장 기본정보(SectionHeading + [지급보류] · [보류해제] · [지급확정] 상태별 활성, FormTable 4쌍 읽기 전용, 지급예정일 연필, 지급상태 Badge, 예금주 검증 불일치 빨강 + Badge) → 원장 요약(`ActionStats` 5칸) → 원장 상세 내역(Button Tab 같은 폭: 원장 산출 근거 표(연계 ID 링크 · 비고 입력) + [취소] · [비고 저장] / 정산대상 거래 건 표 + Total · Pagination / 메모 · 이력 안내만). `api/settlement/ledgerDetail` · `types/settlement/ledgerDetail`(예시)
- 연결: 정산 실행/처리 결과 표 정산원장 ID 링크(`createLedgerColumns`) → 상세. 상세의 처리 버튼 · 연필 → 화면의 일괄 처리 팝업을 이 원장 하나로(상세는 뒤에 열린 채, 닫으면 다시 선택 원장 기준). 디자인 시스템 변경 없음(기존 FormTable · ActionStats · Tab · GridPlaceholder 조합)
- 팝업 모음 · 화면 목록(KWPC06010209 · 10)
- 검증: 앱 tsc, 브라우저: ID 클릭 → 상세 1280, 상태(검증대기)별 버튼(보류만 활성), 요약 5칸, 산출 근거 9줄 · 비고 입력 → 저장 안내, 거래 탭 10행 · Total 830 · 2페이지, [지급보류] → 지급보류 팝업 1건(상세 위), 연필 → 지급예정일 일괄 변경, 에러 없음
- 한 가정: Q70
