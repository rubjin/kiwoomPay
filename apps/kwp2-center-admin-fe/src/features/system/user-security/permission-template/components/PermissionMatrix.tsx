import {
  Checkbox,
  SelectionGroup,
  TreeTable,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import type { FunctionItem } from '@/features/system/functionCode.types';
import type { MenuNode } from '@/features/system/menu.types';
import { selfAndDescendants } from './templateParams';

interface PermissionMatrixProps {
  /** 1Depth 메뉴부터 (시스템 줄 제외) */
  menus: MenuNode[];
  /** 3Depth 메뉴별 일반 기능 (특수권한 기능 제외) */
  functionsByMenu: Record<string, FunctionItem[]>;
  menuIds: string[];
  functionCodes: string[];
  onChange: (next: { menuIds: string[]; functionCodes: string[] }) => void;
  expandedIds: string[];
  onExpandedChange: (ids: string[]) => void;
}

/**
 * 화면설계서 KWPC10010301 ④ 권한 항목: 1~3Depth 메뉴 접근 + 4Depth 탭 · 버튼 · 업무 기능권한.
 * 메뉴 접근을 켜고 끄면 하위 메뉴 접근도 함께(기능권한은 그대로 개별 선택), 메뉴 접근이 없는 기능은 선택 불가 · 해제
 */
export function PermissionMatrix({
  menus,
  functionsByMenu,
  menuIds,
  functionCodes,
  onChange,
  expandedIds,
  onExpandedChange,
}: PermissionMatrixProps) {
  const toggleMenu = (node: MenuNode, on: boolean) => {
    const ids = selfAndDescendants(node);
    const nextMenus = on
      ? [...new Set([...menuIds, ...ids])]
      : menuIds.filter((id) => !ids.includes(id));
    // 메뉴 접근을 끄면 그 메뉴들의 기능권한도 뺀다 (접근 없는 기능은 선택 불가)
    const offCodes = on ? [] : ids.flatMap((id) => (functionsByMenu[id] ?? []).map((f) => f.code));
    onChange({
      menuIds: nextMenus,
      functionCodes: functionCodes.filter((c) => !offCodes.includes(c)),
    });
  };

  const toggleFunction = (code: string, on: boolean) =>
    onChange({
      menuIds,
      functionCodes: on ? [...functionCodes, code] : functionCodes.filter((c) => c !== code),
    });

  const columns: GridPlaceholderColumn<MenuNode>[] = [
    // 폭: 메뉴 열 고정, 기능 권한 열이 남는 폭 (TODO(시안))
    { key: 'name', header: '메뉴 (1~3Depth)', width: 280 },
    {
      key: 'access',
      header: '메뉴 접근',
      width: 96,
      render: (node) => {
        const checked = menuIds.includes(node.id);
        const some = !checked && selfAndDescendants(node).some((id) => menuIds.includes(id));
        return (
          <Checkbox
            size="sm"
            aria-label={`${node.name} 메뉴 접근`}
            checked={checked}
            indeterminate={some}
            onChange={(e) => toggleMenu(node, e.target.checked)}
          />
        );
      },
    },
    {
      key: 'functions',
      header: '기능 권한 (4Depth 탭·버튼·업무 기능)',
      align: 'left',
      render: (node) => {
        const list = functionsByMenu[node.id] ?? [];
        if (!list.length) return null;
        const access = menuIds.includes(node.id);
        return (
          <SelectionGroup direction="horizontal">
            {list.map((f) => (
              <Checkbox
                key={f.code}
                size="sm"
                label={f.type === 'TAB' ? `${f.name}(탭)` : f.name}
                disabled={!access}
                checked={access && functionCodes.includes(f.code)}
                onChange={(e) => toggleFunction(f.code, e.target.checked)}
              />
            ))}
          </SelectionGroup>
        );
      },
    },
  ];

  return (
    <TreeTable
      columns={columns}
      nodes={menus}
      expandedIds={expandedIds}
      onExpandedChange={onExpandedChange}
    />
  );
}
