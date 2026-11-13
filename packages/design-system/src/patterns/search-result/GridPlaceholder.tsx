import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import { Checkbox } from '../../components/selection';
import styles from './SearchResult.module.scss';

export interface GridPlaceholderColumn<T> {
  key: string;
  header: ReactNode;
  /** 열 폭(px) */
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => ReactNode;
  /**
   * 위아래 줄의 값이 같으면 셀을 합친다 (IBSheet 셀 병합). 앞쪽 merge 열들도 같아야 합친다
   * — 예: 1depth · 2depth · 3depth 계층 (1depth가 다르면 2depth 이름이 같아도 따로)
   */
  merge?: boolean;
}

export interface GridPlaceholderProps<T> {
  columns: GridPlaceholderColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** 앞에 선택 체크박스 열 */
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  /** 행이 없을 때. 글자면 행 높이 한 줄 가운데 안내, 요소면 그대로 (예: LookupSearchEmpty) */
  empty?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * **IBSheet8 연결 전 임시 미리보기**. 실제 화면의 Grid는 IBSheet8이 담당한다.
 * 패턴 스토리 · 앱 개발 서버에서 결과 영역 모양과 선택 흐름을 확인하는 용도로만 쓴다.
 */
export function GridPlaceholder<T>({
  columns,
  rows,
  rowKey,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  empty,
  className,
  style,
}: GridPlaceholderProps<T>) {
  const keys = rows.map(rowKey);
  const checkedCount = keys.filter((key) => selectedKeys.includes(key)).length;
  const allChecked = rows.length > 0 && checkedCount === rows.length;

  // merge 열: 각 줄의 셀 높이(줄 수). 0이면 위 셀에 합쳐져 그리지 않는다
  const valueOf = (row: T, key: string) => String((row as Record<string, unknown>)[key] ?? '');
  const spans = new Map<string, number[]>();
  const mergeKeys: string[] = [];
  for (const column of columns) {
    if (!column.merge) continue;
    mergeKeys.push(column.key);
    const scope = [...mergeKeys];
    const same = (a: T, b: T) => scope.every((k) => valueOf(a, k) === valueOf(b, k));
    const counts = rows.map(() => 0);
    let start = 0;
    rows.forEach((row, i) => {
      if (i > 0 && same(rows[start] as T, row)) counts[start] = (counts[start] ?? 0) + 1;
      else {
        start = i;
        counts[i] = 1;
      }
    });
    spans.set(column.key, counts);
  }

  const toggle = (key: string) =>
    onSelectionChange?.(
      selectedKeys.includes(key) ? selectedKeys.filter((k) => k !== key) : [...selectedKeys, key],
    );

  return (
    <div className={clsx(styles.grid, className)} style={style}>
      <table className={styles.gridTable}>
        <thead>
          <tr>
            {selectable && (
              <th className={clsx(styles.gridHead, styles.gridCheck)}>
                <Checkbox
                  size="sm"
                  aria-label="전체 선택"
                  checked={allChecked}
                  indeterminate={checkedCount > 0 && !allChecked}
                  disabled={rows.length === 0}
                  onChange={() => onSelectionChange?.(allChecked ? [] : keys)}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={styles.gridHead}
                style={{ width: column.width, minWidth: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && empty !== undefined && (
            <tr>
              <td
                className={typeof empty === 'string' ? styles.gridEmptyText : styles.gridEmpty}
                colSpan={columns.length + (selectable ? 1 : 0)}
              >
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row, rowIndex) => {
            const key = rowKey(row);
            return (
              <tr key={key}>
                {selectable && (
                  <td className={clsx(styles.gridCell, styles.gridCheck)}>
                    <Checkbox
                      size="sm"
                      aria-label="행 선택"
                      checked={selectedKeys.includes(key)}
                      onChange={() => toggle(key)}
                    />
                  </td>
                )}
                {columns.map((column) => {
                  const span = spans.get(column.key)?.[rowIndex] ?? 1;
                  if (span === 0) return null;
                  return (
                    <td
                      key={column.key}
                      rowSpan={span > 1 ? span : undefined}
                      className={styles.gridCell}
                      style={{ textAlign: column.align ?? 'center' }}
                    >
                      {column.render ? column.render(row) : valueOf(row, column.key)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
