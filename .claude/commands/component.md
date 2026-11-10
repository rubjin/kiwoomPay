---
description: 컴포넌트 1개를 brief 규칙대로 제작 (tsx·module.scss·stories·index + MDX 가이드)
argument-hint: "<컴포넌트 이름> [시안 링크·추가 지시]"
---
컴포넌트 제작: $ARGUMENTS

brief 3·5·6번 규칙을 따른다. 체크리스트:
- 위치: brief 3번 폴더 구조의 해당 폴더. 파일은 `Name.tsx · Name.module.scss · Name.stories.tsx · index.ts`
- `forwardRef`, className/style/HTML 속성 pass-through, variant·size(sm/md/lg)·state는 문자열 유니온 prop
- form 계열은 controlled/uncontrolled 모두 지원. 시맨틱 HTML과 포커스 표시 유지
- 복합 컴포넌트는 Compound 패턴
- 스타일: `@use` 로 `styles/tokens` 진입점만 참조, 값 하드코딩 금지, Primitive 직접 참조 금지
  클래스명은 단순하게(`.button`, `.primary`, `.small`), `clsx`로 조합, 중첩 최대 2단계, 요소·ID 선택자 금지
- 어드민 상태: compact 밀도, 말줄임, 로딩/비활성/에러/빈 상태
- 시안이 없으면 `TODO(시안)` 임시값. 필요한 토큰이 없으면 만들지 말고 보고한다
- `src/index.ts`에 named export 추가
- Storybook MDX 가이드: 사용 목적, variant/size/state 목록, 사용 예시, Do/Don't
- 외부 라이브러리가 필요하면 이유·대안 제시 후 확인받는다

끝나면 "만든 것 / 한 가정 / 다음 할 일"을 짧게 요약하고 `docs/ai/status.md`를 갱신하고 커밋 메시지를 작성(brief 8번, 커밋은 실행하지 않음)한다.
