import type { BadgeTone } from '@kiwoompay/design-system';

/** KWPC02020000 마이페이지 권한관리 — 나의 권한 현황 · 기본 권한 정보 · 특수권한 */
export interface PermissionOverview {
  /** 나의 권한 현황 */
  template: string;
  menuCount: number;
  cpidScope: string;
  specialInUse: number;
  specialTotal: number;
  /** 처리 중인 권한 신청 건수 */
  pendingRequests: number;
  /** 기본 권한 정보 */
  department: string;
  userType: string;
  templateAppliedAt: string;
  /** 특수권한 (이름 · 상태 · 기간) */
  specials: { name: string; status: { label: string; tone: BadgeTone }; period: string }[];
}
