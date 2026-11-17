# Components (단일 컴포넌트)

> 범위: Button · Field 계열 · Selection · Pagination · Date Picker · Badge · Modal · Tab · Tooltip · Text 등. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### 공통

- forwardRef · HTML 속성 pass-through, variant · size · state는 문자열 유니온, form 계열은 controlled/uncontrolled(`useControllableState`)
- 팝업류(Select · DatePicker · Tooltip · Work Tab 메뉴)는 document.body에 띄우고 `useFloatingPosition`(아래 공간 부족 시 위, `align: 'end'`). 팝업 Esc는 캡처 단계에서 먼저 처리 → Modal은 처리된 Esc 무시
- Hover · 전환 애니메이션은 motion 토큰이 없어 넣지 않음(시안에 hover가 없으면 미구현)
- 고정 예시 스토리는 `render: () =>` + `controls: { disable: true }`, 상태를 나란히 보일 때는 `Case`(이름 · 설명). 시안 없이 정한 스토리는 `parameters.tempWork`

### Button · TextButton

- variant primary · neutral · dark · danger × appearance solid · line × size sm 32 · md 40 · lg 48. prop 이름 `appearance`(HTML `type`과 겹쳐서). 글자 14 Bold / 13 SemiBold / 12 SemiBold(Button Guide), 아이콘 간격 4
- `loading` 모양(정지 아이콘 + "처리 중")은 Storybook에만 — 앱 화면은 쓰지 않는다(확정 결정)
- TextButton: neutral 글자 Neutral 600, md 13 Bold, Hover는 Primary 50 배경(밑줄 없음). `TextLink`는 항상 밑줄

### Field 계열

- `Field`(라벨 · 컨트롤 · 헬퍼, Context로 id · size · feedback · disabled). 라벨은 왼쪽(간격 8) 기본, `labelPosition="top"`은 Modal Form용. `variant="inline"`(표 칸 안, = `FormTable.InlineField`), `grow`, `required`(*) · `required="text"`("필수"), `helperGap` · `reserveHelper` · `aside`(컨트롤 오른쪽 안내)
- 한 Field 안 컨트롤이 여럿이면 첫 컨트롤만 Field id. 라벨 + 입력 + 붙는 버튼은 한 묶음(확정 결정)
- 크기 sm 32 · md 40 · lg 48(높이만 다름, md · lg 글자 14). 폭은 내용 기준, 부모 폭은 `fullWidth`, 정해진 폭은 `fieldWidth`(auto · xs 72 · sm 150 · md 200 · lg 270, `fullWidth`가 우선). 날짜 140 · 기간 264 고정
- 피드백 테두리 2px는 1px 테두리 + inset 그림자(레이아웃 안 밀림), 피드백이 포커스보다 우선. 헬퍼 색은 Status Border(#22C55E / #EF4444)
- SelectBox: 패널 최대 190 · 로딩/빈 174, 열린 채 스크롤 · 로딩 · 빈 상태면 트리거 Primary 2px(번짐 없음), sm 항목 13 Medium. MultiSelect: 항목 36 · 반경 4, 패널 최대 md 276 · sm 210, 글자 md 14 · sm 13, 여러 개는 쉼표 나열. `TableMultiSelect`(표로 고르는 드롭다운)
- 셀렉트 상자는 항상 루트 폭을 채움. 시각 셀렉트는 `fieldWidth="auto"`(값에 맞는 폭)
- `TextField` `trailingAction`, `PasswordField`(가림 eye · 보임 eye-off), `SearchField` `searchLabel`(입력 + [조회] 묶음), `LookupField`(입력 + [찾기])
- DateField · DateRangeField: 숫자 입력 시 YYYY-MM-DD 자동 정렬, 날짜 ↔ 달력 아이콘 4. 달력은 `CalendarProvider` 어댑터(IBSheet), 없으면 자체 DatePicker

### Selection

- native input을 투명하게 덮고 모양은 형제 요소가 그림. 컨트롤은 라벨 첫 줄 세로 가운데(`1lh`)
- Checkbox 반경 4 · indeterminate, Radio는 원 하나 + 안쪽 링(`inset box-shadow`)으로 점을 그림(소수점 좌표에서 찌그러지지 않게), RadioGroup이 checked 제어. 라벨 글자 md 14 · sm 13
- Segmented: 옵션 테두리 겹쳐 붙임 · 최소 60 · 좌우 12 · 선택 12 SemiBold, `size="md"` 40. 검색 조건 안에서는 최소 55 · 늘어나지 않음
- `SelectAllCheckbox` · `toggleKey`(전체 선택 / 하나 토글), `SelectionGroup`(세로 · 가로)

### Pagination · Date Picker · Badge

- Pagination: 칸 40 · 이전/다음 최소 62 · 간격 4 · 반경 8, 처음 · 끝 1개 + 현재 양옆 1개(7칸 일정). 1페이지 이하 숨김은 화면 정책
- DatePicker: 336 × 344 · 반경 12 · 헤더 40 · 셀 40, 일요일 시작, `min` · `max` · `isDateDisabled` · `maxRangeDays` · `today`. 토요일 Info · 일요일 Error 글자
- Badge tone 6 · soft/line · md 24 / sm 20, `NumberBadge`(99+, 0 숨김, `appearance="soft"`), `DotBadge`(6), `UnreadIndicator`("N" 11 Bold)

### Modal

- 크기 sm 400 · md 620 · lg 880 · xl 1280 · xxl 1680(확정 결정), `height`(고정 높이), `width`(예외 폭). 반경 12 · 테두리 없음 · 그림자 0 8px 24px rgba(0,0,0,.12) · 여백 20 · 딤 48%
- Body만 스크롤, Header · Footer 고정. 배경 스크롤 잠금, 포커스 복귀, Esc는 맨 위 모달만, 딤 클릭 닫기 기본 꺼짐
- `Modal.Header`(`addon`, 제목 20 SemiBold) · `Modal.Section`(소제목 + 내용, `gap` 16 · 8) · `Modal.Description`(줄바꿈 문자 유지) · `Modal.InfoList` · `Modal.Footer`(`start` 왼쪽 보조 버튼). Footer 버튼 항상 lg 48

### Tab · Tooltip · Text

- Tab: line md 40(14 Regular / Active 14 Bold · 좌우 12) · sm 32(12 / 12 SemiBold · 좌우 10), button md 40(좌우 16) · sm 32(좌우 12), title 34(14 / Active 14 Bold + 밑줄 4 · 좌우 12, Tab 사이 0). `count` Badge
- Tooltip: Hover 200ms · Focus 즉시, 자동 위치 전환(bottom → top → left → right), 몸체 Neutral 800 · 반경 8 · 최대 320, 포인터 높이 8 · 기준 요소 바깥 8. `InfoTip`(Info 아이콘 20)
- `Text`: 보조 설명 글자(역할 이름 variant · tone secondary 기본) — TODO(시안) 글자 규칙
- 표 테두리: 칸 사이 세로선, 양 끝 선 없음(FormTable · GridPlaceholder · IBSheet 테마)

## 열린 질문

- [Q17] 가이드는 Hover를 "한 단계 어두운 배경"이라 쓰지만 시안의 Neutral Solid Hover는 더 밝은 회색(Neutral/500). 시안 값을 따름 — 디자인 확인 필요
- [Q18] MultiSelect: ① 시안은 전부 선택해도 "전체"가 일부 선택(–) → 구현은 체크(✓) ② 열림 상태 트리거 글자 회색 예시 ↔ 진한 색 예시 → 진한 색
- [Q19] 시안에 없는 항목: 필드 hover 표현, SelectBox 키보드 이동(↑↓) → 미구현
- [Q20] 남은 임시값: `z-index/dropdown`
- [Q21] SelectBox Negative 상태의 화살표만 진한 색(#1E293B), 나머지는 Neutral/500 → Neutral/500로 통일
- [Q22] Selection 임시값(`tokens/custom/selection.json` TODO): 비활성 라벨 색, 가로 그룹 간격(16, Figma CPID 표는 12), 체크박스 sm 체크 아이콘 크기(20을 0.8배)
- [Q23] Checkbox · Radio · Toggle · Segmented hover 미구현, 토글 이동 애니메이션 없음
- [Q28] Pagination 반응형(가맹점관리자 모바일) 시안 없음
- [Q29] Date Picker: 필드 ↔ 패널 간격 8 임시, 기간 선택 중 마우스 위치 미리보기 미구현
- [Q30] Badge 임시값: Neutral 상태 점 색(Neutral/500), Primary · Neutral 외 tone의 Line 테두리(각 Status Border), Number 두 자리 이상 좌우 6 · 12 SemiBold. 3글자 이상 배지는 시안보다 2px 넓음(글자 폭 반올림)
- [Q31] Modal: z-index 체계(모달 1000 · 팝업 1100) 임시, 시안 제목 → 본문 19라 높이 1~2px 큼, focus trap 미구현(a11y 범위 밖)
- [Q34] Tab 임시값: Button Tab 간격 8, 비활성 Tab Badge 색, Hover 없음. Tab Guide "Small 32 = LNB 등 밀도 높은 영역" ↔ LNB View Tab은 32로 반영됨
- [Q38] Tooltip 임시값(`tokens/custom/tooltip.json` · `field.json`): 화면 경계 최소 8, `z-index/tooltip` 1200, 비활성 Info 아이콘 색, 표시 애니메이션 없음
