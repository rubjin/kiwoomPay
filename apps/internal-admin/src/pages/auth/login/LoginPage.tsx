import {
  AuthField,
  AuthForm,
  AuthLayout,
  AuthNotice,
  Button,
  useAction,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { requestLogin } from '@/api/auth/login';
import loginSecurity from '@/assets/login/login-security.png';
import logoHeader from '@/assets/logo/logo-header.png';
import { Footer } from '@/layouts/Footer/Footer';
import { useAuthStore } from '@/store/auth';
import type { LoginChallenge } from '@/types/auth/login';
import { LOGIN_NOTICES, loginErrorMessage } from './components/loginMessages';
import { SmsVerifyModal } from './components/SmsVerifyModal';

/**
 * KWPC3000 로그인 (Figma 28701:69251) — 페이지 패턴 P05 Login → Auth.
 * 아이디 · 비밀번호 → [로그인 인증] → SMS 인증(2차) → 원래 가려던 화면(없으면 메인).
 * TODO(이관): 기존 pages/Common/Login/Login.tsx의 토큰 · 사용자 · 메뉴 저장
 */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [challenge, setChallenge] = useState<LoginChallenge | null>(null);
  const ready = id.trim() !== '' && password !== '';

  const login = useAction({
    run: () => requestLogin(id.trim(), password),
    onSuccess: setChallenge,
    failure: loginErrorMessage,
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
        submit={
          <Button type="submit" size="lg" disabled={!ready} loading={login.loading}>
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
      {challenge && (
        <SmsVerifyModal
          key={challenge.challengeId + challenge.expiresIn}
          challenge={challenge}
          onClose={() => setChallenge(null)}
          onVerified={finish}
        />
      )}
    </AuthLayout>
  );
}
