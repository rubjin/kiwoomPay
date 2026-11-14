import type { BadgeTone } from '@kiwoompay/design-system';

/** KWPC02010100 마이페이지 계정관리 — 계정정보 */
export interface AccountInfo {
  /** 기본 계정정보 */
  userName: string;
  loginId: string;
  department: string;
  phone: string;
  accountStatus: { label: string; tone: BadgeTone };
  email: string;
  createdAt: string;
  /** 비밀번호 및 로그인 보안 */
  passwordChangedAt: string;
  lastLoginAt: string;
  lastLoginIp: string;
  /** 계정정보 변경 요청 받는 곳 (시스템 관리자 메일) */
  adminEmail: string;
}
