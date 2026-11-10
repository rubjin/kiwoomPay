import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import { Tooltip, type TooltipPlacement } from './Tooltip';
import styles from './Tooltip.module.scss';

export interface InfoTipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'content'> {
  /** 보조 설명 문구 */
  content: ReactNode;
  /** 선호 위치 (기본 bottom) */
  placement?: TooltipPlacement;
  /** Info 아이콘 크기 (기본 20, 시안) */
  size?: 16 | 20;
  /** Hover 후 표시까지 지연 (기본 200ms) */
  delay?: number;
  /** 표시 여부 (controlled) */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Info 아이콘 + Tooltip. 라벨 · 제목 옆에서 용어 · 정책 같은 보조 설명을 보여준다.
 *
 * ```tsx
 * <Field label={<>보유 메뉴 권한 <InfoTip content="현재 사용자에게 부여된 …" /></>}>…</Field>
 * ```
 */
export const InfoTip = forwardRef<HTMLButtonElement, InfoTipProps>(
  (
    {
      content,
      placement,
      size = 20,
      delay,
      open,
      defaultOpen,
      onOpenChange,
      disabled,
      className,
      'aria-label': ariaLabel = '도움말',
      ...rest
    },
    ref,
  ) => (
    <Tooltip
      content={content}
      placement={placement}
      delay={delay}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
    >
      <button
        {...rest}
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        disabled={disabled}
        className={clsx(styles.infoTip, className)}
      >
        <Icon name="info-circle" size={size} />
      </button>
    </Tooltip>
  ),
);
InfoTip.displayName = 'InfoTip';
