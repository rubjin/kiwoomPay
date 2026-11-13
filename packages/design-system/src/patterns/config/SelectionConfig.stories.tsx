import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { Field, SelectBox, TextField } from '../../components/field';
import { Infobox } from '../../components/display';
import { Modal } from '../../components/Modal';
import { SectionHeading } from '../../components/SectionHeading';
import { Radio, RadioGroup } from '../../components/selection';
import { FavoriteMenuPicker, findPath } from '../../components/navigation';
import { FAVORITE_MENU, FAVORITE_SELECTED } from '../../stories/favoriteMenuData';
import { useAction } from '../action';
import { DialogProvider, useDialog } from '../common';
import {
  ConditionSummary,
  ConfigDivider,
  ConfigField,
  ConfigHint,
  ConfigSplit,
  SavedConditionList,
} from './SavedConditionList';
import { TransferList } from './TransferList';
import {
  CURRENT_SCREEN_ROWS,
  EXCEL_COLUMNS,
  EXCEL_DEFAULT,
  SAVED_CONDITIONS,
  summarizeCondition,
  type DemoCondition,
} from './configDemoData';
import { useConfigDraft } from './useConfigDraft';

const meta = {
  title: 'Patterns/P07 Selection Configuration',
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <DialogProvider>
        <Story />
      </DialogProvider>
    ),
  ],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * 즐겨찾기 편집 (V01 메뉴 선택): 저장값을 초안으로 복사해 Modal에서 편집 →
 * [저장] 저장 · 닫기 · 완료 안내 / [취소] · X: 바뀐 것이 있으면 버릴지 확인
 */
function FavoriteEditFlow() {
  const dialog = useDialog();
  const [favorites, setFavorites] = useState(FAVORITE_SELECTED);
  const [open, setOpen] = useState(false);
  const config = useConfigDraft(favorites);

  const save = useAction({
    run: () => wait(500), // TODO(API) 즐겨찾기 저장
    onSuccess: () => {
      setFavorites(config.draft);
      setOpen(false);
    },
    success: '즐겨찾기를 저장했습니다.',
  });

  const close = async () => {
    if (
      config.dirty &&
      !(await dialog.confirm('변경한 내용이 저장되지 않습니다. 닫을까요?', { confirmText: '닫기' }))
    )
      return;
    setOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Button
        variant="neutral"
        appearance="line"
        onClick={() => {
          config.begin();
          setOpen(true);
        }}
      >
        즐겨찾기 편집
      </Button>
      <p style={{ margin: 0 }}>
        저장된 즐겨찾기 {favorites.length}개:{' '}
        {favorites.map((id) => findPath(FAVORITE_MENU, id).at(-1)?.label).join(', ')}
      </p>
      <Modal open={open} onClose={save.loading ? undefined : close} size="lg">
        <Modal.Header title="즐겨찾기 편집" closeButton />
        <Modal.Body>
          <FavoriteMenuPicker
            items={FAVORITE_MENU}
            value={config.draft}
            onChange={config.setDraft}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="lg"
            variant="neutral"
            appearance="line"
            disabled={save.loading}
            onClick={close}
          >
            취소
          </Button>
          <Button
            size="lg"
            disabled={!config.dirty}
            loading={save.loading}
            onClick={() => save.execute()}
          >
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

/** 즐겨찾기 편집 흐름 (lg 880) */
export const FavoriteEdit: Story = {
  parameters: {
    controls: { disable: true },
    tempWork: '변경 시에만 [저장] 활성 · 닫기 확인 문구 · 완료 문구 · 예시 메뉴',
  },
  render: () => <FavoriteEditFlow />,
};

// ── V02 엑셀 다운로드 설정 (Figma KWPC04010107) ─────────────
const EXCEL_LABEL_WIDTH = 80; // 다운로드 유형 · 엑셀 템플릿 라벨 칸 맞춤 (Figma는 각자 폭)
const TEMPLATE_WIDTH = 438;

function ExcelDownloadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useDialog();
  const [type, setType] = useState('normal');
  const [columns, setColumns] = useState(EXCEL_DEFAULT);
  const download = useAction({
    validate: () => (columns.length === 0 ? '출력할 항목을 1개 이상 선택해주세요.' : null),
    run: () => wait(500), // TODO(API) 엑셀 생성 요청
    onSuccess: onClose,
    success: '엑셀 다운로드를 요청했습니다. 대용량 파일은 다운로드 센터에서 받을 수 있습니다.',
  });
  return (
    <Modal open={open} onClose={download.loading ? undefined : onClose} size="lg">
      <Modal.Header title="엑셀 다운로드 설정" closeButton />
      <Modal.Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ConfigField label="다운로드 유형" labelWidth={EXCEL_LABEL_WIDTH}>
            <RadioGroup direction="horizontal" value={type} onChange={setType}>
              <Radio value="normal" label="일반 거래내역" />
              <Radio value="unpaid" label="미납자료 추출" />
            </RadioGroup>
          </ConfigField>
          <ConfigField label="엑셀 템플릿" labelWidth={EXCEL_LABEL_WIDTH}>
            <SelectBox
              style={{ width: TEMPLATE_WIDTH }}
              fullWidth
              options={[{ value: 'basic', label: '기본 템플릿' }]}
            />
            <Button variant="neutral" appearance="line" onClick={() => setColumns(EXCEL_DEFAULT)}>
              불러오기
            </Button>
            <Button
              variant="primary"
              appearance="line"
              onClick={() => dialog.alert('템플릿을 저장했습니다. (예시)')}
            >
              저장
            </Button>
            <Button variant="danger" appearance="line">
              삭제
            </Button>
          </ConfigField>
          <TransferList items={EXCEL_COLUMNS} value={columns} onChange={setColumns} />
          <Infobox>
            <Infobox.Item>
              개인정보·결제정보는 다운로드 권한에 따라 마스킹 또는 원문으로 제공되며, 모든 Excel
              파일은 암호화되고 대용량 파일은 다운로드센터에서 생성 결과를 확인할 수 있습니다.
            </Infobox.Item>
          </Infobox>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={download.loading}
          onClick={onClose}
        >
          취소
        </Button>
        <Button size="lg" loading={download.loading} onClick={() => download.execute()}>
          엑셀 다운로드
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/** V02 엑셀 다운로드 설정 (lg 880): 다운로드 유형 · 템플릿 · 전체 항목 ⇄ 선택 항목(끌어서 순서) */
export const ExcelDownload: Story = {
  parameters: {
    controls: { disable: true },
    tempWork: '템플릿 불러오기 · 저장 · 삭제 동작, 다운로드 결과 문구',
  },
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="neutral" appearance="line" onClick={() => setOpen(true)}>
          엑셀 다운로드
        </Button>
        <ExcelDownloadModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
};

// ── V03 내 검색조건 관리 (Figma KWPC04010105) ──────────────
const PAGE_SIZE = 10;

interface ConditionDraft {
  list: DemoCondition[];
  /** 저장 시 지울 조건 (삭제 예정) */
  deleted: string[];
  /** 적용 중인 조건 */
  appliedId: string | null;
}

function SavedConditionModal({
  open,
  onClose,
  initial = SAVED_CONDITIONS,
}: {
  open: boolean;
  onClose: () => void;
  initial?: DemoCondition[];
}) {
  const dialog = useDialog();
  const [saved, setSaved] = useState<ConditionDraft>({
    list: initial,
    deleted: [],
    appliedId: initial[0]?.id ?? null,
  });
  const config = useConfigDraft(saved);
  const { draft } = config;
  const [selectedId, setSelectedId] = useState(initial[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [seq, setSeq] = useState(1);
  /** 저장된 조건이 없으면 오른쪽은 신규 등록 (현재 화면 조건 + 이름) */
  const creating = draft.list.length === 0;
  const [newName, setNewName] = useState('');

  const filtered = useMemo(
    () => draft.list.filter((c) => c.name.includes(query.trim())),
    [draft.list, query],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = draft.list.find((c) => c.id === selectedId);
  const isDeleted = selected ? draft.deleted.includes(selected.id) : false;

  const update = (patch: Partial<ConditionDraft>) => config.setDraft({ ...draft, ...patch });
  const patchSelected = (patch: Partial<DemoCondition>) =>
    update({ list: draft.list.map((c) => (c.id === selectedId ? { ...c, ...patch } : c)) });

  const save = useAction({
    validate: () =>
      (creating ? !newName.trim() : draft.list.some((c) => !c.name.trim()))
        ? '검색조건명을 입력해주세요.'
        : null,
    run: () => wait(500), // TODO(API) 검색조건 저장
    onSuccess: () => {
      if (creating) {
        const id = `new${seq}`;
        setSeq(seq + 1);
        const next = {
          list: [{ id, name: newName.trim(), rows: CURRENT_SCREEN_ROWS }],
          deleted: [],
          appliedId: null,
        };
        setSaved(next);
        config.setDraft(next);
        setSelectedId(id);
        setNewName('');
      } else {
        setSaved({
          ...draft,
          list: draft.list.filter((c) => !draft.deleted.includes(c.id)),
          deleted: [],
        });
      }
      onClose();
    },
    success: '검색조건을 저장했습니다.',
  });

  const close = async () => {
    if (
      config.dirty &&
      !(await dialog.confirm('변경한 내용이 저장되지 않습니다. 닫을까요?', { confirmText: '닫기' }))
    )
      return;
    config.reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={save.loading ? undefined : close} size="lg">
      <Modal.Header title="내 검색조건 관리" closeButton />
      <Modal.Body>
        <ConfigSplit
          description={
            creating
              ? '저장된 검색조건이 없습니다. 현재 화면의 검색조건을 새로 저장할 수 있습니다.'
              : '저장된 검색조건을 선택하여 적용하거나 이름과 조건을 수정할 수 있습니다.'
          }
          left={
            <SavedConditionList
              items={pageItems.map((c) => ({
                id: c.id,
                name: c.name || '(이름 없음)',
                summary: summarizeCondition(c),
                status: draft.deleted.includes(c.id)
                  ? { label: '삭제 예정', tone: 'error' }
                  : c.id === draft.appliedId
                    ? { label: '적용 중', tone: 'success' }
                    : undefined,
              }))}
              total={filtered.length}
              value={selectedId}
              onChange={setSelectedId}
              query={query}
              onQueryChange={(q) => {
                setQuery(q);
                setPage(1);
              }}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          }
          right={
            creating ? (
              <>
                <SectionHeading size="md" as="h3" title="신규 검색조건 등록" />
                <Field label="검색조건명">
                  <TextField
                    fullWidth
                    maxLength={30}
                    placeholder="검색조건명을 입력해주세요"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </Field>
                <Field label="저장할 조건" labelPosition="top">
                  <ConditionSummary rows={CURRENT_SCREEN_ROWS} />
                </Field>
                <ConfigHint>현재 조회화면의 선택 조건으로 새 검색조건을 저장합니다.</ConfigHint>
              </>
            ) : (
              <>
                <SectionHeading
                  size="md"
                  as="h3"
                  title="선택한 검색조건 관리"
                  actions={
                    <Button
                      size="sm"
                      variant="primary"
                      appearance="line"
                      onClick={() => {
                        const id = `new${seq}`;
                        setSeq(seq + 1);
                        update({
                          list: [
                            { id, name: '새 검색조건', rows: CURRENT_SCREEN_ROWS },
                            ...draft.list,
                          ],
                        });
                        setSelectedId(id);
                        setPage(1);
                      }}
                    >
                      신규 등록
                    </Button>
                  }
                />
                {selected && (
                  <>
                    <Field label="검색조건명">
                      <TextField
                        fullWidth
                        value={selected.name}
                        disabled={isDeleted}
                        onChange={(e) => patchSelected({ name: e.target.value })}
                      />
                    </Field>
                    <Field label="저장된 조건" labelPosition="top">
                      <ConditionSummary rows={selected.rows} />
                    </Field>
                    <ConfigField
                      label={
                        <Button
                          variant="neutral"
                          appearance="line"
                          disabled={isDeleted}
                          onClick={() => patchSelected({ rows: CURRENT_SCREEN_ROWS })}
                        >
                          현재 조건 덮어쓰기
                        </Button>
                      }
                      align="between"
                    >
                      <ConfigHint>선택 조건을 현재 화면의 검색조건으로 변경합니다.</ConfigHint>
                    </ConfigField>
                    <ConfigDivider />
                    <ConfigField label="선택 조건 작업" align="between">
                      <Button
                        variant="danger"
                        appearance="line"
                        onClick={() =>
                          update({
                            deleted: isDeleted
                              ? draft.deleted.filter((id) => id !== selected.id)
                              : [...draft.deleted, selected.id],
                          })
                        }
                      >
                        {isDeleted ? '삭제 취소' : '삭제'}
                      </Button>
                      <Button
                        variant="primary"
                        appearance="line"
                        disabled={isDeleted}
                        onClick={() => update({ appliedId: selected.id })}
                      >
                        선택 조건 적용
                      </Button>
                    </ConfigField>
                  </>
                )}
                <Infobox>
                  <Infobox.Item>
                    {draft.deleted.length > 0
                      ? `삭제 예정 ${draft.deleted.length}건을 포함한 `
                      : ''}
                    삭제 예정 1건을 포함한 변경사항은 [저장] 선택 시 최종 반영되며, [취소] 또는
                    [X]로 종료하면 반영되지 않습니다.
                  </Infobox.Item>
                </Infobox>
              </>
            )
          }
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={save.loading}
          onClick={close}
        >
          취소
        </Button>
        <Button
          size="lg"
          disabled={!creating && !config.dirty}
          loading={save.loading}
          onClick={() => save.execute()}
        >
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/** V03 내 검색조건 관리 (lg 880): 저장된 검색조건 목록 | 선택한 검색조건 관리 — 변경은 [저장] 때 반영 */
export const SavedConditions: Story = {
  parameters: {
    controls: { disable: true },
    tempWork:
      '적용 · 덮어쓰기 · 신규 등록 동작 해석, 예시 데이터, 화면 쪽 반영(적용 시 검색 조건 바꾸기)',
  },
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="neutral" appearance="line" onClick={() => setOpen(true)}>
          내 검색조건 관리
        </Button>
        <SavedConditionModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
};

/** V03 저장된 조건 없음: 왼쪽 빈 안내, 오른쪽 신규 검색조건 등록(현재 화면 조건 + 이름) */
export const SavedConditionsEmpty: Story = {
  name: 'SavedConditions · 저장조건 없음',
  parameters: {
    controls: { disable: true },
    tempWork: '예시 조건(저장할 조건 = 현재 화면 조건)',
  },
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="neutral" appearance="line" onClick={() => setOpen(true)}>
          내 검색조건 관리
        </Button>
        <SavedConditionModal open={open} onClose={() => setOpen(false)} initial={[]} />
      </>
    );
  },
};
