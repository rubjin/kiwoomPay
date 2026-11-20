import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  MerchantSettlementParams,
  MerchantSettlementSummary,
  SettlementLedger,
} from '@/features/settlement/merchantSettlement.types';
import { paginate, wait } from '@/mocks/utils';
import type { CodeGroup } from '@/constants/codes';
import { SETTLEMENT_LEDGERS, SETTLEMENT_SUMMARY } from '@/mocks/settlement/merchantSettlement.mock';
import { getCodeOptions } from '@/store/code';

// TODO(API) 정산원장 조회 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

/** 정산원장 조회 (페이지 단위) */
export async function fetchSettlementLedgers({
  params,
  page,
  pageSize,
}: SearchRequest<MerchantSettlementParams>): Promise<
  SearchResultPage<SettlementLedger, MerchantSettlementSummary>
> {
  await wait(300);
  const keyword = params.merchantName.trim();
  // 상세 검색 (예시 데이터 거르기): 결제수단 = 이름, 정산구분 = 코드 이름('01 일반' → 일반), 처리사유 = 이름이 들어 있으면
  const labels = (group: CodeGroup, values: string[]) =>
    getCodeOptions(group)
      .filter((o) => values.includes(o.value))
      .map((o) => o.label);
  const typeNames = labels('SETTLEMENT_TYPE', params.types).map((l) => l.replace(/^\S+\s/, ''));
  const reasonNames = labels('SETTLEMENT_REASON', params.reasons);
  const rows = SETTLEMENT_LEDGERS.filter(
    (row) =>
      (!params.cpid || row.cpid.includes(params.cpid.trim())) &&
      (!params.bizNo || row.bizNo.includes(params.bizNo.trim())) &&
      (!keyword || row.merchantName.includes(keyword)) &&
      (params.payMethods.length === 0 || params.payMethods.includes(row.payMethod)) &&
      (typeNames.length === 0 || typeNames.includes(row.type)) &&
      (reasonNames.length === 0 || reasonNames.some((r) => row.reason.includes(r))),
  );
  if (rows.length === 0) {
    return {
      items: [],
      total: 0,
      summary: {
        ...SETTLEMENT_SUMMARY,
        target: 0,
        actionRequired: 0,
        verifying: 0,
        waiting: 0,
        hold: 0,
      },
    };
  }
  // 예시 데이터는 10건뿐이라 페이지마다 반복해서 보여준다
  const filtered = rows.length === SETTLEMENT_LEDGERS.length;
  const total = filtered ? SETTLEMENT_SUMMARY.target : rows.length;
  const start = (page - 1) * pageSize;
  const items = filtered
    ? Array.from(
        { length: Math.min(pageSize, total - start) },
        (_, i) => SETTLEMENT_LEDGERS[(start + i) % SETTLEMENT_LEDGERS.length] as SettlementLedger,
      )
    : paginate(rows, { page, pageSize }).items;
  return {
    items,
    total,
    summary: filtered ? SETTLEMENT_SUMMARY : { ...SETTLEMENT_SUMMARY, target: total },
  };
}

/** 선택 원장 업무 처리 (지급확정 · 지급보류 …) */
export async function requestLedgerAction(action: string, ledgerIds: string[]) {
  await wait(300);
  return { action, count: ledgerIds.length };
}
