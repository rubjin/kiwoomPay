import { textValue, type SearchFieldDef } from '@kiwoompay/design-system';
import { getCodeOptions } from '@/store/code';
import type { MerchantSettlementParams } from '@/types/settlement/merchantSettlement';

/**
 * 가맹점 정산 실행/처리 검색 조건 정의 — 적용된 검색 조건 칩 순서 (지급예정일 · 정산주기 먼저).
 * 정산주기는 선택 없음 · 전체 선택이면 "전체"
 */
export const SEARCH_FIELDS: SearchFieldDef<MerchantSettlementParams>[] = [
  {
    key: 'payDate',
    label: '지급예정일',
    format: ({ payDate: { start, end } }) => (start || end ? `${start} ~ ${end}` : null),
  },
  {
    key: 'cycles',
    label: '정산주기',
    format: ({ cycles }) => {
      const options = getCodeOptions('SETTLEMENT_CYCLE');
      return cycles.length === 0 || cycles.length === options.length
        ? '전체'
        : options
            .filter((o) => cycles.includes(o.value))
            .map((o) => o.label)
            .join(', ');
    },
  },
  { key: 'cpid', label: 'CPID', format: (p) => textValue(p.cpid) },
  { key: 'bizNo', label: '사업자번호', format: (p) => textValue(p.bizNo) },
  { key: 'merchantName', label: '가맹점명', format: (p) => textValue(p.merchantName) },
];
