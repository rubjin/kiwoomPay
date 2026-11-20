// 예시 데이터: 메뉴 트리 (1depth 4개) · 사용 중인 메뉴 4개
// system/menu.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import { SYSTEM_MENU_ID, type MenuNode, type MenuType } from '@/features/system/menu.types';

type Seed = [id: string, name: string, type: MenuType, progLink?: string, children?: Seed[]];

const SEED: Seed[] = [
  [
    'M1000',
    '시스템관리',
    'GROUP',
    '',
    [
      [
        'M1010',
        '사용자·권한·보안 관리',
        'GROUP',
        '',
        [
          ['M1011', '계정관리', 'PAGE', '/system/user-security/account'],
          ['M1012', '조직관리', 'PAGE', '/system/user-security/organization'],
          ['M1013', '메뉴·기능 관리', 'PAGE', '/system/user-security/menu'],
          ['M1014', '권한 템플릿 관리', 'PAGE', '/system/user-security/permission-template'],
          ['M1015', '권한 신청 승인 관리', 'PAGE', '/system/user-security/permission-approval'],
        ],
      ],
      [
        'M1020',
        '기준정보·코드 관리',
        'GROUP',
        '',
        [
          ['M1021', '키움페이 표준코드', 'PAGE', '/system/code/standard'],
          ['M1022', '원천사 응답/에러코드', 'PAGE', '/system/code/source-error'],
        ],
      ],
    ],
  ],
  [
    'M2000',
    '운영관리',
    'GROUP',
    '',
    [
      [
        'M2010',
        '가맹점 계약 관리',
        'GROUP',
        '',
        [['M2011', '가맹점 기본/계약 정보 관리', 'PAGE', '/operation/merchant-contract/basic']],
      ],
    ],
  ],
  [
    'M3000',
    '거래내역',
    'GROUP',
    '',
    [
      [
        'M3010',
        '통합 거래 및 예외 관리',
        'GROUP',
        '',
        [['M3011', '통합 거래 내역', 'PAGE', '/transaction/integrated/list']],
      ],
    ],
  ],
  [
    'M4000',
    '정산내역',
    'GROUP',
    '',
    [
      [
        'M4010',
        '가맹점 정산 관리',
        'GROUP',
        '',
        [['M4011', '가맹점 정산 실행/처리', 'PAGE', '/settlement/merchant/execute']],
      ],
    ],
  ],
];

const build = (seeds: Seed[], parent: MenuNode): MenuNode[] =>
  seeds.map(([id, name, type, progLink = '', children], i) => {
    const node: MenuNode = {
      id,
      name,
      level: parent.level + 1,
      parentId: parent.id,
      type,
      description:
        id === 'M1013'
          ? '메뉴 구조와 기능코드를 등록·관리하고, 메뉴 및 기능별 권한 적용 기준을 설정합니다.'
          : '',
      progLink,
      sortOrder: i + 1,
      use: id !== 'M1022',
    };
    if (children) node.children = build(children, node);
    return node;
  });

export const MENU_ROOT: MenuNode = {
  id: SYSTEM_MENU_ID,
  name: '내부관리자',
  level: 0,
  parentId: null,
  type: 'GROUP',
  description: '',
  progLink: '',
  sortOrder: 1,
  use: true,
};
MENU_ROOT.children = build(SEED, MENU_ROOT);

/** 사용 이력이 있는 3Depth 메뉴 — 삭제 불가 (이력 검증은 서버) */
export const USED_MENU_IDS = new Set(['M1011', 'M1013', 'M3011', 'M4011']);
