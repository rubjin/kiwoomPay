import type { BadgeTone } from '@kiwoompay/design-system';
import type { LedgerStatus } from '@/types/settlement/merchantSettlement';

/** 원장 상태 → Badge 색. 목록(ledgerColumns) · 상세 팝업(LedgerDetailModal)이 같이 쓴다 */
export const LEDGER_STATUS_TONE: Record<LedgerStatus, BadgeTone> = {
  '조치 필요': 'error',
  검증대기: 'info',
  지급대기: 'primary',
  지급보류: 'warning',
  지급완료: 'success',
  지급실패: 'error',
};
