import clsx from 'clsx';
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import type { FieldFeedback, FieldSize } from './fieldContext';
import styles from './FieldBox.module.scss';

// 모든 입력 컴포넌트(TextField, SelectBox, DateField …)가 공유하는 박스. 패키지 내부용이다.

export interface FieldBoxProps extends HTMLAttributes<HTMLDivElement> {
  size: FieldSize;
  feedback?: FieldFeedback;
  disabled?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  /** 포커스 스타일을 강제로 표시 (SelectBox가 열려 있을 때) */
  active?: boolean;
  /** 열린 SelectBox에서 스크롤·로딩·빈 상태일 때: 테두리 2px, 번짐 없음 */
  strong?: boolean;
  /** 여러 줄 입력(TextArea). 높이가 내용에 따라 늘어난다 */
  multiline?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const FieldBox = forwardRef<HTMLDivElement, FieldBoxProps>(
  (
    {
      size,
      feedback,
      disabled,
      readOnly,
      fullWidth,
      active,
      strong,
      multiline,
      leading,
      trailing,
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <div
      {...rest}
      ref={ref}
      className={clsx(
        styles.box,
        styles[size],
        feedback && styles[feedback],
        disabled && styles.disabled,
        readOnly && styles.readOnly,
        fullWidth && styles.fullWidth,
        active && styles.active,
        strong && styles.strong,
        multiline && styles.multiline,
        className,
      )}
    >
      {leading && <span className={styles.leading}>{leading}</span>}
      {children}
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </div>
  ),
);
FieldBox.displayName = 'FieldBox';

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 날짜 입력: YYYY-MM-DD 10자 기준으로 폭이 정해진다 */
  date?: boolean;
}

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
  ({ date, className, ...rest }, ref) => (
    <input {...rest} ref={ref} className={clsx(styles.input, date && styles.date, className)} />
  ),
);
FieldInput.displayName = 'FieldInput';

export const FieldTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...rest }, ref) => (
  <textarea {...rest} ref={ref} className={clsx(styles.input, styles.textarea, className)} />
));
FieldTextarea.displayName = 'FieldTextarea';

/** 입력값 뒤에 붙는 단위·접미사 (예: 원) */
export function FieldSuffix({ children }: { children: ReactNode }) {
  return <span className={styles.suffix}>{children}</span>;
}

/** 시작일 ~ 종료일 사이의 구분자 */
export function FieldSeparator({ filled }: { filled?: boolean }) {
  return <span className={clsx(styles.separator, filled && styles.filled)}>~</span>;
}

/** trailing 영역의 아이콘 (20×20) */
export function FieldIcon({ children }: { children: ReactNode }) {
  return <span className={styles.icon}>{children}</span>;
}

interface FieldIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** muted: 지우기처럼 옅은 아이콘 */
  tone?: 'default' | 'muted';
}

/** trailing 영역의 아이콘 버튼 (지우기, 달력 열기 등) */
export const FieldIconButton = forwardRef<HTMLButtonElement, FieldIconButtonProps>(
  ({ tone = 'default', type = 'button', className, ...rest }, ref) => (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={clsx(styles.iconButton, tone === 'muted' && styles.muted, className)}
    />
  ),
);
FieldIconButton.displayName = 'FieldIconButton';

/** 글자수 카운터 (TextArea 우측 하단) */
export function FieldCounter({ children }: { children: ReactNode }) {
  return <span className={styles.counter}>{children}</span>;
}
