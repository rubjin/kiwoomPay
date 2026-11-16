import { PasswordChangeError, type AccountInfo } from '@/features/mypage/account.types';
import { wait } from '@/api/mock';

// TODO(API) 계정정보 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터 (시안 계정관리.png)
// TODO(정책) 마스킹 적용 중에는 휴대전화 · 이메일 · 이름을 마스킹 값으로 (서버가 내려줄지 화면에서 가릴지)
const SAMPLE: AccountInfo = {
  userName: '홍길동',
  loginId: 'kwpay1234',
  department: 'PG운영팀',
  phone: '010-1234-5678',
  accountStatus: { label: '정상', tone: 'success' },
  email: 'abc123@daoudata.co.kr',
  createdAt: '2025-12-12',
  passwordChangedAt: '2026-07-05',
  lastLoginAt: '2026-08-29 15:30',
  lastLoginIp: '123.456.78.90',
  adminEmail: 'pg-admin@daoudata.co.kr',
};

export async function fetchAccountInfo(): Promise<AccountInfo> {
  await wait(200);
  return SAMPLE;
}

/**
 * KWPC02010101 비밀번호 변경. TODO(API) 주소 · 요청 형식.
 * 예시: 현재 비밀번호가 password가 아니면 CURRENT_MISMATCH, 새 비밀번호가 Kiwoom!2025(최근 사용)이면 RECENTLY_USED
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ changedAt: string }> {
  await wait(500);
  if (currentPassword !== 'password') throw new PasswordChangeError('CURRENT_MISMATCH');
  if (newPassword === 'Kiwoom!2025') throw new PasswordChangeError('RECENTLY_USED');
  // (예시) 처리 실패 — 새 비밀번호에 Fail이 들어가면 서버 오류
  if (newPassword.includes('Fail')) throw new Error('SERVER_ERROR');
  return { changedAt: new Date().toISOString().slice(0, 10) };
}
