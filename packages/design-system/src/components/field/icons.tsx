import type { SVGProps } from 'react';

// Icon 컴포넌트(Phase 2) 전 임시 아이콘. 20×20 프레임, 색은 currentColor.
const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const SearchIcon = () => (
  <svg {...base}>
    <circle cx="9" cy="9" r="6" />
    <path d="M13.5 13.5L16.5 16.5" />
  </svg>
);

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

export const ChevronDownIcon = () => (
  <svg {...base}>
    <path d="M3.5 6.5L10 13l6.5-6.5" />
  </svg>
);

export const ChevronUpIcon = () => (
  <svg {...base}>
    <path d="M3.5 13.5L10 7l6.5 6.5" />
  </svg>
);

export const CalendarIcon = () => (
  <svg {...base}>
    <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
    <path d="M3 8.5h14M7 3v3M13 3v3" />
  </svg>
);
