import type { SearchResultPage } from '@kiwoompay/design-system';
import type { LedgerDetail, LedgerTx } from '@/features/settlement/ledgerDetail.types';
import type { SettlementLedger } from '@/features/settlement/merchantSettlement.types';
import { ledgerDetailOf, ledgerTxAt, ledgerTxTotal } from '@/mocks/settlement/ledgerDetail.mock';
import { wait } from '@/mocks/utils';

// TODO(API) 원장 상세 · 정산대상 거래 API가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 데이터

export async function fetchLedgerDetail(ledger: SettlementLedger): Promise<LedgerDetail> {
  await wait(200);
  return ledgerDetailOf(ledger);
}

/** 정산대상 거래 건 (페이지 단위). 예시는 830건을 만들어 낸다 */
export async function fetchLedgerTxs(
  ledger: SettlementLedger,
  page: number,
  pageSize: number,
): Promise<SearchResultPage<LedgerTx>> {
  await wait(200);
  const total = ledgerTxTotal(ledger);
  const from = (page - 1) * pageSize;
  const items = Array.from({ length: Math.max(0, Math.min(pageSize, total - from)) }, (_, k) =>
    ledgerTxAt(ledger, from + k),
  );
  return { items, total };
}

/** 원장 산출 근거 비고 저장 */
export async function saveLedgerNotes(ledgerId: string, notes: Record<string, string>) {
  await wait(300);
  return { ledgerId, count: Object.keys(notes).length };
}
