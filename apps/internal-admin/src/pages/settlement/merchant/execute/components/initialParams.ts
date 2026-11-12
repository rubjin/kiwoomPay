import type { MerchantSettlementParams } from '@/types/settlement/merchantSettlement';

/** 가맹점 정산 실행/처리 검색 초기값 ([초기화] 기준). 화면에 들어올 때마다 새로 만든다 */
export function createInitialParams(): MerchantSettlementParams {
  return {
    cpid: '',
    bizNo: '',
    merchantName: '',
    payDate: { start: '', end: '' },
    quickPeriod: '',
    cycles: [],
  };
}
