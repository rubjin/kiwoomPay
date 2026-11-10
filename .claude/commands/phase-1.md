---
description: Phase 1 — 워크스페이스·build-tokens·base 스타일·Storybook·JSP 연동 세팅
argument-hint: "[추가 지시]"
---
brief의 "7. 진행 방식 > Phase 1"을 수행한다. 추가 지시: $ARGUMENTS

시작 전 확인:
- `docs/ai/status.md`에 Phase 0 확정안이 있는지 본다. 없으면 진행하지 말고 Phase 0 확정을 요청한다.
- 지원 브라우저 등 미정 결정이 세팅에 영향을 주면 먼저 질문한다.

범위:
- pnpm 워크스페이스(루트 package.json, pnpm-workspace.yaml), packages/design-system 패키지 설정
- `scripts/build-tokens.mjs` (Phase 0 확정 규칙 기준) → `_generated.scss` 생성, `_index.scss` 진입점
- `src/styles/{base,mixins}`, ESLint·Prettier·Stylelint, Storybook, Vite 라이브러리 빌드
- JSP 연동: 빌드 산출물 위치, JSP에서 CSS/JS 로드·React 마운트 예시
- 토큰 변경 절차 문서(Figma 수정 → JSON 재내보내기 → build-tokens → _generated 갱신)

끝나면 "만든 것 / 한 가정 / 다음 할 일"을 요약하고 `docs/ai/status.md`를 갱신하고 커밋 메시지를 작성(brief 8번, 커밋은 실행하지 않음)한 뒤 사용자 확인을 기다린다.
