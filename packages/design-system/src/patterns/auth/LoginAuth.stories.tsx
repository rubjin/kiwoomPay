import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Footer } from '../../components/navigation';
import { useAction } from '../action';
import { DialogProvider, useDialog } from '../common';
import { AuthField, AuthForm, AuthLayout, AuthNotice } from './AuthLayout';
import { AuthInfoRow, AuthVerifyBody, VerifyCodeField } from './VerifyCodeField';
import { systemAssets } from '../../stories/systemAssets';

const meta = {
  title: 'Patterns/P05 Login Auth',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <DialogProvider>
        <Story />
      </DialogProvider>
    ),
  ],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── 예시 값 (임의 작업) ──
// 비밀번호 password(5회 연속 틀리면 잠김) · 잠긴 아이디 locked · 사용 불가 disabled · 시스템 오류 error · 통신 오류 network
// 휴대전화번호 없음 nophone · 첫 발송 실패 sendfail · 인증번호 123456(5회 연속 틀리면 잠김) · 재발송 30초 대기 · 3회까지
// 로그인 인증 세션은 10분 — 인증번호 시간(3분)보다 길어서, 시간이 남아 있는 동안에는 세션 만료가 뜨지 않는다
const NOTICES = [
  '아이디 또는 비밀번호를 5회 연속 잘못 입력하면 계정이 잠깁니다.',
  'SMS 인증번호를 5회 연속 잘못 입력해도 계정이 잠깁니다.',
  '계정 잠금 해제는 마스터 관리자에게 요청해 주세요.',
  '로그인 버튼을 누른 후 SMS 인증까지 완료해 주세요.',
  '아이디, 비밀번호 및 인증번호는 타인과 공유하지 마세요.',
];
const CODE_SECONDS = 180; // 3분
const CODE_LENGTH = 6;
const MAX_FAILS = 5;
const RESEND_WAIT = 30;
const RESEND_MAX = 3;
const SESSION_SECONDS = 600;

/** 상태별 문구 (Figma LOGIN STATE & FEEDBACK RULE 28721:69202) — 앱 loginMessages.ts와 같다 */
const MESSAGES = {
  // 로그인
  MISMATCH: '아이디 또는 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.', // 비밀번호 아래
  LOCK_EXCEEDED:
    '로그인 실패 횟수를 초과하여 계정이 잠겼습니다.\n잠금 해제는 마스터 관리자에게 요청해 주세요.', // Alert
  LOCKED:
    '잠금 상태인 계정으로 로그인할 수 없습니다.\n잠금 해제는 마스터 관리자에게 요청해 주세요.', // Alert
  UNAVAILABLE: '현재 로그인할 수 없는 계정입니다. 마스터 관리자에게 문의해 주세요.', // Alert
  SYSTEM: '로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', // Alert
  // SMS 인증 — 인증번호 아래 빨간 문구, 잠김 · 세션 만료만 Alert
  CODE_MISMATCH: '인증번호가 일치하지 않습니다. 다시 확인해 주세요.',
  CODE_EXPIRED: '인증번호가 만료되었습니다. 인증번호를 재발송해 주세요.',
  CODE_LOCK_EXCEEDED:
    '인증 실패 횟수를 초과하여 계정이 잠겼습니다.\n잠금 해제는 마스터 관리자에게 요청해 주세요.', // 모달 닫고 로그인 화면 Alert
  SEND_FAILED: '인증번호 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
  RESEND_WAIT: '잠시 후 인증번호를 다시 요청해 주세요.', // + [재발송] 비활성
  RESEND_LIMIT: '인증번호 재발송 가능 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.', // + [재발송] 비활성
  SESSION_EXPIRED: '로그인 인증 시간이 만료되었습니다.\n다시 로그인해 주세요.', // 모달 위 Alert → 로그인 화면
};
type AuthCode = keyof typeof MESSAGES;
/** 서버/통신 오류 (공통) — Alert, 그 단계 유지 */
const COMMON_ERROR = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

class AuthError extends Error {
  constructor(
    readonly code: AuthCode,
    readonly retryAfter = 0,
  ) {
    super(code);
  }
}
const authCode = (error: unknown) => (error instanceof AuthError ? error.code : undefined);
const authMessage = (error: unknown) =>
  error instanceof AuthError ? MESSAGES[error.code] : COMMON_ERROR;

// 예시 서버 상태 (스토리 안에서만)
const mock = { passwordFails: 0, codeFails: 0, resendCount: 0, lastSentAt: 0, loginAt: 0 };
const lockedIds = new Set(['locked']);

/** 인증번호 아래 빨간 문구 (만료는 남은 시간으로 판단) */
type CodeError = 'CODE_MISMATCH' | 'SEND_FAILED' | 'RESEND_WAIT' | 'RESEND_LIMIT';

/** SMS 인증 (Modal sm 400): 안내 → 등록된 휴대전화번호 → 인증번호(남은 시간 · 재발송) → [취소][완료] */
function SmsVerifyModal({
  open,
  phone,
  onClose,
  onVerified,
  onLocked,
  inline,
  initialRemaining = CODE_SECONDS,
  initialCode = '',
  initialError = null,
}: {
  open: boolean;
  phone: string;
  onClose: () => void;
  onVerified: () => void;
  /** 5회 실패로 잠김 → 모달을 닫고 로그인 화면에 Alert */
  onLocked?: (message: string) => void;
  inline?: boolean;
  initialRemaining?: number;
  initialCode?: string;
  /** 처음부터 보여 줄 문구 (스토리 예시) */
  initialError?: CodeError | null;
}) {
  const dialog = useDialog();
  const [code, setCode] = useState(initialCode);
  const [codeError, setCodeError] = useState<CodeError | null>(initialError);
  const [remaining, setRemaining] = useState(initialRemaining);
  const sendFailed = codeError === 'SEND_FAILED';
  const resendBlocked = codeError === 'RESEND_WAIT' || codeError === 'RESEND_LIMIT';
  const expired = remaining <= 0 && !sendFailed;

  // 열려 있는 동안 1초마다 줄인다 (만료되면 멈춤)
  useEffect(() => {
    if (!open || remaining <= 0) return;
    const timer = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [open, remaining]);

  const sessionCheck = () => {
    if (mock.loginAt && Date.now() - mock.loginAt > SESSION_SECONDS * 1000)
      throw new AuthError('SESSION_EXPIRED');
  };
  // 세션 만료: 모달 위 Alert → [확인] 후 모달을 닫고 로그인 화면
  const sessionExpired = () => void dialog.alert(MESSAGES.SESSION_EXPIRED).then(onClose);

  const resend = useAction({
    run: async () => {
      await wait(400); // TODO(API) 인증번호 재발송
      sessionCheck();
      if (mock.resendCount >= RESEND_MAX) throw new AuthError('RESEND_LIMIT');
      const waited = Math.floor((Date.now() - mock.lastSentAt) / 1000);
      if (waited < RESEND_WAIT) throw new AuthError('RESEND_WAIT', RESEND_WAIT - waited);
      mock.resendCount += 1;
      mock.lastSentAt = Date.now();
    },
    onSuccess: () => {
      setCode('');
      setCodeError(null);
      setRemaining(CODE_SECONDS);
    },
    success: '인증번호를 다시 발송했습니다.', // (임의 작업) 표에 없음
    failure: (error) => {
      const c = authCode(error);
      if (c === 'SEND_FAILED' || c === 'RESEND_LIMIT') {
        setCodeError(c);
        return null;
      }
      if (c === 'RESEND_WAIT') {
        setCodeError(c);
        // 대기시간이 지나면 다시 누를 수 있다
        const seconds = error instanceof AuthError ? error.retryAfter : 0;
        setTimeout(() => setCodeError((e) => (e === 'RESEND_WAIT' ? null : e)), seconds * 1000);
        return null;
      }
      if (c === 'SESSION_EXPIRED') {
        sessionExpired();
        return null;
      }
      return authMessage(error);
    },
  });

  const verify = useAction({
    run: async () => {
      await wait(500); // TODO(API) 인증번호 확인
      sessionCheck();
      if (code !== '123456') {
        mock.codeFails += 1;
        if (mock.codeFails >= MAX_FAILS) {
          mock.codeFails = 0;
          throw new AuthError('CODE_LOCK_EXCEEDED');
        }
        throw new AuthError('CODE_MISMATCH');
      }
      mock.codeFails = 0;
    },
    onSuccess: onVerified,
    failure: (error) => {
      const c = authCode(error);
      if (c === 'CODE_MISMATCH') {
        setCodeError(c);
        return null;
      }
      if (c === 'CODE_LOCK_EXCEEDED') {
        if (onLocked) onLocked(MESSAGES.CODE_LOCK_EXCEEDED);
        else void dialog.alert(MESSAGES.CODE_LOCK_EXCEEDED);
        return null;
      }
      if (c === 'SESSION_EXPIRED') {
        sessionExpired();
        return null;
      }
      return authMessage(error);
    },
  });

  // 인증번호 아래 문구 (모두 빨강): 재발송 안내 > 만료 > 발송 실패 · 불일치
  const error =
    codeError && resendBlocked
      ? MESSAGES[codeError]
      : expired
        ? MESSAGES.CODE_EXPIRED
        : codeError
          ? MESSAGES[codeError]
          : undefined;

  return (
    <Modal open={open} onClose={verify.loading ? undefined : onClose} inline={inline}>
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
          info={<AuthInfoRow label="등록된 휴대전화번호" value={phone} />}
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
            resendDisabled={resendBlocked}
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
          disabled={expired || sendFailed || code.length < CODE_LENGTH}
          onClick={() => verify.execute()}
        >
          완료
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/** SMS 인증 불가 (sm 400): 등록된 휴대전화번호가 없음 → 안내 + [확인]만 (닫기 X 없음) */
function SmsUnavailableModal({
  open,
  onClose,
  inline,
}: {
  open: boolean;
  onClose: () => void;
  inline?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} inline={inline}>
      <Modal.Header title="SMS 인증" />
      <Modal.Body>
        <AuthVerifyBody
          message={
            <>
              휴대전화번호가 등록되어 있지 않아 SMS 인증이 불가합니다.
              <br />
              마스터 관리자에게 문의해 주세요.
            </>
          }
          info={<AuthInfoRow label="등록된 휴대전화번호" value="등록 정보 없음" empty />}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button size="lg" onClick={onClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/** 로그인 화면 (KWPC3000): 아이디 · 비밀번호 → [로그인 인증] → SMS 인증 → 완료 */
function LoginScreen({
  onLoggedIn,
  defaultId = '',
  defaultPassword = '',
  defaultMismatch = false,
}: {
  onLoggedIn: () => void;
  defaultId?: string;
  defaultPassword?: string;
  /** 처음부터 불일치 문구를 보여 준다 (스토리 예시) */
  defaultMismatch?: boolean;
}) {
  const [id, setId] = useState(defaultId);
  const [password, setPassword] = useState(defaultPassword);
  const [mismatch, setMismatch] = useState(defaultMismatch);
  const dialog = useDialog();
  // SMS 모달: 열 때마다 새로 그린다(key). sendFailed면 처음부터 발송 실패 문구
  const [sms, setSms] = useState<{ key: number; sendFailed: boolean } | null>(null);
  const [noPhoneOpen, setNoPhoneOpen] = useState(false);
  const ready = id.trim() !== '' && password !== '';

  const login = useAction({
    run: async () => {
      await wait(500); // TODO(API) 아이디 · 비밀번호 확인 + SMS 발송
      if (id === 'network') throw new Error('network');
      if (id === 'error') throw new AuthError('SYSTEM');
      if (id === 'disabled') throw new AuthError('UNAVAILABLE');
      if (lockedIds.has(id)) throw new AuthError('LOCKED');
      if (password !== 'password') {
        mock.passwordFails += 1;
        if (mock.passwordFails >= MAX_FAILS) {
          mock.passwordFails = 0;
          lockedIds.add(id);
          throw new AuthError('LOCK_EXCEEDED');
        }
        throw new AuthError('MISMATCH');
      }
      Object.assign(mock, { passwordFails: 0, codeFails: 0, resendCount: 0 });
      mock.lastSentAt = mock.loginAt = Date.now();
      return id;
    },
    onSuccess: (loginId) => {
      setMismatch(false);
      if (loginId === 'nophone') setNoPhoneOpen(true);
      else setSms({ key: Date.now(), sendFailed: loginId === 'sendfail' });
    },
    // 불일치는 비밀번호 아래 문구 (Alert 없음), 잠김 · 사용 불가 · 오류는 Alert
    failure: (error) => {
      if (authCode(error) === 'MISMATCH') {
        setMismatch(true);
        return null;
      }
      setMismatch(false);
      return authMessage(error);
    },
  });

  return (
    <AuthLayout
      logo={<img src={systemAssets.logoHeader} alt="KIWOOM PAY" />}
      illustration={<img src={systemAssets.loginSecurity} alt="" />}
      title="로그인"
      footer={
        <Footer
          logo={<img src={systemAssets.logoFooter} alt="DAOU DATA" width={110} height={16} />}
          items={[
            '대표이사 : 김상준',
            '사업자등록번호 : 220-81-01733',
            '04156 서울특별시 마포구 독막로 311 (염리동, 재화스퀘어) 3층, 5층',
            '대표전화 : 1588-5984',
            'FAX : 02-6280-3268',
          ]}
          copyright="Copyright ⓒ DAOU Tech Inc. All Rights Reserved."
        />
      }
    >
      <AuthForm
        onSubmit={() => ready && login.execute()}
        error={mismatch ? MESSAGES.MISMATCH : undefined}
        submit={
          // 처리 중 표시 없음 — 중복 요청은 useAction이 막는다
          <Button type="submit" size="lg" disabled={!ready}>
            로그인 인증
          </Button>
        }
        notice={<AuthNotice items={NOTICES} />}
      >
        <AuthField
          label="아이디"
          placeholder="아이디를 입력해 주세요."
          autoComplete="username"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setMismatch(false);
          }}
        />
        <AuthField
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMismatch(false);
          }}
        />
      </AuthForm>
      <SmsUnavailableModal open={noPhoneOpen} onClose={() => setNoPhoneOpen(false)} />
      {sms && (
        <SmsVerifyModal
          // 열 때마다 새로 그려 남은 시간 · 입력을 초기화
          key={sms.key}
          open
          phone="010-****-5678"
          initialError={sms.sendFailed ? 'SEND_FAILED' : null}
          onClose={() => setSms(null)}
          onVerified={() => {
            setSms(null);
            onLoggedIn();
          }}
          // 5회 실패 잠김: 모달을 닫고 로그인 화면에 Alert
          onLocked={(message) => {
            setSms(null);
            void dialog.alert(message);
          }}
        />
      )}
    </AuthLayout>
  );
}

/**
 * 로그인 흐름 — 상태별 처리는 Figma LOGIN STATE & FEEDBACK RULE(28721:69202).
 * 예시: 비밀번호 password(5회 틀리면 잠김) · 아이디 locked · disabled · error · network · nophone · sendfail ·
 * 인증번호 123456(5회 틀리면 잠김) · 재발송 30초 대기 · 3회까지 · 로그인 인증 세션 10분
 */
export const Login: Story = {
  parameters: {
    controls: { disable: true },
    tempWork: '예시 계정 · 재발송 완료 안내 · 입력 중 밑줄 색 · 내용 ↔ Footer 최소 간격',
  },
  render: function Render() {
    const [done, setDone] = useState(false);
    return done ? (
      <div style={{ padding: 40 }}>
        로그인되었습니다. (예시: 실제 화면은 메인으로 이동){' '}
        <Button size="sm" variant="neutral" appearance="line" onClick={() => setDone(false)}>
          다시 보기
        </Button>
      </div>
    ) : (
      <LoginScreen onLoggedIn={() => setDone(true)} />
    );
  },
};

/** 계정정보 불일치 (Figma 28732:76076): 비밀번호 아래 20 · 버튼 위 20에 문구(12 Regular · Chart/Negative), 버튼 위치는 그대로. 입력을 고치면 사라진다 */
export const LoginMismatch: Story = {
  name: 'Login · 계정정보 불일치',
  parameters: { controls: { disable: true } },
  render: () => (
    <LoginScreen
      onLoggedIn={() => {}}
      defaultId="kwpay1234"
      defaultPassword="wrongpass"
      defaultMismatch
    />
  ),
};

/** SMS 인증 (sm 400): 남은 시간 · 재발송, 6자리를 입력해야 [완료] */
export const SmsVerify: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <SmsVerifyModal open inline phone="010-****-5678" onClose={() => {}} onVerified={() => {}} />
  ),
};

/** SMS 인증 만료: 남은 시간 0 → 입력 아래 빨간 문구 + [완료] 비활성, [재발송]으로 다시 3분 */
export const SmsExpired: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <SmsVerifyModal
      open
      inline
      initialRemaining={0}
      phone="010-****-5678"
      onClose={() => {}}
      onVerified={() => {}}
    />
  ),
};

/** 인증번호 불일치: Alert 없이 입력 아래 문구. 입력을 고치거나 [재발송]하면 사라짐 */
export const SmsMismatch: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <SmsVerifyModal
      open
      inline
      initialCode="000000"
      initialError="CODE_MISMATCH"
      phone="010-****-5678"
      onClose={() => {}}
      onVerified={() => {}}
    />
  ),
};

/** 인증번호 발송 실패: 모달 유지, 입력 아래 문구 + [완료] 비활성 → [재발송]으로 다시 시도 */
export const SmsSendFailed: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <SmsVerifyModal
      open
      inline
      initialError="SEND_FAILED"
      phone="010-****-5678"
      onClose={() => {}}
      onVerified={() => {}}
    />
  ),
};

/** 재발송 대기시간 미경과: 재발송 영역 아래 문구 + [재발송] 비활성 (대기시간이 지나면 다시 활성) */
export const SmsResendWait: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <SmsVerifyModal
      open
      inline
      initialError="RESEND_WAIT"
      phone="010-****-5678"
      onClose={() => {}}
      onVerified={() => {}}
    />
  ),
};

/** 재발송 가능 횟수 초과: 재발송 영역 아래 문구 + [재발송] 비활성 */
export const SmsResendLimit: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <SmsVerifyModal
      open
      inline
      initialError="RESEND_LIMIT"
      phone="010-****-5678"
      onClose={() => {}}
      onVerified={() => {}}
    />
  ),
};

/** SMS 인증 불가: 등록된 휴대전화번호 없음 → 안내 + [확인] */
export const SmsNoPhone: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => <SmsUnavailableModal open inline onClose={() => {}} />,
};
