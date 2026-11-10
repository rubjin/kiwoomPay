import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'neutral' | 'dark' | 'danger';
export type ButtonAppearance = 'solid' | 'line';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** 역할(위험도)에 따른 색. 화면·팝업당 primary는 1개를 기본으로 한다 */
  variant?: ButtonVariant;
  /** solid: 채움 / line: 테두리 */
  appearance?: ButtonAppearance;
  /** sm 32 · md 40 · lg 48 (높이 px) */
  size?: ButtonSize;
  /** API 처리 중. 로딩 아이콘과 `loadingText`를 보여주고 클릭을 막는다. 색은 Default 그대로 */
  loading?: boolean;
  /** 로딩 중 문구 (기본 "처리 중"). 아이콘 전용 버튼은 아이콘만 바뀐다 */
  loadingText?: ReactNode;
};

/** 텍스트 버튼. 아이콘은 앞(leading) 또는 뒤(trailing) 중 하나만 쓴다 */
type TextContentProps =
  | {
      iconOnly?: false;
      children: ReactNode;
      leadingIcon?: ReactNode;
      trailingIcon?: never;
      icon?: never;
    }
  | {
      iconOnly?: false;
      children: ReactNode;
      leadingIcon?: never;
      trailingIcon?: ReactNode;
      icon?: never;
    };

/** 아이콘 전용 버튼. 정사각형(48·40·32)이고 텍스트가 없으므로 aria-label이 필수다 */
type IconOnlyContentProps = {
  iconOnly: true;
  icon: ReactNode;
  'aria-label': string;
  children?: never;
  leadingIcon?: never;
  trailingIcon?: never;
};

export type ButtonProps = ButtonBaseProps & (TextContentProps | IconOnlyContentProps);

type LooseButtonProps = ButtonBaseProps & {
  children?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  iconOnly?: boolean;
  icon?: ReactNode;
};

// 버튼 크기별 아이콘 크기 (Button Guide: Icon 24 / 20 / 16)
const ICON_SIZE = { lg: 24, md: 20, sm: 16 } as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    variant = 'primary',
    appearance = 'solid',
    size = 'md',
    loading = false,
    loadingText = '처리 중',
    iconOnly = false,
    icon,
    leadingIcon,
    trailingIcon,
    type = 'button',
    className,
    disabled,
    onClick,
    children,
    ...rest
  } = props as LooseButtonProps;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      className={clsx(
        styles.button,
        styles[variant],
        styles[appearance],
        styles[size],
        iconOnly && styles.iconOnly,
        loading && styles.loading,
        className,
      )}
      onClick={handleClick}
    >
      <span className={styles.content}>
        {loading ? (
          <>
            <span className={styles.icon}>
              <Icon name="loading" size={ICON_SIZE[size]} />
            </span>
            {!iconOnly && <span className={styles.label}>{loadingText}</span>}
          </>
        ) : iconOnly ? (
          <span className={styles.icon}>{icon}</span>
        ) : (
          <>
            {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
            <span className={styles.label}>{children}</span>
            {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
          </>
        )}
      </span>
    </button>
  );
});

Button.displayName = 'Button';
