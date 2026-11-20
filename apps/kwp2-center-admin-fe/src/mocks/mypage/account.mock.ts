// 예시 데이터: 계정정보 1건 (홍길동)
// mypage/account.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import { type AccountInfo } from '@/features/mypage/account.types';

// TODO(정책) 마스킹 적용 중에는 휴대전화 · 이메일 · 이름을 마스킹 값으로 (서버가 내려줄지 화면에서 가릴지)
export const ACCOUNT_INFO: AccountInfo = {
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
