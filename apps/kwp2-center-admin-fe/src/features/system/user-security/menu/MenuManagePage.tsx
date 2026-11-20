/**
 * 화면ID: [KWPC10010201] 메뉴 관리
 * 위치: 시스템관리 > 사용자·권한·보안 관리 > 메뉴·기능 관리 · /system/user-security/menu
 */
import {
  Button,
  Checkbox,
  Field,
  Icon,
  Infobox,
  PageLayout,
  ResultPanel,
  SearchPanel,
  SectionHeading,
  SelectionGroup,
  Stack,
  StatusView,
  TextField,
  TreeTable,
  useAction,
  useDialog,
  type SearchStatus,
} from '@kiwoompay/design-system';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MENU_PATH, MenuFunctionTabs } from '@/features/system/components/MenuFunctionTabs';
import { SYSTEM_MENU_ID, deleteMenu, fetchMenuTree, saveMenu } from '@/features/system/menu.api';
import { MenuError, type MenuInput, type MenuNode } from '@/features/system/menu.types';
import { MenuInfoForm } from './components/MenuInfoForm';
import { MENU_COLUMNS } from './components/menuColumns';
import {
  MAX_MENU_LEVEL,
  createInitialParams,
  findMenu,
  newChildInput,
  searchMenuTree,
  toInput,
} from './components/menuTree';

const sameInput = (a: MenuInput | null, b: MenuInput | null) =>
  JSON.stringify(a) === JSON.stringify(b);

/**
 * KWPC10010201 메뉴관리 (메뉴·기능 관리 › 메뉴관리) — 화면설계서 v0.1 기준, 시안 없음.
 * 레이아웃은 기획서가 아니라 디자인 패턴 기준 — ① 검색 조건(전체 폭) → 아래 ② 메뉴 트리(왼쪽) · ③ 메뉴 정보 · ④ 하위 메뉴 추가 · 삭제 · 저장(오른쪽)
 * (P01 검색 + P02 폼 + P04 처리).
 * 메뉴 관리 화면이라 들어오면 전체 트리를 바로 보여 준다 (조회 화면 기본 규칙의 예외, TODO(정책) 확인)
 */
export function MenuManagePage() {
  const dialog = useDialog();
  const [root, setRoot] = useState<MenuNode | null>(null);
  // 트리는 조회 중 표시가 없다 — 다시 받는 동안 이전 트리를 그대로 둔다 (사용자 결정)
  const [loadStatus, setLoadStatus] = useState<'error' | 'success'>('success');
  const [params, setParams] = useState(createInitialParams);
  const [applied, setApplied] = useState(createInitialParams);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** 오른쪽 입력값 · 불러온 원래 값 (바뀐 것 확인용) */
  const [input, setInput] = useState<MenuInput | null>(null);
  const [original, setOriginal] = useState<MenuInput | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const tree = useMemo(() => (root ? searchMenuTree(root, applied) : null), [root, applied]);
  const selected = root && selectedId ? findMenu(root, selectedId) : undefined;
  const dirty = !sameInput(input, original);

  /** 트리를 다시 받는다. 받은 뒤 고를 줄이 있으면 그 줄까지 펼치고 오른쪽에 보여 준다 */
  const load = useCallback(async (selectId?: string): Promise<MenuNode | undefined> => {
    try {
      const next = await fetchMenuTree();
      setRoot(next);
      setLoadStatus('success');
      if (selectId) {
        const node = findMenu(next, selectId);
        const path: string[] = [];
        for (let p = node?.parentId; p; p = findMenu(next, p)?.parentId) path.push(p);
        setExpandedIds((ids) => [...new Set([...ids, ...path])]);
        setSelectedId(selectId);
        const value = node && node.level > 0 ? toInput(node) : null;
        setInput(value);
        setOriginal(value);
      }
      return next;
    } catch {
      setLoadStatus('error');
      return undefined;
    }
  }, []);

  useEffect(() => {
    void load().then(() => setExpandedIds([SYSTEM_MENU_ID]));
  }, [load]);

  /** 저장하지 않은 입력이 있으면 버릴지 묻는다 (TODO(정책) 문구) */
  const confirmDiscard = async () =>
    !dirty ||
    (await dialog.confirm('저장하지 않은 내용이 있습니다.\n저장하지 않고 이동할까요?', {
      confirmText: '이동',
    }));

  const select = async (node: MenuNode) => {
    if (node.id === selectedId) return;
    if (!(await confirmDiscard())) return;
    setSelectedId(node.id);
    setNameError(null);
    // 시스템 줄(최상위)은 메뉴 코드가 아니라 고칠 수 없다 — 하위 메뉴 추가만
    const value = node.level > 0 ? toInput(node) : null;
    setInput(value);
    setOriginal(value);
  };

  const search = async () => {
    if (!params.use && !params.unused) {
      await dialog.alert('사용여부를 하나 이상 선택해주세요.'); // TODO(정책) 둘 다 해제 시 처리
      return;
    }
    if (!(await confirmDiscard())) return;
    setApplied(params);
    setSelectedId(null);
    setInput(null);
    setOriginal(null);
    // TODO(API) 서버 검색이면 조건을 넘겨 다시 받는다. 지금은 받은 트리를 화면에서 거른다
    const next = await load();
    if (next) setExpandedIds(searchMenuTree(next, params).expandedIds);
  };

  const addChild = async () => {
    if (!selected || !(await confirmDiscard())) return;
    const value = newChildInput(selected);
    setNameError(null);
    setInput(value);
    setOriginal(value);
  };

  const save = useAction({
    validate: () => {
      if (!input) return null;
      if (!input.name.trim()) return '메뉴명을 입력해주세요.';
      if (!input.parentId) return '상위메뉴를 선택해주세요.';
      return null;
    },
    run: () => saveMenu(input!),
    onSuccess: async (id) => {
      setNameError(null);
      await load(id);
    },
    success: '저장되었습니다.',
    failure: (error) => {
      if (error instanceof MenuError && error.code === 'DUPLICATE_NAME') {
        setNameError('같은 상위메뉴 아래에 같은 메뉴명이 있습니다.');
        return null;
      }
      return '저장하지 못했습니다. 잠시 후 다시 시도해주세요.';
    },
  });

  const remove = useAction({
    confirm: () => `'${input?.name}' 메뉴를 삭제할까요?`,
    confirmOptions: { confirmText: '삭제' },
    run: () => deleteMenu(input!.id!),
    onSuccess: async () => {
      await load(input!.parentId);
    },
    success: '삭제되었습니다.',
    failure: (error) => {
      if (error instanceof MenuError && error.code === 'HAS_CHILDREN') {
        return '하위 메뉴가 있어 삭제할 수 없습니다. 하위 메뉴를 먼저 삭제해주세요.';
      }
      if (error instanceof MenuError && error.code === 'IN_USE') {
        return '사용 이력이 있는 메뉴는 삭제할 수 없습니다.\n삭제 대신 미사용으로 전환해주세요.';
      }
      return '삭제하지 못했습니다. 잠시 후 다시 시도해주세요.';
    },
  });

  const treeStatus: SearchStatus =
    loadStatus === 'error' ? 'error' : !tree || tree.nodes.length ? 'success' : 'empty';
  const creating = input !== null && input.id === null;
  // 하위 메뉴 추가: 최대 3Depth — 3Depth에서는 비활성, 추가 입력 중에도 비활성
  const canAddChild = Boolean(selected) && selected!.level < MAX_MENU_LEVEL && !creating;

  const menuActions = (
    <>
      <Button
        size="sm"
        variant="neutral"
        appearance="line"
        leadingIcon={<Icon name="plus" size={20} />}
        disabled={!canAddChild}
        onClick={addChild}
      >
        하위 메뉴 추가
      </Button>
      <Button
        size="sm"
        variant="neutral"
        appearance="line"
        disabled={!input?.id}
        onClick={() => void remove.execute()}
      >
        삭제
      </Button>
      <Button size="sm" disabled={!input} onClick={() => void save.execute()}>
        저장
      </Button>
    </>
  );

  return (
    <>
      {/* 기획서의 화면명 옆 설명은 넣지 않는다 (사용자 결정) */}
      <PageLayout.Title title="메뉴·기능 관리" />
      {/* 제목 탭(화면 전체가 바뀜) 바로 아래 박스(검색 조건)는 붙인다 — 탭 아래 여백 없음 */}
      <Stack gap={0}>
        <MenuFunctionTabs current={MENU_PATH} />
        <SearchPanel onSearch={search} onReset={() => setParams(createInitialParams())}>
          <Field label="메뉴ID">
            <TextField
              value={params.menuId}
              placeholder="메뉴ID를 입력해주세요"
              onChange={(e) => setParams({ ...params, menuId: e.target.value })}
            />
          </Field>
          <Field label="메뉴명">
            <TextField
              value={params.menuName}
              placeholder="메뉴명을 입력해주세요"
              onChange={(e) => setParams({ ...params, menuName: e.target.value })}
            />
          </Field>
          <Field label="사용여부">
            <SelectionGroup direction="horizontal">
              <Checkbox
                label="사용"
                checked={params.use}
                onChange={(e) => setParams({ ...params, use: e.target.checked })}
              />
              <Checkbox
                label="미사용"
                checked={params.unused}
                onChange={(e) => setParams({ ...params, unused: e.target.checked })}
              />
            </SelectionGroup>
          </Field>
        </SearchPanel>
      </Stack>

      {/* 레이아웃은 디자인 패턴 기준: 검색 조건 전체 폭 → 아래 목록(왼쪽) · 상세(오른쪽) */}
      <PageLayout.Split
        side={
          <ResultPanel title="메뉴 목록" status={treeStatus}>
            {tree && (
              <TreeTable
                columns={MENU_COLUMNS}
                nodes={tree.nodes}
                expandedIds={expandedIds}
                onExpandedChange={setExpandedIds}
                selectedId={selectedId}
                onSelect={(node) => void select(node)}
              />
            )}
          </ResultPanel>
        }
      >
        {/* 옆 메뉴 목록(ResultPanel md)과 같은 제목 크기 md */}
        <PageLayout.Section>
          <SectionHeading size="md" title="메뉴 정보" actions={menuActions} />
          {root && input ? (
            <MenuInfoForm
              root={root}
              value={input}
              nameError={nameError}
              onChange={(patch) => {
                if ('name' in patch) setNameError(null);
                setInput({ ...input, ...patch });
              }}
            />
          ) : (
            <StatusView
              status="idle"
              title={selected ? '시스템(최상위)은 수정할 수 없습니다' : '메뉴를 선택해주세요'}
              description={
                selected
                  ? '[하위 메뉴 추가]로 1Depth 메뉴를 등록할 수 있습니다.'
                  : '왼쪽 메뉴 목록에서 메뉴를 선택하면 상세 정보가 표시됩니다.'
              }
            />
          )}
          {/* 섹션 안내 = 그 카드 안 맨 아래 · neutral 톤, 여러 줄은 아이콘 하나 + 점 목록. 내용이 없으면 안내도 없음 */}
          {root && input && (
            <Infobox tone="neutral">
              <Infobox.Item
                bullets={[
                  '미사용 메뉴는 권한 보유와 관계없이 미노출 및 직접 접근 차단',
                  '상위메뉴가 미사용이면 하위메뉴에도 적용하되 기존 메뉴 · 권한 설정 유지',
                  '3Depth 메뉴에 사용 이력이 있으면 삭제 불가, 미사용 처리',
                ]}
              />
            </Infobox>
          )}
        </PageLayout.Section>
      </PageLayout.Split>
    </>
  );
}
