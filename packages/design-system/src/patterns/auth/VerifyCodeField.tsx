import clsx from 'clsx';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../../components/Button';
import { Field, TextField, type FieldFeedback } from '../../components/field';
import { formatRemaining } from '../../components/navigation';
import styles from './Auth.module.scss';

export interface VerifyCodeFieldProps {
  label?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  /** 남은 시간(초). 0이면 만료 — 시간 계산(카운트다운)은 화면이 한다 */
  remaining: number;
  onResend?: () => void;
  resendLabel?: ReactNode;
  /** 재발송 처리 중 */
  resending?: boolean;
  /** 인증번호 자리수 (숫자만 받음, 기본 6) */
  length?: number;
  placeholder?: string;
  /** 오류 문구 (불일치 · 만료) */
  error?: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  autoFocus?: boolean;
}

/**
 * SMS 인증번호 입력: 라벨 왼쪽 + 입력(오른쪽에 남은 시간 MM:SS 빨강) + [재발송].
 * 시안 KWPC3000 로그인 SMS 인증 (PNG 측정): 입력 · 버튼 40, 사이 8.
 */
export const VerifyCodeField = forwardRef<HTMLInputElement, VerifyCodeFieldProps>(
  (
    {
      label = '인증번호',
      value,
      onChange,
      remaining,
      onResend,
      resendLabel = '재발송',
      resending,
      length = 6,
      placeholder = '인증번호 입력',
      error,
      disabled,
      className,
      style,
      autoFocus,
    },
    ref,
  ) => {
    const feedback: FieldFeedback | undefined = error ? 'negative' : undefined;
    return (
      <Field
        label={label}
        className={clsx(styles.verifyField, className)}
        style={style}
        feedback={feedback}
        helperText={error}
        disabled={disabled}
      >
        <div className={styles.verify}>
          <TextField
            ref={ref}
            className={styles.verifyInput}
            fullWidth
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={length}
            placeholder={placeholder}
            value={value}
            autoFocus={autoFocus}
            onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, length))}
            suffix={
              <span className={styles.timer} aria-label={`남은 시간 ${formatRemaining(remaining)}`}>
                {formatRemaining(remaining)}
              </span>
            }
          />
          <Button variant="neutral" disabled={disabled} loading={resending} onClick={onResend}>
            {resendLabel}
          </Button>
        </div>
      </Field>
    );
  },
);
VerifyCodeField.displayName = 'VerifyCodeField';

export interface AuthVerifyBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** 안내 문구 (14 Regular, 본문 색) */
  message?: ReactNode;
  /** 확인용 정보 (AuthInfoRow) */
  info?: ReactNode;
  /** 인증번호 입력 (VerifyCodeField). 아래에 오류 문구 한 줄 자리를 잡아 두어 문구가 나와도 높이가 같다 */
  children?: ReactNode;
}

/** 2차 인증 Modal 본문: 안내 → 확인용 정보(12) → 인증번호(34). 시안 KWPC3000 SMS 인증 */
export const AuthVerifyBody = forwardRef<HTMLDivElement, AuthVerifyBodyProps>(
  ({ message, info, className, children, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.verifyBody, className)}>
      {message && <p className={styles.verifyMessage}>{message}</p>}
      {info}
      <div className={styles.verifyArea}>{children}</div>
    </div>
  ),
);
AuthVerifyBody.displayName = 'AuthVerifyBody';

export interface AuthInfoRowProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
}

/** 확인용 정보 한 줄 (예: 등록된 휴대전화번호 010-****-5678). Neutral 50 상자, 높이 44 */
export const AuthInfoRow = forwardRef<HTMLDivElement, AuthInfoRowProps>(
  ({ label, value, className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.info, className)}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  ),
);
AuthInfoRow.displayName = 'AuthInfoRow';
