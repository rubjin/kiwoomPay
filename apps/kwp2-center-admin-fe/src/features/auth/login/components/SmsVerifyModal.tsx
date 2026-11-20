/**
 * 화면ID: [KWPC03010000] SMS 인증 팝업
 * 위치: 로그인 > SMS 인증 · /auth/login (팝업)
 */
import {
  AuthInfoRow,
  AuthVerifyBody,
  Button,
  Modal,
  VerifyCodeField,
  useAction,
  useDialog,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import { resendSmsCode, verifySmsCode } from '@/features/auth/login.api';
import { LoginError, type LoginChallenge } from '@/features/auth/login.types';
import { LOGIN_MESSAGES, loginErrorCode, loginErrorMessage } from './loginMessages';

const CODE_LENGTH = 6;

interface SmsVerifyModalProps {
  /** 1단계 결과. 바뀔 때마다 새로 그린다(key) */
  challenge: LoginChallenge;
  onClose: () => void;
  onVerified: (accessToken: string) => void;
  /** SMS 인증 5회 실패로 계정이 잠김 → 화면이 모달을 닫고 로그인 화면에 Alert */
  onLocked: (message: string) => void;
}

/** 인증번호 입력 아래 빨간 문구 (불일치 · 발송 실패). 만료는 남은 시간으로 판단 */
type CodeError = 'CODE_MISMATCH' | 'SEND_FAILED';
/** 재발송 영역 하단 빨간 안내 + [재발송] 비활성 */
type ResendBlock = 'RESEND_WAIT' | 'RESEND_LIMIT';

/**
 * SMS 인증 (P05, Modal sm 400): 안내 → 등록된 휴대전화번호 → 인증번호(남은 시간 · 재발송) → [취소][완료].
 * 상태별 처리는 Figma LOGIN STATE & FEEDBACK RULE(28721:69202):
 * - 인증번호 미입력: [완료] 비활성 · 불일치 · 만료 · 발송 실패: 인증번호 아래 문구, 모달 유지
 * - 재발송 대기시간 · 횟수 초과: 재발송 영역 아래 안내 + [재발송] 비활성
 * - 5회 실패 잠김: 모달 닫고 로그인 화면 Alert · 세션 만료: 모달 위 Alert → [확인] 후 모달 닫힘(로그인 화면)
 * - 서버/통신 오류: Alert, 모달 유지
 */
export function SmsVerifyModal({ challenge, onClose, onVerified, onLocked }: SmsVerifyModalProps) {
  const dialog = useDialog();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<CodeError | null>(
    challenge.sendFailed ? 'SEND_FAILED' : null,
  );
  const [resendBlock, setResendBlock] = useState<ResendBlock | null>(null);
  const [remaining, setRemaining] = useState(challenge.expiresIn);
  const expired = remaining <= 0 && !challenge.sendFailed;

  // 1초마다 줄인다 (만료되면 멈춤)
  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [remaining]);

  // 로그인 인증 세션 만료: Alert [확인] 후 모달을 닫고 로그인 화면으로
  const sessionExpired = () => {
    void dialog.alert(LOGIN_MESSAGES.SESSION_EXPIRED).then(onClose);
  };

  const resend = useAction({
    run: () => resendSmsCode(challenge.challengeId),
    onSuccess: ({ expiresIn }) => {
      setCode('');
      setCodeError(null);
      setResendBlock(null);
      setRemaining(expiresIn);
    },
    success: '인증번호를 다시 발송했습니다.', // TODO(정책) 재발송 완료 안내 (임의 작업)
    failure: (error) => {
      switch (loginErrorCode(error)) {
        case 'SEND_FAILED':
          setCodeError('SEND_FAILED');
          return null;
        case 'RESEND_WAIT': {
          setResendBlock('RESEND_WAIT');
          // 대기시간이 지나면 다시 누를 수 있다
          const seconds = error instanceof LoginError ? error.retryAfter : 0;
          setTimeout(() => setResendBlock((b) => (b === 'RESEND_WAIT' ? null : b)), seconds * 1000);
          return null;
        }
        case 'RESEND_LIMIT':
          setResendBlock('RESEND_LIMIT');
          return null;
        case 'SESSION_EXPIRED':
          sessionExpired();
          return null;
        default:
          return loginErrorMessage(error); // 서버/통신 오류 Alert, 모달 유지
      }
    },
  });

  const verify = useAction({
    run: () => verifySmsCode(challenge.challengeId, code),
    onSuccess: ({ accessToken }) => onVerified(accessToken), // 별도 안내 없이 메인으로
    failure: (error) => {
      switch (loginErrorCode(error)) {
        case 'CODE_MISMATCH':
          setCodeError('CODE_MISMATCH');
          return null;
        case 'CODE_EXPIRED':
          setRemaining(0);
          return null;
        case 'CODE_LOCK_EXCEEDED':
          onLocked(LOGIN_MESSAGES.CODE_LOCK_EXCEEDED);
          return null;
        case 'SESSION_EXPIRED':
          sessionExpired();
          return null;
        default:
          return loginErrorMessage(error);
      }
    },
  });

  // 인증번호 아래 문구: 재발송 안내(대기 · 횟수 초과) > 만료 > 발송 실패 · 불일치
  // 재발송을 누른 직후에는 그 결과 안내가 먼저 보여야 한다
  const error = resendBlock
    ? LOGIN_MESSAGES[resendBlock]
    : expired
      ? LOGIN_MESSAGES.CODE_EXPIRED
      : codeError
        ? LOGIN_MESSAGES[codeError]
        : undefined;

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
          info={<AuthInfoRow label="등록된 휴대전화번호" value={challenge.maskedPhone ?? ''} />}
        >
          <VerifyCodeField
            value={code}
            onChange={(value) => {
              setCode(value);
              if (codeError === 'CODE_MISMATCH') setCodeError(null);
            }}
            remaining={remaining}
            length={CODE_LENGTH}
            onResend={() => resend.execute()}
            resending={resend.loading}
            resendDisabled={resendBlock !== null}
            error={error}
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
          disabled={expired || codeError === 'SEND_FAILED' || code.length < CODE_LENGTH}
          onClick={() => verify.execute()}
        >
          완료
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
