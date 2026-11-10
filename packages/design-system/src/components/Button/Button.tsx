import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
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
  /** API 처리 중. 스피너를 보여주고 클릭을 막는다 (버튼 크기는 유지) */
  loading?: boolean;
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

function Spinner() {
  return (
    <svg className={styles.spinnerIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    variant = 'primary',
    appearance = 'solid',
    size = 'md',
    loading = false,
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
        {iconOnly ? (
          <span className={styles.icon}>{icon}</span>
        ) : (
          <>
            {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
            <span className={styles.label}>{children}</span>
            {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
          </>
        )}
      </span>
      {loading && (
        <span className={styles.spinner}>
          <Spinner />
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
