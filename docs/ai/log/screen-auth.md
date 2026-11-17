# 화면: 로그인 (auth)

> 범위: KWPC3000 로그인 · SMS 인증.
> 이 영역을 작업할 때만 읽는다. 확정 결정은 `docs/ai/status.md`(매 세션 자동)가 우선한다.
> 작업이 끝나면 아래 "작업 기록" 맨 끝에 `### 제목 — YYYY-MM-DD` 한 절을 추가하고, 질문은 "열린 질문"에 적는다.

## 열린 질문

- [Q57] P05 로그인 확인 필요: ① 제목 32 ExtraBold는 Figma 텍스트 스타일에 없음(컴포넌트 SCSS 값) ② 입력 중 · 오류 밑줄 색, 오류 문구 위치 · 문구(실패 n/5 · 잠김 · 만료) ③ SMS 인증 Modal Figma 노드(안내 ↔ 상자 12는 PNG 측정, 상자 ↔ 인증번호 12 · 입력 ↔ 오류 문구 4는 사용자 확정 2026-11-13) ④ 화면 ID — IA는 KWPC0300, Figma는 KWPC3000 ⑤ 내용 ↔ Footer 최소 간격 40(임시), 가맹점관리자 모바일 시안

## 작업 기록

### P05 SMS 인증 간격 — 2026-11-13
- 사용자 확정: 휴대전화번호 상자 ↔ 인증번호 34 → **12**, 인증번호 입력 ↔ 오류 문구 **4**(Field 기본 8). Field에 `--field-helper-gap` CSS 변수(기본 8) — `VerifyCodeField`만 4로. 오류 문구 자리(18 + 4)는 미리 잡아 문구가 나와도 Modal 높이 같음(329)
- 검증: lint · typecheck, Storybook 측정(상자 ↔ 입력 12, 입력 ↔ 문구 4, 만료 · 기본 모두 Modal 329)
- 인증번호 불일치 문구(사용자 확정): Alert 대신 입력 아래 "인증번호가 일치하지 않습니다. 다시 확인해 주세요." — 입력 수정 · 재발송 시 지움, 만료 문구가 우선. `useAction` `failure`가 null을 돌려주면 Alert 생략(옵션 추가). 스토리 SmsMismatch, 앱 SmsVerifyModal 동일. 검증: 틀린 번호 → Alert 없음 · 문구 표시 · Modal 329 유지, 입력 수정 → 문구 사라짐(Storybook · 앱)
- SMS 인증 불가 케이스(사용자 이미지): 등록된 휴대전화번호 없음 → 안내 2줄 + "등록 정보 없음"(`AuthInfoRow empty`, Text Placeholder) + [확인]만, 닫기 X 없음. `AuthVerifyBody`는 인증번호가 없으면 안내 · 정보만. 스토리 SmsNoPhone, 로그인 흐름 예시 아이디 nophone. 앱: `LoginChallenge.maskedPhone` null → `SmsUnavailableModal`. SmsVerify 스토리의 "(임의 작업: 간격)" 표시 삭제(간격 확인 완료). 검증: Storybook · 앱 nophone → 불가 안내(255 높이, 버튼 [확인]만) → 확인으로 닫힘

### 로그인 · SMS 인증 상태별 문구 (Figma 28721:69202) — 2026-11-17
- 기준: LOGIN STATE & FEEDBACK RULE 표 — 문구 · 표시 위치를 그대로 적용. 문구는 `features/auth/login/components/loginMessages.ts`(`LOGIN_MESSAGES` · 공통 `COMMON_ERROR_MESSAGE`), 실패 사유는 `LoginError(code, retryAfter)`
- 로그인: 불일치 → 비밀번호 아래 문구, 5회 실패 잠김 · 잠금 계정 · 사용 불가 · 시스템 오류 · 서버/통신 오류 → Alert(로그인 화면 유지)
- SMS 인증: 미입력 → [완료] 비활성, 불일치 · 만료 · 발송 실패 → 인증번호 아래 빨간 문구(모달 유지, 발송 실패면 [완료] 비활성 · 재발송으로 재시도), 재발송 대기시간 · 횟수 초과 → 재발송 아래 빨간 문구 + [재발송] 비활성(대기는 시간이 지나면 다시 활성), 5회 실패 잠김 → 모달 닫고 로그인 화면 Alert, 세션 만료 → 모달 위 Alert → [확인] 후 로그인 화면, 서버/통신 오류 → Alert(모달 유지)
- 디자인 시스템: `VerifyCodeField` `resendDisabled`(SMS 인증 문구는 모두 입력 아래 빨강 — 사용자 확정, 회색 안내 notice는 만들었다가 삭제), Modal 설명 문구 줄바꿈 문자 그대로(`white-space: pre-line` — 두 줄 Alert)
- 예시 API(임의 작업): 아이디 locked · disabled · error · network · nophone · sendfail, 비밀번호 password(5회 틀리면 잠김), 인증번호 123456 · 재발송 30초 대기 · 3회까지 · 로그인 인증 세션 10분(전에는 999999 입력 시 세션 만료 → 인증 시간이 남았는데 만료로 보여 시간 기준으로 바꿈)
- (임의 작업) 재발송 성공 안내 Alert "인증번호를 다시 발송했습니다."(표에 없음), 재발송 안내가 불일치 · 만료 문구보다 우선
- Storybook `Patterns/P05 Login Auth`: 같은 규칙으로 다시 작성(문구 · 예시 계정 · 세션 10분), 스토리 SmsSendFailed · SmsResendWait · SmsResendLimit 추가, 가이드에 상태별 처리 표
- 검증: 디자인 시스템 typecheck · lint · build, 앱 tsc · prettier, 브라우저에서 위 상태 전부 확인(문구 · 위치 · 버튼 비활성 · 대기 후 재활성), 에러 없음
