import {
  Button,
  ConditionSummary,
  ConfigDivider,
  ConfigField,
  ConfigHint,
  ConfigPanelHeader,
  ConfigSplit,
  Field,
  Infobox,
  Modal,
  SavedConditionList,
  TextField,
  useAction,
  useConfigDraft,
  useDialog,
} from '@kiwoompay/design-system';
import { useEffect, useMemo, useState } from 'react';
import type { IntegratedTransactionParams } from '@/types/transaction/integratedTransaction';
import { cardSummary, summaryRows, type SavedSearch } from './savedSearches';

const PAGE_SIZE = 10;

interface Draft {
  list: SavedSearch[];
  /** [저장] 때 지울 조건 (삭제 예정) */
  deleted: string[];
  /** 적용 중인 조건 */
  appliedId: string | null;
}

interface SavedSearchModalProps {
  open: boolean;
  saved: SavedSearch[];
  appliedId: string | null;
  /** 현재 화면 검색조건 (덮어쓰기 · 신규 등록) */
  currentParams: IntegratedTransactionParams;
  onSave: (list: SavedSearch[], appliedId: string | null) => void;
  onClose: () => void;
}

/**
 * KWPC04010105 내 검색조건 관리 — 패턴 P07 V03 (저장된 조건 관리). 변경은 초안에 모아 [저장] 때 반영.
 * (임의 작업) 신규 등록 = 현재 화면 조건으로 새 항목, 적용 = [저장] 때 화면 검색조건을 바꿈
 */
export function SavedSearchModal({
  open,
  saved,
  appliedId,
  currentParams,
  onSave,
  onClose,
}: SavedSearchModalProps) {
  const dialog = useDialog();
  const savedDraft = useMemo<Draft>(
    () => ({ list: saved, deleted: [], appliedId }),
    [saved, appliedId],
  );
  const config = useConfigDraft(savedDraft);
  const { draft, begin } = config;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // 열 때마다 저장값으로 시작
  useEffect(() => {
    if (!open) return;
    begin();
    setSelectedId(appliedId ?? saved[0]?.id ?? null);
    setQuery('');
    setPage(1);
  }, [open]);

  const filtered = draft.list.filter((s) => s.name.includes(query.trim()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = draft.list.find((s) => s.id === selectedId);
  const isDeleted = !!selected && draft.deleted.includes(selected.id);

  const update = (patch: Partial<Draft>) => config.setDraft({ ...draft, ...patch });
  const patchSelected = (patch: Partial<SavedSearch>) =>
    update({ list: draft.list.map((s) => (s.id === selectedId ? { ...s, ...patch } : s)) });

  const save = useAction({
    validate: () =>
      draft.list.some((s) => !draft.deleted.includes(s.id) && !s.name.trim())
        ? '검색조건명을 입력해주세요.'
        : null,
    run: () => new Promise((resolve) => setTimeout(resolve, 300)), // TODO(API) 내 검색조건 저장
    onSuccess: () => {
      const list = draft.list.filter((s) => !draft.deleted.includes(s.id));
      const applied = list.some((s) => s.id === draft.appliedId) ? draft.appliedId : null;
      onSave(list, applied);
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
    onClose();
  };

  const addNew = () => {
    const id = `new-${Date.now()}`;
    update({ list: [{ id, name: '새 검색조건', params: currentParams }, ...draft.list] });
    setSelectedId(id);
    setQuery('');
    setPage(1);
  };

  return (
    <Modal open={open} onClose={save.loading ? undefined : close} size="lg">
      <Modal.Header title="내 검색조건 관리" closeButton />
      <Modal.Body>
        <ConfigSplit
          description="저장된 검색조건을 선택하여 적용하거나 이름과 조건을 수정할 수 있습니다."
          left={
            <SavedConditionList
              items={pageItems.map((s) => ({
                id: s.id,
                name: s.name || '(이름 없음)',
                summary: cardSummary(s.params),
                status: draft.deleted.includes(s.id)
                  ? { label: '삭제 예정', tone: 'error' }
                  : s.id === draft.appliedId
                    ? { label: '적용 중', tone: 'success' }
                    : undefined,
              }))}
              total={filtered.length}
              value={selectedId ?? undefined}
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
            <>
              <ConfigPanelHeader
                title="선택한 검색조건 관리"
                actions={
                  <Button size="sm" variant="primary" appearance="line" onClick={addNew}>
                    신규 등록
                  </Button>
                }
              />
              {selected && (
                <>
                  <Field label="검색조건명">
                    <TextField
                      fullWidth
                      maxLength={30}
                      value={selected.name}
                      disabled={isDeleted}
                      onChange={(e) => patchSelected({ name: e.target.value })}
                    />
                  </Field>
                  <Field label="저장된 조건" labelPosition="top">
                    <ConditionSummary rows={summaryRows(selected.params)} />
                  </Field>
                  <ConfigField
                    align="between"
                    label={
                      <Button
                        variant="neutral"
                        appearance="line"
                        disabled={isDeleted}
                        onClick={() => patchSelected({ params: currentParams })}
                      >
                        현재 조건 덮어쓰기
                      </Button>
                    }
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
                  {draft.deleted.length > 0 ? `삭제 예정 ${draft.deleted.length}건을 포함한 ` : ''}
                  변경사항은 [저장] 선택 시 최종 반영되며, [취소] 또는 [X]로 종료하면 반영되지
                  않습니다.
                </Infobox.Item>
              </Infobox>
            </>
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
          disabled={!config.dirty}
          loading={save.loading}
          onClick={() => save.execute()}
        >
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
