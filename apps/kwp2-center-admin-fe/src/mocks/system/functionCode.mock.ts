// 예시 데이터: 기능 13건 · 사용 중인 기능 코드 4개
// system/functionCode.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import {
  type FunctionItem,
  type FunctionType,
  type PermissionKind,
  type SpecialApply,
} from '@/features/system/functionCode.types';

type Seed = [
  code: string,
  name: string,
  type: FunctionType,
  tabCode: string | null,
  key: string,
  kind?: PermissionKind,
  special?: [code: string, apply: SpecialApply],
];

const SEED: Record<string, Seed[]> = {
  // 메뉴·기능 관리 (화면설계서 예시 7건)
  M1013: [
    ['F1001', '메뉴 관리', 'TAB', null, 'MENU_TAB'],
    ['F1002', '기능 코드 관리', 'TAB', null, 'FUNCTION_TAB'],
    ['F1003', '하위 메뉴 추가', 'BUTTON', 'F1001', 'MENU_ADD'],
    ['F1004', '메뉴 삭제', 'BUTTON', 'F1001', 'MENU_DELETE'],
    ['F1005', '메뉴 저장', 'BUTTON', 'F1001', 'MENU_SAVE'],
    ['F1006', '기능 추가', 'BUTTON', 'F1002', 'FUNCTION_ADD'],
    ['F1007', '기능 삭제', 'BUTTON', 'F1002', 'FUNCTION_DELETE'],
  ],
  M1011: [
    ['F2001', '계정 목록', 'TAB', null, 'ACCOUNT_TAB'],
    ['F2002', '엑셀 다운로드', 'BUTTON', 'F2001', 'ACCOUNT_EXCEL'],
    [
      'F2003',
      '개인정보 원문 보기',
      'BUTTON',
      'F2001',
      'ACCOUNT_RAW',
      'SPECIAL',
      ['SP0001', 'OPTION'],
    ],
  ],
  M3011: [
    ['F3001', '엑셀 다운로드', 'BUTTON', null, 'TX_EXCEL'],
    ['F3002', '개인정보 원문 보기', 'BUTTON', null, 'TX_RAW', 'SPECIAL', ['SP0001', 'OPTION']],
    [
      'F3003',
      '원문 엑셀 다운로드',
      'BUTTON',
      null,
      'TX_RAW_EXCEL',
      'SPECIAL',
      ['SP0002', 'OPTION'],
    ],
  ],
};

export const FUNCTIONS: FunctionItem[] = Object.entries(SEED).flatMap(([menuId, seeds]) =>
  seeds.map(([code, name, type, tabCode, key, kind = 'NORMAL', special], i) => ({
    code,
    menuId,
    name,
    type,
    tabCode,
    kind,
    key,
    specialCode: special?.[0] ?? null,
    specialApply: special?.[1] ?? null,
    sortOrder: i + 1,
    use: true,
  })),
);

/** 권한이 부여됐거나 사용 이력이 있는 기능 — 삭제 불가 (이력 확인은 서버) */
export const USED_FUNCTION_CODES = new Set(['F1001', 'F1002', 'F2002', 'F3001']);
