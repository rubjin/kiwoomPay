import clsx from 'clsx';
import { createContext, forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react';
import styles from './RecordForm.module.scss';

const LABEL_WIDTH = 138; // Figma KWPC07010101 label 칸

const TemplateContext = createContext<string>('');

export interface FormTableProps extends HTMLAttributes<HTMLDivElement> {
  /** 라벨-값 쌍의 수 (기본 4). 칸 = 라벨 138 + 값(같은 폭) × N */
  pairs?: number;
  /** 직접 지정하는 열 구성 (예: 담당자 표 "36px repeat(5, minmax(0, 1fr))"). 있으면 pairs 무시 */
  template?: string;
  children: ReactNode;
}

const FormTableRoot = forwardRef<HTMLDivElement, FormTableProps>(
  ({ pairs = 4, template, className, children, ...rest }, ref) => {
    const columns = template ?? `repeat(${pairs}, ${LABEL_WIDTH}px minmax(0, 1fr))`;
    return (
      <TemplateContext.Provider value={columns}>
        <div {...rest} ref={ref} role="group" className={clsx(styles.table, className)}>
          {children}
        </div>
      </TemplateContext.Provider>
    );
  },
);
FormTableRoot.displayName = 'FormTable';

/** 한 줄. 칸은 Label · Cell · Head를 순서대로 넣는다 */
const FormTableRow = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...rest }, ref) => {
    const columns = useContext(TemplateContext);
    return (
      <div
        {...rest}
        ref={ref}
        className={clsx(styles.row, className)}
        style={{ gridTemplateColumns: columns, ...style }}
      />
    );
  },
);
FormTableRow.displayName = 'FormTable.Row';

export interface FormTableLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** 필수 표시 * */
  required?: boolean;
  /** 입력 요소 id (label for) */
  htmlFor?: string;
}

/** 라벨 칸 (회색 · 12 Bold) */
const FormTableLabel = forwardRef<HTMLDivElement, FormTableLabelProps>(
  ({ required, htmlFor, className, children, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.label, className)}>
      {htmlFor ? <label htmlFor={htmlFor}>{children}</label> : children}
      {required && (
        <span className={styles.required} aria-hidden>
          *
        </span>
      )}
    </div>
  ),
);
FormTableLabel.displayName = 'FormTable.Label';

export interface FormTableCellProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 차지하는 격자 칸 수 (기본 1). 쌍 구성에서 값 1칸 = 1, 값 2칸 넓이(라벨 하나 포함) = 3,
   * 줄 끝까지(라벨 1개 뒤) = 7
   */
  colSpan?: number;
  /** 가운데 정렬 (체크박스 칸 등) */
  center?: boolean;
}

/** 값 칸 (흰 배경). 입력 요소는 fullWidth로 채운다 */
const FormTableCell = forwardRef<HTMLDivElement, FormTableCellProps>(
  ({ colSpan = 1, center, className, style, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.cell, center && styles.center, className)}
      style={colSpan > 1 ? { gridColumn: `span ${colSpan}`, ...style } : style}
    />
  ),
);
FormTableCell.displayName = 'FormTable.Cell';

/** 머리 칸 (목록형 표의 열 이름: 회색 · 가운데 · 높이 44) */
export interface FormTableHeadProps extends HTMLAttributes<HTMLDivElement> {
  /** md 44(기본) · sm 36 (머리가 "항목" 한 칸뿐인 목록 — Figma CPID 담당자 정보) */
  size?: 'md' | 'sm';
}

const FormTableHead = forwardRef<HTMLDivElement, FormTableHeadProps>(
  ({ size = 'md', className, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      role="columnheader"
      className={clsx(styles.head, size === 'sm' && styles.headSm, className)}
    />
  ),
);
FormTableHead.displayName = 'FormTable.Head';

/**
 * P02 Record → Form 의 라벨-값 표 (Figma KWPC07010101 기본 정보 · 담당자 정보).
 * 한 줄 52(입력 40 + 위아래 6), 라벨 138, 값 칸은 남는 폭을 나눠 갖는다.
 *
 * ```tsx
 * <FormTable>
 *   <FormTable.Row>
 *     <FormTable.Label required>사업자번호</FormTable.Label>
 *     <FormTable.Cell><TextField fullWidth /></FormTable.Cell>
 *     <FormTable.Label>업종</FormTable.Label>
 *     <FormTable.Cell colSpan={5}><TextField fullWidth /></FormTable.Cell>
 *   </FormTable.Row>
 * </FormTable>
 * ```
 */
/** 값 칸 안의 작은 라벨 (예: 주소 칸의 국가 · 우편번호 · 주소 — 12 Bold) */
const FormTableInlineLabel = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...rest }, ref) => (
    <span {...rest} ref={ref} className={clsx(styles.inlineLabel, className)} />
  ),
);
FormTableInlineLabel.displayName = 'FormTable.InlineLabel';

export const FormTable = Object.assign(FormTableRoot, {
  InlineLabel: FormTableInlineLabel,
  Row: FormTableRow,
  Label: FormTableLabel,
  Cell: FormTableCell,
  Head: FormTableHead,
});
