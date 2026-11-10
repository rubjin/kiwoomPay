---
description: Phase 3 — 중간 복잡도 (Badge, Tab, Pagination, Modal, Tooltip, Date Picker)
argument-hint: "[대상 컴포넌트 — 생략 시 Phase 3 전체]"
---
brief의 "7. 진행 방식 > Phase 3"을 수행한다. 대상: $ARGUMENTS (비어 있으면 Badge, Tab, Pagination, Modal, Tooltip, DatePicker 전체)

- 컴포넌트마다 `/component` 명령의 규칙을 그대로 따른다.
- Modal은 Compound 패턴(Modal.Header / Body / Footer). Calendar Day·Pagination Item 등 하위 조각의 분리 여부는 이유와 함께 제안한다.
- DatePicker 외부 라이브러리 사용 여부가 미정이면 이유·대안을 제시하고 확인받은 뒤 진행한다.
- 반응형 대상(Modal, Pagination, Date Picker, Tab)은 모바일 시안이 없으면 값을 만들지 말고 필요한 동작만 정리해 요청한다.

끝나면 "만든 것 / 한 가정 / 다음 할 일"을 요약하고 `docs/ai/status.md`를 갱신하고 커밋 메시지를 작성(brief 8번, 커밋은 실행하지 않음)한 뒤 사용자 확인을 기다린다.
