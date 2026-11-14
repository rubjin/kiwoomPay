import type { Option } from '@/constants/options';
import type { IntegratedTransactionParams } from './integratedTransaction.types';

// 거래내역(1depth) 화면들이 같이 쓰는 고정 선택지. 앱 전체 공통은 constants/options

type DateBasis = IntegratedTransactionParams['dateBasis'];

/** 조회기준일 (검색 조건 값과 묶인 고정 선택지 — 공통코드 아님) */
export const DATE_BASIS: Option<DateBasis>[] = [
  { value: 'pay', label: '결제일' },
  { value: 'cancel', label: '취소일' },
];
/** RadioGroup onChange(string) → 조회기준일 값인지 확인 (타입 단언 대신) */
export const isDateBasis = (value: string): value is DateBasis =>
  DATE_BASIS.some((o) => o.value === value);
