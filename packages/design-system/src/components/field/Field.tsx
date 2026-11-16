import clsx from 'clsx';
import {
  forwardRef,
  useId,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './Field.module.scss';
import { FieldContext, type FieldFeedback, type FieldSize } from './fieldContext';

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 라벨 텍스트 */
  label?: ReactNode;
  /** left(기본): 필드 왼쪽에 가로 배치 / top: 필드 위 (검색 영역) */
  labelPosition?: 'left' | 'top';
  /** 필수 표시(*) */
  required?: boolean;
  /** 필드 아래 안내 문구. feedback이 있으면 해당 색으로 표시된다 */
  helperText?: ReactNode;
  /** 안쪽 컨트롤(TextField 등)에 전달되는 검증 결과 */
  feedback?: FieldFeedback;
  /** 안쪽 컨트롤의 크기. 라벨 높이도 이 값에 맞춘다 */
  size?: FieldSize;
  disabled?: boolean;
  /** 여러 필드의 라벨 폭을 맞출 때 (px 숫자 또는 CSS 길이) */
  labelWidth?: number | string;
  /** 컨트롤 ↔ 안내 문구 간격 (기본 8, 예: 비밀번호 변경 5 · 인증번호 4) */
  helperGap?: number;
  /** 안내 문구 자리를 늘 잡아 둔다 — 오류가 나타나도 아래 줄이 밀리지 않는다 (Figma 비밀번호 변경: 줄 높이 고정) */
  reserveHelper?: boolean;
  /** 컨트롤의 id. 생략하면 자동 생성되어 label과 연결된다 */
  htmlFor?: string;
  children: ReactNode;
}

/**
 * 라벨 + 컨트롤 + 헬퍼 텍스트를 묶는다.
 * 안쪽의 TextField · SelectBox · DateField 등이 id, size, feedback, disabled를 자동으로 받는다.
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label,
      labelPosition = 'left',
      required,
      helperText,
      feedback,
      size = 'md',
      disabled,
      labelWidth,
      helperGap,
      reserveHelper,
      htmlFor,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = htmlFor ?? autoId;
    const helperId = helperText ? `${id}-helper` : undefined;

    const context = useMemo(
      () => ({ id, describedBy: helperId, size, feedback, disabled }),
      [id, helperId, size, feedback, disabled],
    );

    const labelStyle: CSSProperties | undefined =
      labelWidth === undefined ? undefined : { width: labelWidth };

    return (
      <FieldContext.Provider value={context}>
        <div
          {...rest}
          ref={ref}
          className={clsx(styles.field, labelPosition === 'top' && styles.top, className)}
          style={
            helperGap === undefined
              ? style
              : ({ ...style, '--field-helper-gap': `${helperGap}px` } as CSSProperties)
          }
        >
          {label && (
            <label htmlFor={id} className={clsx(styles.label, styles[size])} style={labelStyle}>
              {label}
              {required && (
                <span className={styles.required} aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}
          <div className={styles.body}>
            {children}
            {helperText ? (
              <p id={helperId} className={clsx(styles.helper, feedback && styles[feedback])}>
                {helperText}
              </p>
            ) : (
              reserveHelper && <p className={clsx(styles.helper, styles.helperEmpty)} aria-hidden />
            )}
          </div>
        </div>
      </FieldContext.Provider>
    );
  },
);

Field.displayName = 'Field';
