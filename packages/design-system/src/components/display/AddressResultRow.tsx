import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button';
import styles from './AddressSearch.module.scss';

export interface AddressResultRowProps extends HTMLAttributes<HTMLDivElement> {
  /** 우편번호 */
  zipCode: ReactNode;
  /** 도로명 주소 */
  roadAddress: ReactNode;
  /** 지번 주소 (없으면 줄을 그리지 않음) */
  jibunAddress?: ReactNode;
  /** [선택]. 없으면 버튼을 그리지 않는다 */
  onSelect?: () => void;
  selectLabel?: ReactNode;
}

/** 주소 검색 결과 한 줄: 우편번호 · 도로명(굵게) / [지번] 지번 주소 · [선택] */
export const AddressResultRow = forwardRef<HTMLDivElement, AddressResultRowProps>(
  (
    { zipCode, roadAddress, jibunAddress, onSelect, selectLabel = '선택', className, ...rest },
    ref,
  ) => (
    <div {...rest} ref={ref} className={clsx(styles.row, className)}>
      <div className={styles.address}>
        <p className={styles.roadLine}>
          <span className={styles.zip}>{zipCode}</span>
          <span className={styles.road}>{roadAddress}</span>
        </p>
        {jibunAddress !== undefined && (
          <p className={styles.jibunLine}>
            <span className={styles.tag}>지번</span>
            <span className={styles.jibun}>{jibunAddress}</span>
          </p>
        )}
      </div>
      {onSelect && (
        <Button size="sm" appearance="line" onClick={onSelect}>
          {selectLabel}
        </Button>
      )}
    </div>
  ),
);
AddressResultRow.displayName = 'AddressResultRow';
