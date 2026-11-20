import type { GeneralRequestSearchParams } from '@/features/system/permissionApproval.types';
import { toYmd } from '@/utils/period';

/**
 * 일반 권한 신청 검색 초기값 ([초기화] 기준). 화면에 들어올 때마다 새로 만든다.
 * 신청일 최근 30일 (화면설계서 Description "기본값 최근 30일(제안)" — TODO(정책) 확정)
 */
export function createInitialParams(): GeneralRequestSearchParams {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 30);
  return {
    applicant: '',
    status: 'all',
    type: 'all',
    requestNo: '',
    period: { start: toYmd(start), end: toYmd(end) },
    department: 'all',
  };
}
