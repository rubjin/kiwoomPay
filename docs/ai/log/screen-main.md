# 화면: 메인 (main)

> 범위: KWPC0104 다운로드 센터.
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## 열린 질문

- [Q55] 다운로드 센터(KWPC0104) 확인 필요: ① 진입 시 바로 조회(조회 화면 기본 규칙 "최초 진입 시 조회하지 않음"의 예외로 둠 — 내 요청 목록이라) ② 기본 요청일 이번 달 1일 ~ 오늘(시안 08-01 ~ 08-31) ③ 생성중 요청의 상세 Footer는 [닫기]만, 실패 · 만료는 [재시도] · [재요청](시안은 다운로드 가능만 있음) ④ 재시도 · 재요청 횟수 제한 · 권한 ⑤ 잔여기간을 서버가 줄지 화면 계산인지 ⑥ 헤더 [다운로드 센터] 건수 기준(완료 후 받지 않은 파일 수로 가정)

## 작업 기록

### Screen: KWPC0104 다운로드 센터 (P01) — 2026-11-12
- 디자인 시스템
  - `SearchPanel actionsPlacement="inline"`: [초기화] · [조회]를 필드 줄 끝에, 제목 16(md) · 제목 줄 32 · 접기 없음 — 조건이 한 줄뿐인 화면용. 기본(header)은 그대로(통합 거래내역 검색 카드 변경 전후 같음 확인). 스토리 InlineActions · 가이드
  - `Infobox.Item` `title` 생략 가능 — 설명이 제목 자리부터 이어짐(한 줄 안내). Variations 스토리 · 가이드
- 앱 `pages/main/download-center/`: `DownloadCenterPage`(상단 안내 Infobox · 검색 업무영역 · 처리상태 · 파일상태 · 요청일 · 파일명 · 결과 Grid 미리보기 · Pagination), `components/`(`downloadColumns` · `downloadActions`(작업 규칙: 완료+다운로드 가능 → 다운로드, 실패 → 재시도, 완료+만료 → 재요청, 생성중 → 없음) · `statusBadges` · `DownloadDetailModal`(1056: 안내 · 요청 정보 · 처리 및 파일 정보(FormTable 2쌍) · 요청 조건 · 이력 · Footer) · `RequestConditions`(요청 조건 줄, 시안 측정 인라인 스타일) · `initialParams`). `api/main/downloadCenter`(예시 24건, 날짜는 이번 달 안으로 옮김) · `types/main/downloadCenter`. 공통코드 `DOWNLOAD_AREA` · `DOWNLOAD_STATUS` · `DOWNLOAD_FILE_STATUS` 추가. 라우트 `/main/download-center`, 헤더 [다운로드 센터] → 이동. 화면 목록에 추가(작업중)
- 흐름: 다운로드는 바로 내려받기(TODO API), 재시도 · 재요청은 Confirm → 요청 → `refresh()` → 완료 Alert, 상세 팝업 Footer도 같은 처리
- 검증: typecheck · lint · build(디자인 시스템 · 앱 · 화면 목록) 통과. 앱 브라우저 테스트 15개 통과(헤더 버튼 이동, 진입 시 10행 · Total 24, [조회] 필드 줄 끝 · 접기 없음, 행별 작업 버튼, 상세 1056 · 내용 · Footer, 재시도 Confirm → 생성중 → Alert, 파일명 검색 · 초기화, 3페이지 4행). 검색 카드 높이 139(시안 138), favicon 404는 기존
- 한 가정: Q55
