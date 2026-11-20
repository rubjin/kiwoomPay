// 예시 데이터: 권한 템플릿 6개 · 변경 이력 (T01 12건)
// system/permissionTemplate.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import {
  type PermissionTemplate,
  type TemplateChangeType,
  type TemplateHistoryItem,
} from '@/features/system/permissionTemplate.types';

const SETTLEMENT_MENUS = ['M3000', 'M3010', 'M3011', 'M4000', 'M4010', 'M4011'];

export const TEMPLATES: PermissionTemplate[] = [
  [
    'T01',
    '정산담당',
    '정산업무 담당자에게 부여할 기본 메뉴·기능 권한 구성',
    7,
    SETTLEMENT_MENUS,
    ['F3001'],
  ],
  ['T02', 'RM담당', '리스크 관리 담당 기본 권한', 4, ['M3000', 'M3010', 'M3011'], []],
  ['T03', '가맹점운영', '가맹점 운영 담당 기본 권한', 12, ['M2000', 'M2010', 'M2011'], []],
  ['T04', 'CS상담', '고객 상담 담당 기본 권한', 2, ['M3000', 'M3010', 'M3011'], ['F3001']],
  ['T05', '영업관리', '영업 관리 담당 기본 권한', 5, ['M2000', 'M2010', 'M2011'], []],
  ['T06', '정산담당(구)', '이전 정산 담당 권한 구성', 0, ['M4000', 'M4010', 'M4011'], [], false],
].map(([id, name, description, linkedAccounts, menuIds, functionCodes, use = true]) => ({
  id: id as string,
  name: name as string,
  description: description as string,
  linkedAccounts: linkedAccounts as number,
  menuIds: menuIds as string[],
  functionCodes: functionCodes as string[],
  use: use as boolean,
}));

/** 과거 적용 · 사용 이력이 있는 템플릿 (서버 검증) */
export const USED_TEMPLATE_IDS = new Set(['T06']);

type HistorySeed = [
  changedAt: string,
  changedBy: string,
  type: TemplateChangeType,
  item: string,
  before: string,
  after: string,
];

/** 정산담당 12건 — 화면설계서 예시 */
const T01_HISTORY: HistorySeed[] = [
  ['2026-10-20 15:42', 'admin01', 'PERMISSION', '통합 거래 내역 / 엑셀', '미부여', '부여'],
  ['2026-10-15 10:18', 'admin02', 'PERMISSION', '정산스케줄 / 접근', '미부여', '부여'],
  [
    '2026-10-10 16:25',
    'admin01',
    'INFO',
    '템플릿 설명',
    '정산담당 기본 권한',
    '정산업무 기본 권한',
  ],
  ['2026-09-29 11:02', 'admin02', 'USE', '템플릿 사용여부', '미사용', '사용'],
  ['2026-09-27 14:10', 'admin01', 'PERMISSION', '지급대상 확정 / 확정', '부여', '미부여'],
  ['2026-09-26 09:40', 'admin02', 'PERMISSION', '통합 정산 내역 / 엑셀', '미부여', '부여'],
  ['2026-09-25 17:22', 'admin01', 'USE', '템플릿 사용여부', '사용', '미사용'],
  ['2026-09-25 13:05', 'admin01', 'INFO', '템플릿명', '정산', '정산담당'],
  ['2026-09-25 11:30', 'admin02', 'PERMISSION', '정산내역 / 접근', '미부여', '부여'],
  ['2026-09-25 10:12', 'admin01', 'PERMISSION', '거래내역 / 접근', '미부여', '부여'],
  ['2026-09-25 09:30', 'admin01', 'INFO', '템플릿 설명', '-', '정산담당 기본 권한'],
  ['2026-09-25 09:10', 'admin01', 'CREATE', '템플릿 생성', '-', '정산담당'],
];

export const TEMPLATE_HISTORY: Record<string, TemplateHistoryItem[]> = {
  T01: T01_HISTORY.map(([changedAt, changedBy, type, item, before, after], i) => ({
    id: `T01-${i}`,
    changedAt,
    changedBy,
    type,
    item,
    before,
    after,
  })),
};
for (const t of TEMPLATES) {
  TEMPLATE_HISTORY[t.id] ??= [
    {
      id: `${t.id}-0`,
      changedAt: '2026-09-01 09:00',
      changedBy: 'admin01',
      type: 'CREATE',
      item: '템플릿 생성',
      before: '-',
      after: t.name,
    },
  ];
}
