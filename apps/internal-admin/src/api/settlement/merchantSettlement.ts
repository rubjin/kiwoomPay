import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  MerchantSettlementParams,
  MerchantSettlementSummary,
  SettlementLedger,
} from '@/types/settlement/merchantSettlement';
import { paginate, wait } from '@/api/mock';

// TODO(API) 정산원장 조회 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터
const SAMPLE: SettlementLedger[] = [
  [
    'STL-0831-01',
    '조치 필요',
    '일반',
    null,
    '2026-09-01',
    '2026-09-02',
    'CP000101',
    '다우커머스',
    '000-00-00001',
    '신용카드',
    'D+1 영',
    '2026-09-01~2026-09-01',
    1240,
  ],
  [
    'STL-0831-02',
    '검증대기',
    '일반',
    null,
    '2026-08-31',
    '2026-09-01',
    'CP000102',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    '2026-08-31~2026-08-31',
    830,
  ],
  [
    'ADJ-02-01',
    '검증대기',
    '조정',
    'STL-0831-02',
    '2026-08-31',
    '2026-09-01',
    'CP000102',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    null,
    null,
  ],
  [
    'ADJ-02-02',
    '검증대기',
    '조정',
    'STL-0831-02',
    '2026-08-31',
    '2026-09-01',
    'CP000102',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    null,
    null,
  ],
  [
    'ADJ-OFF-01',
    '검증대기',
    '조정',
    'STL-0831-02',
    '2026-08-31',
    '2026-09-01',
    'CP000102',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    null,
    null,
  ],
  [
    'STL-0901-03',
    '검증대기',
    '일반',
    null,
    '2026-08-31',
    '2026-09-01',
    'CP000103',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    '2026-08-31~2026-08-31',
    8,
  ],
  [
    'ADJ-OFF-02',
    '검증대기',
    '조정',
    'STL-0901-03',
    '2026-08-31',
    '2026-09-01',
    'CP000103',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    null,
    null,
  ],
  [
    'STL-0830-04',
    '검증대기',
    '당사환불',
    null,
    '2026-07-31',
    '2026-08-31',
    'CP000104',
    '새봄리테일',
    '000-00-00004',
    '신용카드',
    'M+1월말',
    '2026-07-01~2026-07-31',
    480,
  ],
  [
    'STL-0829-05',
    '검증대기',
    '관리비',
    null,
    '2026-08-31',
    '2026-09-01',
    'CP000105',
    '온누리마켓',
    '000-00-00005',
    '신용카드',
    'M+1월초',
    '2026-08-01~2026-08-31',
    390,
  ],
  [
    'STL-0828-06',
    '조치 필요',
    '분리정산',
    null,
    '2026-09-03',
    '2026-09-10',
    'CP000106',
    '모아쇼핑',
    '000-00-00006',
    '휴대폰결제',
    'D+5 영',
    '2026-08-30~2026-09-03',
    320,
  ],
].map(
  ([
    ledgerId,
    status,
    type,
    sourceLedgerId,
    closed,
    payDate,
    cpid,
    merchantName,
    bizNo,
    payMethod,
    cycle,
    period,
    txCount,
  ]) =>
    ({
      ledgerId,
      status,
      type,
      sourceLedgerId,
      closedAt: `${closed as string} 00:00:00`,
      payDate,
      cpid,
      merchantName,
      bizNo,
      payMethod,
      cycle,
      period,
      txCount,
    }) as SettlementLedger,
);

const SUMMARY: MerchantSettlementSummary = {
  target: 28,
  actionRequired: 4,
  verifying: 14,
  waiting: 6,
  hold: 4,
  paid: 0,
  failed: 0,
};

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
  const rows = SAMPLE.filter(
    (row) =>
      (!params.cpid || row.cpid.includes(params.cpid.trim())) &&
      (!params.bizNo || row.bizNo.includes(params.bizNo.trim())) &&
      (!keyword || row.merchantName.includes(keyword)),
  );
  if (rows.length === 0) {
    return {
      items: [],
      total: 0,
      summary: { ...SUMMARY, target: 0, actionRequired: 0, verifying: 0, waiting: 0, hold: 0 },
    };
  }
  // 예시 데이터는 10건뿐이라 페이지마다 반복해서 보여준다
  const filtered = rows.length === SAMPLE.length;
  const total = filtered ? SUMMARY.target : rows.length;
  const start = (page - 1) * pageSize;
  const items = filtered
    ? Array.from(
        { length: Math.min(pageSize, total - start) },
        (_, i) => SAMPLE[(start + i) % SAMPLE.length] as SettlementLedger,
      )
    : paginate(rows, { page, pageSize }).items;
  return { items, total, summary: filtered ? SUMMARY : { ...SUMMARY, target: total } };
}

/** 선택 원장 업무 처리 (지급확정 · 지급보류 …) */
export async function requestLedgerAction(action: string, ledgerIds: string[]) {
  await wait(300);
  return { action, count: ledgerIds.length };
}
