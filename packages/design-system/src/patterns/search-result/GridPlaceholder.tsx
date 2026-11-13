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
}

export interface GridPlaceholderProps<T> {
  columns: GridPlaceholderColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** 앞에 선택 체크박스 열 */
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  /** 행이 없을 때 머리 아래에 보여줄 내용 (예: 결과 없음 안내). IBSheet의 데이터 없음 메시지 자리 */
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
              <td className={styles.gridEmpty} colSpan={columns.length + (selectable ? 1 : 0)}>
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => {
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
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={styles.gridCell}
                    style={{ textAlign: column.align ?? 'center' }}
                  >
                    {column.render
                      ? column.render(row)
                      : String((row as Record<string, unknown>)[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
