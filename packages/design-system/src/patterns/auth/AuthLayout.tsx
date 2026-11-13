import clsx from 'clsx';
import {
  forwardRef,
  useId,
  useState,
  type FormEvent,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../../components/Icon';
import styles from './Auth.module.scss';

export interface AuthLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header 가운데 로고 (높이 32) */
  logo?: ReactNode;
  /** 제목 위 그림 (160 × 160) */
  illustration?: ReactNode;
  /** 화면 제목 (예: 로그인) */
  title?: ReactNode;
  /** 회사 정보 Footer */
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * P05 Login → Auth 화면 틀: LNB · Work Tab 없이 Header(로고) · 가운데 내용(폭 360) · Footer.
 * Figma KWPC3000_로그인_최초진입. 가맹점관리자 반응형 대상(모바일 시안 확인 후 적용).
 */
export const AuthLayout = forwardRef<HTMLDivElement, AuthLayoutProps>(
  ({ logo, illustration, title, footer, className, children, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.layout, className)}>
      <header className={styles.header}>{logo && <div className={styles.logo}>{logo}</div>}</header>
      <main className={styles.main}>
        <div className={styles.content}>
          {illustration && <div className={styles.illustration}>{illustration}</div>}
          {title && <h1 className={styles.title}>{title}</h1>}
          <div className={styles.body}>{children}</div>
        </div>
      </main>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  ),
);
AuthLayout.displayName = 'AuthLayout';

export interface AuthFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Enter · 제출 버튼 → 기본 제출을 막고 호출 */
  onSubmit?: () => void;
  /** 제출 버튼 (필드 아래 58) */
  submit?: ReactNode;
  /** 버튼 아래 안내 (AuthNotice) */
  notice?: ReactNode;
}

/** 로그인 폼: 필드(사이 40) → 제출 버튼 → 안내 */
export const AuthForm = forwardRef<HTMLFormElement, AuthFormProps>(
  ({ onSubmit, submit, notice, className, children, ...rest }, ref) => (
    <form
      {...rest}
      ref={ref}
      noValidate
      className={className}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <div className={styles.form}>{children}</div>
      {submit && <div className={styles.submit}>{submit}</div>}
      {notice}
    </form>
  ),
);
AuthForm.displayName = 'AuthForm';

export interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: ReactNode;
  /** 오류 문구 → 밑줄 빨강 + 아래 문구 */
  error?: ReactNode;
  /** type="password"일 때 보기/숨기기 아이콘 (기본 true) */
  revealable?: boolean;
}

/** 로그인용 밑줄 입력: 라벨 위 → 입력 → 밑줄 (사이 16). 비밀번호는 보기 아이콘 */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, error, revealable = true, type = 'text', id, className, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;
    const [revealed, setRevealed] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className={clsx(styles.field, className)}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
        <div className={clsx(styles.inputRow, error && styles.invalid)}>
          <input
            {...rest}
            ref={ref}
            id={inputId}
            type={isPassword && revealed ? 'text' : type}
            className={styles.input}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          {isPassword && revealable && (
            <button
              type="button"
              className={styles.reveal}
              aria-label={revealed ? '비밀번호 숨기기' : '비밀번호 보기'}
              aria-pressed={revealed}
              onClick={() => setRevealed((v) => !v)}
            >
              <Icon name={revealed ? 'eye' : 'eye-off'} size={24} />
            </button>
          )}
        </div>
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
AuthField.displayName = 'AuthField';

export interface AuthNoticeProps extends HTMLAttributes<HTMLUListElement> {
  items: ReactNode[];
}

/** 로그인 · 2차 인증 보안 안내 (Primary 50 상자, • 목록) */
export const AuthNotice = forwardRef<HTMLUListElement, AuthNoticeProps>(
  ({ items, className, ...rest }, ref) => (
    <ul {...rest} ref={ref} className={clsx(styles.notice, className)}>
      {items.map((item, index) => (
        <li key={index} className={styles.noticeItem}>
          {item}
        </li>
      ))}
    </ul>
  ),
);
AuthNotice.displayName = 'AuthNotice';
