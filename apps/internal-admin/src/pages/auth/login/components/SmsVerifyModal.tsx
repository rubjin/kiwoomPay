import {
  AuthInfoRow,
  AuthVerifyBody,
  Button,
  Modal,
  VerifyCodeField,
  useAction,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import { resendSmsCode, verifySmsCode } from '@/api/auth/login';
import { LoginError, type LoginChallenge } from '@/types/auth/login';
import { loginErrorMessage } from './loginMessages';

const CODE_LENGTH = 6;
const CODE_MISMATCH_MESSAGE = '인증번호가 일치하지 않습니다. 다시 확인해 주세요.';

interface SmsVerifyModalProps {
  /** 1단계 결과. 바뀔 때마다 새로 그린다(key) */
  challenge: LoginChallenge;
  onClose: () => void;
  onVerified: (accessToken: string) => void;
}

/** SMS 인증 (P05, Modal sm 400): 안내 → 등록된 휴대전화번호 → 인증번호(남은 시간 · 재발송) → [취소][완료] */
export function SmsVerifyModal({ challenge, onClose, onVerified }: SmsVerifyModalProps) {
  const [code, setCode] = useState('');
  // 인증번호 불일치는 Alert 대신 입력 아래 문구 (입력을 고치거나 재발송하면 지움)
  const [mismatch, setMismatch] = useState(false);
  const [remaining, setRemaining] = useState(challenge.expiresIn);
  const expired = remaining <= 0;

  // 1초마다 줄인다 (만료되면 멈춤)
  useEffect(() => {
    if (expired) return;
    const timer = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [expired]);

  const resend = useAction({
    run: () => resendSmsCode(challenge.challengeId),
    onSuccess: ({ expiresIn }) => {
      setCode('');
      setMismatch(false);
      setRemaining(expiresIn);
    },
    success: '인증번호를 다시 발송했습니다.',
    failure: loginErrorMessage,
  });

  const verify = useAction({
    run: () => verifySmsCode(challenge.challengeId, code),
    onSuccess: ({ accessToken }) => onVerified(accessToken),
    failure: (error) => {
      if (error instanceof LoginError && error.code === 'CODE_MISMATCH') {
        setMismatch(true);
        return null;
      }
      return loginErrorMessage(error);
    },
  });

  return (
    <Modal open onClose={verify.loading ? undefined : onClose}>
      <Modal.Header title="SMS 인증" closeButton />
      <Modal.Body>
        <AuthVerifyBody
          message={
            <>
              등록된 휴대전화번호로 인증번호를 발송했어요.
              <br />
              문자로 받은 인증번호를 입력해 주세요.
            </>
          }
          info={<AuthInfoRow label="등록된 휴대전화번호" value={challenge.maskedPhone} />}
        >
          <VerifyCodeField
            value={code}
            onChange={(value) => {
              setCode(value);
              setMismatch(false);
            }}
            remaining={remaining}
            length={CODE_LENGTH}
            onResend={() => resend.execute()}
            resending={resend.loading}
            error={
              expired
                ? loginErrorMessage(new LoginError('CODE_EXPIRED'))
                : mismatch
                  ? CODE_MISMATCH_MESSAGE
                  : undefined
            }
            autoFocus
          />
        </AuthVerifyBody>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={verify.loading}
          onClick={onClose}
        >
          취소
        </Button>
        <Button
          size="lg"
          disabled={expired || code.length < CODE_LENGTH}
          loading={verify.loading}
          onClick={() => verify.execute()}
        >
          완료
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
