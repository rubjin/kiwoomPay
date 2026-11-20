import { transactionColumns } from './transactionColumns';

/** 엑셀 다운로드 설정 — 출력 항목 = 표 열 (TODO(API) 엑셀 전용 항목이 따로 있으면 교체) */
export const EXCEL_ITEMS = transactionColumns.map((col) => ({ key: col.key, label: col.header }));
export const EXCEL_DEFAULT_KEYS = EXCEL_ITEMS.slice(3, 13).map((item) => item.key);
export const EXCEL_TYPES = [
  { value: 'normal', label: '일반 거래내역' },
  { value: 'unpaid', label: '미납자료 추출' },
];
