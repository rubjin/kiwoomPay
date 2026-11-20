# 화면: 시스템관리 (system)

> 범위: KWPC10 시스템관리. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### KWPC10010201 메뉴관리 (`features/system/user-security/menu/`, 경로 `/system/user-security/menu`)

- 기준: Figma 화면설계서 v0.1(`ZuoRAjEgbTZFZoJmRHz5gn` 노드 40004387:98592), **시안 없음** — `docs/screen-from-spec.md` 기준
- 구성: 화면명(옆 설명 없음 — 확정 결정) → 제목 탭(메뉴관리 · 기능 코드 관리, `Stack gap={0}`으로 아래 박스와 붙임) → `SearchPanel`(전체 폭, 탭과 붙임) → `PageLayout.Split`: 왼쪽 `ResultPanel`(메뉴 목록 `TreeTable`) · 오른쪽 `PageLayout.Section`(메뉴 정보 폼, 제목 `SectionHeading size="md"` — 옆 메뉴 목록과 같은 크기, 제목 아래 구분선 없음) — 정책 안내는 메뉴 정보 카드 안 맨 아래 `Infobox tone="neutral"` + `bullets` 3줄. 기획서 배치(검색이 왼쪽 열)는 따르지 않음 — 디자인 패턴 기준
- 제목 탭 기능 코드 관리(KWPC10010202)는 `/system/user-security/function-code` — 아래 항목
- API · 타입: `features/system/menu.api.ts` · `menu.types.ts`(예시 데이터, 메모리 저장). 시스템 줄(최상위 `M`)은 메뉴 코드가 아니라 고칠 수 없음 — 하위 메뉴 추가만
- 규칙: 최대 3Depth(3Depth면 [하위 메뉴 추가] 비활성), 상위메뉴 선택지에서 자기 자신 · 하위 · 옮기면 3Depth를 넘는 메뉴 제외, 페이지 설명은 3Depth만, PROG_LINK는 그룹 메뉴면 비활성 · 저장 시 비움, 정렬순서 빈 값이면 마지막
- 트리는 조회 중 표시 없음(이전 트리 유지), 목록 · 정보 영역은 Split 기본 높이 840 — 선택 전에도 높이 그대로. 선택 전 · 0건 안내(StatusView)는 카드 세로 가운데
- 처리: 저장 · 삭제는 `useAction`. 메뉴명 중복은 필드 아래 문구(Alert 없음), 하위 있음 · 사용 이력은 Alert. 성공하면 트리를 다시 받아 저장한 메뉴(삭제면 상위)를 선택 · 경로 펼침
- (임의 작업) 들어오면 바로 전체 트리 조회(1Depth까지 펼침), 검색은 받은 트리를 화면에서 거름, 사용여부 둘 다 해제면 Alert, 미저장 이동 확인 문구, 하위 메뉴 추가 기본 메뉴유형(3Depth 업무 화면 · 그 외 그룹), 라벨 폭 120 · 입력 높이 40(기획서 36), [저장] Primary(기획서 Dark), 확인 · 완료 · 실패 문구, 예시 메뉴 · 이동 경로 · 사용 이력

### KWPC10010202 기능 코드 관리 (`features/system/user-security/function-code/`, 경로 `/system/user-security/function-code`)

- 기준: Figma 화면설계서 v0.1(노드 40002405:34833), **시안 없음**. 메뉴관리와 같은 제목 탭(`features/system/components/MenuFunctionTabs` — 두 화면 공용)
- 구성: 화면명 → 제목 탭 + `SearchPanel`(전체 폭, 붙임) → **3열** `PageLayout.Split sideWidth="sm"`(메뉴 트리) 안에 `PageLayout.Split sideWidth="md"`(기능 목록) + 기능 정보 카드. 안내는 각 카드 안 맨 아래 `Infobox tone="neutral"`(기능 목록은 `ResultPanel footer`, 기능 정보는 Section 마지막)
- 메뉴 트리: 1~2Depth 줄은 누르면 펼침 · 접기(선택 아님), 3Depth를 누르면 그 메뉴의 기능 목록 조회. 트리 조회 중 표시 없음
- 기능 목록: `TreeTable`(하위 없는 평평한 목록 = 줄 선택 목록), 기능명 아래 줄 `└ 소속 탭`, 유형(탭 info · 버튼 neutral) · 권한(특수 warning · 일반 neutral) · 상태 Badge, 제목 줄 오른쪽 `총 N건`. 메뉴 선택 전은 idle 안내, 조회 중 표시 있음(목록은 트리 아님)
- 검색: 기능코드 · 기능명 부분일치, 기능유형 · 권한구분 · 사용여부 체크박스(같은 그룹 OR · 그룹끼리 AND, 기본 전체). 메뉴를 안 고르고 [조회]하면 Alert
- 기능 정보: 소속 메뉴 · 기능코드 읽기 전용, 소속 탭은 버튼·기능만(탭이면 비활성), 특수권한 코드 · 적용 방식은 권한구분 특수만(일반이면 비활성 · "일반 기능 - 선택 불가"). 저장 검증: 기능명 · 식별키 필수, 특수면 코드 · 적용 방식 필수, 식별키 중복은 필드 아래 문구
- API · 타입: `features/system/functionCode.api.ts` · `functionCode.types.ts`, 공통코드 FUNCTION_TYPE · PERMISSION_KIND · SPECIAL_APPLY
- (임의 작업) 3열 폭 320 · 480, 기능 추가 기본값(버튼·기능 · 일반 · 사용), 특수권한 코드 목록 SP001~SP003, [코드 관리]는 준비 중 Alert(특수권한 코드 관리 팝업 KWPC10010203 미작업), 기획서의 "선택 메뉴 | …" · "선택 기능 | …" 안내 줄 생략(트리 · 목록 선택 표시로 대신), 카드 안 ※ 안내는 기획서 화면 문구 그대로, 기능 정보 입력칸 도움말 없음(와이어프레임에 없음), 예시 기능 · 식별키 · 사용 이력

### KWPC10010203 특수권한 코드 관리 팝업 (`function-code/components/SpecialCodeModal.tsx`, 팝업 모음 `?open=specialCode`)

- 기준: Figma 화면설계서 v0.1(노드 40002405:35357), **시안 없음**. 기능 코드 관리 기능 정보 [코드 관리]로 연다. 닫으면 기능 코드 관리가 특수권한 코드 선택지를 다시 받는다(사용 중인 코드만)
- 구성: `Modal xl` → 조회 조건 `SearchPanel variant="box" fieldWidth="lg"`(plain 구성 + 배경 · 테두리 색 — 사용자 요청, 팝업 기본 plain의 예외) → `HubGrid`(525 : 535) 왼쪽 `Modal.Section` 특수권한 목록(`TreeTable` 줄 선택 목록, [삭제] · [+ 신규 등록]) | 오른쪽 특수권한 정보 폼 + 연결된 기능(`GridPlaceholder` 5건씩 + `ResultFooter` · `Pagination`) → 하단 안내 `Infobox`(neutral, bullets 3줄 — 기획서 Description 정책 요약, 사용자 요청으로 넣음) → Footer [닫기] · [저장] lg
- 규칙: 코드는 자동 생성, 권한명 필수 · 중복 불가(필드 아래 문구), 설명 선택. 연결된 기능은 조회 전용 · 코드를 고르면 1페이지부터. 삭제는 기능 연결 · 신청 · 결재 · 부여 · 사용 이력이 있으면 불가(Alert). [저장]은 바뀐 것이 있을 때만, 미저장 닫기 · 다른 코드 선택은 확인
- API · 타입: `features/system/specialCode.api.ts` · `specialCode.types.ts`. 기능 코드 예시 데이터의 특수권한 코드도 SP0001 · SP0002 형식으로 맞춤
- (임의 작업) 열면 바로 전체 목록 조회, 좌우 비율 525 : 535, [신규 등록] Neutral Line + plus(Footer [저장]이 Primary라), 기획서 원 번호 · 적용 방식 링크 모양은 넣지 않음. 입력칸 도움말 없음(와이어프레임에 없음), 예시 코드 · 연결 기능 23건

### KWPC10010301 권한 템플릿 관리 - 권한 항목 (`features/system/user-security/permission-template/`, 경로 `/system/user-security/permission-template`)

- 기준: Figma 화면설계서 v0.1(노드 40002406:36127), **시안 없음**
- 구성: 화면명 → `SearchPanel`(전체 폭) → `PageLayout.Split sideWidth="sm"` 왼쪽 템플릿 목록(`ResultPanel` + `TreeTable` 줄 선택, [+ 추가], footer 안내 "템플릿 적용 방식") | 오른쪽 템플릿 정보 카드([삭제] · [저장], 카드 안 ※ 안내) + 권한 카드(**버튼 탭** 권한 항목 · 변경 이력 — 화면 전체 전환이 아니라서(페이지 탭 규칙))
- 권한 항목: `PermissionMatrix` = `TreeTable` 열 render에 `Checkbox` — 메뉴(1~3Depth, 280) · 메뉴 접근 · 기능 권한(남는 폭, 일반 기능만 — 탭은 `(탭)`). 메뉴 접근을 켜고 끄면 하위 메뉴 접근도 함께, 끄면 그 메뉴들의 기능권한도 해제 · 비활성. 일부 하위만 켜진 상위는 indeterminate. 기획서의 선택 개수 표기(`메뉴 N · 기능 M`)는 넣지 않음(사용자 결정)
- 메뉴 트리는 메뉴관리 API(`menu.api` 시스템 줄 제외), 기능은 `functionCode.api` `fetchNormalFunctions`(특수권한 기능 제외)
- 처리: 템플릿명 필수 · 중복 불가(필드 아래 문구), 메뉴 접근 1개 이상, 연결 계정이 있으면 [삭제] 전 Alert "연결된 계정이 있으면 삭제 불가합니다.", 과거 이력은 서버 IN_USE Alert
- API · 타입: `features/system/permissionTemplate.api.ts` · `permissionTemplate.types.ts`
- **변경 이력 탭 = KWPC10010302**(노드 40002406:36651, `components/TemplateHistory.tsx`): 카드 안 "변경 이력" 제목(md, 위쪽 건수 없음 — 건수는 표 아래 Total) → 검색 `SearchPanel variant="box" title={null}`(변경일시 기간 · 변경유형, [조회]만) → `IbsheetGrid`(변경일시 · 변경자 · 변경유형 · 변경항목 · 변경 전 · 변경 후) → `ResultFooter` + `Pagination`(5건씩) → ※ 안내 2줄(기획서 문구 그대로, 0건 · 오류면 없음). 템플릿을 고르면 조건 처음으로 · 저장하면 다시 받음, 신규(저장 전)는 "저장 후 변경 이력이 표시됩니다". 저장 시 이력은 API가 전후값 비교로 남김(정보 수정 · 사용 변경 · 권한 변경 · 신규 등록, 공통코드 TEMPLATE_CHANGE_TYPE)
- (임의 작업) 들어오면 바로 목록, 변경 이력 기본 기간 최근 3개월, 처리자 예시 admin01, 메뉴 접근 1개 이상 검증, 처음엔 트리 모두 펼침, 예시 템플릿 · 권한 구성

### KWPC10010401 일반 메뉴·기능 권한 (권한 신청 승인 관리, `features/system/user-security/permission-approval/`, 경로 `/system/user-security/permission-approval`)

- 기준: Figma 화면설계서 v0.1(노드 40002401:29387, 머리 화면ID KWPC10010501 — IA는 KWPC10010401), **시안 없음**. 특수권한 결재 현황과 제목 탭(`features/system/components/PermissionApprovalTabs`)으로 이어짐. 페이지 패턴 **P01 Search → Result**(다운로드 센터와 같은 구성, 최초 진입 시 조회하지 않음)
- 검색: 신청자(계정 ID · 이름, 원문 비교) · 처리상태 · 권한유형(전체는 기획서 문구 "전체 (메뉴·기능)") · 신청번호(숫자만) · 신청일(기간, 기본 최근 30일) · 신청자 부서
- 결과: `ResultPanel` "일반 권한 신청 목록"(위쪽 건수 없음) → `IbsheetGrid` 신청번호(링크) · 신청자(마스킹) · 권한유형 · 신청 항목 · 신청 사유(마우스 올리면 전체) · 신청일시 · 상태 Badge(승인대기 warning · 승인 success · 반려 error) · 처리자(마스킹) · 처리일시 · [상세보기] → `ResultFooter` Total + `Pagination`(10건씩)
- API · 타입: `features/system/permissionApproval.api.ts` · `permissionApproval.types.ts`(마스킹은 서버), 공통코드 GENERAL_PERMISSION_TYPE · DEPARTMENT, 처리상태는 기존 PERMISSION_REQUEST_STATUS
- (임의 작업) 신청일 기본 최근 30일(기획서 "제안"), 부서 선택지, 예시 28건(날짜는 오늘 기준으로 옮김)

### KWPC10010402 일반권한 신청 처리 팝업 (`permission-approval/components/GeneralRequestModal.tsx`, 팝업 모음 `?open=generalRequest` · `generalRequestDone`)

- 기준: Figma 화면설계서 v0.1(노드 40002401:30001, 머리 화면ID KWPC10010502 — IA는 KWPC10010402), **시안 없음**. 일반 메뉴·기능 권한 목록의 신청번호 · [상세보기]로 연다. 처리하면 목록 다시 조회
- 구성: `Modal xl` → `Modal.Description`(기획서 문구) → `DetailCard` 신청 기본정보(3열, 라벨 96) · 신청 사유 · 신청 권한 내역(`GridPlaceholder` No · 메뉴 경로 · 구분 · 신청 권한, 위쪽 건수 없음) → 처리 의견 `TextArea`(Field 라벨 위) → Footer [닫기] Line · [반려] Neutral · [승인] Primary (lg)
- 규칙: 승인대기만 처리, 신청번호 단위 전체 승인 · 반려(개별 선택 없음). 반려는 사유 필수(Alert), 승인 · 반려 모두 확인 후 처리 → 완료 Alert. 처리 완료면 조회 전용 — 처리 의견 자리에 처리자 · 처리일시 · 처리 의견 `DetailCard`, 버튼은 [닫기]만
- API: `fetchGeneralRequestDetail` · `approveGeneralRequest` · `rejectGeneralRequest`(예시 — 신청 권한 줄은 신청 항목 요약에서 만듦, 계정 ID 마스킹은 서버)
- (임의 작업) 처리 완료 조회 전용 구성, 확인 · 완료 문구, [반려] 버튼 색(기획서 회색 → Neutral)

### KWPC10010403 특수권한 결재 현황 (`permission-approval/SpecialApprovalPage.tsx`, 경로 `/system/user-security/permission-approval/special`)

- 기준: Figma 화면설계서 v0.1(노드 40002401:30935, 머리 화면ID KWPC10010503 — IA는 KWPC10010403), **시안 없음**. P01, 최초 진입 시 조회하지 않음
- 구성: 화면명 → 제목 탭(일반 메뉴·기능 권한 | 특수권한 결재 현황) + `SearchPanel`(붙임) → `ResultSummary`(결재 승인 대기 warning · 부여 대기 info · 현재 사용 중 success, 검색 조건 기준 건수) → `ResultPanel` "특수권한 신청·결재 목록"(`IbsheetGrid`) — footer에 선택 신청 상세(`DetailCard`, 신청번호 · 상세를 누르면) + ※ 안내(기획서 문구) → `ResultFooter` + `Pagination`(10건씩)
- 검색: 신청자 · 특수권한(특수권한 코드 API) · 결재 상태 · 부여 상태 · 신청일(기본 최근 30일) · 신청번호 · 결재번호
- 상태: 결재 상태(공통코드 APPROVAL_STATUS — 승인 대기 · 승인완료 · 반려, 다우오피스 회신 기준 · KWP에서 승인 · 반려 없음) · 부여 상태(GRANT_STATUS — 부여 대기 info · 사용 예정 primary · 사용 중 success · 기간 만료 neutral · 회수 error · 미부여 neutral). [권한 부여](Dark sm)는 승인완료 + 부여 대기만, 나머지는 "-"
- 관리 열: 기획서는 [상세] · [권한 부여]가 한 칸 — `IbsheetGrid`는 칸마다 요소 하나만 클릭되어 "상세" · "관리" 두 열로 나눔
- API · 타입: `features/system/specialApproval.api.ts` · `specialApproval.types.ts`(요약 summary 포함, 예시 날짜는 오늘 기준으로 옮김)
- (임의 작업) 제목 탭(기획서에 없음), 신청일 기본 최근 30일, 예시 32건(기준일 2026-10-23 → 오늘)

### KWPC10010404 특수권한 부여 처리 팝업 (`permission-approval/components/SpecialGrantModal.tsx`, 팝업 모음 `?open=specialGrant`)

- 기준: Figma 화면설계서 v0.1(노드 40002401:30453, 머리 화면ID KWPC10010504 — IA는 KWPC10010404), **시안 없음**. 특수권한 결재 현황 [권한 부여](승인완료 + 부여 대기)로 연다. 부여하면 목록 다시 조회
- 구성: `Modal xl` → `Modal.Description`(기획서 문구) → `DetailCard` 신청 기본정보(3열) · 신청 사유 및 승인 결재 정보(4열, 사유 한 줄 전체) · 최종 권한 부여 설정(`form` — 신청 희망 기간 · 현재 부여 상태 · 실제 권한 사용 기간 시작일 · 종료일 `DateField`, `ControlGroup spacing="lg"`) → ※ 안내 2줄(기획서 문구, 팝업 아래) → Footer [닫기] · [권한 부여] lg
- 검증: 시작 · 종료일 필수, 종료 ≥ 시작, 신청 희망 기간 안(화면 Alert) / 서버 — 같은 계정 · 특수권한 기간 중복(OVERLAP) · 범위 밖 · 부여 불가 상태. 확인 → 부여 → 완료 Alert. 시작일이 오늘 이전이면 사용 중, 미래면 사용 예정
- 승인완료 + 부여 대기가 아니면 날짜 비활성 · [권한 부여] 없음
- API: `fetchSpecialApprovalDetail` · `grantSpecialPermission`(`GrantError`)
- (임의 작업) 실제 사용 기간 기본값 = 신청 희망 기간, 확인 · 완료 · 오류 문구, 결재 승인자 예시 "장*신"

## 열린 질문

- [Q75] 메뉴관리: ① 들어오면 바로 조회할지(조회 화면 기본은 조회 안 함) ② 검색을 서버에서 할지 ③ 사용여부 둘 다 해제 시 처리 ④ 메뉴유형 "탭 화면"과 "4Depth 탭은 메뉴 등록 대상 아님"의 관계 ⑤ 그룹 메뉴의 PROG_LINK · 페이지 설명을 저장할 때 비울지 ⑥ 메뉴ID 생성 규칙(M + 숫자) ⑦ 상위메뉴를 바꿔 옮기는 것 허용 여부 ⑧ [저장] 버튼 색(기획서 Dark ↔ 앱 Primary)
- [Q76] 기능 코드 관리: ① 특수권한 코드 관리 팝업(KWPC10010203) 화면설계서 ② 기능 식별키 형식(대문자 · 밑줄) 검증 여부 ③ 미사용 메뉴를 고르면 기능 목록을 보여 줄지 · 막을지 ④ 탭 기능을 미사용으로 바꾸면 소속 버튼도 막을지 ⑤ 기획서 "기본 7건 표시" 의미(페이지 단위?) ⑥ 선택 메뉴 · 선택 기능 안내 줄이 필요한지
- [Q77] 특수권한 코드 관리 팝업: ① 연결된 기능의 적용 방식(파란 글자)을 누르면 그 기능으로 이동하는지 ② 미사용 코드도 기능 코드 관리 선택지에 보일지(지금 사용 중만) ③ 권한명 중복 기준(대소문자 · 공백) ④ 열자마자 조회할지 ⑤ 결재 현황(KWPC10010403) · 부여 처리 팝업(KWPC10010404) 연결 위치
- [Q78] 권한 템플릿 관리: ① 변경 이력 기본 기간 · 변경자 표시(아이디 · 이름) ② 권한 구성 검증 기준(메뉴 접근 1개 이상인지) ③ 상위 메뉴 접근만 켜고 하위를 일부 끌 수 있는지(지금 가능 — 상위는 그대로) ④ 미사용 메뉴 · 미사용 기능을 매트릭스에 보일지(지금 미사용 기능은 뺌) ⑤ 기능 권한 체크 시 메뉴 접근 자동 체크 여부
- [Q79] 일반 메뉴·기능 권한: ① 처리 팝업 — 처리 완료 화면 구성 · 승인 시 처리 의견 저장 위치 ② 신청일 기본 기간(최근 30일 "제안") 확정 ③ 신청자 부서 선택지 출처(조직관리) ④ 화면명 — 메뉴는 "권한 신청 승인 관리", 기획서 화면명은 "일반 메뉴·기능 권한"
- [Q80] 권한 신청 승인 관리: ① 기획서 머리 화면ID(KWPC1001050x)와 IA(KWPC1001040x)가 다름 — 지금 IA 기준 ② 일반 메뉴·기능 권한 ↔ 특수권한 결재 현황을 제목 탭으로 이었음(기획서에 탭 없음) — 이동 방식 확인 ③ 부여 처리 팝업 — 실제 사용 기간 기본값(지금 신청 희망 기간) · 부여 후 신청자 알림 여부 ④ 관리 칸 [상세] · [권한 부여]를 두 열로 나눔
