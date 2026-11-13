import { Header as HeaderBase } from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MENU } from '@/constants/menu';

// KWPC0102 헤더. TODO(이관): 사용자 정보 · 세션 타이머 · 마스킹 상태는 store/auth와 API로 연결

// TODO(API) 받지 않은 다운로드 파일 수 · 미확인 알림 여부 (지금은 시안 예시 값: 다운로드 1건, 미확인 알림 있음)
const PENDING_DOWNLOADS = 1;
const HAS_UNREAD_NOTIFICATIONS = true;

const SESSION_SECONDS = 3 * 3600; // TODO(정책) 세션 유지 시간
const UNMASK_SECONDS = 3600; // 마스킹 해제 유지 시간 (시안 59:55 → 1시간)

// 사용자 정보: 기본은 마스킹, 해제 중에는 원래 값 (TODO(API) 로그인 사용자 정보)
const MASKED = [
  { label: '아이디', value: 'kw*******' },
  { label: '이름', value: '홍*동' },
  { label: '소속', value: 'PG운영팀' },
  { label: '권한', value: '관리자' },
];
const UNMASKED = [
  { label: '아이디', value: 'kwpay1234' },
  { label: '이름', value: '홍길동' },
  { label: '소속', value: 'PG운영팀' },
  { label: '권한', value: '관리자' },
];

/** 1초마다 1씩 줄이는 남은 시간. null이면 멈춤 */
function useCountdown(initial: number | null) {
  const [seconds, setSeconds] = useState<number | null>(initial);
  const running = seconds !== null && seconds > 0;
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((s) => (s === null ? null : s - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);
  return [seconds, setSeconds] as const;
}

export function Header() {
  const navigate = useNavigate();
  const [session, setSession] = useCountdown(SESSION_SECONDS);
  // 마스킹 해제 남은 시간 (null = 마스킹 중). 시안(Figma Header)대로 처음부터 해제 중으로 보여 준다 (사용자 요청)
  // TODO(API) 로그인 사용자의 실제 마스킹 상태 · 남은 시간으로
  const [unmask, setUnmask] = useCountdown(UNMASK_SECONDS);
  const unmasked = unmask !== null && unmask > 0;

  // 해제 시간이 끝나면 다시 마스킹
  useEffect(() => {
    if (unmask === 0) setUnmask(null);
  }, [unmask, setUnmask]);

  return (
    <HeaderBase>
      <HeaderBase.Search />
      <HeaderBase.UserInfo items={unmasked ? UNMASKED : MASKED} />
      <HeaderBase.Divider />
      {/* TODO(API) 세션 연장 · 만료 시 로그아웃 */}
      <HeaderBase.Session remaining={session ?? 0} onExtend={() => setSession(SESSION_SECONDS)} />
      <HeaderBase.Divider />
      <HeaderBase.Masking
        unmasked={unmasked}
        remaining={unmask ?? 0}
        // TODO(시안 · API) 마스킹 해제 사유 입력 Modal(Q46) → 승인 후 해제. 지금은 바로 해제
        onUnmask={() => setUnmask(UNMASK_SECONDS)}
        onExtend={() => setUnmask(UNMASK_SECONDS)}
        onApply={() => setUnmask(null)}
      />
      <HeaderBase.Divider />
      <HeaderBase.Download count={PENDING_DOWNLOADS} onClick={() => navigate(MENU.KWPC0104)} />
      <HeaderBase.Actions>
        <HeaderBase.IconButton icon="user" label="내 정보" onClick={() => navigate('/mypage')} />
        <HeaderBase.IconButton
          icon="bell"
          label="알림"
          dot={HAS_UNREAD_NOTIFICATIONS}
          onClick={() => navigate(MENU.KWPC0203)}
        />
        <HeaderBase.IconButton icon="power" label="로그아웃" />
      </HeaderBase.Actions>
    </HeaderBase>
  );
}
