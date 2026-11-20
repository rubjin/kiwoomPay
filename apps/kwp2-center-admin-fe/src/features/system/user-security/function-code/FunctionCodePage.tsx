/**
 * 화면ID: [KWPC10010202] 기능 코드 관리
 * 위치: 시스템관리 > 사용자·권한·보안 관리 > 메뉴·기능 관리 · /system/user-security/function-code
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
  Text,
  TextField,
  TreeTable,
  useAction,
  useDialog,
  type SearchStatus,
} from '@kiwoompay/design-system';
import { useEffect, useMemo, useState } from 'react';
import {
  FUNCTION_CODE_PATH,
  MenuFunctionTabs,
} from '@/features/system/components/MenuFunctionTabs';
import {
  deleteFunction,
  fetchFunctions,
  fetchMenuTabs,
  saveFunction,
} from '@/features/system/functionCode.api';
import {
  FunctionError,
  type FunctionInput,
  type FunctionItem,
  type FunctionSearchParams,
} from '@/features/system/functionCode.types';
import { SYSTEM_MENU_ID, fetchMenuTree } from '@/features/system/menu.api';
import { fetchSpecialCodes } from '@/features/system/specialCode.api';
import type { Option } from '@/constants/options';
import type { MenuNode } from '@/features/system/menu.types';
import { FunctionInfoForm } from './components/FunctionInfoForm';
import { SpecialCodeModal } from './components/SpecialCodeModal';
import { MENU_TREE_COLUMNS, createFunctionColumns } from './components/functionColumns';
import {
  FUNCTION_MENU_LEVEL,
  createInitialParams,
  findMenu,
  newInput,
  toInput,
  toggleIn,
} from './components/functionParams';

const sameInput = (a: FunctionInput | null, b: FunctionInput | null) =>
  JSON.stringify(a) === JSON.stringify(b);

/**
 * KWPC10010202 기능 코드 관리 (메뉴·기능 관리 › 기능 코드 관리) — 화면설계서 v0.1 기준, 시안 없음.
 * 레이아웃은 디자인 패턴 기준 — ① 검색 조건(전체 폭) → 아래 ② 메뉴 트리 | ③ 기능 목록 | ④ 기능 정보 · ⑤ 기능 추가 · 삭제 · 저장
 * (Split 안에 Split, P01 검색 + P02 폼 + P04 처리). 3Depth 메뉴를 고르면 그 메뉴의 기능 목록을 조회한다
 */
export function FunctionCodePage() {
  const dialog = useDialog();
  const [root, setRoot] = useState<MenuNode | null>(null);
  const [treeError, setTreeError] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>([SYSTEM_MENU_ID]);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [params, setParams] = useState(createInitialParams);
  const [applied, setApplied] = useState(createInitialParams);
  const [functions, setFunctions] = useState<FunctionItem[]>([]);
  const [listStatus, setListStatus] = useState<SearchStatus>('idle');
  const [tabs, setTabs] = useState<FunctionItem[]>([]);
  /** 오른쪽 입력값 · 불러온 원래 값 (바뀐 것 확인용) */
  const [input, setInput] = useState<FunctionInput | null>(null);
  const [original, setOriginal] = useState<FunctionInput | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);
  /** 특수권한 코드 선택지 (사용 중인 코드) · 코드 관리 팝업 */
  const [specialCodes, setSpecialCodes] = useState<Option[]>([]);
  const [codeModal, setCodeModal] = useState(false);

  const menu = root && menuId ? findMenu(root, menuId) : undefined;
  const dirty = !sameInput(input, original);
  const columns = useMemo(
    () => createFunctionColumns((code) => tabs.find((t) => t.code === code)?.name),
    [tabs],
  );

  // 메뉴 트리 — 조회 중 표시 없음 (트리 규칙)
  useEffect(() => {
    fetchMenuTree()
      .then(setRoot)
      .catch(() => setTreeError(true));
  }, []);

  /** 특수권한 코드 선택지 — 코드 관리 팝업을 닫으면 다시 받는다 */
  const loadSpecialCodes = () =>
    fetchSpecialCodes({ code: '', name: '', uses: ['Y'] }).then((list) =>
      setSpecialCodes(list.map((c) => ({ value: c.code, label: `${c.name} (${c.code})` }))),
    );
  useEffect(() => {
    void loadSpecialCodes();
  }, []);

  const showInput = (value: FunctionInput | null) => {
    setKeyError(null);
    setInput(value);
    setOriginal(value);
  };

  /** 기능 목록 · 소속 탭을 다시 받는다. 받은 뒤 고를 기능이 있으면 오른쪽에 보여 준다 */
  const loadFunctions = async (id: string, search: FunctionSearchParams, selectCode?: string) => {
    setListStatus('loading');
    try {
      const [list, menuTabs] = await Promise.all([fetchFunctions(id, search), fetchMenuTabs(id)]);
      setFunctions(list);
      setTabs(menuTabs);
      setListStatus(list.length ? 'success' : 'empty');
      const picked = selectCode ? list.find((f) => f.code === selectCode) : undefined;
      showInput(picked ? toInput(picked) : null);
    } catch {
      setListStatus('error');
    }
  };

  /** 저장하지 않은 입력이 있으면 버릴지 묻는다 (TODO(정책) 문구) */
  const confirmDiscard = async () =>
    !dirty ||
    (await dialog.confirm('저장하지 않은 내용이 있습니다.\n저장하지 않고 이동할까요?', {
      confirmText: '이동',
    }));

  // 1~2Depth는 하위 메뉴를 펼치는 용도, 3Depth를 고르면 그 메뉴의 기능 목록
  const selectMenu = async (node: MenuNode) => {
    if (node.level < FUNCTION_MENU_LEVEL) {
      if (node.children?.length) {
        setExpandedIds((ids) =>
          ids.includes(node.id) ? ids.filter((x) => x !== node.id) : [...ids, node.id],
        );
      }
      return;
    }
    if (node.id === menuId || !(await confirmDiscard())) return;
    setMenuId(node.id);
    await loadFunctions(node.id, applied);
  };

  const search = async () => {
    if (!params.types.length || !params.kinds.length || !params.uses.length) {
      // TODO(정책) 그룹 전체 해제 시 처리
      await dialog.alert('기능유형 · 권한구분 · 사용여부를 하나 이상 선택해주세요.');
      return;
    }
    if (!menuId) {
      await dialog.alert('메뉴 목록에서 3Depth 메뉴를 선택해주세요.');
      return;
    }
    if (!(await confirmDiscard())) return;
    setApplied(params);
    await loadFunctions(menuId, params);
  };

  const selectFunction = async (f: FunctionItem) => {
    if (f.code === input?.code || !(await confirmDiscard())) return;
    showInput(toInput(f));
  };

  const addFunction = async () => {
    if (!menuId || !(await confirmDiscard())) return;
    showInput(newInput(menuId));
  };

  const save = useAction({
    validate: () => {
      if (!input) return null;
      if (!input.name.trim()) return '기능명을 입력해주세요.';
      if (!input.key.trim()) return '기능 식별키를 입력해주세요.';
      if (input.kind === 'SPECIAL' && !input.specialCode) return '특수권한 코드를 선택해주세요.';
      if (input.kind === 'SPECIAL' && !input.specialApply)
        return '특수권한 적용 방식을 선택해주세요.';
      return null;
    },
    run: () => saveFunction(input!),
    onSuccess: async (code) => {
      await loadFunctions(input!.menuId, applied, code);
    },
    success: '저장되었습니다.',
    failure: (error) => {
      if (error instanceof FunctionError && error.code === 'DUPLICATE_KEY') {
        setKeyError('같은 메뉴 안에 같은 기능 식별키가 있습니다.');
        return null;
      }
      return '저장하지 못했습니다. 잠시 후 다시 시도해주세요.';
    },
  });

  const remove = useAction({
    confirm: () => `'${input?.name}' 기능을 삭제할까요?`,
    confirmOptions: { confirmText: '삭제' },
    run: () => deleteFunction(input!.code!),
    onSuccess: async () => {
      await loadFunctions(input!.menuId, applied);
    },
    success: '삭제되었습니다.',
    failure: (error) =>
      error instanceof FunctionError && error.code === 'IN_USE'
        ? '권한이 부여됐거나 사용 이력이 있는 기능은 삭제할 수 없습니다.\n삭제 대신 미사용으로 전환해주세요.'
        : '삭제하지 못했습니다. 잠시 후 다시 시도해주세요.',
  });

  const creating = input !== null && input.code === null;
  const functionActions = (
    <>
      <Button
        size="sm"
        variant="neutral"
        appearance="line"
        leadingIcon={<Icon name="plus" size={20} />}
        disabled={!menuId || creating}
        onClick={() => void addFunction()}
      >
        기능 추가
      </Button>
      <Button
        size="sm"
        variant="neutral"
        appearance="line"
        disabled={!input?.code}
        onClick={() => void remove.execute()}
      >
        삭제
      </Button>
      <Button size="sm" disabled={!input} onClick={() => void save.execute()}>
        저장
      </Button>
    </>
  );

  const checkGroup = <K extends 'types' | 'kinds' | 'uses'>(
    key: K,
    options: { value: FunctionSearchParams[K][number]; label: string }[],
  ) => (
    <SelectionGroup direction="horizontal">
      {options.map((o) => (
        <Checkbox
          key={o.value}
          label={o.label}
          checked={(params[key] as string[]).includes(o.value)}
          onChange={(e) =>
            setParams({
              ...params,
              [key]: toggleIn(params[key] as string[], o.value, e.target.checked),
            })
          }
        />
      ))}
    </SelectionGroup>
  );

  return (
    <>
      <PageLayout.Title title="메뉴·기능 관리" />
      {/* 제목 탭 바로 아래 박스(검색 조건)는 붙인다 */}
      <Stack gap={0}>
        <MenuFunctionTabs current={FUNCTION_CODE_PATH} />
        <SearchPanel onSearch={search} onReset={() => setParams(createInitialParams())}>
          <Field label="기능코드">
            <TextField
              value={params.code}
              placeholder="기능코드를 입력해주세요"
              onChange={(e) => setParams({ ...params, code: e.target.value })}
            />
          </Field>
          <Field label="기능명">
            <TextField
              value={params.name}
              placeholder="기능명을 입력해주세요"
              onChange={(e) => setParams({ ...params, name: e.target.value })}
            />
          </Field>
          <Field label="기능유형">
            {checkGroup('types', [
              { value: 'TAB', label: '탭' },
              { value: 'BUTTON', label: '버튼·기능' },
            ])}
          </Field>
          <Field label="권한구분">
            {checkGroup('kinds', [
              { value: 'NORMAL', label: '일반' },
              { value: 'SPECIAL', label: '특수' },
            ])}
          </Field>
          <Field label="사용여부">
            {checkGroup('uses', [
              { value: 'Y', label: '사용' },
              { value: 'N', label: '미사용' },
            ])}
          </Field>
        </SearchPanel>
      </Stack>

      {/* 3열: 메뉴 트리 | 기능 목록 | 기능 정보 */}
      <PageLayout.Split
        sideWidth="sm"
        side={
          <ResultPanel title="메뉴 목록" status={treeError ? 'error' : 'success'}>
            {root && (
              <TreeTable
                columns={MENU_TREE_COLUMNS}
                nodes={[root]}
                expandedIds={expandedIds}
                onExpandedChange={setExpandedIds}
                selectedId={menuId}
                onSelect={(node) => void selectMenu(node)}
              />
            )}
          </ResultPanel>
        }
      >
        <PageLayout.Split
          sideWidth="md"
          side={
            <ResultPanel
              title="기능 목록"
              status={listStatus}
              statusProps={
                listStatus === 'idle'
                  ? {
                      title: '3Depth 메뉴를 선택해주세요',
                      description: '메뉴 목록에서 3Depth 메뉴를 선택하면 기능 목록이 표시됩니다.',
                    }
                  : undefined
              }
              actions={
                listStatus === 'success' && <Text variant="body-sm">총 {functions.length}건</Text>
              }
              // 섹션 안내 = 카드 맨 아래(footer) · neutral 톤, 문구는 기획서 화면의 ※ 그대로.
              // 카드에 내용이 없으면(선택 전 · 0건 · 오류) 안내도 없음
              footer={
                listStatus === 'success' ? (
                  <Infobox tone="neutral">
                    <Infobox.Item
                      bullets={[
                        '기능 목록은 선택된 3Depth 메뉴 기준입니다.',
                        '기본 7건 표시 · 필터 적용 후 건수 재집계.',
                        '탭·버튼별 권한 및 사용 상태를 구분합니다.',
                      ]}
                    />
                  </Infobox>
                ) : undefined
              }
            >
              {listStatus === 'success' && (
                <TreeTable
                  columns={columns}
                  nodes={functions.map((f) => ({ ...f, id: f.code }))}
                  expandedIds={[]}
                  onExpandedChange={() => {}}
                  selectedId={input?.code ?? null}
                  onSelect={(f) => void selectFunction(f)}
                />
              )}
            </ResultPanel>
          }
        >
          <PageLayout.Section>
            <SectionHeading size="md" title="기능 정보" actions={functionActions} />
            {menu && input ? (
              <FunctionInfoForm
                menu={menu}
                tabs={tabs}
                value={input}
                specialCodes={specialCodes}
                keyError={keyError}
                onChange={(patch) => {
                  if ('key' in patch) setKeyError(null);
                  setInput({ ...input, ...patch });
                }}
                onManageCodes={() => setCodeModal(true)}
              />
            ) : (
              <StatusView
                status="idle"
                title="기능을 선택해주세요"
                description={
                  menuId
                    ? '기능 목록에서 기능을 선택하거나 [기능 추가]로 등록합니다.'
                    : '3Depth 메뉴를 선택한 뒤 기능을 선택하거나 등록합니다.'
                }
              />
            )}
            {/* 섹션 안내 = 그 카드 안 맨 아래 · neutral 톤, 문구는 기획서 화면의 ※ 그대로. 내용이 없으면 안내도 없음 */}
            {menu && input && (
              <Infobox tone="neutral">
                <Infobox.Item
                  bullets={[
                    '특수권한 적용: 버튼 노출 / 옵션 노출 / 실행 시 검증',
                    '권한부여·사용 이력 존재 시 기능 삭제 불가(미사용 처리)',
                  ]}
                />
              </Infobox>
            )}
          </PageLayout.Section>
        </PageLayout.Split>
      </PageLayout.Split>

      <SpecialCodeModal
        open={codeModal}
        onClose={() => {
          setCodeModal(false);
          void loadSpecialCodes();
        }}
      />
    </>
  );
}
