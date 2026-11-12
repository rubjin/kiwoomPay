import type { IntegratedTransactionParams } from '@/types/transaction/integratedTransaction';
import { rangeOfQuickPeriod } from '@/utils/period';

/**
 * 통합 거래내역 검색 초기값 ([초기화] · 내 검색조건 신규 저장 기준).
 * 조회기간(최근 1주일)이 오늘 기준이라 화면에 들어올 때마다 새로 만든다
 */
export function createInitialParams(): IntegratedTransactionParams {
  const week = rangeOfQuickPeriod('1w');
  return {
    bizNo: '',
    cpid: '',
    dateBasis: 'pay',
    startDate: week.start,
    startTime: '00:00',
    endDate: week.end,
    endTime: '23:59',
    quickPeriod: '',
    txNo: '',
    orderNo: '',
    txType: 'all',
    payMethod: 'all',
    txStatus: 'all',
    source: 'all',
    customerName: '',
    buyerId: '',
    cardNo: '',
    approvalNo: '',
    phone: '',
    depositor: '',
    virtualAccountNo: '',
    giftCard: '',
    payRequestCode: '',
    includePersonal: true,
  };
}
