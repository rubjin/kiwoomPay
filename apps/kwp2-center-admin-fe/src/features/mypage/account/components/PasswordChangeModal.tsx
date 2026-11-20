/**
 * 화면ID: [KWPC02010101] 비밀번호 변경 팝업
 * 위치: 마이페이지 > 계정관리 > 계정정보 · /mypage/account (팝업)
 */
import {
  // 팝업 틀 · 버튼
  Modal,
  Button,
  Stack,
  // 입력
  Field,
  PasswordField,
  // 안내
  NoticePanel,
  InlineFeedback,
  // 처리 흐름 (P04)
  useAction,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { changePassword } from '@/features/mypage/account.api';
import { PasswordChangeError } from '@/features/mypage/account.types';
import {
  PASSWORD_GUIDE,
  validatePassword,
  type PasswordErrors,
  type PasswordForm,
} from './passwordRules';

/** 라벨 폭 (Figma 96) · 입력 ↔ 오류 문구 (Figma 5) */
const LABEL_WIDTH = 96;
const HELPER_GAP = 5;

const EMPTY: PasswordForm = { current: '', next: '', confirm: '' };

const FIELDS: { key: keyof PasswordForm; label: string; placeholder: string }[] = [
  { key: 'current', label: '현재 비밀번호', placeholder: '현재 비밀번호를 입력해 주세요' },
  { key: 'next', label: '새 비밀번호', placeholder: '새 비밀번호를 입력해 주세요' },
  { key: 'confirm', label: '새 비밀번호 확인', placeholder: '새 비밀번호를 다시 입력해 주세요' },
];

interface PasswordChangeModalProps {
  open: boolean;
  onClose: () => void;
  /** 변경 완료 (변경일 반영) */
  onChanged: (changedAt: string) => void;
}

/**
 * KWPC02010101 비밀번호 변경 (Figma 28946:73531, Modal md 620).
 * [변경]: 화면 규칙 검사(오류는 입력 아래, Alert 없음) → 변경 요청 → 닫고 완료 안내.
 * 서버 오류(현재 비밀번호 불일치 · 최근 사용 비밀번호)도 해당 입력 아래, 그 밖의 처리 실패는 안내 상자 아래(Figma 28946:75197).
 * 입력 줄은 오류 문구 자리를 늘 잡아 둔다(Figma 줄 높이 59 고정). 한 번 [변경]을 누른 뒤에는 입력할 때마다 다시 검사
 */
export function PasswordChangeModal({ open, onClose, onChanged }: PasswordChangeModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [submitted, setSubmitted] = useState(false);
  /** 처리 실패 안내 (안내 상자 아래, Alert 없음) */
  const [failure, setFailure] = useState<string | null>(null);

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setSubmitted(false);
    setFailure(null);
  };
  const close = () => {
    reset();
    onClose();
  };

  const set = (key: keyof PasswordForm, value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    setFailure(null);
    if (submitted) setErrors(validatePassword(next));
  };

  const change = useAction({
    run: () => changePassword(form.current, form.next),
    onSuccess: ({ changedAt }) => {
      onChanged(changedAt);
      close();
    },
    success: '비밀번호가 변경되었습니다.',
    // 서버 검사 오류는 입력 아래, 그 밖의 실패는 안내 상자 아래 (모두 Alert 없음)
    failure: (error) => {
      if (error instanceof PasswordChangeError) {
        setErrors(
          error.code === 'CURRENT_MISMATCH'
            ? { current: '현재 비밀번호가 일치하지 않습니다.' }
            : { next: '최근 사용한 비밀번호는 사용할 수 없습니다.' },
        );
        return null;
      }
      setFailure('비밀번호 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      return null;
    },
  });

  const submit = () => {
    setSubmitted(true);
    setFailure(null);
    const found = validatePassword(form);
    setErrors(found);
    if (Object.keys(found).length === 0) void change.execute();
  };

  return (
    <Modal open={open} onClose={change.loading ? undefined : close} size="md">
      <Modal.Header title="비밀번호 변경" closeButton />
      <Modal.Body>
        <Stack gap={12}>
          <Modal.Description>
            현재 비밀번호를 입력한 후, 새 비밀번호를 설정해 주세요.
          </Modal.Description>
          {FIELDS.map(({ key, label, placeholder }) => (
            <Field
              key={key}
              label={label}
              required
              labelWidth={LABEL_WIDTH}
              helperGap={HELPER_GAP}
              reserveHelper
              feedback={errors[key] ? 'negative' : undefined}
              helperText={errors[key]}
            >
              <PasswordField
                fullWidth
                placeholder={placeholder}
                maxLength={30}
                value={form[key]}
                disabled={change.loading}
                onChange={(e) => set(key, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </Field>
          ))}
          <NoticePanel title="비밀번호 설정 안내" items={PASSWORD_GUIDE} />
          {failure && <InlineFeedback tone="error">{failure}</InlineFeedback>}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={change.loading}
          onClick={close}
        >
          취소
        </Button>
        <Button size="lg" onClick={submit}>
          변경
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
