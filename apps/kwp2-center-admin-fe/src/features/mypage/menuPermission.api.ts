import type { TreeOptionNode } from '@kiwoompay/design-system';
import { wait } from '@/api/mock';

/** 신청할 수 있는 메뉴 권한 트리 — 승인대기 권한은 pending */
export interface MenuPermissionNode extends Omit<TreeOptionNode, 'options' | 'children'> {
  children?: MenuPermissionNode[];
  options?: { value: string; label: string; pending?: boolean }[];
}

// TODO(API) 메뉴 권한 트리 · 신청 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터 (Figma 메뉴 권한 신청)
const TREE: MenuPermissionNode[] = [
  {
    id: 'settlement',
    label: '정산내역',
    children: [
      {
        id: 'settlement-merchant',
        label: '가맹점 정산 관리',
        children: [
          {
            id: 'KWPC0602',
            label: '통합 정산 내역',
            current: ['조회'],
            options: [
              { value: 'PROCESS', label: '처리' },
              { value: 'DOWNLOAD', label: '다운로드' },
            ],
          },
          {
            id: 'KWPC0601',
            label: '가맹점 정산 실행/처리',
            current: ['조회'],
            options: [{ value: 'PROCESS', label: '처리', pending: true }],
          },
          {
            id: 'KWPC0603',
            label: '정산 예정 금액 조회',
            current: ['조회'],
            options: [{ value: 'DOWNLOAD', label: '다운로드' }],
          },
          {
            id: 'KWPC0604',
            label: '승인/정산 캘린더',
            current: ['조회'],
            options: [{ value: 'UPDATE', label: '수정' }],
          },
        ],
      },
      {
        id: 'settlement-data',
        label: '정산자료관리',
        children: [
          {
            id: 'KWPC0611',
            label: '정산 자료 추출/다운로드',
            current: ['조회'],
            options: [{ value: 'DOWNLOAD', label: '다운로드' }],
          },
          {
            id: 'KWPC0612',
            label: '정산 내역 검증',
            current: ['조회'],
            options: [{ value: 'PROCESS', label: '처리' }],
          },
        ],
      },
    ],
  },
  {
    id: 'operation',
    label: '운영관리',
    children: [
      {
        id: 'operation-merchant',
        label: '가맹점 & 계약 통합관리',
        children: [
          {
            id: 'KWPC0701',
            label: '가맹점 기본/계약 정보 관리',
            current: ['조회'],
            options: [
              { value: 'CREATE', label: '등록' },
              { value: 'UPDATE', label: '수정' },
            ],
          },
        ],
      },
    ],
  },
];

export async function fetchMenuPermissionTree(): Promise<MenuPermissionNode[]> {
  await wait(200);
  return TREE;
}

export async function requestMenuPermissions(request: {
  items: Record<string, string[]>;
  reason: string;
}): Promise<void> {
  await wait(500);
  void request;
}
