import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';
import styles from './InlineFeedback.module.scss';

export type InlineFeedbackTone = 'error' | 'warning' | 'success' | 'info';

export interface InlineFeedbackProps extends HTMLAttributes<HTMLDivElement> {
  /** 상태 색 (기본 error) */
  tone?: InlineFeedbackTone;
}

/**
 * 처리 결과 안내 상자: 팝업 · 폼 안에서 처리 실패 등을 Alert 없이 그 자리에 보여 준다
 * (Status 배경 · 테두리 · 글자, 여백 12 · 반경 6 · 13 Regular). Figma 비밀번호 변경 "변경 처리 실패"(28949:75687).
 * error · warning은 role="alert"로 바로 읽힌다
 */
export const InlineFeedback = forwardRef<HTMLDivElement, InlineFeedbackProps>(
  ({ tone = 'error', className, role, children, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      role={role ?? (tone === 'error' || tone === 'warning' ? 'alert' : 'status')}
      className={clsx(styles.feedback, styles[tone], className)}
    >
      {children}
    </div>
  ),
);
InlineFeedback.displayName = 'InlineFeedback';
