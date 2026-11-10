---
description: Phase 2 — Foundation (Button, Icon, Field 계열, Selection 계열)
argument-hint: "[대상 컴포넌트 — 생략 시 Phase 2 전체]"
---
brief의 "7. 진행 방식 > Phase 2"를 수행한다. 대상: $ARGUMENTS (비어 있으면 Button, TextButton, Icon, Field 계열, Selection 계열 전체)

- 컴포넌트마다 `/component` 명령의 규칙을 그대로 따른다.
- 시안이 없는 컴포넌트는 시각 값을 추측하지 않고 `TODO(시안)` 임시값을 쓴다. 시안 필요 목록을 따로 정리한다.
- 아이콘 소스 포맷이 미정이면 Icon 작업 전에 질문한다.
- Field/Selection은 `control/*` 공통 토큰을 공유하도록 만든다.

끝나면 "만든 것 / 한 가정 / 다음 할 일"을 요약하고 `docs/ai/status.md`를 갱신하고 커밋 메시지를 작성(brief 8번, 커밋은 실행하지 않음)한 뒤 사용자 확인을 기다린다.
