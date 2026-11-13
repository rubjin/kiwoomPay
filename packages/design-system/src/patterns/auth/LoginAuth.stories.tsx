import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Footer } from '../../components/navigation';
import loginSecurity from '../../stories/assets/login-security.png';
import logoFooter from '../../stories/assets/logo-footer.svg';
import logoHeader from '../../stories/assets/logo-header.png';
import { useAction } from '../action';
import { DialogProvider } from '../common';
import { AuthField, AuthForm, AuthLayout, AuthNotice } from './AuthLayout';
import { AuthInfoRow, AuthVerifyBody, VerifyCodeField } from './VerifyCodeField';

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

// ── 예시 값 (임의 작업) — 비밀번호 password, 인증번호 123456, 잠긴 아이디 locked ──
const NOTICES = [
  '아이디 또는 비밀번호를 5회 연속 잘못 입력하면 계정이 잠깁니다.',
  'SMS 인증번호를 5회 연속 잘못 입력해도 계정이 잠깁니다.',
  '계정 잠금 해제는 마스터 관리자에게 요청해 주세요.',
  '로그인 버튼을 누른 후 SMS 인증까지 완료해 주세요.',
  '아이디, 비밀번호 및 인증번호는 타인과 공유하지 마세요.',
];
const CODE_SECONDS = 180; // 3분
const CODE_LENGTH = 6;

class AuthError extends Error {
  constructor(
    readonly code: 'MISMATCH' | 'LOCKED' | 'CODE_MISMATCH',
    readonly count = 0,
  ) {
    super(code);
  }
}

const authMessage = (error: unknown) => {
  if (!(error instanceof AuthError))
    return '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  if (error.code === 'LOCKED')
    return '계정이 잠겼습니다. 마스터 관리자에게 잠금 해제를 요청해 주세요.';
  if (error.code === 'CODE_MISMATCH') return `인증번호가 일치하지 않습니다. (${error.count}/5)`;
  return `아이디 또는 비밀번호가 일치하지 않습니다. (${error.count}/5)`;
};

/** SMS 인증 (Modal sm 400): 안내 → 등록된 휴대전화번호 → 인증번호(남은 시간 · 재발송) → [취소][완료] */
function SmsVerifyModal({
  open,
  phone,
  onClose,
  onVerified,
  inline,
  initialRemaining = CODE_SECONDS,
}: {
  open: boolean;
  phone: string;
  onClose: () => void;
  onVerified: () => void;
  inline?: boolean;
  initialRemaining?: number;
}) {
  const [code, setCode] = useState('');
  const [remaining, setRemaining] = useState(initialRemaining);
  const [failCount, setFailCount] = useState(0);
  const expired = remaining <= 0;

  // 열려 있는 동안 1초마다 줄인다 (만료되면 멈춤)
  useEffect(() => {
    if (!open || expired) return;
    const timer = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [open, expired]);

  const resend = useAction({
    run: () => wait(400), // TODO(API) 인증번호 재발송
    onSuccess: () => {
      setCode('');
      setRemaining(CODE_SECONDS);
    },
    success: '인증번호를 다시 발송했습니다.',
  });

  const verify = useAction({
    run: async () => {
      await wait(500); // TODO(API) 인증번호 확인
      if (code !== '123456') {
        setFailCount((n) => n + 1);
        throw new AuthError('CODE_MISMATCH', failCount + 1);
      }
    },
    onSuccess: onVerified,
    failure: authMessage,
  });

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
            onChange={setCode}
            remaining={remaining}
            length={CODE_LENGTH}
            onResend={() => resend.execute()}
            resending={resend.loading}
            error={expired ? '인증 시간이 만료되었습니다. [재발송]을 눌러 주세요.' : undefined}
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

/** 로그인 화면 (KWPC3000): 아이디 · 비밀번호 → [로그인 인증] → SMS 인증 → 완료 */
function LoginScreen({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [failCount, setFailCount] = useState(0);
  const [smsOpen, setSmsOpen] = useState(false);
  const ready = id.trim() !== '' && password !== '';

  const login = useAction({
    run: async () => {
      await wait(500); // TODO(API) 아이디 · 비밀번호 확인 + SMS 발송
      if (id === 'locked') throw new AuthError('LOCKED');
      if (password !== 'password') {
        setFailCount((n) => n + 1);
        throw new AuthError('MISMATCH', failCount + 1);
      }
    },
    onSuccess: () => setSmsOpen(true),
    failure: authMessage,
  });

  return (
    <AuthLayout
      logo={<img src={logoHeader} alt="KIWOOM PAY" />}
      illustration={<img src={loginSecurity} alt="" />}
      title="로그인"
      footer={
        <Footer
          logo={<img src={logoFooter} alt="DAOU DATA" width={110} height={16} />}
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
        submit={
          <Button type="submit" size="lg" disabled={!ready} loading={login.loading}>
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
          onChange={(e) => setId(e.target.value)}
        />
        <AuthField
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </AuthForm>
      <SmsVerifyModal
        // 열 때마다 새로 그려 남은 시간 · 입력을 초기화
        key={smsOpen ? 'open' : 'closed'}
        open={smsOpen}
        phone="010-****-5678"
        onClose={() => setSmsOpen(false)}
        onVerified={() => {
          setSmsOpen(false);
          onLoggedIn();
        }}
      />
    </AuthLayout>
  );
}

/** 로그인 흐름 (예시: 비밀번호 password · 인증번호 123456 · 잠긴 아이디 locked) */
export const Login: Story = {
  parameters: {
    controls: { disable: true },
    tempWork: '예시 계정 · 오류 문구 · 입력 중 밑줄 색 · 내용 ↔ Footer 최소 간격',
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

/** SMS 인증 (sm 400): 남은 시간 · 재발송, 6자리를 입력해야 [완료] */
export const SmsVerify: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'padded',
    tempWork: '안내 ↔ 상자 ↔ 인증번호 간격(PNG 측정)',
  },
  render: () => (
    <SmsVerifyModal open inline phone="010-****-5678" onClose={() => {}} onVerified={() => {}} />
  ),
};

/** SMS 인증 만료: 남은 시간 0 → 안내 + [완료] 비활성, [재발송]으로 다시 3분 */
export const SmsExpired: Story = {
  parameters: { controls: { disable: true }, layout: 'padded', tempWork: '만료 문구' },
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
