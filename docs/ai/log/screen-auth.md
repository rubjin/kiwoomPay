# 화면: 로그인 (auth)

> 범위: KWPC3000 로그인 · SMS 인증. 이 영역을 작업할 때만 읽는다.
> 확정 결정은 `docs/ai/status.md`가 우선한다. 완료 내역은 남기지 않는다(git log) — 앞으로 참조할 기준 · 가정 · 열린 질문만 적는다.

## 참조

### 상태별 처리 (Figma LOGIN STATE & FEEDBACK RULE 28721:69202)

- 문구는 `features/auth/login/components/loginMessages.ts`(`LOGIN_MESSAGES` · `COMMON_ERROR_MESSAGE`), 실패 사유는 `LoginError(code, retryAfter)`. Storybook `Patterns/P05 Login Auth` 가이드에 같은 표
- 로그인: 불일치 → 비밀번호 아래 문구(Alert 없음). 5회 실패 잠김 · 잠금 계정 · 사용 불가 · 시스템 오류 · 서버/통신 오류 → Alert, 로그인 화면 유지
- SMS 인증: 미입력 → [완료] 비활성. 불일치 · 만료 · 발송 실패 · 재발송 대기 · 재발송 횟수 초과 → **모두 인증번호 아래 빨간 문구**(사용자 확정), 모달 유지. 발송 실패면 [완료] 비활성, 재발송 제한이면 [재발송] 비활성(대기는 시간이 지나면 다시 활성). 문구가 겹치면 재발송 안내 > 만료 > 발송 실패 · 불일치
- SMS 5회 실패 잠김 → 모달 닫고 로그인 화면 Alert. 세션 만료 → 모달 위 Alert → [확인] 후 로그인 화면. 세션 만료는 인증번호 시간(3분)과 다른 로그인 인증 세션 기준
- 휴대전화번호 없음 → SMS 인증 불가 Modal(안내 2줄 + "등록 정보 없음" + [확인]만, 닫기 X 없음)
- Alert 두 줄 문구는 `\n`(Modal 설명이 줄바꿈 유지)

### 간격 (사용자 확정)

- 휴대전화번호 상자 ↔ 인증번호 12, 인증번호 입력 ↔ 오류 문구 4(`VerifyCodeField`만, Field 기본 8). 오류 문구 자리는 미리 잡아 문구가 나와도 Modal 높이 같음

### 예시 API (임의 작업, `login.api.ts`)

- 아이디 locked · disabled · error · network · nophone · sendfail, 비밀번호 password(5회 틀리면 잠김), 인증번호 123456(5회 틀리면 잠김), 재발송 30초 대기 · 3회까지, 로그인 인증 세션 10분
- (임의 작업) 재발송 성공 안내 Alert "인증번호를 다시 발송했습니다."(표에 없음)

## 열린 질문

- [Q57] 로그인 확인 필요: ① 제목 32 ExtraBold는 Figma 텍스트 스타일에 없음(컴포넌트 SCSS 값) ② 입력 중 · 오류 밑줄 색 ③ SMS 인증 Modal Figma 노드(안내 ↔ 상자 12는 PNG 측정) ④ 화면 ID — IA는 KWPC0300, Figma는 KWPC3000 ⑤ 내용 ↔ Footer 최소 간격 40(임시), 가맹점관리자 모바일 시안
