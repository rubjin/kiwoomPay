// 예시 데이터: 통합 거래 23건 · 가맹점 4곳
// transaction/integratedTransaction.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type { IntegratedTransaction } from '@/features/transaction/integratedTransaction.types';

const CP = [
  ['키움쇼핑(키움몰)', 'CP000101', '신용카드', '신한카드'],
  ['다우커머스(다우샵)', 'CP000102', '간편결제', '카카오페이'],
  ['새봄리테일(새봄)', 'CP000104', '신용카드', '국민카드'],
  ['온누리마켓(온누리)', 'CP000105', '휴대폰결제', 'SKT'],
] as const;

export const TRANSACTIONS: IntegratedTransaction[] = Array.from({ length: 23 }, (_, i) => {
  const [cpName, cpid, payService, issuer] = CP[i % CP.length]!;
  const day = String(30 - (i % 7)).padStart(2, '0');
  return {
    txNo: `T2026103${i % 10}${String(100000 + i * 37)}`,
    complaint: i % 9 === 4,
    cancelled: i % 6 === 2 ? 'full' : i % 8 === 5 ? 'partial' : null,
    paidAt: `2026-10-${day} ${String(9 + (i % 9)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00`,
    cpName,
    cpid,
    payService,
    orderNo: `ORD-${20261000 + i * 13}`,
    buyerId: `user${String(i + 1).padStart(3, '0')}`,
    customerName: ['김*준', '이*연', '박*훈', '최*진'][i % 4]!,
    issuer,
    authCode: String(30000000 + i * 4211).slice(0, 8),
    cardNo: payService === '신용카드' ? `9410-****-****-${String(1000 + i * 3)}` : '-',
    productName: ['정기구독 1개월', '생활용품 세트', '모바일 쿠폰', '도서 2권'][i % 4]!,
  };
});
