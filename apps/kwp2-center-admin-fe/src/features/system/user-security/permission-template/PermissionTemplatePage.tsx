/**
 * 화면ID: [KWPC10010301] 권한 템플릿 관리 - 권한 항목
 *         [KWPC10010302] 권한 템플릿 관리 - 변경 이력
 * 위치: 시스템관리 > 사용자·권한·보안 관리 > 권한 템플릿 관리 · /system/user-security/permission-template
 */
import {
  Badge,
  Button,
  Checkbox,
  Field,
  Icon,
  Infobox,
  PageLayout,
  Radio,
  RadioGroup,
  ResultPanel,
  SearchPanel,
  SectionHeading,
  SelectionGroup,
  Stack,
  StatusView,
  Tab,
  Text,
  TextField,
  TreeTable,
  treeTableGroupIds,
  useAction,
  useDialog,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { useEffect, useMemo, useState } from 'react';
import { fetchNormalFunctions } from '@/features/system/functionCode.api';
import type { FunctionItem } from '@/features/system/functionCode.types';
import { fetchMenuTree } from '@/features/system/menu.api';
import type { MenuNode } from '@/features/system/menu.types';
import {
  deleteTemplate,
  fetchTemplates,
  saveTemplate,
} from '@/features/system/permissionTemplate.api';
import {
  TemplateError,
  type PermissionTemplate,
  type TemplateInput,
  type TemplateSearchParams,
} from '@/features/system/permissionTemplate.types';
import { PermissionMatrix } from './components/PermissionMatrix';
import { TemplateHistory } from './components/TemplateHistory';
import {
  createInitialParams,
  newInput,
  sameInput,
  toInput,
  toggleIn,
} from './components/templateParams';

const LABEL_WIDTH = 120;

const TEMPLATE_COLUMNS: GridPlaceholderColumn<PermissionTemplate>[] = [
  { key: 'name', header: '템플릿명' },
  { key: 'linkedAccounts', header: '연결 계정', width: 72 },
  {
    key: 'use',
    header: '상태',
    width: 72,
    render: (t) => (
      <Badge size="sm" tone={t.use ? 'success' : 'neutral'}>
        {t.use ? '사용' : '미사용'}
      </Badge>
    ),
  },
];

/**
 * KWPC10010301 권한 템플릿 관리 - 권한 항목 — 화면설계서 v0.1 기준, 시안 없음.
 * 레이아웃은 디자인 패턴 기준: ① 검색 조건(전체 폭) → 아래 ② 템플릿 목록(왼쪽) | ③ 템플릿 정보 · ④ 권한 항목 / 변경 이력(오른쪽).
 * 권한 항목 / 변경 이력(KWPC10010302)은 영역 안 보기 전환이라 버튼 탭. 관리 화면이라 들어오면 바로 목록 (TODO(정책))
 */
export function PermissionTemplatePage() {
  const dialog = useDialog();
  const [params, setParams] = useState(createInitialParams);
  const [applied, setApplied] = useState(createInitialParams);
  const [templates, setTemplates] = useState<PermissionTemplate[]>([]);
  const [listError, setListError] = useState(false);
  /** 첫 목록을 받기 전에는 0건 안내를 띄우지 않는다 */
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState<TemplateInput | null>(null);
  const [original, setOriginal] = useState<TemplateInput | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [tab, setTab] = useState('items');
  /** 저장할 때마다 올려 변경 이력을 다시 받는다 */
  const [historyVersion, setHistoryVersion] = useState(0);
  const [menus, setMenus] = useState<MenuNode[]>([]);
  const [functions, setFunctions] = useState<FunctionItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const dirty = !sameInput(input, original);
  const selected = input?.id ? templates.find((t) => t.id === input.id) : undefined;
  const functionsByMenu = useMemo(() => {
    const map: Record<string, FunctionItem[]> = {};
    for (const f of functions) (map[f.menuId] ??= []).push(f);
    return map;
  }, [functions]);

  /** 목록을 다시 받는다. 고를 템플릿이 있으면 오른쪽에 보여 준다 (undefined면 선택 유지) */
  const loadTemplates = async (search: TemplateSearchParams, selectId?: string | null) => {
    try {
      const list = await fetchTemplates(search);
      setTemplates(list);
      setListError(false);
      setLoaded(true);
      if (selectId !== undefined) {
        const picked = selectId ? list.find((t) => t.id === selectId) : undefined;
        showInput(picked ? toInput(picked) : null);
      }
    } catch {
      setListError(true);
    }
  };

  useEffect(() => {
    void loadTemplates(createInitialParams());
    // 권한 항목: 메뉴 트리(시스템 줄 제외) · 일반 기능 — 처음엔 모두 펼침
    void Promise.all([fetchMenuTree(), fetchNormalFunctions()]).then(([root, list]) => {
      const top = root.children ?? [];
      setMenus(top);
      setFunctions(list);
      setExpandedIds(treeTableGroupIds(top));
    });
  }, []);

  const showInput = (value: TemplateInput | null) => {
    setNameError(null);
    setInput(value);
    setOriginal(value);
  };

  /** 저장하지 않은 입력이 있으면 버릴지 묻는다 (TODO(정책) 문구) */
  const confirmDiscard = async () =>
    !dirty ||
    (await dialog.confirm('저장하지 않은 내용이 있습니다.\n저장하지 않고 이동할까요?', {
      confirmText: '이동',
    }));

  const search = async () => {
    if (!params.uses.length) {
      await dialog.alert('사용여부를 하나 이상 선택해주세요.'); // TODO(정책) 둘 다 해제 시 처리
      return;
    }
    if (!(await confirmDiscard())) return;
    setApplied(params);
    await loadTemplates(params, null);
  };

  const select = async (t: PermissionTemplate) => {
    if (t.id === input?.id || !(await confirmDiscard())) return;
    showInput(toInput(t));
  };

  const add = async () => {
    if (!(await confirmDiscard())) return;
    showInput(newInput());
    setTab('items');
  };

  const save = useAction({
    validate: () => {
      if (!input) return null;
      if (!input.name.trim()) return '템플릿명을 입력해주세요.';
      if (!input.menuIds.length) return '메뉴 접근 권한을 하나 이상 선택해주세요.'; // TODO(정책) 권한 구성 검증
      return null;
    },
    run: () => saveTemplate(input!),
    onSuccess: async (id) => {
      await loadTemplates(applied, id);
      setHistoryVersion((v) => v + 1);
    },
    success: '저장되었습니다.',
    failure: (error) => {
      if (error instanceof TemplateError && error.code === 'DUPLICATE_NAME') {
        setNameError('같은 템플릿명이 있습니다.');
        return null;
      }
      return '저장하지 못했습니다. 잠시 후 다시 시도해주세요.';
    },
  });

  const remove = useAction({
    validate: () =>
      selected && selected.linkedAccounts > 0 ? '연결된 계정이 있으면 삭제 불가합니다.' : null,
    confirm: () => `'${input?.name}' 템플릿을 삭제할까요?`,
    confirmOptions: { confirmText: '삭제' },
    run: () => deleteTemplate(input!.id!),
    onSuccess: async () => {
      await loadTemplates(applied, null);
    },
    success: '삭제되었습니다.',
    failure: (error) =>
      error instanceof TemplateError && error.code === 'IN_USE'
        ? '적용 · 사용 이력이 있는 템플릿은 삭제할 수 없습니다.\n삭제 대신 미사용으로 전환해주세요.'
        : '삭제하지 못했습니다. 잠시 후 다시 시도해주세요.',
  });

  const creating = input !== null && input.id === null;

  return (
    <>
      <PageLayout.Title title="권한 템플릿 관리" />

      <SearchPanel onSearch={search} onReset={() => setParams(createInitialParams())}>
        <Field label="템플릿명">
          <TextField
            value={params.name}
            placeholder="템플릿명을 입력하세요"
            onChange={(e) => setParams({ ...params, name: e.target.value })}
          />
        </Field>
        <Field label="사용여부">
          <SelectionGroup direction="horizontal">
            {(
              [
                ['Y', '사용'],
                ['N', '미사용'],
              ] as const
            ).map(([value, label]) => (
              <Checkbox
                key={value}
                label={label}
                checked={params.uses.includes(value)}
                onChange={(e) =>
                  setParams({ ...params, uses: toggleIn(params.uses, value, e.target.checked) })
                }
              />
            ))}
          </SelectionGroup>
        </Field>
      </SearchPanel>

      <PageLayout.Split
        sideWidth="sm"
        side={
          <ResultPanel
            title="템플릿 목록"
            status={listError ? 'error' : !loaded || templates.length ? 'success' : 'empty'}
            actions={
              <Button
                size="sm"
                variant="neutral"
                appearance="line"
                leadingIcon={<Icon name="plus" size={20} />}
                disabled={creating}
                onClick={() => void add()}
              >
                추가
              </Button>
            }
            footer={
              // 섹션 안내 = 카드 맨 아래 · neutral, 문구는 기획서 화면 그대로. 목록이 없으면(0건 · 오류) 안내도 없음
              !listError && templates.length ? (
                <Infobox tone="neutral">
                  <Infobox.Item
                    title="템플릿 적용 방식"
                    bullets={[
                      '계정에 적용할 때 권한을 복사합니다.',
                      '이 템플릿의 변경사항은 이미 부여된 사용자의 권한에 자동 반영되지 않습니다.',
                    ]}
                  />
                </Infobox>
              ) : undefined
            }
          >
            {templates.length > 0 && (
              <TreeTable
                columns={TEMPLATE_COLUMNS}
                nodes={templates}
                expandedIds={[]}
                onExpandedChange={() => {}}
                selectedId={input?.id ?? null}
                onSelect={(t) => void select(t)}
              />
            )}
          </ResultPanel>
        }
      >
        <PageLayout.Section>
          <SectionHeading
            size="md"
            title="템플릿 정보"
            actions={
              <>
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
            }
          />
          {input ? (
            <Stack gap={16}>
              <Field
                label="템플릿명"
                labelWidth={LABEL_WIDTH}
                required
                feedback={nameError ? 'negative' : undefined}
                helperText={nameError ?? undefined}
              >
                <TextField
                  fullWidth
                  value={input.name}
                  placeholder="템플릿명을 입력하세요"
                  onChange={(e) => {
                    setNameError(null);
                    setInput({ ...input, name: e.target.value });
                  }}
                />
              </Field>
              <Field label="사용여부" labelWidth={LABEL_WIDTH} required>
                <RadioGroup
                  direction="horizontal"
                  value={input.use ? 'Y' : 'N'}
                  onChange={(v) => setInput({ ...input, use: v === 'Y' })}
                >
                  <Radio value="Y" label="사용" />
                  <Radio value="N" label="미사용" />
                </RadioGroup>
              </Field>
              <Field label="설명" labelWidth={LABEL_WIDTH}>
                <TextField
                  fullWidth
                  value={input.description}
                  placeholder="설명을 입력하세요"
                  onChange={(e) => setInput({ ...input, description: e.target.value })}
                />
              </Field>
              {/* 조회 전용 값은 텍스트 */}
              <Field label="연결 계정" labelWidth={LABEL_WIDTH}>
                <Text variant="body-md" tone="body">
                  {selected?.linkedAccounts ?? 0}
                </Text>
              </Field>
              <Infobox tone="neutral">
                <Infobox.Item
                  bullets={[
                    '연결된 계정이 있으면 삭제 불가합니다.',
                    '템플릿 변경사항은 이후 적용 계정에만 반영, 기존 계정 및 개별 추가·회수 권한은 유지',
                  ]}
                />
              </Infobox>
            </Stack>
          ) : (
            <StatusView
              status="idle"
              title="템플릿을 선택해주세요"
              description="템플릿 목록에서 템플릿을 선택하거나 [추가]로 등록합니다."
            />
          )}
        </PageLayout.Section>

        {/* 권한 항목 / 변경 이력 — 화면 전체 전환이 아니라 버튼 탭 (페이지 탭 규칙) */}
        <PageLayout.Section>
          <Tab variant="button" value={tab} onChange={setTab} aria-label="권한 템플릿">
            <Tab.Item value="items">권한 항목</Tab.Item>
            <Tab.Item value="history">변경 이력</Tab.Item>
          </Tab>
          {!input ? (
            <StatusView status="idle" title="템플릿을 선택해주세요" description={null} />
          ) : tab === 'items' ? (
            <>
              {/* 선택 개수(메뉴 N · 기능 M) 표기는 넣지 않음 — 사용자 결정 */}
              <PermissionMatrix
                menus={menus}
                functionsByMenu={functionsByMenu}
                menuIds={input.menuIds}
                functionCodes={input.functionCodes}
                onChange={(next) => setInput({ ...input, ...next })}
                expandedIds={expandedIds}
                onExpandedChange={setExpandedIds}
              />
              <Infobox tone="neutral">
                <Infobox.Item
                  bullets={[
                    '상위메뉴 선택/해제는 하위 메뉴 접근권한에만 일괄 적용하며, 탭·버튼 기능권한은 개별 선택합니다.',
                    '특수권한(개인정보 마스킹 해제·원문 다운로드 등)은 이 템플릿에서 부여하지 않으며, 별도 신청·승인으로 관리합니다.',
                  ]}
                />
              </Infobox>
            </>
          ) : input.id ? (
            // KWPC10010302 변경 이력 — 선택한 템플릿 이력만, 저장하면 다시 받는다
            <TemplateHistory templateId={input.id} version={historyVersion} />
          ) : (
            <StatusView status="idle" title="저장 후 변경 이력이 표시됩니다" description={null} />
          )}
        </PageLayout.Section>
      </PageLayout.Split>
    </>
  );
}
