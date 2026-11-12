import type { GridPlaceholderColumn } from '@kiwoompay/design-system';
import type { IntegratedTransaction } from '@/types/transaction/integratedTransaction';

/**
 * 통합 거래내역 Grid 열 (Figma KWPC04010100 IBSheet8_Header_Row). IBSheet8 연결 시 같은 순서 · 폭으로 Cols를 만든다.
 * TODO(시안) 민원접수 · 전체취소 · 부분취소 칸의 표시 방식(버튼 · 아이콘)은 조회결과 시안 확인 후
 */
export const transactionColumns: GridPlaceholderColumn<IntegratedTransaction>[] = [
  { key: 'complaint', header: '민원접수', width: 88, render: (row) => (row.complaint ? 'Y' : '-') },
  {
    key: 'fullCancel',
    header: '전체취소',
    width: 88,
    render: (row) => (row.cancelled === 'full' ? 'Y' : '-'),
  },
  {
    key: 'partialCancel',
    header: '부분취소',
    width: 88,
    render: (row) => (row.cancelled === 'partial' ? 'Y' : '-'),
  },
  { key: 'paidAt', header: '결제일', width: 165 },
  { key: 'cpName', header: 'CP명(서비스명)', width: 218 },
  { key: 'cpid', header: 'CPID', width: 111 },
  { key: 'payService', header: '결제서비스', width: 109 },
  { key: 'txNo', header: '거래번호', width: 183 },
  { key: 'orderNo', header: '주문번호', width: 172 },
  { key: 'buyerId', header: '구매자 ID', width: 116 },
  { key: 'customerName', header: '고객명', width: 88 },
  { key: 'issuer', header: '결제기관', width: 88 },
  { key: 'authCode', header: '결제인증값', width: 100 },
  { key: 'cardNo', header: '카드번호', width: 100 },
  { key: 'productName', header: '상품명', width: 128 },
];
