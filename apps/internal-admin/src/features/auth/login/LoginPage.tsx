import {
  AuthField,
  AuthForm,
  AuthLayout,
  AuthNotice,
  Button,
  useAction,
  useDialog,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { requestLogin } from '@/features/auth/login.api';
import loginSecurity from '@/assets/common/login-security.svg';
import logoHeader from '@/assets/logo/logo-header.svg';
import { Footer } from '@/layouts/Footer/Footer';
import { useAuthStore } from '@/store/auth';
import type { LoginChallenge } from '@/features/auth/login.types';
import {
  LOGIN_MESSAGES,
  LOGIN_NOTICES,
  loginErrorCode,
  loginErrorMessage,
} from './components/loginMessages';
import { SmsUnavailableModal } from './components/SmsUnavailableModal';
import { SmsVerifyModal } from './components/SmsVerifyModal';

/**
 * KWPC3000 로그인 (Figma 28701:69251) — 페이지 패턴 P05 Login → Auth.
 * 아이디 · 비밀번호 → [로그인 인증] → SMS 인증(2차) → 원래 가려던 화면(없으면 메인).
 * TODO(이관): 기존 pages/Common/Login/Login.tsx의 토큰 · 사용자 · 메뉴 저장
 */
export function LoginPage() {
  const navigate = useNavigate();
  const dialog = useDialog();
  const location = useLocation();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [challenge, setChallenge] = useState<LoginChallenge | null>(null);
  // 아이디 · 비밀번호 불일치는 버튼 위 문구로 (Alert 없음). 입력을 고치면 지운다
  const [mismatch, setMismatch] = useState(false);
  const ready = id.trim() !== '' && password !== '';

  const login = useAction({
    run: () => requestLogin(id.trim(), password),
    onSuccess: (next) => {
      setMismatch(false);
      setChallenge(next);
    },
    // 상태별 처리 (Figma LOGIN STATE & FEEDBACK RULE): 불일치는 비밀번호 아래 문구,
    // 5회 실패 잠김 · 잠긴 계정 · 사용 불가 · 시스템 · 통신 오류는 로그인 화면 Alert (확인 후 로그인 화면 유지)
    failure: (error) => {
      if (loginErrorCode(error) === 'MISMATCH') {
        setMismatch(true);
        return null;
      }
      setMismatch(false);
      return loginErrorMessage(error);
    },
  });

  const finish = (accessToken: string) => {
    setAccessToken(accessToken);
    const from = (location.state as { from?: Location } | null)?.from;
    navigate(from ? from.pathname + from.search : '/', { replace: true });
  };

  return (
    <AuthLayout
      logo={<img src={logoHeader} alt="KIWOOM PAY" />}
      illustration={<img src={loginSecurity} alt="" />}
      title="로그인"
      footer={<Footer />}
    >
      <AuthForm
        onSubmit={() => ready && login.execute()}
        error={mismatch ? LOGIN_MESSAGES.MISMATCH : undefined}
        submit={
          // 처리 중 표시 없음 (사용자 결정) — 중복 요청은 useAction이 막는다
          <Button type="submit" size="lg" disabled={!ready}>
            로그인 인증
          </Button>
        }
        notice={<AuthNotice items={LOGIN_NOTICES} />}
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
      {challenge && !challenge.maskedPhone && (
        <SmsUnavailableModal onClose={() => setChallenge(null)} />
      )}
      {challenge?.maskedPhone && (
        <SmsVerifyModal
          key={challenge.challengeId + challenge.expiresIn}
          challenge={challenge}
          onClose={() => setChallenge(null)}
          onVerified={finish}
          // SMS 인증 5회 실패 잠김: SMS 모달을 닫고 로그인 화면에서 Alert
          onLocked={(message) => {
            setChallenge(null);
            void dialog.alert(message);
          }}
        />
      )}
    </AuthLayout>
  );
}
