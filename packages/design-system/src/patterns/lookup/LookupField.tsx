import clsx from 'clsx';
import { forwardRef, type ChangeEvent, type CSSProperties, type ReactNode } from 'react';
import { Button } from '../../components/Button';
import { TextField, type TextFieldProps } from '../../components/field';
import { Icon } from '../../components/Icon';
import styles from './LookupField.module.scss';

export interface LookupFieldProps extends Omit<TextFieldProps, 'leadingIcon' | 'onChange'> {
  /** [찾기] → Lookup 팝업(P03)을 연다. 선택 결과를 value에 반영하는 것은 화면이 한다 */
  onFind?: () => void;
  /** 버튼 문구 (기본 '찾기') */
  findLabel?: ReactNode;
  /** 직접 입력 */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** 입력 박스 폭 (기본: 글자 폭) */
  inputWidth?: CSSProperties['width'];
}

/**
 * P03 Lookup → Apply의 호출 필드: 검색 아이콘 입력 + [찾기].
 * 직접 입력도 되고, [찾기]로 팝업에서 골라 채울 수도 있다. 팝업을 취소하면 값은 그대로 둔다.
 *
 * ```tsx
 * <Field label="사업자번호">
 *   <LookupField placeholder="사업자번호를 입력해주세요" value={bizNo} onChange={setBizNo} onFind={openBizLookup} />
 * </Field>
 * ```
 */
export const LookupField = forwardRef<HTMLInputElement, LookupFieldProps>(
  (
    { onFind, findLabel = '찾기', onChange, inputWidth, size, disabled, className, style, ...rest },
    ref,
  ) => (
    <span className={clsx(styles.lookupField, className)} style={style}>
      <TextField
        {...rest}
        ref={ref}
        size={size}
        disabled={disabled}
        leadingIcon={<Icon name="search" size={size === 'sm' ? 16 : 20} />}
        style={{ width: inputWidth }}
        onChange={(event) => onChange?.(event.target.value, event)}
      />
      <Button
        variant="neutral"
        appearance="line"
        size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
        disabled={disabled}
        onClick={onFind}
      >
        {findLabel}
      </Button>
    </span>
  ),
);
LookupField.displayName = 'LookupField';
