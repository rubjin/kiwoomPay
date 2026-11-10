---
description: Phase 0 — Figma 토큰 JSON 분석 + SCSS 매핑 설계 (설계안만 출력)
argument-hint: "[JSON 경로 — 생략 시 packages/design-system/tokens/figma/ 전체]"
---
brief의 "7. 진행 방식 > Phase 0"을 수행한다.

입력: $ARGUMENTS (비어 있으면 `packages/design-system/tokens/figma/`의 모든 JSON)
- JSON이 없으면 작업하지 말고 파일을 요청한다. 토큰 이름·값을 새로 만들지 않는다.
- JSON은 수정하지 않는다. 읽기 전용으로 분석한다.

출력 (이 5개 항목만, 코드 파일은 만들지 않는다):
1. 토큰 현황 요약 — 컬렉션/그룹 구조, 변수 개수, Primitive/Semantic/Component 분류
2. brief 4번 설계 원칙 대비 점검 — 어긋난 항목마다 "그대로 유지 / Figma에서 수정 필요 / 코드에서만 보정" 중 하나 제안
3. JSON → SCSS 변수 / `--kp-*` CSS 변수 변환 규칙과 예시 코드 (CSS Modules 공통 로드 구조, Figma Code syntax(Web) 값 포함)
4. 브레이크포인트·size(sm/md/lg) 저장 방식 확인 + 컬렉션/모드 분리 제안(근거 포함)
5. 누락·오류 점검(끊긴 참조, 미사용 변수, 이름 규칙 위반) + 확인 필요한 질문 목록

끝나면 `docs/ai/status.md`의 현재 단계를 "Phase 0 설계안 검토 대기"로, 질문은 "열린 질문"에 기록하고, 커밋 메시지를 작성(brief 8번, 커밋은 실행하지 않음)한 뒤 사용자 확인을 기다린다.
