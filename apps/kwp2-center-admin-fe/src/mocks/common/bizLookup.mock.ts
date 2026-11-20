// 예시 데이터: 사업자 5곳(CPID 1만 개짜리 포함) · 서비스 3종 · 정산주기 6종
// api/bizLookup.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type { BizRow } from '@/api/bizLookup.types';

export const BUSINESSES: BizRow[] = [
  { bizNo: '000-00-00000', name: '테스트상사', cpidCount: 10000 },
  { bizNo: '000-00-00001', name: '테스트상사 리테일', cpidCount: 12 },
  { bizNo: '000-00-00002', name: '테스트상사 서비스', cpidCount: 1 },
  { bizNo: '000-00-00003', name: '테스트상사 유통', cpidCount: 128 },
  { bizNo: '000-00-00004', name: '테스트상사 온라인', cpidCount: 3 },
];

export const CPID_SERVICES = ['신용카드', '계좌이체', '가상계좌'];

export const SETTLE_CYCLES = ['D+1', 'D+1', 'D+2', 'D+1', '주정산', '월 1회'];
