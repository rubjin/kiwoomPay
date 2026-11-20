import { textValue, type SearchFieldDef } from '@kiwoompay/design-system';
import { getCodeOptions } from '@/store/code';
import type { CodeGroup } from '@/constants/codes';
import type { MerchantSettlementParams } from '@/features/settlement/merchantSettlement.types';

/** 고른 코드 이름 (선택 없음 · 전체 선택이면 "전체") */
const codesValue = (group: CodeGroup, values: string[]) => {
  const options = getCodeOptions(group);
  return values.length === 0 || values.length === options.length
    ? '전체'
    : options
        .filter((o) => values.includes(o.value))
        .map((o) => o.label)
        .join(', ');
};
/** 상세 검색 — 선택 없음 · 전체면 칩 없음 */
const pickedValue = (group: CodeGroup, values: string[]) =>
  values.length === 0 || values.length === getCodeOptions(group).length
    ? null
    : codesValue(group, values);

/**
 * 가맹점 정산 실행/처리 검색 조건 정의 — 적용된 검색 조건 칩 순서 (지급예정일 · 정산주기 먼저).
 * 정산주기는 선택 없음 · 전체 선택이면 "전체", 상세 검색(결제수단 · 정산구분 · 처리사유)은 고른 것이 있을 때만
 */
export const SEARCH_FIELDS: SearchFieldDef<MerchantSettlementParams>[] = [
  {
    key: 'payDate',
    label: '지급예정일',
    format: ({ payDate: { start, end } }) => (start || end ? `${start} ~ ${end}` : null),
  },
  { key: 'cycles', label: '정산주기', format: (p) => codesValue('SETTLEMENT_CYCLE', p.cycles) },
  { key: 'cpid', label: 'CPID', format: (p) => textValue(p.cpid) },
  { key: 'bizNo', label: '사업자번호', format: (p) => textValue(p.bizNo) },
  { key: 'merchantName', label: '가맹점명', format: (p) => textValue(p.merchantName) },
  // 상세 검색 — 고른 것이 있을 때만 칩
  {
    key: 'payMethods',
    label: '결제수단',
    format: (p) => pickedValue('SETTLEMENT_PAY_METHOD', p.payMethods),
  },
  { key: 'types', label: '정산구분', format: (p) => pickedValue('SETTLEMENT_TYPE', p.types) },
  { key: 'reasons', label: '처리사유', format: (p) => pickedValue('SETTLEMENT_REASON', p.reasons) },
];
