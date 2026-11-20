// 예시 데이터: 특수권한 코드 4개 · 연결 기능
// system/specialCode.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import { type LinkedFunction, type SpecialCode } from '@/features/system/specialCode.types';

const LINK_BASE: Omit<LinkedFunction, 'id'>[] = [
  { location: '거래내역', name: '통합 거래 내역 · 원문 엑셀', apply: '옵션 노출' },
  { location: '정산내역', name: '통합 정산 내역 · 원문 엑셀', apply: '옵션 노출' },
  { location: '운영관리', name: '가맹점 정보 · 원문 엑셀', apply: '옵션 노출' },
  { location: '정산내역', name: '정산 예정 금액 · 원문 엑셀', apply: '옵션 노출' },
  { location: '운영관리', name: '계약 정보 · 원문 엑셀', apply: '옵션 노출' },
  { location: '시스템관리', name: '계정관리 · 개인정보 원문 보기', apply: '버튼 노출' },
];

const links = (count: number, offset = 0): LinkedFunction[] =>
  Array.from({ length: count }, (_, i) => {
    const base = LINK_BASE[(i + offset) % LINK_BASE.length]!;
    const round = Math.floor(i / LINK_BASE.length);
    return {
      ...base,
      id: `L${offset}-${i}`,
      name: round ? `${base.name} ${round + 1}` : base.name,
    };
  });

export const SPECIAL_CODES: { code: SpecialCode; links: LinkedFunction[] }[] = [
  ['SP0001', '개인정보 마스킹 해제', '마스킹된 개인정보를 원문으로 볼 수 있는 특수권한', 1, 5],
  [
    'SP0002',
    '개인정보 원문 다운로드',
    '개인정보 원문이 포함된 파일을 다운로드할 수 있는 특수권한',
    23,
    0,
  ],
  ['SP0003', '정산계좌 변경', '가맹점 정산계좌를 변경할 수 있는 특수권한', 1, 2],
  ['SP0004', '수수료 수정', '가맹점 수수료를 수정할 수 있는 특수권한', 1, 3],
].map(([code, name, description, count, offset]) => {
  const list = links(count as number, offset as number);
  return {
    code: {
      code: code as string,
      name: name as string,
      description: description as string,
      use: true,
      linkedCount: list.length,
    },
    links: list,
  };
});

/** 신청 · 결재 · 부여 · 사용 이력이 있는 코드 (이력 검사는 서버) */
export const USED_SPECIAL_CODES = new Set(['SP0001']);
