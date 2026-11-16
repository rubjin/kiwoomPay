import { forwardRef, useState } from 'react';
import { Icon } from '../Icon';
import { FieldIconButton } from './FieldBox';
import { TextField, type TextFieldProps } from './TextField';

export interface PasswordFieldProps extends Omit<
  TextFieldProps,
  'type' | 'trailingIcon' | 'trailingAction' | 'clearable'
> {
  /** 보기 버튼 이름 (기본 비밀번호 보기 / 비밀번호 숨기기) */
  revealLabel?: string;
  hideLabel?: string;
}

/**
 * 비밀번호 입력: 뒤 [보기] 버튼으로 가림 ↔ 보임 전환 (Figma 비밀번호 변경 — 가린 상태에서 eye 아이콘).
 * 나머지는 TextField와 같다
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    { revealLabel = '비밀번호 보기', hideLabel = '비밀번호 숨기기', autoComplete, ...rest },
    ref,
  ) => {
    const [revealed, setRevealed] = useState(false);
    return (
      <TextField
        {...rest}
        ref={ref}
        type={revealed ? 'text' : 'password'}
        autoComplete={autoComplete ?? 'off'}
        trailingAction={
          <FieldIconButton
            aria-label={revealed ? hideLabel : revealLabel}
            aria-pressed={revealed}
            disabled={rest.disabled}
            onClick={() => setRevealed((v) => !v)}
          >
            <Icon name={revealed ? 'eye-off' : 'eye'} size={20} />
          </FieldIconButton>
        }
      />
    );
  },
);
PasswordField.displayName = 'PasswordField';
