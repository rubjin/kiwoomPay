// 필드 전용 아이콘. 나머지 아이콘은 Icon 컴포넌트를 쓴다.
// 지우기(clear)는 시안에서 색이 필드 토큰(field/icon-muted)을 따르므로 currentColor 기반으로 유지한다.
export const ClearIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8" fill="currentColor" />
    <path
      d="M7.5 7.5l5 5M12.5 7.5l-5 5"
      stroke="var(--kp-color-field-bg)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
