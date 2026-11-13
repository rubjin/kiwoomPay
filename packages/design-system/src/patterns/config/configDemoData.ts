import type { TransferItem } from './TransferList';

// P07 스토리 예시 데이터 — Figma KWPC04010107 · KWPC04010105 (임의 작업: 값은 시안 그대로, 동작은 예시)

/** 엑셀 다운로드 항목 (Figma 전체 항목 + 선택 항목) */
export const EXCEL_COLUMNS: TransferItem[] = [
  '거래일시',
  '거래원천',
  'VAN사',
  '거래구분',
  '가맹점/CPID',
  '거래번호',
  '결제수단',
  '승인번호',
  '거래금액',
  '거래상태',
  '주문번호',
  '구매자',
  '카드사',
  '카드번호',
  '전화번호',
  '결제요청코드',
].map((label, i) => ({ key: `col${i + 1}`, label }));

/** 기본 선택 (출력 순서) */
export const EXCEL_DEFAULT = EXCEL_COLUMNS.slice(0, 10).map((c) => c.key);

export interface DemoCondition {
  id: string;
  name: string;
  rows: { label: string; value: string }[];
}

const PAY_ALL =
  '신용카드, 휴대폰, 계좌이체, 가상계좌, KT집전화결제, 문화상품권, 게임문화상품권, 도서상품권, 해피머니, 에그머니, 모바일팝, 틴캐시, 티머니(캐시비), CMS(자동이체), 알리페이, 장바구니, 카카오페이, 위쳇페이, 네이버페이, 제로페이, 삼성페이, 페이코, 애플페이, 선불카드, 가상자산, 현금영수증';

const cond = (
  id: string,
  name: string,
  period: string,
  source: string,
  type: string,
  pay = '전체',
  status = '전체',
): DemoCondition => ({
  id,
  name,
  rows: [
    { label: '조회기준일', value: '결제일' },
    { label: '조회기간', value: period },
    { label: '거래원천', value: source },
    { label: '거래구분', value: type },
    { label: '결제수단', value: pay },
    { label: '거래상태', value: status },
  ],
});

/** 저장된 검색조건 12건 (Figma 목록) */
export const SAVED_CONDITIONS: DemoCondition[] = [
  { ...cond('c1', '선택 결제수단 승인 거래', '1주일', 'PG', '승인', PAY_ALL, '승인') },
  cond('c2', 'VAN 승인 거래', '1개월', 'VAN', '승인'),
  cond('c3', '취소 거래 확인', '1주일', '전체', '취소'),
  cond('c4', '최근 1개월 전체 거래', '1개월', '전체 원천', '전체 거래'),
  cond('c5', '카카오페이 거래', '1주일', '전체', '승인', '카카오페이'),
  cond('c6', '신용카드 거래', '2개월', '전체', '전체 거래', '신용카드'),
  cond('c7', '부분취소 거래', '1개월', '전체', '부분취소'),
  cond('c8', 'PG 거래 조회', '1주일', 'PG', '전체'),
  cond('c9', '삼성페이 승인내역', '3개월', '전체', '승인', '삼성페이'),
  cond('c10', '전일 취소내역', '1주일', '전체 원천', '취소'),
  cond('c11', '네이버페이 거래', '1개월', '전체', '승인', '네이버페이'),
  cond('c12', '가상계좌 입금', '1주일', '전체', '승인', '가상계좌'),
];

/** 카드 한 줄 요약: 조회기간 · 거래원천 · 거래구분 · 결제수단(많으면 N개) */
export function summarizeCondition(c: DemoCondition): string {
  const v = (label: string) => c.rows.find((r) => r.label === label)?.value ?? '';
  const pay = v('결제수단');
  const payText = pay.includes(',')
    ? `결제수단 ${pay.split(',').length}개`
    : pay === '전체'
      ? ''
      : pay;
  return [v('조회기간'), v('거래원천'), v('거래구분'), payText].filter(Boolean).join(' · ');
}

/** "현재 화면 검색조건" 예시 (덮어쓰기 · 신규 등록에 쓴다) */
export const CURRENT_SCREEN_ROWS = cond(
  'now',
  '',
  '1주일',
  'PG',
  '승인',
  '신용카드, 카카오페이',
  '승인',
).rows;
