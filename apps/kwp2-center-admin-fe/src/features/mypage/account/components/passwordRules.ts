/**
 * 비밀번호 설정 규칙 (Figma KWPC02010101 "비밀번호 설정 안내").
 * 화면에서 먼저 검사하고, "최근 사용한 비밀번호"는 서버만 알 수 있어 응답(RECENTLY_USED)으로 처리한다.
 */
export const PASSWORD_GUIDE = [
  '8자 이상 30자 이하',
  '영문 대문자·소문자·숫자·특수문자 중 3종 이상 조합',
  '동일 문자 3자 이상, 연속 문자 4자 이상 사용 불가',
  '최근 사용한 비밀번호와 동일하게 설정 불가',
];

export interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

export type PasswordErrors = Partial<Record<keyof PasswordForm, string>>;

const CHAR_TYPES = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];

/** 같은 문자 3자 이상 (예: aaa · 111) */
const hasRepeat = (value: string) => /(.)\1\1/.test(value);

/** 연속 문자 4자 이상 — 오름 · 내림 (예: abcd · 4321) */
function hasSequence(value: string) {
  for (let i = 0; i + 3 < value.length; i += 1) {
    const codes = [...value.slice(i, i + 4)].map((c) => c.toLowerCase().charCodeAt(0));
    const step = codes[1]! - codes[0]!;
    if (
      (step === 1 || step === -1) &&
      codes.every((c, k) => k === 0 || c - codes[k - 1]! === step)
    ) {
      return true;
    }
  }
  return false;
}

// (임의 작업) 규칙별 오류 문구 — 시안은 빈 값 문구 3개만
export function validatePassword(form: PasswordForm): PasswordErrors {
  const errors: PasswordErrors = {};
  if (!form.current) errors.current = '현재 비밀번호를 입력해 주세요.';

  const next = form.next;
  if (!next) errors.next = '새 비밀번호를 입력해 주세요.';
  else if (next.length < 8 || next.length > 30) errors.next = '8자 이상 30자 이하로 입력해 주세요.';
  else if (CHAR_TYPES.filter((re) => re.test(next)).length < 3)
    errors.next = '영문 대문자·소문자·숫자·특수문자 중 3종 이상을 조합해 주세요.';
  else if (hasRepeat(next)) errors.next = '동일 문자를 3자 이상 연속으로 사용할 수 없습니다.';
  else if (hasSequence(next)) errors.next = '연속 문자를 4자 이상 사용할 수 없습니다.';
  else if (form.current && next === form.current)
    errors.next = '현재 비밀번호와 다른 비밀번호를 입력해 주세요.';

  if (!form.confirm) errors.confirm = '새 비밀번호를 다시 입력해 주세요.';
  else if (form.confirm !== next) errors.confirm = '새 비밀번호가 일치하지 않습니다.';

  return errors;
}
