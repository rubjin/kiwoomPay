# Patterns P01~P07

> 범위: 페이지 패턴 부품 · 흐름 훅 · 패턴 페이지(설계안은 page-patterns-plan.md).
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## 열린 질문

- [Q56] P03 Lookup 확인 필요: ① Figma 분류 Select의 "대분류 · 중분류 · 소분류"가 진한 글자(Neutral 800) — 현재 SelectBox placeholder(회색)로 표시. 선택 전 문구를 진하게 할지 ② 읽기 전용 호출 필드의 지우기(x) — TextField는 읽기 전용이면 지우기를 숨김 ③ 결과 그리드 행 48 · 세로선은 IBSheet 테마로(미리보기는 40) ④ 중분류 값은 Figma에 없어 예시 값
- [Q59] P07 즐겨찾기 편집 확인 필요: ① Figma Modal 폭 820 · 여백 24 ↔ 요청 lg 880 · Modal 공통 여백 20 ② ~~Footer 버튼~~ → 항상 lg 48 (확정 결정 "팝업 하단 버튼") ③ 검색 상태(이름 + 경로 목록)는 Figma 노드 없음 — 사용자 이미지 기준 ④ 바뀐 것이 없을 때 [저장] 비활성 · 닫기 확인 문구 · 저장 완료 문구 ⑤ ~~V03 시안~~ → 반영(2026-11-13)
- [Q60] P07 V02 · V03 확인 필요: ① ~~[추가] 버튼 색~~ → Chart/Positive 초록(사용자 확정, Hover 배경 · 비활성 색은 임시) ② 엑셀 템플릿 불러오기 · 저장 · 삭제 동작 · 다운로드 요청 후 안내 문구 ③ 엑셀 출력 항목 = Grid 열로 가정, 기본 선택 10개 ④ [선택 조건 적용]은 [저장] 때 화면 검색 조건에 넣음(조회는 사용자가) — 즉시 적용인지 ⑤ [신규 등록]은 현재 화면 조건 + 이름 "새 검색조건" ⑥ Figma Modal 820 ↔ lg 880, 안내 ↔ 본문 24 · 라벨 ↔ 내용 30은 Figma 값
- [Q61] P02 거래 상세정보 팝업: ~~폭 520~~ → md 620 · 높이 고정(사용자 확정), ~~기본정보 탭~~ → Figma 29443:106622 반영. 남은 확인: ① 고정 높이 655는 가장 긴 결제 오류 · 결제정보 탭 기준(임시) — 부분취소 이력이 여러 건이면 본문 스크롤 ② 통합 거래내역 행 선택 → 팝업 연결(IBSheet 행 이벤트)
- [Q62] P02 고객문의·민원 처리 팝업 확인 필요: ① 폭 Figma 720 → md 620(가까운 표준 크기) ② 민원구분 · 민원유형 · 회신방법 선택지, 필수 항목(지금 민원구분 · 민원내용) ③ 등록 후 팝업을 닫을지, 남아서 접수정보 표에 새 줄을 보여 줄지(지금 닫기 + 완료 안내) ④ [등록 후 메일 발송] 받는 사람(담당자 E-mail · E-mail 1/2/3) · 확인 창 필요 여부 ⑤ ~~접수정보 표 머리~~ → 12 SemiBold · Neutral 100 (사용자 확정)
- [Q63] P04 부분취소 요청 확인 필요: ① 폭 Figma 720 → md 620 ② 요청 후 팝업을 유지하고 취소내역에 반영(지금) vs 닫기 ③ 새 요청의 처리상태 문구(지금 "요청") ④ 검증 · 확인 문구 ⑤ 취소유형별 조건(상계 · 강제 · 카드사직권 — 권한 · 추가 입력 여부) ⑥ 잔여 금액 0이면 입력 · 버튼 비활성

## 작업 기록

### Pattern: P01 Search → Result + KWPC06010201 — 2026-11-12
- 만든 것 (디자인 시스템 `src/patterns/`, Storybook `Patterns/P01 Search Result`)
  - 공통: `StatusView`(조회 전 · 조회 중 · 0건 · 오류 · 권한 없음, Figma Grid State / Empty 18 SemiBold · 14 Regular · 높이 220), `DialogProvider` · `useDialog`(alert · confirm Promise, Modal sm — 성공/실패 안내 Alert 통일)
  - P01: `SearchPanel`(KWP GUI 검색 카드: 제목 18 Bold + 접기, [초기화 ↻] · [조회], 구분선, 필드 줄 간격 16, 아래 붙은 [상세 검색] 16 Bold Primary), `AppliedFilters`(칩 32 · Primary 50 · 13 Medium, 조회 전 안내), `ResultSummary`(항목 60 · 24 Bold 숫자 + 단위, 조회 전 -), `ResultPanel`(제목 줄 64 · 16 Bold + 공통/업무 Action, success 외에는 StatusView), `ResultFooter`(Total + 가운데 Pagination), `GridPlaceholder`(IBSheet 연결 전 임시 미리보기, 선택 체크박스), `useSearchResult`(입력/조회 조건 분리, 늦은 응답 무시, autoSearch 기본 false)
  - 토큰 `tokens/custom/search-result.json`(색 모두 Semantic alias). `Segmented size="md"`(40, 폭은 글자 + 12). PageLayout Section 제목 18/16 SemiBold → Bold(Figma). 날짜 입력 폭 11ch → 글자 폭(field-sizing: content, 미지원 브라우저 10ch) → Date Range Field 246(Figma 253)
  - 가이드 `docs/patterns/P01SearchResult.mdx`(구성 순서 · 흐름 · 상태 체크리스트 · 선택 Action · 기본값 · Do/Don't)
- 앱: `pages/settlement/merchant/execute/MerchantSettlementExecutePage`(`/settlement/merchant/execute`, `/settlement/merchant`은 이동), `api/settlement/merchantSettlement`(예시 데이터, TODO API), `types/settlement/merchantSettlement`, App에 `DialogProvider`
- 검증: tokens · typecheck · lint · build(디자인 시스템 · 앱) · Storybook 빌드 통과. 1680 화면에서 카드 위치 · 높이가 Figma와 일치(검색 147 · 상세 58 · 적용 조건 58 · 요약 86, y 72/218/288/358/456, 요약 항목 213 × 60, 칩 32). 앱 브라우저 테스트 15개 통과(경로, 최초진입 조회 전 · Action 비활성, 1주일 → 날짜, 조회 → 칩 · 10행 · Total 28 · 요약, 선택 없이 Action → Alert, 2건 선택 → Confirm → 완료 Alert, 3페이지 8행, Enter 0건, 초기화 → 입력만 비움, 상세 검색 · 접기). 기존 테스트 재통과(공통 24 · step5 22 · MultiSelect 27 · 가이드 28 · Q36/Q53 · Modal 스크롤), 실패는 옛 기대값(Date Picker 340 · 검색 라벨 위 배치)뿐
- 참고: Storybook 빌드가 가끔 깨진 결과(L7[e] is not a function)를 내는데 다시 빌드하면 정상 — 코드 문제 아님
- 한 가정: Q54

### Pattern: P02 Record → Form + KWPC07010101 가맹점 기본/계약 정보 관리 — 2026-11-12
- 시안: 신규등록_Collapsed(28459:11020) · 조회수정(28298:50)
- 디자인 시스템 `src/patterns/record-form/` (Storybook `Patterns/P02 Record Form`)
  - `FormTable`(+ Row · Label(required *) · Cell(colSpan) · Head · InlineLabel): 라벨 138 + 값 칸 4쌍 격자(`pairs`) 또는 직접 열 구성(`template`, 담당자 표 36 + 5칸). 줄 52 · 머리 44, 라벨 12 Bold Neutral 100 배경, 테두리는 줄 높이 안(Figma)
  - `FormSection`(+ Header 소제목 18 Bold + 설명 12 · Heading 선택 CPID): 카드(여백 16 − 테두리 1), 제목 18 SemiBold, 접기/열기(13 Bold + ⌃⌄), 위에 붙는 제목 탭 `tabs` + 오른쪽 `tabActions`(카드 위 8)
  - `ContextChip`(현재 사업자 | 사업자번호 …, 흰색 · muted 회색), `PageLayout.Title titleAddon`(제목 옆 12)
  - 토큰 `tokens/custom/record-form.json`. Title Tab 사이 간격 8(TODO) → 0 (Figma 붙어 있음, Q34 일부 해소)
- 앱: 최소 폭 1920(MainLayout). `/operation/merchant-contract/basic/new`(신규등록) · `/basic/edit`(조회수정) — 기본 정보 8줄 · 담당자 표(추가 · 선택 삭제) · 저장(Confirm → Alert) · 가맹점 정보관리(선택 CPID 문맥, 신규는 접힘)
- 검증: typecheck · lint · build · Storybook 빌드 통과. 1920 화면에서 Figma와 1px 이내(제목 탭 y70 · 버튼 y55 · 기본 정보 카드 y103 h793(Figma 792) · 줄 52 · 라벨 138/값 262 · 아래 버튼 y903 · CPID 카드 y951 h64 · 국가 192). 1600 화면은 가로 스크롤(최소 폭 1920)
- (임의 작업): 고객 확인 정보 · 결제 오픈 현황 탭 내용, CPID 상세 영역(9개 탭), 선택지 값, 필수 검증(사업자구분만), 찾기 · 주소 · 사업자번호 수정 팝업 연결, 예시 데이터
- 화면 목록(`apps/screen-list`)에 신규등록 · 조회수정 추가 (작업중)
- Storybook 정리(같은 날): 패턴 부품을 Components에도 스토리 · 가이드로 추가 — `Components/Search Result`(Guide · SearchPanel(Playground · Rows · DetailGrid · Collapsed) · Result Parts(AppliedFilters · ResultSummary · ResultPanel · 상태)), `Components/Record Form`(Guide · FormTable(Pairs · ColSpan · Matrix · ReadOnly) · FormSection(Playground · Tabbed · SubHeader · Heading) · ContextChip), `Components/Lookup Field` · `Components/Status View` · `Components/Dialog`(각 Guide), `Patterns/P02 Record Form` Guide. 기존 보강: Segmented Sizes · FullWidth(Selection 가이드), Page Layout TitleAddon(가이드). 새 스토리 · 가이드 33개 렌더링 확인

### Pattern: P03 Lookup → Apply — 2026-11-13
- 시안: KWPC07010101 팝업 표준산업분류코드조회 · 분류로 찾기(28511:35220, 조회 전 28511:39777 · 결과 28517:66195)
- 디자인 시스템
  - `useLookup<T>()`(`patterns/lookup`): `isOpen` · `open()` → 고른 값 / 취소 시 `null`(Promise) · `select(value)` · `cancel()`. 열린 상태에서 다시 열거나 화면이 닫히면 앞의 호출은 `null`
  - `LookupSearch`: `keyword={false}`(검색어 칸 없이 extraFields만 — 분류로 찾기), `onReset`(새로고침 아이콘 버튼, [조회] 앞)
  - Storybook `Patterns/P03 Lookup Apply`(Guide · LookupApply(호출 화면 → Modal → 선택 → 반영) · ModalInitial · ModalResult), 가이드 `docs/patterns/P03LookupApply.mdx`
- 앱: `pages/patterns/P03LookupApplyPage`(`/patterns/lookup-apply`, 개발 서버만), 탭 제목 P03, 화면 목록 맨 위 세 번째 줄
- 검증: typecheck · lint · build(디자인 시스템 · 앱 · 화면 목록). Modal 880 × 709 · 탭 y68 · 검색 줄 y120 = Figma. 흐름(Storybook · 앱 동일): 대분류 선택 → [전체조회] 2건 → [선택] → 필드 반영 · Modal 닫힘, Esc → 원래 값 유지, 키워드로 찾기 '타이어' → 1건, 콘솔 에러 없음
- 한 가정: Q56

### P03 키워드로 찾기 반반 · 앱 개발 서버 폰트 — 2026-11-13
- `LookupSearch`: 검색어 + 버튼([초기화] · [조회])을 한 묶음(`.keyword`, flex 1)으로 — `extraFields`의 Field에 `flex: 1`을 주면 반씩 나눔(키워드로 찾기 416 · 416, 위 Tab과 같은 선). 분류로 찾기 · 기존 Lookup 배치는 그대로
- 폰트 미적용 원인: 앱 개발 서버가 폰트를 `packages/design-system/dist/fonts`에서 줬는데 `pnpm build`가 dist를 비웠다가 마지막에 다시 복사함 → 빌드 중에 연 화면은 폰트 404 → 대체 글꼴(맑은 고딕)로 남음. 수정: `designSystemSource()`에 개발 서버 전용 미들웨어(`/fonts/pretendard/*` → `pretendard` 패키지, Storybook staticDirs와 같은 폴더), 앱 두 곳의 `publicDir: dist` 제거. dist/fonts를 치워도 5173 · 5180 폰트 200 확인

### P03 검색 결과 없음 — 2026-11-13
- 결과가 없으면 그리드 머리는 남기고 그 아래에 안내(IBSheet 데이터 없음 메시지 자리). `GridPlaceholder` `empty` 슬롯 추가, Lookup 결과 없음 안내를 `LookupSearchEmpty`로 분리 export(`LookupSearch` `empty`는 그대로 — 안내만). 결과 자리 높이 517에 맞춰 Modal 709 유지
- Storybook `Patterns/P03 Lookup Apply` ModalEmpty(키워드로 찾기) · 가이드, 앱 P03 페이지 동일 적용
- 검증: typecheck · lint · build, 브라우저(Storybook · 앱): 머리 5열 + 안내 "검색 결과가 없습니다. / 검색어를 다시 확인해 주세요.", 다시 조회하면 결과 행 표시, 에러 없음

### P03 탭 없는 Lookup — 2026-11-13
- 찾기 방식이 하나인 Lookup(사업자번호 검색 — 업체명 검색어 하나, Modal lg 800, Tab 없음)을 P03 예시에 추가. 호출 화면에 사업자번호 줄(LookupField) 추가, 스토리 NoTabInitial · NoTabResult, 가이드 "3. 탭 없는 Lookup"(규칙: 찾기 방식이 둘 이상일 때만 Tab), 앱 P03 페이지 동일 적용
- 검증: typecheck · lint · build, 브라우저(Storybook · 앱): Modal 800 · 검색 줄 y68 · Tab 0, "ABC" → 2건 → [선택] → 사업자번호 반영 · 닫힘, 에러 없음
- (임의 작업) 사업자 예시 데이터 · 열 구성(사업자번호 · 업체명 · 대표자명 · 선택)

### Modal xl · P03 주소 검색 — 2026-11-13
- Modal `size="xl"`(880, 결과 Grid가 넓은 Lookup — Figma 표준산업분류코드 조회 879.5) 추가. 기존 `width={880}` 3곳(Lookup Search Empty 스토리 · P03 표준산업분류 스토리 · 앱 P03)을 `size="xl"`로. Modal 가이드 폭 표기 갱신 (사용자 결정: 주소 검색은 lg, 880은 xl)
- P03에 주소 검색 Lookup 추가: 기존 `AddressSearch` + Modal lg 800, 호출 화면 "사업장 주소"(우편번호 LookupField [주소 검색] + 도로명(읽기 전용) + 상세주소 직접 입력). 스토리 AddressInitial · AddressResult, 가이드 "4. 주소 검색", 앱 P03 동일
- 검증: typecheck · lint · build, 브라우저(Storybook · 앱): xl 880 · lg 800 폭, "독막로" → 3건 → [선택] → 우편번호 04153 · 도로명 반영 · 닫힘, 상세주소 입력, 에러 없음
- (임의 작업) 주소 예시 데이터, 호출 화면 주소 줄 구성

### Pattern: P04 Action → Feedback — 2026-11-13
- 시안: 사용자 제공 이미지(엑셀 다운로드 사유 입력 · 사업자번호 변경, sm 팝업). Figma 노드 없음 → 값은 기존 Modal · Field 규칙
- 디자인 시스템
  - `useAction({ validate, confirm, confirmOptions, run, onSuccess, success, failure })`(`patterns/action`) → `{ execute, loading }`. Check(문구 → Alert 후 중단) → Confirm(옵션) → Process(loading · 중복 실행 무시) → Result(성공: onSuccess → 완료 Alert / 실패: 실패 Alert, 입력 유지). DialogProvider 필요
  - Storybook `Patterns/P04 Action Feedback`(Guide · ActionFeedback(호출 화면) · DownloadReason · BizNoChange), 가이드 `docs/patterns/P04ActionFeedback.mdx`
  - sm 입력 팝업 규칙: Modal sm 400 · Field 라벨 왼쪽(폭 통일, 120 임시) · 줄 간격 12 · 현재 값은 읽기 전용 입력 · Footer [취소][확인] lg · 처리 중 닫기 · Esc 막음
- 앱: `pages/patterns/P04ActionFeedbackPage`(`/patterns/action-feedback`, 개발 서버만), 탭 제목 P04, 화면 목록 네 번째 줄
- 검증: typecheck · lint · build(디자인 시스템 · 앱 · 화면 목록), 브라우저(Storybook · 앱 동일): 팝업 400, 사유 없이 확인 → 안내, 사유 선택 → loading → 닫힘 · 완료 안내, 사업자번호 형식 오류 안내, Confirm 문구 "현재 → 변경", 실패(000…) → 실패 안내 · 입력 유지, 성공 → 값 반영 · 닫힘, 에러 없음
- (임의 작업) 다운로드 사유 선택지 · 기타 직접 입력, 검증 문구, 실패 예시, 라벨 폭 120 · 필수 표시

### Modal 크기 재정의 · P04 xl 결제한도 설정 — 2026-11-13
- Modal `size`: lg 800 → **880**, xl 880 → **1280**, **xxl 1680** 추가(화면이 좁으면 max-width 100%). 기존 `size="xl"` 3곳(Lookup Search Empty · P03 표준산업분류 스토리 · 앱 P03) → lg. Modal · LookupSearch · AddressSearch · P03 가이드와 주석의 폭 표기 갱신
- P04에 xl 입력 표 팝업 "카드번호별 매입사 결제한도 설정"(사용자 이미지): 업종 Button Tab md 40 + FormTable(카드사 9 × 4 한도, 단위 회 · 원) + [취소][등록], 숫자만 · 쉼표 표시, Tab별 입력 유지, `useAction`(입력 없음 안내 → 등록 Confirm → 완료). 호출 화면 [결제한도 설정], 스토리 CardLimit, 가이드 "3. xl 입력 표 팝업", 앱 P04 동일
- 검증: typecheck · lint · build, 브라우저(Storybook · 앱): 폭 1280 · Lookup 880 · Modal Types 400/620/880, 빈 등록 안내, "1000000a" → "1,000,000", Tab 이동 후 값 유지, 등록 Confirm → 완료 안내, 에러 없음

### Pattern: P05 Login → Auth + KWPC3000 로그인 — 2026-11-13
- 디자인 시스템 `patterns/auth`: `AuthLayout`(Header 66 · 로고 32 · 내용 폭 360 · 위 99 · Footer 74) · `AuthForm`(필드 사이 40 · 버튼 위 58 · 안내 위 20) · `AuthField`(밑줄 입력, 라벨 20 · 16 · 입력 · 16 · 밑줄, 비밀번호 보기 아이콘) · `AuthNotice` · `AuthVerifyBody` · `AuthInfoRow` · `VerifyCodeField`(남은 시간 MM:SS · 재발송 · 숫자만). 토큰 `tokens/custom/auth.json`(색 모두 alias). Storybook `Patterns/P05 Login Auth`(Guide · Login · SmsVerify · SmsExpired), 가이드 `docs/patterns/P05LoginAuth.mdx`. 스토리 자산 `src/stories/assets`(로고 · 그림 · Footer 로고)
- 앱: `pages/auth/login/LoginPage`(1단계 → SMS 인증 → 토큰 저장 → 원래 화면/메인), `components/SmsVerifyModal` · `loginMessages`, `api/auth/login`(예시, TODO(API)), `types/auth/login`, 자산 `assets/login/login-security.svg` · `assets/logo/logo-header.svg`(Figma 다운로드). 화면 목록에 KWPC3000 추가
- 검증: tokens · typecheck · lint · build. 1920 × 1080에서 Figma와 1px 이내(Header 66, 로고 871/17 · 178.5 × 32, 그림 165 · 160, 제목 345 · 44.8 · 32/800, 아이디 430 · 74, 비밀번호 544 · 77, 버튼 679 · 48, 안내 747 · 130, Footer 1006 · 74), SMS Modal 400 × 352(PNG 351). 흐름(Storybook · 앱): 틀린 비밀번호 Alert(1/5) · 입력 유지, 비밀번호 보기, Enter 제출 → SMS, 카운트다운, 숫자만 6자리 · [완료] 활성, 틀린 인증번호 Alert, 성공 → 메인(대시보드) 이동, 에러 없음
- 한 가정: Q57

### Pattern: P06 Notification Feed + KWPC2000 마이페이지 — 2026-11-13
- 시안: Figma KWPC2000_마이페이지_GUI_최초진입(28762:69925), 도움말 4종(Tooltip 노드 텍스트)
- 디자인 시스템 `patterns/feed`: `NotificationFeed`(미확인 요약 · [모두 읽음 처리] · 업무유형 칩 · 목록 줄 44, 미확인 Primary 50 + N + SemiBold, `unreadCount` 전체 · `limit`), Hub 부품 `HubGrid`(폭 비율) · `HubCard`(제목 20 Bold + [상세보기 >]) · `HubInfoList` · `HubInfo`(+ `.Sub`, `hint` InfoTip, `labelWidth`) · `HubDivider` · `HubSubtitle` · `HubPanel` · `HubLinkRow`. 토큰 `tokens/custom/feed.json`(색 모두 alias). Storybook `Patterns/P06 Notification Feed`(Guide · Mypage Hub · Feed · Empty), 가이드 `docs/patterns/P06NotificationFeed.mdx`
- TextButton neutral 글자색 Neutral 700 → 600 (Figma 근거, Q15 해소) — 모든 neutral TextButton에 적용
- 앱: `pages/mypage/hub/MypageHubPage`(`/mypage` index, 헤더 [내 정보] → 이동), `api/mypage/mypageHub`(예시, TODO(API)) · `types/mypage/mypageHub`. [상세보기] → 계정관리 · 권한관리 · 알림센터, 알림 선택 → 읽음 + 알림센터, [모두 읽음 처리] → Confirm → 0건. 탭 제목 · 화면 목록에 KWPC2000
- 검증: tokens · typecheck · lint · build, Storybook 1680에서 Figma와 일치(카드 x 24/510/1058 · y72 · 폭 470/532/598 · 높이 412(Figma 413), 계정 줄 78/119/160/201/241/281/322, 알림 요약 78 · 칩 118 · 목록 154부터 44씩, 미확인 배경 · 글자), 흐름(선택 → 읽음, 모두 읽음 Confirm → 0, 버튼 숨김) · 앱(헤더 이동, 상세보기 이동, 알림 → 알림센터), 에러 없음
- 한 가정: Q58
- 권한 없음 · 알림 없음 케이스(Figma 28815:71127): `HubEmpty`(회색 상자 · 문구 12 Regular Text Secondary + [특수권한 신청] sm Neutral Line, 사이 2) — 특수권한이 없으면 권한 신청 현황 → 빈 상태 순서(Figma). `NotificationFeed` 빈 상태: 목록 자리 남은 높이 가운데 "최근 수신된 알림이 없습니다."(기본 문구), 칩은 0건 유지, [모두 읽음 처리] 숨김. 모두 읽음 처리 후에도 칩 0건 유지(스토리 · 앱). 스토리 `Mypage Hub · 권한 없음 / 알림 없음`, 앱 `/mypage?example=empty`(예시, 화면 목록 행 추가). 검증: Figma 위치 일치(권한 신청 현황 259 · 45, 빈 상자 320 · 76, 버튼 352, 알림 빈 영역 154 · 242, 카드 413), 앱 [특수권한 신청] → 권한관리, 에러 없음
- 앱 Header 누락 반영(Figma 마이페이지 Header 28765:112928): [다운로드 센터] 건수 Badge(`count`, 예시 1) · 알림 아이콘 미확인 점(`dot` → bell-on, 예시 있음) — 디자인 시스템 Header는 이미 지원, 앱이 넘기지 않았음. 알림 아이콘 → 알림센터 이동. 값은 TODO(API). Figma의 "마스킹 해제 중 59:55" · 실명 표시는 마스킹 해제 후 상태(해제 사유 Modal 필요, Q46)라 미반영
- 앱 Header 마스킹 해제 중 상태(사용자 요청): 처음부터 해제 중(60:00 카운트다운 · 실명 사용자 정보)으로 표시 — Figma Header와 같음. [연장] 60:00 · [마스킹 적용] → 마스킹(kw******* · 홍*동) · 0초가 되면 자동 마스킹, [마스킹 해제] → 바로 해제(TODO 사유 Modal Q46). 세션 시간도 카운트다운 · [연장]. 실제 상태 · 시간은 TODO(API)

### Pattern: P07 Selection & Configuration (V01 즐겨찾기 편집) — 2026-11-13
- 시안: Figma KWPC1301_LNB_즐겨찾기 편집 팝업(29348:37 — 접힘 528 · 펼침 751 두 Modal), 검색 상태는 사용자 이미지. 폭은 사용자 요청대로 lg 880
- `FavoriteMenuPicker` 새 시안으로 다시 만듦: 검색(lg 48) → 즐겨찾기 메뉴 상자(N / 10 + 칩, x로 빼기, 넘치면 → 버튼) → 메뉴 트리(1Depth 44 Neutral 50 · 2Depth 40 Neutral 100 · 3Depth 체크박스 40, 최대 445 · 안에서 스크롤). 검색 중에는 일치 메뉴 목록(이름 강조 + 경로). `defaultQuery` 추가, `description` · `FavoriteCount` 삭제(개수는 상자 안으로). 토큰 `favorite-menu.json` 새로. 칩 지우기는 필드 지우기 아이콘 재사용
- `useConfigDraft(saved)`(`patterns/config`): 초안 · `dirty` · `begin` · `reset`. Storybook `Patterns/P07 Selection Configuration`(Guide · FavoriteEdit 흐름), `Composites/Feedback/Favorite Menu Picker`(FavoriteEdit · Expanded · Search · Full · Playground), 가이드 2개. 예시 메뉴 `src/stories/favoriteMenuData.ts`(Figma IA, 하위가 안 보이는 2Depth는 "… 현황" 예시)
- 앱: LNB 즐겨찾기 탭 [편집] → `layouts/Lnb/FavoriteEditModal`(lg 880, 초안 · 저장 Confirm 없이 바로 저장 → 완료 Alert, 변경 후 닫기 확인). 즐겨찾기는 화면 안 상태(TODO(API)). 화면 목록에 KWPC1301
- 검증: tokens · typecheck · lint · build, Storybook: Modal 880, 본문 검색 0 · 48 / 상자 60 · 86 / 트리 158(접힘 7줄 310 · 펼침 445, 펼침 Modal 751 = Figma), 줄 44/40/40 · 배경 · 왼쪽 16/40/65 · 글자, 칩 32 · 13 Medium · N300 · 반경 6, Footer 40(→ 이후 사용자 확정으로 lg 48). 10/10이면 나머지 비활성, 칩 넘칠 때만 → 버튼 · 클릭 시 200 이동, 흐름(변경 전 [저장] 비활성, 변경 후 취소 → 확인, 저장 → 완료 Alert · 반영). 앱: 3 → 4개 선택 저장 → LNB 즐겨찾기에 반영, 에러 없음
- 한 가정: Q59

### Pattern: P07 V02 엑셀 다운로드 설정 · V03 내 검색조건 관리 — 2026-11-13
- 확정 결정: 팝업 하단 버튼은 항상 lg 48 (Figma 40은 디자인 오류)
- 시안: Figma KWPC04010107 엑셀 다운로드 설정(29495:87846) · KWPC04010105 내 검색조건 관리(29503:90470), 폭은 lg 880
- 디자인 시스템 `patterns/config`: `TransferList`(전체 항목 ⇄ 선택 항목, 체크 → [추가]/[제거], 선택 항목 끌어서 순서, 패널 386 · 줄 36) · `SavedConditionList`(제목 · 총 N 건, 검색 · 카드(이름 13 SemiBold · 요약 12 · 상태 Badge sm) · Pagination, 패널 485) · `ConditionSummary`(Neutral 50 · 반경 6 · 이름 52 · 줄 16) · `ConfigSplit`(안내 → 왼쪽 318 | 구분선 | 오른쪽) · `ConfigField`(라벨 13 Bold ↔ 내용 30, between) · `ConfigPanelHeader` · `ConfigHint` · `ConfigDivider`. 토큰 `tokens/custom/config.json`(색 모두 alias). 스토리 ExcelDownload · SavedConditions(예시 `configDemoData`), P07 가이드 2 · 3절
- 앱(통합 거래내역): [엑셀 다운로드] → `ExcelDownloadModal`(출력 항목 = Grid 열), [내 검색조건 관리] → `SavedSearchModal`(초안 · 삭제 예정 · 적용 중 · 신규 등록 · 덮어쓰기, 요약은 `SEARCH_FIELDS` + `summarizeSearch`), 제목 옆 [내 검색조건 선택]으로 저장 조건을 검색 조건에 넣음. 저장 조건은 화면 안 상태(TODO(API)). 화면 목록에 KWPC04010107 · KWPC04010105
- 검증: tokens · typecheck · lint · build(디자인 시스템) · 앱 tsc. Storybook 두 Modal 880 · Footer 48 · 배치가 Figma와 같음. 앱: 엑셀 — 선택 항목 모두 제거 후 다운로드 → 안내, 추가 → 요청 → 완료 안내 · 닫힘. 내 검색조건 — 변경 전 [저장] 비활성, 다른 조건 적용 → 저장 → 완료 안내 → 제목 옆 선택에 반영, 에러 없음
- 한 가정: Q60
- 저장조건 없음(Figma 29509:94307, 같은 날): `SavedConditionList` 빈 상태(검색창 유지 · 안내 가운데 · 패널은 오른쪽 높이까지, 최소 354, 검색어가 있으면 "검색 결과가 없습니다."). 오른쪽은 "신규 검색조건 등록"(검색조건명 · 저장할 조건 = 현재 화면 조건 · 안내), [저장] 처음부터 활성 · 이름 필수. 스토리 SavedConditionsEmpty, 앱 `/transaction/integrated/list?example=empty`(화면 목록 행 추가). 검증: Storybook 패널 318 × 354 · 안내 위치가 Figma와 같음, 이름 없이 저장 → 안내, 저장 → 1건 목록으로 전환(Storybook · 앱), 에러 없음
- 패널 제목을 `SectionHeading`으로 통일(같은 날, 사용자 확인): `ConfigPanelHeader` · `.panelHeader` · `.panelTitle` · 토큰 `Config.Title` 삭제 → TransferList(전체 항목 · 선택 항목) · SavedConditionList(저장된 검색조건 + 총 N 건) · 오른쪽 제목(선택한 검색조건 관리 · 신규 검색조건 등록)이 모두 `SectionHeading size="md" as="h3"`. 제목 줄 높이 32는 패널 제목 class · `ConfigSplit` 오른쪽 첫 줄로 유지. 빈 상태 제목 색은 `Config.EmptyTitle`. 검증: 바꾸기 전/후 캡처 6장 — 엑셀 2장 0px · 내 검색조건 2장 1px(글자 안티앨리어싱) · Storybook 저장조건 없음 4px, 앱 저장조건 없음은 왼쪽 패널이 2px 길어져 구분선 아래 끝과 맞음(전에는 2px 짧았음)

### P02 거래 상세정보 팝업 · P07 스토리 닫힌 상태 — 2026-11-13
- 시안: Figma KWPC04010101 거래 상세정보 · PG / 결제정보 / 정상(29443:107913)
- 디자인 시스템 `patterns/record-form/RecordDetail`: `DetailTarget`(선택한 거래 + 값 · 아래 구분선) · `DetailTabs`(제목 탭 줄, 스크롤 밖) · `DetailSection`(SectionHeading md + 설명 + 카드 사이 12) · `DetailCard`(Neutral 50 · 반경 6 · 여백 12, 제목 14 Bold, 라벨 12 SemiBold 73 · 값 12 Regular, 2열 220 · 줄 16, 빈 안내). 토큰 `tokens/custom/record-detail.json`(색 모두 alias). 스토리 `Patterns/P02 Record Form` Detail Popup(처음 닫힘, 버튼으로 열기), P02 가이드 4절
- 앱: P02 패턴 페이지(`/patterns/record-form`) 화면명 오른쪽 [상세 팝업 (조회 전용)] → `pages/patterns/P02DetailModal`
- P07 스토리(엑셀 다운로드 · 내 검색조건 관리 · 저장조건 없음)를 처음 닫힌 상태로 — 버튼으로 연다(즐겨찾기 편집과 같게)
- 검증: typecheck · lint · build, Storybook: 팝업 520 · 카드 217/81/81 · 2열 라벨 x 33/253 · 줄 간격 34가 Figma와 1px 이내, 탭 전환, 앱 같은 크기 · Esc 닫기, P07 4개 스토리 처음 닫힘, 에러 없음
- 한 가정: Q61
- 수정(같은 날, 사용자 확정): 팝업 폭 520 → **Modal md 620**(표준 크기 중 가까운 것) · **높이 고정**(Modal `height` 옵션 추가, 621 = 결제정보 탭 기준, 탭을 바꿔도 같은 크기). 기본정보 탭을 Figma(29443:106622)대로: 가맹점 정보(가맹점명 · CPID · 상담전화 · 서비스명 · URL 한 줄) · 거래 기본정보(거래번호 · 주문번호 · 거래원천 · 승인일시 · 결제상태 · 결제금액), 처음 선택 탭 = 기본정보. `DetailCard` 칸은 카드 폭을 똑같이 나눔(기존 220 고정 해제) + 항목 `span`(URL 두 칸). 검증: Storybook · 앱 두 탭 모두 620 × 621 · 스크롤 없음, 카드 149/149 · 217/81/81, URL 두 칸, 에러 없음
- 결제 오류 케이스(같은 날, 사용자 이미지): 결제상태 "오류" · 매입상태 승인, 결제 고객 정보에 에러코드 · 에러내용 줄, 오류 값은 Chart/Negative #EF4444 글자(`DetailCard` 항목 `tone: 'error'`, 토큰 `RecordDetail.ValueError` = Chart/Negative #EF4444, 사용자 확정), 설명 "…결제정보 및 오류정보를 조회합니다". 고정 높이 621 → 655(오류 케이스가 가장 김 — 스크롤 없이 보이게). 스토리 `Detail Popup · 결제 오류`, 앱 P02 패턴 페이지 [상세 팝업 (결제 오류)]. 검증: Storybook · 앱 기본정보 · 결제정보 · 결제 오류 모두 620 × 655 · 스크롤 없음, 빨간 값 3개, 에러 없음

### P02 고객문의·민원 처리 팝업 — 2026-11-13
- 시안: Figma KWPC04010101 고객문의·민원 처리(29443:116562)
- 디자인 시스템: `DetailTarget divider`(구분선 끄기) · `DetailCard` `labelGap`(이름 ↔ 값) · `form`(입력 폼 카드: 열 사이 40 · 이름 ↔ 컨트롤 20 · 말줄임 없음) · `children`(표 등 자유 내용), `Modal.Footer start`(왼쪽 끝 보조 버튼 → 양끝 배치), `GridPlaceholder` `empty`가 글자면 행 높이 한 줄 가운데 안내 · 표 흰 배경. 스토리 `Detail Popup · 고객문의·민원 처리`, P02 가이드 5절
- 앱: P02 패턴 페이지 [민원 처리 팝업 (조회 + 입력)] → `pages/patterns/P02ComplaintModal`
- 검증: typecheck · lint · build, Storybook: 팝업 620 × 969 · 카드 183/149/145/271 · 컨트롤 40 · Footer 48, 필수 항목 안내 · 새로고침 초기화 · 등록 후 메일 발송 완료 안내, 앱 같은 크기 · 닫기 확인, 에러 없음
- 한 가정: Q62
- 접수정보 있음 케이스(같은 날, 사용자 이미지): 접수 내역 3줄(접수일시 · 접수경로 · 민원구분 · 처리상태, 가운데 정렬 · 4칸 같은 폭 138). 표 머리를 **12 SemiBold · Neutral 100**으로 변경(사용자 확정) — `GridPlaceholder` 공통이라 모든 표 미리보기(P01 · P03 · 다운로드 센터 · 거래내역 등)에 적용(토큰 `search-result/GridHeaderBg` Bg.Page → Neutral.100). 스토리 `Detail Popup · 고객문의·민원 처리 (접수정보 있음)`, 앱 P02 패턴 페이지 [민원 처리 팝업 (접수정보 있음)]. 검증: 머리 12px · 600 · #F1F5F9 · 40, 3줄 · 가운데 정렬, 빈 케이스 그대로, Storybook · 앱 에러 없음

### P04 부분취소 요청 팝업 — 2026-11-13
- 시안: Figma KWPC04010111 부분취소 요청(29486:132933)
- 디자인 시스템: `DetailCard plain`(상자 없이 제목 + 줄, 사이 12) · `DetailSummary`(금액 요약 상자: 이름 12 Regular · 값 16 Bold 오른쪽 정렬, 항목 사이 세로선). 스토리 `Patterns/P04 Action Feedback` PartialCancel(처음 닫힘), P04 가이드 4절
- 앱: P04 패턴 페이지 [부분취소 요청] → `pages/patterns/P04PartialCancelModal`
- 검증: typecheck · lint · build, Storybook · 앱: 팝업 620 × 621, 요약 상자 75(Figma), 금액 숫자만 · 쉼표, 금액 없음 · 잔여 초과(150 > 100) · 사유 없음 안내, 확인 → 완료 안내 → 누적 30원 · 잔여 70원 · 표 1줄, 에러 없음
- 한 가정: Q63
