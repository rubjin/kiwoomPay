import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';
import styles from './ControlGroup.module.scss';

export interface ControlGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** 사이 간격: md 8(기본, 같은 형태) · lg 16(형태가 다른 세트끼리 — 세트마다 ControlGroup) */
  spacing?: 'md' | 'lg';
  /** 남는 폭을 채움 — 안의 fullWidth 입력이 늘어난다 (예: 예금주 입력 + [예금주 조회]) */
  grow?: boolean;
}

/**
 * 같은 형태로 붙는 컨트롤 묶음 (사이 8): 입력 + 버튼, 버튼 + 버튼.
 *
 * 간격 규칙
 * - 입력 + 버튼 · 버튼 + 버튼: 8 → `ControlGroup`
 * - 칸 안 라벨 + 입력: 12 (FormTable 칸 기본 간격)
 * - 형태가 다른 묶음 사이: 16 (예: 제목 줄 [이력조회] ↔ [추가][삭제]) → 세트끼리는 `spacing="lg"`
 *
 * ```tsx
 * <ControlGroup spacing="lg">
 *   <ControlGroup>[정보일괄변경] [키움저축계좌통지]</ControlGroup>
 *   <ControlGroup>[새로고침] [저장]</ControlGroup>
 * </ControlGroup>
 * ```
 */
export const ControlGroup = forwardRef<HTMLDivElement, ControlGroupProps>(
  ({ spacing = 'md', grow = false, className, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.group, spacing === 'lg' && styles.lg, grow && styles.grow, className)}
    />
  ),
);
ControlGroup.displayName = 'ControlGroup';
