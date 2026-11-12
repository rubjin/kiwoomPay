import type { CSSProperties, ReactNode } from 'react';

// Storybook 예시 전용: 케이스 이름 · 설명 + 내용 칸.
// 코드 복사(Show code)에서는 감싸기가 빠지고 이름 · 설명이 주석으로 남는다 (.storybook/sourceTransform.ts)
export interface CaseProps {
  /** 케이스 이름 (한 줄) */
  label: string;
  /** 설명 (최대 2줄 자리를 잡아 같은 줄 칸의 내용 위치가 맞는다) */
  description?: string;
  /** 칸 폭 (기본 200) */
  width?: CSSProperties['width'];
  /** 칸 최소 높이 — 아래로 펼쳐지는 패널이 다음 줄과 겹치지 않게 확보 */
  height?: CSSProperties['minHeight'];
  children: ReactNode;
}

const head: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 'var(--kp-space-8)',
  font: '400 12px/18px Pretendard, sans-serif',
  color: 'var(--kp-color-text-secondary)',
};
const name: CSSProperties = { fontWeight: 700, color: 'var(--kp-color-text-heading)' };

export function Case({ label, description, width = 200, height, children }: CaseProps) {
  return (
    <div style={{ width, minHeight: height }}>
      <div style={{ ...head, minHeight: description ? 54 : undefined }}>
        <span style={name}>{label}</span>
        {description && <span>{description}</span>}
      </div>
      {children}
    </div>
  );
}

/** 케이스 칸을 가로로 나열 (좁으면 줄바꿈) */
export const caseRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-16)',
  alignItems: 'flex-start',
};
