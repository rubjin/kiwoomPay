# 진행 현황 · 확정 결정

> 세션이 바뀌어도 이어서 작업할 수 있도록 AI가 단계 종료 시마다 갱신한다.
> 사람이 직접 고쳐도 된다. 여기 적힌 확정 결정은 `brief.md`보다 우선한다.

## 현재 단계
- Phase 0 설계안 검토 대기 — 입력: `tokens/figma/color.json`(변수 60, 모드 "Mode 1"), `tokens/figma/space.json`(space 12개 0~80, 모드 "Default", scope GAP), `tokens/figma/text-styles.json`(텍스트 스타일 29)
- 원본 JSON 점검(2026-11-10): JSON 문법·참조·hex↔components 일치 모두 정상. 내용 보존 수정 필요 없음 → 파일 손대지 않음. 개선은 Figma에서 고치고 다시 내보낸다(아래 열린 질문 참고)

## 확정 결정
| 항목 | 결정 | 확정일 |
| --- | --- | --- |
| 브랜드 메인 컬러 | 미정 (`#______`) | - |
| 지원 브라우저 / IE | 미정 | - |
| 아이콘 소스 포맷 | 미정 | - |
| Chart 라이브러리 | 미정 | - |
| DatePicker 외부 라이브러리 사용 여부 | 미정 | - |
| 브레이크포인트 컬렉션 구조 | 미정 (Phase 0에서 제안) | - |

## 열린 질문
- [Q1] 브랜드 메인 컬러 = `Primary/500 #2484C6` 맞는지
- [Q2] 파일명이 "Internal_Admin"인데, 가맹점관리자·영업대행사도 이 토큰을 그대로 쓰는지
- [Q3] Color 파일이 Figma에서 컬렉션 1개(모드 "Mode 1")인지. Primitives / Semantic 컬렉션 분리 가능한지
- [Q4] Spacing·radius·border width·shadow·z-index·motion·breakpoint·control 크기(sm/md/lg) 토큰을 Figma에 추가할 계획과 일정 (space는 `space.json`으로 받음. 나머지는 아직 없음. space scope가 GAP만 있어 padding에도 쓰려면 Figma에서 scope 추가 필요)
- [Q5] 배경(surface/page/hover/selected), 인터랙션(primary hover/pressed), 포커스 링, 딤(overlay) 색 Semantic 추가 여부. 현재 Primary/600·700 등을 컴포넌트에서 직접 쓰고 있는지
- [Q6] Status 색(raw hex 12개)·Chart Category 02~06을 Primitive로 올리고 alias로 바꿀지, 지금 값을 그대로 둘지
- [Q7] Typography 이름 `Typo / 14 / Regular`(값 기준)를 그대로 쓸지, 역할 이름(예: body/md)을 추가할지
- [Q8] Pretendard 로딩 방식(CDN / self-host / 사용자 PC 설치 가정)과 fallback 폰트 스택
- [Q9] size(sm/md/lg)를 Figma 모드로 만들지, 이름에 넣은 단일 변수(`control/height/sm`)로 만들지 → Phase 0 제안은 단일 변수
- [Q10] Figma 변수에 Code syntax(Web) 일괄 입력할 담당/방법(플러그인 or 수동)

## 단계별 요약
<!-- 각 Phase 종료 시 아래 형식으로 추가
### Phase N — YYYY-MM-DD
- 만든 것:
- 한 가정:
- 다음 할 일:
-->
