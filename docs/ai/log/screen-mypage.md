# 화면: 마이페이지 (mypage)

> 범위: KWPC2000 Hub · 계정관리 · 권한관리 · 알림센터와 팝업. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### 공통 (`features/mypage/`)

- Hub(KWPC2000, `/mypage`)는 메뉴(IA)에 없는 화면 — 헤더 [내 정보]로 진입. `?example=empty`로 권한 없음 · 알림 없음 케이스
- 계정관리 · 권한관리 화면 안 탭(`components/MypageTabs`)은 각 메뉴 화면으로 이동(한 화면 안 탭 전환 아님)
- 권한 도움말 `components/permissionHints`(Hub · 권한관리 공용), 권한 신청 현황 팝업과 표 열 `PERMISSION_REQUEST_COLUMNS`는 `features/mypage/components/`(Hub · 권한관리 공용)
- 팝업은 열면 바로 조회(내 목록). 팝업 안 조회 조건은 확정 결정 "팝업 안 조회 조건"(plain)
- 팝업 시안 폭 1380 · 1040 · 922 등은 표준 Modal 크기(xl 1280 · lg 880)로. 표 행 높이 · 머리는 IBSheet 테마로(미리보기 40)
- 시안 없이 만든 부분 (임의 작업): 권한 변경 이력 탭의 최근 3건 표, 개별 권한 건수 눌러 보기 전환, 예시 데이터 · 완료 문구

### 화면 · 팝업 위치

| 화면ID | 이름 | 위치 |
| --- | --- | --- |
| KWPC2000 | 마이페이지 Hub | `hub/MypageHubPage` |
| KWPC02010100 | 계정관리 | `account/AccountPage` |
| KWPC02010101 | 비밀번호 변경 | `account/components/PasswordChangeModal` + `passwordRules` |
| KWPC02010102 · 03 | 로그인 이력 · 계정 상태 이력 | `account/components/LoginHistoryModal` · `AccountStatusHistoryModal` |
| KWPC02020000 | 권한관리 | `permission/PermissionPage` |
| KWPC02020001 | 개별 권한(보유 기능 권한 보기) | `permission/components/ExceptionPermissionModal` |
| KWPC02020002 | 메뉴 권한 신청 | `permission/components/MenuPermissionRequestModal` |
| KWPC02020004 | 특수권한 신청 | `permission/components/SpecialPermissionRequestModal` |
| KWPC02020101 | 권한 신청 현황 상세 | `components/PermissionRequestModal` |
| KWPC02020201 | 권한 변경 이력 상세 | `components/PermissionChangeModal` |
| KWPC02030000 | 알림센터 | `notification/NotificationCenterPage` |

### 입력 팝업 규칙 (비밀번호 변경 · 특수권한 · 메뉴 권한 신청)

- 화면 규칙 오류 · 서버 오류는 입력 아래 문구(Alert 없음). 한 번 [변경]/[신청]을 누른 뒤에는 입력마다 다시 검사. 오류 문구 자리는 `Field reserveHelper`로 미리 잡음
- 서버 처리 실패는 안내 상자 아래 `InlineFeedback`(빨간 상자), 입력하거나 다시 누르면 사라짐
- 신청 사유 필수 표시는 `Field required="text"`("필수" 글자)
- 비밀번호 규칙(`passwordRules`): 필수 · 8~30자 · 3종 조합 · 같은 문자 3자 · 연속 문자 4자 · 현재와 같음 · 확인 불일치. 예시: 현재 비밀번호 password, Kiwoom!2025는 최근 사용, 새 비밀번호에 Fail → 처리 실패
- 특수권한 상태 4종 Badge: 미보유 neutral · 승인대기 warning · 사용 중 success · 만료 error(임의). 신청 가능은 미보유 · 만료

### 알림센터

- 요약 + 조회 조건 한 카드(`SearchPanel header`에 `NotificationSummary`), 진입 시 바로 조회(수신기간 최근 3개월), 검색어 강조(`HighlightText`)
- 펼치면 읽음 처리(요약 건수 바로 줄고, 펼친 동안은 미확인 모양 — 접으면 회색), [모두 읽음 처리] Confirm, 관련 업무 버튼 → 해당 화면
- (임의 작업) 셀렉트 폭 200(Figma 117 · 99), 조회 조건 필드 사이 16(Figma 20), 읽음 처리 시점 · 확인 문구 · 이동 대상

## 열린 질문

- [Q58] Hub 확인 필요: ① 알림 선택 시 이동 대상(유형별 업무 화면 — 지금은 알림센터) ② 모두 읽음 확인 문구 · 빈 상태 문구 · 알림 행 Hover ③ 업무유형 칩 아이콘 규칙(Figma는 리스크/FDS만) ④ 계정관리 Badge 줄 라벨 ↔ 값 Figma 8(다른 줄 12) — 12로 통일 ⑤ 권한 신청 현황 값 위치 — 오른쪽 끝으로 통일 ⑥ [특수권한 신청] 이동 대상(지금 권한관리)
- [Q65] 권한 신청 현황 팝업: ① 기본 신청기간 최근 1개월(시안 08-15 ~ 09-15) ② 조회 조건 필드 사이 시안 약 20 → 규칙 16
- [Q66] 계정관리: ① 마스킹 적용 중 휴대전화 · 이메일 · 이름 표시(서버 마스킹 값인지) ② 시안 왼쪽 카드 구분선이 오른쪽보다 4 아래 → 두 카드 같은 규칙(제목 줄 + 16)
- [Q67] 권한관리: ① 기본 권한 정보 도움말 문구 ② 최근 신청 표 처리자 · 처리일시 정렬(이 시안 가운데 ↔ 팝업 시안 왼쪽 → 왼쪽 유지) ③ [상세보기] · '권한 신청 현황 1건'은 권한 신청 현황 팝업을 연다고 해석
- [Q72] 비밀번호 변경: ① 오류 문구 색 — 시안 #B91C1C ↔ Field 공통 #EF4444(공통 유지) · 오류 테두리 시안 1px ↔ Field 2px ② 오류 문구 줄 높이 18(시안 14)이라 입력 줄마다 4px 큼 ③ 규칙별 오류 문구(시안은 빈 값 3개만) ④ 변경 후 재로그인 · 세션 처리 ⑤ 보기 아이콘 — 시안은 가린 상태 eye, 로그인은 eye-off(서로 반대)
