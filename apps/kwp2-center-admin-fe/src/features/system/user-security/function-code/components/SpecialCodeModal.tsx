/**
 * 화면ID: [KWPC10010203] 특수권한 코드 관리 팝업
 * 위치: 시스템관리 > 사용자·권한·보안 관리 > 메뉴·기능 관리 · /system/user-security/function-code (팝업)
 */
import {
  Badge,
  Button,
  Checkbox,
  Field,
  GridPlaceholder,
  HubGrid,
  Icon,
  Infobox,
  Modal,
  Pagination,
  Radio,
  RadioGroup,
  ResultFooter,
  SearchPanel,
  SelectionGroup,
  Stack,
  StatusView,
  TextArea,
  TextField,
  TreeTable,
  useAction,
  useDialog,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import {
  deleteSpecialCode,
  fetchLinkedFunctions,
  fetchSpecialCodes,
  saveSpecialCode,
} from '@/features/system/specialCode.api';
import {
  SpecialCodeError,
  type LinkedFunction,
  type SpecialCode,
  type SpecialCodeInput,
  type SpecialCodeSearchParams,
} from '@/features/system/specialCode.types';
import { toggleIn } from './functionParams';

// 좌우 폭 — 화면설계서 비율 525 : 535 (TODO(시안))
const PANEL_COLUMNS = [525, 535];
const LABEL_WIDTH = 120;
const LINK_PAGE_SIZE = 5;

const createParams = (): SpecialCodeSearchParams => ({ code: '', name: '', uses: ['Y', 'N'] });
const newInput = (): SpecialCodeInput => ({ code: null, name: '', description: '', use: true });
const toInput = (c: SpecialCode): SpecialCodeInput => ({
  code: c.code,
  name: c.name,
  description: c.description,
  use: c.use,
});
const sameInput = (a: SpecialCodeInput | null, b: SpecialCodeInput | null) =>
  JSON.stringify(a) === JSON.stringify(b);

const CODE_COLUMNS: GridPlaceholderColumn<SpecialCode & { id: string }>[] = [
  { key: 'code', header: '특수권한 코드', width: 110 },
  { key: 'name', header: '특수권한명' },
  { key: 'linkedCount', header: '연결', width: 64, render: (c) => `${c.linkedCount}건` },
  {
    key: 'use',
    header: '상태',
    width: 72,
    render: (c) => (
      <Badge size="sm" tone={c.use ? 'success' : 'neutral'}>
        {c.use ? '사용' : '미사용'}
      </Badge>
    ),
  },
];

const LINK_COLUMNS: GridPlaceholderColumn<LinkedFunction>[] = [
  { key: 'location', header: '적용 위치', width: 100 },
  { key: 'name', header: '기능명', align: 'left' },
  { key: 'apply', header: '적용 방식', width: 100 },
];

export interface SpecialCodeModalProps {
  open: boolean;
  /** 닫힌 뒤 (기능 코드 관리 특수권한 코드 선택지 다시 받기) */
  onClose: () => void;
}

/**
 * KWPC10010203 특수권한 코드 관리 팝업 (기능 코드 관리 › [코드 관리]) — 화면설계서 v0.1, 시안 없음.
 * 조회 조건(plain) → 왼쪽 특수권한 목록 | 오른쪽 특수권한 정보 + 연결된 기능(조회 전용, 5건씩) → [닫기] · [저장].
 * 코드 저장만으로 사용자 권한은 부여되지 않는다 — 최종 부여는 결재 현황(KWPC10010403) → 부여 처리 팝업(KWPC10010404)
 */
export function SpecialCodeModal({ open, onClose }: SpecialCodeModalProps) {
  return open ? <Body onClose={onClose} /> : null;
}

function Body({ onClose }: { onClose: () => void }) {
  const dialog = useDialog();
  const [params, setParams] = useState(createParams);
  const [applied, setApplied] = useState(createParams);
  const [codes, setCodes] = useState<SpecialCode[]>([]);
  const [listError, setListError] = useState(false);
  const [input, setInput] = useState<SpecialCodeInput | null>(null);
  const [original, setOriginal] = useState<SpecialCodeInput | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [links, setLinks] = useState<{ items: LinkedFunction[]; total: number }>({
    items: [],
    total: 0,
  });
  const [linkPage, setLinkPage] = useState(1);
  const dirty = !sameInput(input, original);

  /** 목록을 다시 받는다. 고를 코드가 있으면 오른쪽에 보여 준다 */
  const loadCodes = async (search: SpecialCodeSearchParams, selectCode?: string | null) => {
    try {
      const list = await fetchSpecialCodes(search);
      setCodes(list);
      setListError(false);
      const picked = selectCode ? list.find((c) => c.code === selectCode) : undefined;
      if (selectCode !== undefined) await showCode(picked ?? null);
    } catch {
      setListError(true);
    }
  };

  const loadLinks = async (code: string, page: number) => {
    setLinkPage(page);
    setLinks(await fetchLinkedFunctions(code, page, LINK_PAGE_SIZE));
  };

  const showCode = async (c: SpecialCode | null) => {
    const value = c ? toInput(c) : null;
    setNameError(null);
    setInput(value);
    setOriginal(value);
    // 코드를 고르면 연결된 기능은 1페이지부터
    if (c) await loadLinks(c.code, 1);
    else setLinks({ items: [], total: 0 });
  };

  // 관리 팝업이라 열면 바로 전체 목록 (TODO(정책) 조회 화면 기본 규칙의 예외)
  useEffect(() => {
    void loadCodes(createParams());
  }, []);

  /** 저장하지 않은 입력이 있으면 버릴지 묻는다 */
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
    await loadCodes(params, null);
  };

  const select = async (c: SpecialCode) => {
    if (c.code === input?.code || !(await confirmDiscard())) return;
    await showCode(c);
  };

  const create = async () => {
    if (!(await confirmDiscard())) return;
    const value = newInput();
    setNameError(null);
    setInput(value);
    setOriginal(value);
    setLinks({ items: [], total: 0 });
  };

  const close = async () => {
    if (
      dirty &&
      !(await dialog.confirm('변경한 내용이 저장되지 않습니다. 닫을까요?', { confirmText: '닫기' }))
    )
      return;
    onClose();
  };

  const save = useAction({
    validate: () => (input && !input.name.trim() ? '특수권한명을 입력해주세요.' : null),
    run: () => saveSpecialCode(input!),
    onSuccess: async (code) => {
      await loadCodes(applied, code);
    },
    success: '저장되었습니다.',
    failure: (error) => {
      if (error instanceof SpecialCodeError && error.code === 'DUPLICATE_NAME') {
        setNameError('같은 특수권한명이 있습니다.');
        return null;
      }
      return '저장하지 못했습니다. 잠시 후 다시 시도해주세요.';
    },
  });

  const remove = useAction({
    confirm: () => `'${input?.name}' 특수권한 코드를 삭제할까요?`,
    confirmOptions: { confirmText: '삭제' },
    run: () => deleteSpecialCode(input!.code!),
    onSuccess: async () => {
      await loadCodes(applied, null);
    },
    success: '삭제되었습니다.',
    failure: (error) =>
      error instanceof SpecialCodeError && error.code === 'IN_USE'
        ? '기능 연결 · 신청 · 결재 · 부여 · 사용 이력이 있는 코드는 삭제할 수 없습니다.\n삭제 대신 미사용으로 전환해주세요.'
        : '삭제하지 못했습니다. 잠시 후 다시 시도해주세요.',
  });

  const busy = save.loading || remove.loading;
  const creating = input !== null && input.code === null;

  return (
    <Modal open onClose={busy ? undefined : () => void close()} size="xl">
      <Modal.Header title="특수권한 코드 관리" closeButton />
      <Modal.Body>
        <Stack gap={24}>
          {/* 조회 조건 = plain 구성 + 파란 상자(배경 · 테두리 색) (사용자 결정 — 이 팝업은 plain 대신 box) */}
          <SearchPanel
            variant="box"
            fieldWidth="lg"
            onSearch={search}
            onReset={() => setParams(createParams())}
          >
            <Field label="특수권한 코드">
              <TextField
                value={params.code}
                placeholder="코드를 입력해주세요"
                onChange={(e) => setParams({ ...params, code: e.target.value })}
              />
            </Field>
            <Field label="특수권한명">
              <TextField
                value={params.name}
                placeholder="권한명을 입력해주세요"
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

          <HubGrid columns={PANEL_COLUMNS}>
            <Modal.Section
              title="특수권한 목록"
              gap={8}
              actions={
                <>
                  <Button
                    size="sm"
                    variant="neutral"
                    appearance="line"
                    disabled={!input?.code || busy}
                    onClick={() => void remove.execute()}
                  >
                    삭제
                  </Button>
                  <Button
                    size="sm"
                    variant="neutral"
                    appearance="line"
                    leadingIcon={<Icon name="plus" size={20} />}
                    disabled={creating || busy}
                    onClick={() => void create()}
                  >
                    신규 등록
                  </Button>
                </>
              }
            >
              {listError ? (
                <StatusView status="error" />
              ) : (
                <TreeTable
                  columns={CODE_COLUMNS}
                  nodes={codes.map((c) => ({ ...c, id: c.code }))}
                  expandedIds={[]}
                  onExpandedChange={() => {}}
                  selectedId={input?.code ?? null}
                  onSelect={(c) => void select(c)}
                  empty="조회 결과가 없습니다."
                />
              )}
            </Modal.Section>

            <Stack gap={24}>
              <Modal.Section title="특수권한 정보">
                {input ? (
                  <Stack gap={16}>
                    <Field label="특수권한 코드" labelWidth={LABEL_WIDTH}>
                      <TextField
                        fullWidth
                        readOnly
                        value={input.code ?? ''}
                        placeholder="저장 시 자동 생성"
                      />
                    </Field>
                    <Field
                      label="특수권한명"
                      labelWidth={LABEL_WIDTH}
                      required
                      feedback={nameError ? 'negative' : undefined}
                      helperText={nameError ?? undefined}
                    >
                      <TextField
                        fullWidth
                        value={input.name}
                        placeholder="특수권한명을 입력해주세요"
                        onChange={(e) => {
                          setNameError(null);
                          setInput({ ...input, name: e.target.value });
                        }}
                      />
                    </Field>
                    <Field label="설명" labelWidth={LABEL_WIDTH}>
                      <TextArea
                        fullWidth
                        value={input.description}
                        placeholder="설명을 입력해주세요"
                        onChange={(e) => setInput({ ...input, description: e.target.value })}
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
                  </Stack>
                ) : (
                  <StatusView
                    status="idle"
                    title="특수권한을 선택해주세요"
                    description="목록에서 코드를 선택하거나 [신규 등록]으로 등록합니다."
                  />
                )}
              </Modal.Section>

              {/* 연결된 기능 — 조회 전용, 연결 · 적용 방식 변경은 기능 코드 관리(KWPC10010202)에서 */}
              <Modal.Section title="연결된 기능" gap={8}>
                <GridPlaceholder
                  columns={LINK_COLUMNS}
                  rows={links.items}
                  rowKey={(l) => l.id}
                  empty={
                    input?.code ? '연결된 기능이 없습니다.' : '특수권한을 선택하면 표시됩니다.'
                  }
                />
                {links.total > 0 && (
                  <ResultFooter total={links.total}>
                    <Pagination
                      totalPages={Math.ceil(links.total / LINK_PAGE_SIZE)}
                      page={linkPage}
                      onChange={(page) => input?.code && void loadLinks(input.code, page)}
                    />
                  </ResultFooter>
                )}
              </Modal.Section>
            </Stack>
          </HubGrid>

          {/* 팝업 하단 안내 — 기획서 Description 정책 요약 (사용자 결정: 하단 안내만, 입력칸 도움말은 없음) */}
          <Infobox tone="neutral">
            <Infobox.Item
              bullets={[
                '한 코드를 여러 기능에 연결할 수 있습니다. 연결 · 적용 방식 변경은 기능 코드 관리에서 합니다.',
                '코드 저장만으로 사용자 권한이 부여되지 않습니다. 결재 승인 후 시스템관리자가 승인 기간대로 최종 부여해야 사용할 수 있습니다.',
                '실제 특수권한 사용 시 사유 입력이 필요합니다.',
              ]}
            />
          </Infobox>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={busy}
          onClick={() => void close()}
        >
          닫기
        </Button>
        <Button size="lg" disabled={!input || !dirty || busy} onClick={() => void save.execute()}>
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
