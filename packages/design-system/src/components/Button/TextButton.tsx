import clsx from 'clsx';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from 'react';
import styles from './TextButton.module.scss';

export type TextButtonVariant = 'primary' | 'neutral';
export type TextButtonSize = 'sm' | 'md';

export interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TextButtonVariant;
  /** sm 12px · md 13px */
  size?: TextButtonSize;
}

/** 화면 안에서 기능을 실행하는 텍스트 액션(이력조회, 전체보기 등). 배경·테두리 없음 */
export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  ({ variant = 'primary', size = 'md', type = 'button', className, ...rest }, ref) => (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={clsx(styles.textButton, styles[variant], styles[size], className)}
    />
  ),
);

TextButton.displayName = 'TextButton';

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: TextButtonSize;
  /** 이동을 막고 비활성 색으로 표시한다 */
  disabled?: boolean;
}

/** 다른 화면·외부 페이지로 이동하는 링크. 모든 상태에서 밑줄을 유지한다 */
export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ size = 'md', disabled = false, href, className, onClick, ...rest }, ref) => {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <a
        {...rest}
        ref={ref}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        className={clsx(
          styles.textButton,
          styles.link,
          styles.primary,
          styles[size],
          disabled && styles.disabled,
          className,
        )}
        onClick={handleClick}
      />
    );
  },
);

TextLink.displayName = 'TextLink';
