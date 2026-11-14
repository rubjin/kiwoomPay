import { Stack, type GridPlaceholderColumn } from '@kiwoompay/design-system';
import type { ReactNode } from 'react';
import { formatNumber } from '@/utils/format';
import type { LedgerActionRow } from './ledgerActionRows';

/** 두 줄 칸 (가맹점 / CPID · 결제수단 / 주기 · 사유 / 금액) */
export function TwoLines({ top, bottom }: { top: ReactNode; bottom: ReactNode }) {
  return (
    <Stack as="span" gap={0} style={{ paddingBlock: 'var(--kp-space-4)' }}>
      <span>{top}</span>
      <span>{bottom}</span>
    </Stack>
  );
}

type Column = GridPlaceholderColumn<LedgerActionRow>;

/** 일괄 처리 팝업 공통 열 */
export const LEDGER_ID_COLUMN = (header = '원장 ID'): Column => ({
  key: 'ledgerId',
  header,
  width: 100,
});

export const MERCHANT_COLUMN: Column = {
  key: 'merchant',
  header: '가맹점 / CPID',
  align: 'left',
  render: (r) => <TwoLines top={r.merchantName} bottom={r.cpid} />,
};

/** 금액 열 (오른쪽 정렬, 천 단위 쉼표) */
export const amountColumn = (
  key: string,
  header: string,
  pick: (r: LedgerActionRow) => number,
): Column => ({ key, header, width: 104, align: 'right', render: (r) => formatNumber(pick(r)) });
