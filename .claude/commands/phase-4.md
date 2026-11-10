---
description: Phase 4 — 내비게이션·레이아웃·데이터 표시 (LNB, Header, Footer, WorkTab, display, chart&kpi)
argument-hint: "[대상 컴포넌트 — 생략 시 Phase 4 전체]"
---
brief의 "7. 진행 방식 > Phase 4"를 수행한다. 대상: $ARGUMENTS (비어 있으면 LNB, Header, Footer, CompactNavigation, WorkTab, display 계열, PageLayout, Grid, chart&kpi 전체)

- 컴포넌트마다 `/component` 명령의 규칙을 그대로 따른다.
- 가이드에만 있는 항목(chart&kpi, data display, overlay&feedback, page notice)은 구현 전에 어떤 컴포넌트로 구성할지 먼저 제안한다.
- Chart 라이브러리가 미정이면 이유·대안을 제시하고 확인받은 뒤 진행한다.
- 반응형 대상(Header, LNB/CompactNavigation, PageLayout, Grid, Table류)은 `respond-to` mixin을 쓰고, 모바일 시안이 없으면 필요한 동작만 정리해 요청한다.

끝나면 "만든 것 / 한 가정 / 다음 할 일"을 요약하고 `docs/ai/status.md`를 갱신하고 커밋 메시지를 작성(brief 8번, 커밋은 실행하지 않음)한 뒤 사용자 확인을 기다린다.
