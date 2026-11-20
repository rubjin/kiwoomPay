import { Badge, Text, type GridPlaceholderColumn } from '@kiwoompay/design-system';
import type { MenuNode } from '@/features/system/menu.types';
import type { FunctionItem } from '@/features/system/functionCode.types';

/** 왼쪽 메뉴 트리 열 (화면설계서 ②) */
export const MENU_TREE_COLUMNS: GridPlaceholderColumn<MenuNode>[] = [
  { key: 'name', header: '메뉴명' },
  { key: 'id', header: '메뉴ID', width: 88 },
];

/**
 * 기능 목록 열 (화면설계서 ③): 기능명(버튼·기능은 아래 줄에 소속 탭) · 기능코드 · 유형 · 권한 · 상태.
 * 폭은 기획서 비율 — TODO(시안)
 */
export const createFunctionColumns = (
  tabName: (code: string) => string | undefined,
): GridPlaceholderColumn<FunctionItem>[] => [
  {
    key: 'name',
    header: '기능명',
    render: (f) => {
      const tab = f.tabCode ? tabName(f.tabCode) : undefined;
      return (
        <>
          {f.name}
          {tab && (
            <Text as="div" variant="caption-md">
              └ {tab}
            </Text>
          )}
        </>
      );
    },
  },
  { key: 'code', header: '기능코드', width: 80 },
  {
    key: 'type',
    header: '유형',
    width: 72,
    render: (f) => (
      <Badge size="sm" tone={f.type === 'TAB' ? 'info' : 'neutral'}>
        {f.type === 'TAB' ? '탭' : '버튼'}
      </Badge>
    ),
  },
  {
    key: 'kind',
    header: '권한',
    width: 64,
    render: (f) => (
      <Badge size="sm" tone={f.kind === 'SPECIAL' ? 'warning' : 'neutral'}>
        {f.kind === 'SPECIAL' ? '특수' : '일반'}
      </Badge>
    ),
  },
  {
    key: 'use',
    header: '상태',
    width: 64,
    render: (f) => (
      <Badge size="sm" tone={f.use ? 'success' : 'neutral'}>
        {f.use ? '사용' : '미사용'}
      </Badge>
    ),
  },
];
