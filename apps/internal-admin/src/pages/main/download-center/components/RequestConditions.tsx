import { Fragment, type CSSProperties } from 'react';

// 요청 조건 줄 (시안 다운로드요청상세.png 측정: 높이 48 · 왼쪽 16 · 항목 사이 구분선 1 × 20, 간격 20)
// TODO(시안) 같은 모양이 다른 화면에도 나오면 디자인 시스템 컴포넌트로 올린다
const box: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--kp-space-8) var(--kp-space-20)',
  minHeight: 48,
  padding: 'var(--kp-space-8) var(--kp-space-16)',
  background: 'var(--kp-color-bg-page)',
  borderRadius: 4,
};
const item: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: 'var(--kp-space-8)',
};
const label: CSSProperties = { fontSize: 13, color: 'var(--kp-color-text-secondary)' };
const value: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--kp-color-text-heading)',
};
const divider: CSSProperties = { width: 1, height: 20, background: 'var(--kp-color-line-subtle)' };

/** 다운로드 요청 당시 조회조건 (라벨 값 | 라벨 값 …) */
export function RequestConditions({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl style={{ ...box, margin: 0 }}>
      {items.map((c, i) => (
        <Fragment key={c.label}>
          {i > 0 && <span aria-hidden style={divider} />}
          <div style={item}>
            <dt style={label}>{c.label}</dt>
            <dd style={{ ...value, margin: 0 }}>{c.value}</dd>
          </div>
        </Fragment>
      ))}
    </dl>
  );
}
