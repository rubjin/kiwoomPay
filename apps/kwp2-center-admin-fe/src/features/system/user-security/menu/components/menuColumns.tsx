import { Badge, type GridPlaceholderColumn } from '@kiwoompay/design-system';
import type { MenuNode } from '@/features/system/menu.types';

/** 메뉴 목록 트리 열 (화면설계서 KWPC10010201 ②). 폭은 기획서 비율 — TODO(시안) */
export const MENU_COLUMNS: GridPlaceholderColumn<MenuNode>[] = [
  { key: 'name', header: '메뉴명' },
  { key: 'id', header: '메뉴ID', width: 128 },
  {
    key: 'use',
    header: '상태',
    width: 80,
    // 시스템 줄(최상위)은 메뉴 코드가 아니라 상태 없음
    render: (node) =>
      node.level === 0 ? null : (
        <Badge size="sm" tone={node.use ? 'success' : 'neutral'}>
          {node.use ? '사용' : '미사용'}
        </Badge>
      ),
  },
];
