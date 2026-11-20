import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Stack.module.scss';

export type StackGap = 0 | 4 | 8 | 12 | 16 | 24;

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** 사이 간격 (Spacing Scale). 기본 16 — 형태가 다른 묶음 사이 */
  gap?: StackGap;
  /** 태그 (기본 div). 팝업 본문의 영역 묶음은 section, 표 칸 안 두 줄은 span, 이름 · 값 목록은 dl */
  as?: 'div' | 'section' | 'span' | 'dl';
  /** row: 가로로 나란히 (글자 · 상자 배치. 입력 · 버튼 묶음은 ControlGroup) */
  direction?: 'column' | 'row';
  /** between: 양끝 정렬 (제목 ↔ 버튼 줄) */
  justify?: 'start' | 'between';
  /** 교차축 맞춤 (기본 stretch) */
  align?: 'stretch' | 'start' | 'center' | 'baseline';
  /** 넘치면 줄바꿈 (row) */
  wrap?: boolean;
  /** 2: 같은 폭 2단 격자 */
  columns?: 2;
  /** 위아래 안쪽 여백 — 표 칸 안 내용이 줄 높이보다 클 때 (4 · 8) */
  paddingBlock?: 4 | 8;
}

/**
 * 묶음 — 위에서 아래로(기본) 또는 가로로 쌓고 사이 간격만 정한다. 입력 · 버튼 가로 묶음은 `ControlGroup`.
 * 간격 · 배치를 인라인 스타일(`style={{ display: 'flex', flexDirection: 'column', gap }}`)로 만들지 않는다 —
 * 가로(`direction="row"`) · 양끝(`justify="between"`) · 2단(`columns={2}`) · 칸 안 여백(`paddingBlock`)도 옵션으로.
 *
 * ```tsx
 * <Stack>                       // 팝업 본문: 안내 ↔ 표 ↔ 표 16
 *   <Infobox>…</Infobox>
 *   <Stack as="section" gap={8}> // 소제목 ↔ 표 8
 *     <SectionHeading as="h3" title="요청 정보" />
 *     <FormTable>…</FormTable>
 *   </Stack>
 * </Stack>
 * <Stack direction="row" justify="between" align="center">…</Stack> // 제목 ↔ 버튼 줄
 * ```
 */
export const Stack = forwardRef<HTMLElement, StackProps>(
  (
    {
      gap = 16,
      as: Tag = 'div',
      direction = 'column',
      justify = 'start',
      align = 'stretch',
      wrap = false,
      columns,
      paddingBlock,
      className,
      ...rest
    },
    ref,
  ) => (
    <Tag
      {...rest}
      // as마다 ref 요소 타입이 달라 HTMLElement로 받는다
      ref={ref as never}
      className={clsx(
        styles.stack,
        styles[`gap${gap}`],
        direction === 'row' && styles.row,
        wrap && styles.wrap,
        justify === 'between' && styles.justifyBetween,
        align === 'start' && styles.alignStart,
        align === 'center' && styles.alignCenter,
        align === 'baseline' && styles.alignBaseline,
        columns === 2 && styles.columns2,
        paddingBlock === 4 && styles.paddingBlock4,
        paddingBlock === 8 && styles.paddingBlock8,
        className,
      )}
    />
  ),
);
Stack.displayName = 'Stack';
