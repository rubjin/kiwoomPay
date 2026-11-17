# 화면: 마이페이지 (mypage)

> 범위: KWPC2000 Hub · 계정관리 · 권한관리 · 알림센터와 팝업.
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## 열린 질문

- [Q58] P06 마이페이지 확인 필요: ① 알림 선택 시 이동 대상(유형별 업무 화면 — 지금은 알림센터) ② 모두 읽음 확인 문구 · 빈 상태 문구 · 알림 행 Hover ③ 업무유형 칩 아이콘 규칙(Figma는 리스크/FDS만) ④ 계정관리 Badge 줄 라벨 ↔ 값 Figma 8(다른 줄 12) — 12로 통일 ⑤ 마이페이지 Hub는 메뉴(IA)에 없는 화면(KWPC2000) — 헤더 [내 정보]로 진입 ⑥ 권한 신청 현황 값 위치 — 기본 Figma 오른쪽 끝 ↔ 권한 없음 Figma 라벨 옆(오른쪽 끝으로 통일) ⑦ [특수권한 신청] 이동 대상(지금 권한관리)
- [Q65] 마이페이지 권한 신청 현황 팝업 확인 필요: ① 폭 시안 1380 → 표준 xl 1280 ② 팝업을 열면 바로 조회(내 신청 목록) ③ 기본 신청기간 최근 1개월(시안 08-15 ~ 09-15) ④ 조회 조건 필드 사이 시안 약 20 → 규칙 16 ⑤ [조회] 버튼 Primary(화면 검색 카드는 Neutral) — 팝업 안 조회는 Primary로 통일할지 ⑥ 표 머리 시안 36 ↔ 미리보기 40(IBSheet 테마)
- [Q66] 마이페이지 계정관리 확인 필요: ① 계정 상태 이력 · 비밀번호 변경 · 로그인 이력 팝업 시안(지금 준비 중 안내) ② 마스킹 적용 중 휴대전화 · 이메일 · 이름 표시(서버 마스킹 값인지) ③ 시안 왼쪽 카드 구분선이 오른쪽보다 4 아래(299 ↔ 295) → 두 카드 같은 규칙(제목 줄 + 16)으로, 줄 시작이 시안보다 4 위 ④ 화면 안 [계정관리 · 권한관리] 탭은 각 메뉴 화면으로 이동(한 화면 안 탭 전환 아님)으로 해석
- [Q67] 마이페이지 권한관리 확인 필요: ① ~~권한 변경 이력 탭 내용~~ → 최근 3건 + [상세보기](권한 변경 이력 팝업, 2026-11-16 — 탭 표 자체는 시안 없음, 임의 작업) ② 기본 권한 정보 도움말 문구 ③ ~~권한 신청 · 특수권한 신청 · 보유 기능 권한 팝업 시안~~ → 모두 반영(2026-11-16) ④ 최근 신청 표의 처리자 · 처리일시 정렬(이 시안은 가운데, 권한 신청 현황 팝업 시안은 왼쪽 → 왼쪽 유지) ⑤ [상세보기] · '권한 신청 현황 1건'은 권한 신청 현황 팝업을 연다고 해석
- [Q65] KWPC02010101 비밀번호 변경 확인 필요: ① 오류 문구 색 — 시안 Status Error Text #B91C1C ↔ Field 공통 규칙 Status Border #EF4444(현재 Field 공통 유지) · 오류 테두리 시안 1px ↔ Field 2px ② 오류 문구 줄 높이 18(시안 14)이라 입력 줄마다 4px 큼 ③ 규칙별 오류 문구(시안은 빈 값 3개만) ④ 변경 후 재로그인 · 세션 처리 ⑤ 보기 아이콘 — 시안은 가린 상태 eye, 로그인(P05)은 가린 상태 eye-off(서로 반대)

## 작업 기록

### 마이페이지 권한 신청 현황 팝업 — 2026-11-13
- 디자인 시스템: `SearchPanel variant="box"` — 팝업 안 조회 조건: 제목(md 16)은 상자 밖 위(사이 16), 회색 상자(Neutral 50 · 여백 16 · 반경 8) 안에 필드 한 줄 + 끝에 [초기화] · [조회](Primary), 접기 · 상세 검색 없음. 토큰 `SearchResult.SearchBoxBg`(Bg.Page). 스토리 Box · Search Panel 가이드
- 앱: `pages/mypage/hub/components/PermissionRequestModal`(Modal xl 1280: 조회 조건(신청기간 · 구분 · 상태) → 권한 신청 이력(신청일시 · 구분 · 신청 권한 · 상태 Badge · 처리자 · 처리일시 · 비고) → Total · Pagination, Footer 없음, 열면 바로 조회), `api/mypage/permissionRequest`(예시 23건, 날짜는 오늘 기준으로 일 단위 이동) · `types/mypage/permissionRequest`, 공통코드 `PERMISSION_REQUEST_TYPE` · `PERMISSION_REQUEST_STATUS`. 마이페이지 권한관리 카드 [권한 신청 현황] → 이 팝업(전에는 권한관리 화면 이동). 팝업 모음 · 화면 목록에 추가
- 검증: 디자인 시스템 tokens · typecheck · lint · build, 앱 tsc, 브라우저: 팝업 1280 · 조회 상자 74 · [조회] Primary · 10행 · Total 23 · 상태 Badge(승인대기 · 승인 · 반려), 에러 없음
- 한 가정: Q65

### Screen: KWPC02010100 마이페이지 계정관리 — 2026-11-14
- 앱 `pages/mypage/account/AccountPage`(`/mypage/account`, placeholder 대체): 화면명 → 제목 탭(계정관리 · 권한관리, 누르면 메뉴 화면 이동) → 카드 2개(`HubGrid` 980 : 636, `PageLayout.Section` 제목 · 버튼 · 구분선): 기본 계정정보(2열 489 : 457, `HubInfo` 라벨 144 + 12, 줄 간격 19 · 계정 상태 Badge, [계정 상태 이력]) · 비밀번호 및 로그인 보안(줄 간격 36, [비밀번호 변경] · [로그인 이력]) → 계정정보 변경 안내 Infobox(변경 요청 mailto). `api/mypage/account`(예시) · `types/mypage/account`, 탭 제목 · 화면 목록(KWPC02010100). 디자인 시스템 변경 없음
- 검증: 앱 tsc, 1920 브라우저: 카드 x 264 · 1260 · 폭 980 · 636, 값 시작 x 437 · 926 · 1433(시안과 같음), 안내 y487(시안 490), 버튼 → 준비 중 안내, [권한관리] 탭 → /mypage/permission, Hub [상세보기] → 이 화면, 에러 없음
- 한 가정: Q66

### Screen: KWPC02020000 마이페이지 권한관리 — 2026-11-14
- 디자인 시스템: `HubStats`(feed) — 요약 수치 줄(이름 12 Regular 위 · 값 20 Bold 아래, 사이 16, 같은 폭 칸, 카드 남는 높이 세로 가운데). `onClick`이면 값이 Primary 버튼. 토큰 `Hub.StatValue` · `Hub.StatAccent`, 스토리 Stats · P06 가이드
- 앱 `pages/mypage/permission/PermissionPage`(`/mypage/permission`): 나의 권한 현황(Badge 현재 설정 + HubStats 5칸, 권한 신청 현황 → 팝업) · 기본 권한 정보(InfoTip, HubInfo) → 권한 신청 현황 · 권한 변경 이력 탭(최근 3건 표 + 총 N건 · [상세보기] → 권한 신청 현황 팝업) → 메뉴 및 기능 권한([권한 신청], 보유 기능 권한 + [보유 기능 권한 보기]) · 특수권한([특수권한 신청], 이름 · 상태 · 기간 줄). `api/mypage/permission` · `types/mypage/permission`
- 공통화: 마이페이지 탭 `pages/mypage/components/MypageTabs`(계정관리 · 권한관리 공용), 권한 도움말 `components/permissionHints`(Hub · 권한관리 공용), 권한 신청 현황 팝업을 `pages/mypage/components/`로 이동 · 표 열 `PERMISSION_REQUEST_COLUMNS` 공유
- 검증: 디자인 시스템 tokens · typecheck · lint · build, 앱 tsc, 1920 브라우저: 카드 x 264 · 1364 · 폭 1084 · 532 · 높이 182(시안 180), 요약 수치 · 정보 줄 시안과 몇 px 이내, 표 3행, 1건 → 팝업, 에러 없음. 표 카드는 미리보기 행 높이 40이라 시안보다 24 큼(IBSheet 테마로)
- 한 가정: Q67

### KWPC02010101 비밀번호 변경 팝업 — 2026-11-16
- 시안: Figma 28946:73531(빈 값 Validation Error 3 Cases)
- 디자인 시스템: `PasswordField`(TextField + 뒤 [보기] 버튼, 가림 eye · 보임 eye-off) · TextField `trailingAction`(누르는 뒤 버튼 자리) · `NoticePanel`(제목 + 글머리표 목록, Primary 50 · 테두리 Primary 200 · 반경 8 · 여백 12/16 — Infobox 토큰 재사용) · Field `helperGap`(컨트롤 ↔ 안내 문구 간격, 인라인 CSS 변수 대신). 스토리 `Components/Field/PasswordField` · `Components/Notice Panel`
- 앱 `features/mypage/account/components/PasswordChangeModal`(Modal md 620, 라벨 96 · 오류 간격 5 · 줄 사이 12, Footer [취소][변경] lg) + `passwordRules`(필수 · 8~30자 · 3종 조합 · 같은 문자 3자 · 연속 문자 4자 · 현재와 같음 · 확인 불일치). [변경] → 화면 규칙 오류는 입력 아래(Alert 없음), 한 번 누른 뒤에는 입력마다 다시 검사 → `changePassword`(예시: 현재 비밀번호 password, Kiwoom!2025는 최근 사용) → 서버 오류도 입력 아래 → 성공 시 닫고 완료 안내 · 계정관리 비밀번호 변경일 갱신. 계정관리 [비밀번호 변경] 연결, 팝업 모음(`?open=passwordChange`) · 화면 목록에 KWPC02010101
- 검증: 디자인 시스템 typecheck · lint · build, 앱 · 화면 목록 tsc. 앱: 팝업 620 · 라벨 96 · 입력 476 × 40 · 오류 문구 입력 아래 5 · Footer 48, 빈 값 3개 문구, 규칙별 문구(짧음 · 조합 · 같은 문자 · 연속 · 불일치), 현재 비밀번호 불일치 → 입력 아래(Alert 없음), 보기 전환, 성공 → 완료 안내 · 변경일 오늘, 에러 없음
- 한 가정: Q65
- 처리 실패 · 간격(Figma 28946:75197, 같은 날): 디자인 시스템 `InlineFeedback`(처리 결과 안내 상자: Status 배경 · 테두리 · 글자, 여백 12 · 반경 6 · 13 Regular, tone error · warning · success · info, error · warning은 role=alert) · Field `reserveHelper`(오류 문구 자리를 늘 잡아 둠 — 오류가 나와도 아래 줄이 밀리지 않음). 팝업: 입력 줄 높이 고정, 서버 처리 실패는 안내 상자 아래 12에 빨간 상자(Alert 없음, 입력하거나 다시 [변경]하면 사라짐). 예시: 새 비밀번호에 Fail이 들어가면 처리 실패. 측정: 줄 간격 75(Figma 71 — 오류 문구 줄 높이 18 ↔ 14, Q65 ②), 안내 상자 ↔ 실패 상자 12 · 실패 상자 44 · 색 #B91C1C / #FFF1F2 / #EF4444 · 반경 6, Footer 가운데, Alert 0, 에러 없음

### KWPC02010102 로그인 이력 · KWPC02010103 계정 상태 이력 팝업 — 2026-11-16
- 시안: Figma 28960:83084(로그인 이력) · 28960:84306(계정 상태 이력)
- 디자인 시스템: `InfoStrip`(display — 회색 상자 안 [이름 값] 쌍 가운데 정렬, 쌍 사이 60 · 이름 13 Bold ↔ 값 14 Regular 12 · 여백 16 · 반경 8, 토큰 `tokens/custom/info-strip.json` 모두 alias, 스토리 `Components/Info Strip`), SearchPanel `description`(제목 옆 12 Regular 안내, 제목 ↔ 설명 12)
- 앱 `features/mypage/account/components/`: `LoginHistoryModal`(Modal lg: 조회 조건 상자(조회기간 · 로그인 결과) + 안내 → 로그인 이력 표(결과 · 상태 Badge) → Total · Pagination, 기본 최근 30일, 열면 바로 조회) · `AccountStatusHistoryModal`(Modal lg: 현재 계정 상태 InfoStrip → 상태 변경 이력 표(변경 전 · 후 Badge, 계정 생성은 -) → Total · Pagination). `accountHistory.api.ts` · `.types.ts`(예시), 공통코드 `LOGIN_RESULT` · `LOGIN_STATE` · `ACCOUNT_STATUS`. 계정관리 [로그인 이력] · [계정 상태 이력] 연결(준비 중 안내 삭제), 팝업 모음 · 화면 목록 추가
- 검증: 디자인 시스템 tokens · typecheck · lint · build, 앱 · 화면 목록 tsc, 브라우저: 두 팝업 880 · 닫기(X), 로그인 이력 조회 조건 설명 · 6열 · 10행 · Total 82, 계정 상태 이력 요약 상자 · 5열 · 6행 · Total 6, 계정관리 버튼으로 열고 X로 닫힘, 에러 없음(favicon 404 제외)
- 한 가정(임의 작업): 폭 Figma 922 · 815 → lg 880, 예시 데이터, 로그인 이력도 열면 바로 조회, 표 글자 · 머리는 공통 미리보기(12) — IBSheet 테마로

### KWPC02020004 특수권한 신청 팝업 — 2026-11-16
- 시안: Figma 29253:76688(Validation Error)
- 디자인 시스템: GridPlaceholder `isRowSelectable`(고를 수 없는 줄은 선택 칸 비활성 — 사용 중 · 승인대기 특수권한)
- 앱 `features/mypage/permission/components/SpecialPermissionRequestModal`(Modal lg): 신청 대상 특수권한 표(라디오 하나, 사용 중 · 승인대기 선택 불가, 현재 상태 Badge) → 사용 희망 기간(시작일 ~ 종료일, 라벨 위) → 신청 사유(TextArea 200자 · 카운터) → [취소][신청] lg. [신청]: 기간 · 사유 오류는 입력 아래(Alert 없음), 한 번 누른 뒤 입력마다 다시 검사, 권한 미선택은 안내 창, 성공 시 닫고 완료 안내. `specialPermission.api.ts` · `.types.ts`(예시). 권한관리 [특수권한 신청] 연결, 팝업 모음 · 화면 목록 추가
- 검증: 디자인 시스템 typecheck · lint · build, 앱 · 화면 목록 tsc, 브라우저: 880 × 555, 마스킹 해제(사용 중) 라디오 비활성, 빈 값 → 기간 · 사유 문구, 종료일 < 시작일 → 순서 문구, 정상 입력 → 신청 → 팝업 닫힘 · 완료 안내, 에러 없음
- 시안과 다른 점(임의 작업): 폭 1040 → lg 880, 표 행 높이 64 → 미리보기 40(IBSheet 테마), 표 안내 문구 위치(제목 줄 오른쪽 끝 → 제목 옆), Footer 버튼 40 → lg 48(확정 결정), 권한 미선택 · 기간 순서 · 완료 문구

### KWPC02020001 개별 권한(개별 예외 권한) 팝업 — 2026-11-16
- 시안: Figma 29175:76240 (화면 이름은 KWPC02020100, IA 기준 개별 권한 팝업 KWPC02020001로 연결)
- 디자인 시스템: `InfoStrip layout="stacked"`(이름 12 Regular 위 · 값 18 Bold 아래 8, 칸 사이 16, `columns`로 칸 폭) · 항목 `onClick`(값이 Primary 밑줄 버튼, Badge는 색 그대로). 토큰 `InfoStrip.StackedLabel` · `Link` 추가, 스토리 Stacked
- 앱 `features/mypage/permission/components/ExceptionPermissionModal`(Modal xl 1280): 권한 적용 기준(템플릿 · 전체 · 개별 추가 · 개별 제외 건수) → 개별 예외 권한 목록(추가 · 제외 건수 Badge, 메뉴 경로, 템플릿 · 추가 · 제외 권한, 최종 적용일, 처리자) → Total · Pagination. 건수를 누르면 목록 보기 전환(전체 · 추가 있는 메뉴 · 제외 있는 메뉴). `exceptionPermission.api.ts` · `.types.ts`(Figma 13건 예시). 권한관리 [보유 기능 권한 보기] 연결, 팝업 모음 · 화면 목록 추가
- 검증: 디자인 시스템 tokens · typecheck · lint · build, 앱 · 화면 목록 tsc, 브라우저: 1280, 요약 33 = 21 + 12, 10행 · Total 13, 제외 → 11 · 추가 → 12 · 전체 → 13, 빈 권한 -, 에러 없음
- 시안과 다른 점(임의 작업): 폭 1380 → xl 1280(표 열 메뉴 경로 남는 폭 · 최종 적용일 220 → 160 · 처리자 148 → 120), 요약 상자 높이 82(시안 78 — 이름 줄 높이 18 ↔ 14), 건수 눌러 보기 전환 동작, 안내 문구 위치(제목 줄 오른쪽 끝 → 제목 옆)

### KWPC02020201 권한 변경 이력 상세 팝업 — 2026-11-16
- 시안: Figma 29158:74723
- 앱 `features/mypage/components/PermissionChangeModal`(Modal xl 1280): 조회 조건 상자(변경기간 · 구분 · 변경 유형, 기본 최근 1개월) → 권한 변경 이력 표(변경일시 · 구분 · 권한 대상 · 변경 내용 · 변경 전 · 변경 후 · 처리자 · 변경 사유) → Total · Pagination, 열면 바로 조회. `permissionChange.api.ts` · `.types.ts`(시안 10건 + 5건), 공통코드 `PERMISSION_CHANGE_TYPE` · `PERMISSION_CHANGE_KIND`. 권한관리 [권한 변경 이력] 탭: 안내 → 최근 3건 표 + "최근 변경 이력 · 총 N건" [상세보기] → 팝업(신청 현황 탭과 같은 방식). 팝업 모음 · 화면 목록 추가. 디자인 시스템 변경 없음
- 검증: 앱 · 화면 목록 tsc, 브라우저: 탭 3행 · 총 15건, [상세보기] → 1280 · 8열 · 10행 · Total 15, 표 폭 1240(넘침 없음), 에러 없음
- 시안과 다른 점(임의 작업): 폭 1380 → xl 1280(권한 대상 남는 폭 · 변경일시 164 → 150 · 변경 전 / 후 157 → 140), 변경 유형 선택지 중 개별 권한 제외 · 권한 부여는 예시, 탭의 최근 3건 표

### KWPC02030000 알림센터 — 2026-11-16
- 시안: Figma 29008:79135(검색결과)
- 디자인 시스템
  - `NotificationSummary`(feed): 미확인 요약 한 줄 [미확인 알림 N건(14 SemiBold · 16 Bold Primary)] · 업무유형 칩(사이 24) ··· [모두 읽음 처리]. 칩은 `NotificationCountChips`로 분리해 NotificationFeed(Hub)와 공용 — Hub 모양 그대로
  - `NotificationAccordion` · `NotificationDetail`(feed): 알림 목록 카드(테두리 Line Default · 반경 8), 줄 56 · 좌우 20 · 사이 16([점 8] 업무유형 92 · 제목 · 일시 164 · 화살표 20), 미확인 14 Bold Heading + Primary 점(DotBadge) · 확인 14 Regular Neutral 400. 한 번에 하나 펼침(controlled/uncontrolled), 펼침 상세 Primary 50 · 여백 24 · 사이 24: 알림 내용 14 Regular(줄바꿈 유지) → 흰 상자(Primary 100 테두리 · 반경 6 · 여백 8/12) [관련 업무 + 경로 · 이동 버튼 | 알림 정보 2×2(Neutral 50 · 이름 58)]
  - `HighlightText`(display): 검색어를 Primary 글자로 강조
  - SearchPanel `header`(inline일 때 제목 줄 대신 쓸 내용 — 요약 줄 · 구분선 · 조회 조건 줄이 한 카드)
  - 토큰 `Feed.*` 15개 추가(모두 alias), 스토리 P06 NotificationCenter
- 앱 `features/mypage/notification/NotificationCenterPage`(`/mypage/notification`, placeholder 대체): 요약 + 조회 조건(수신기간 최근 3개월 · 업무유형 · 확인상태 · 검색어 500) 한 카드 → 알림 목록 → Total · Pagination. 진입 시 바로 조회, 검색어 강조, 펼치면 읽음 처리(요약 건수 바로 줄고, 펼친 동안은 미확인 모양 — 접으면 회색), [모두 읽음 처리] Confirm, 관련 업무 버튼 → 해당 화면 이동. `notification.api.ts` · `.types.ts`(예시 17건, 읽음 상태는 모듈 안), 공통코드 `NOTIFICATION_TYPE`. 탭 제목 · 화면 목록(KWPC02030000)
- 검증: 디자인 시스템 tokens · typecheck · lint · build, 앱 · 화면 목록 tsc, 1920 브라우저: 카드 1632 × 139(Figma 139) · 줄 56 · 펼침 상세 189(Figma 190), 요약 12건 · 칩 5개, Total 17, "자동정산" 조회 → 6건 · 강조 6, 펼침 → 상세 · 요약 11건, 에러 없음
- 시안과 다른 점(임의 작업): 업무유형 · 확인상태 셀렉트 폭 200(Figma 117 · 99 — 검색 조건 기본 폭 규칙), 조회 조건 필드 사이 16(Figma 20), 화면명 ↔ 카드 위치 6 아래(화면명 줄 40 공통), 펼침 시 읽음 처리 시점 · 모두 읽음 확인 문구 · 관련 업무 이동 대상(정산 화면) · 예시 알림

### KWPC02020002 메뉴 권한 신청 팝업 — 2026-11-16
- 시안: Figma 29244:76072(선택 전) · 29244:76377(권한 선택 후)
- 디자인 시스템
  - `TreeOptionTable`(P07 config): 트리 + 항목 선택 표 — 위 도구 줄(Neutral 50 · 여백 12 · 사이 14, 첫 칸만 남는 폭) · 머리(Neutral 100 · 12 Bold) · 1Depth 줄(Neutral 200 · 13 SemiBold) · 2Depth 줄(Neutral 100 · 13 Medium) · 끝 메뉴 줄(13 Regular, 들여쓰기 14 / 34 / 56) [메뉴 | 현재 보유(회색 Badge sm) 160 | 고를 항목 체크박스 250, 사이 16], 줄 42. 펼침은 controlled(`expandedIds`), 항목 `disabled` · `addon`(승인대기 Badge). 도움 함수 `treeGroupIds(nodes, maxDepth)` · `filterTree(nodes, query)`
  - `SelectedOptionList`(P07 config): 고른 항목 확인 — 요약 줄(Neutral 100 · 13 Bold Primary) → 메뉴별 묶음(경로 13 Bold + 체크된 항목 줄 28, 풀면 빠짐, 묶음 사이 선), 빈 상태 제목 · 설명
  - `SectionHeading step`: 제목 앞 단계 번호(Primary 원 20 · 12 SemiBold 흰 글자, 제목과 4)
  - 토큰 `tokens/custom/tree-option.json`(모두 alias), `SectionHeading.StepBg` · `StepText`. 스토리 P07 MenuPermission
- 앱 `features/mypage/permission/components/MenuPermissionRequestModal`(Modal xl 1280): 안내 Infobox(신청 방법 · 신청 제한) → ① 신청할 권한 선택(검색 · Tree Depth 1~3 · 모두 접기 / 펼치기, 승인대기 권한 선택 불가) | ② 신청 예정 권한 확인(880 : 436) → 신청 사유(200자) → [취소][권한 신청](고른 권한 · 사유가 있어야 활성) → 완료 안내 · 닫힘. `menuPermission.api.ts`(예시 트리). 권한관리 메뉴 및 기능 권한 [권한 신청] 연결(준비 중 안내 삭제), 팝업 모음 · 화면 목록 추가
- 검증: 디자인 시스템 tokens · typecheck · lint · build, 앱 · 화면 목록 tsc, 브라우저: 1280 × 950(Figma 높이 950), 줄 11개 · 승인대기 비활성, 3개 선택 → 2개 메뉴 · 3개 권한, 사유 입력 → [권한 신청] 활성, 오른쪽에서 해제 → 2개 권한, "검증" 검색 → 상위 + 1줄, 신청 → 완료 안내, 에러 없음
- 시안과 다른 점(임의 작업): 폭 1380 → xl 1280(왼쪽 · 오른쪽 880 : 436 비율), 처음 접힌 묶음(정산자료관리 — 시안 그대로), 빈 상태 여백 · 완료 문구 · 예시 메뉴
- 필수 표시(사용자 요청, 같은 날): Field `required="text"` — 라벨 옆 "필수" 글자(10 Regular · Status Error Border · 라벨과 8, Figma 값, 토큰 `Field.RequiredText`). 기존 `required`(*)는 그대로. 메뉴 권한 신청 · 특수권한 신청 팝업의 신청 사유에 적용
