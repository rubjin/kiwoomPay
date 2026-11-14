import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Stack.module.scss';

export type StackGap = 0 | 4 | 8 | 12 | 16 | 24;

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** 위아래 간격 (Spacing Scale). 기본 16 — 형태가 다른 묶음 사이 */
  gap?: StackGap;
  /** 태그 (기본 div). 팝업 본문의 영역 묶음은 section, 표 칸 안 두 줄은 span */
  as?: 'div' | 'section' | 'span';
}

/**
 * 세로 묶음 — 위에서 아래로 쌓고 사이 간격만 정한다. 가로 묶음은 `ControlGroup`.
 * 간격을 인라인 스타일(`style={{ display: 'flex', flexDirection: 'column', gap }}`)로 만들지 않는다.
 *
 * ```tsx
 * <Stack>                       // 팝업 본문: 안내 ↔ 표 ↔ 표 16
 *   <Infobox>…</Infobox>
 *   <Stack as="section" gap={8}> // 소제목 ↔ 표 8
 *     <SectionHeading as="h3" title="요청 정보" />
 *     <FormTable>…</FormTable>
 *   </Stack>
 * </Stack>
 * ```
 */
export const Stack = forwardRef<HTMLElement, StackProps>(
  ({ gap = 16, as: Tag = 'div', className, ...rest }, ref) => (
    <Tag
      {...rest}
      // as마다 ref 요소 타입이 달라 HTMLElement로 받는다
      ref={ref as never}
      className={clsx(styles.stack, styles[`gap${gap}`], className)}
    />
  ),
);
Stack.displayName = 'Stack';
