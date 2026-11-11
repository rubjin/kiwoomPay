import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styles from './CpidListItem.module.scss';

export interface CpidListItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'title' | 'name'
> {
  /** CPID (첫 줄, 굵게) */
  cpid: ReactNode;
  /** 가맹점명 (둘째 줄) */
  merchantName?: ReactNode;
  /** 오른쪽 위 상태. 보통 `<Badge size="sm" dot>` */
  status?: ReactNode;
  /** 선택된 항목 (Primary 테두리 · 배경) */
  selected?: boolean;
}

/**
 * CPID 목록의 한 항목. 누르면 선택되는 버튼이며 선택 상태는 화면이 관리한다(`selected` + `onClick`).
 * 긴 CPID · 가맹점명은 한 줄 말줄임된다.
 */
export const CpidListItem = forwardRef<HTMLButtonElement, CpidListItemProps>(
  ({ cpid, merchantName, status, selected = false, className, type = 'button', ...rest }, ref) => (
    <button
      {...rest}
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={clsx(styles.item, selected && styles.selected, className)}
    >
      <span className={styles.cpid}>{cpid}</span>
      {status && <span className={styles.status}>{status}</span>}
      {merchantName && <span className={styles.name}>{merchantName}</span>}
    </button>
  ),
);

CpidListItem.displayName = 'CpidListItem';
