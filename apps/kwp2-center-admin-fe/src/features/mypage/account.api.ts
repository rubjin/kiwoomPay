import { PasswordChangeError, type AccountInfo } from '@/features/mypage/account.types';
import { wait } from '@/mocks/utils';
import { ACCOUNT_INFO } from '@/mocks/mypage/account.mock';

// TODO(API) 계정정보 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

export async function fetchAccountInfo(): Promise<AccountInfo> {
  await wait(200);
  return ACCOUNT_INFO;
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
