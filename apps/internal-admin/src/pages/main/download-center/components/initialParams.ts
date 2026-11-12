import type { DownloadCenterParams } from '@/types/main/downloadCenter';
import { toYmd } from '@/utils/period';

/**
 * 다운로드 센터 검색 초기값 ([초기화] 기준). 화면에 들어올 때마다 새로 만든다.
 * 요청일은 이번 달 1일 ~ 오늘 (시안 2026-08-01 ~ 2026-08-31). TODO(정책) 기본 기간 확인
 */
export function createInitialParams(): DownloadCenterParams {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    area: 'all',
    status: 'all',
    fileStatus: 'all',
    requestDate: { start: toYmd(first), end: toYmd(today) },
    keyword: '',
  };
}
