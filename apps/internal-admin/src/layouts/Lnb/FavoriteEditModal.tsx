import {
  Button,
  FavoriteMenuPicker,
  Modal,
  useAction,
  useConfigDraft,
  useDialog,
  type LnbMenuItem,
} from '@kiwoompay/design-system';

interface FavoriteEditModalProps {
  open: boolean;
  items: LnbMenuItem[];
  /** 저장된 즐겨찾기 메뉴 id */
  favoriteIds: string[];
  onClose: () => void;
  onSaved: (ids: string[]) => void;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * KWPC1301 LNB 즐겨찾기 편집 팝업 (Figma 29348:37, 페이지 패턴 P07, Modal lg 880).
 * 저장값을 초안으로 편집 → [저장] 저장 · 닫기 · 완료 안내 / [취소] · X: 바뀐 것이 있으면 확인
 */
export function FavoriteEditModal({
  open,
  items,
  favoriteIds,
  onClose,
  onSaved,
}: FavoriteEditModalProps) {
  const dialog = useDialog();
  const config = useConfigDraft(favoriteIds);

  const save = useAction({
    run: () => wait(400), // TODO(API) 즐겨찾기 저장
    onSuccess: () => {
      onSaved(config.draft);
      onClose();
    },
    success: '즐겨찾기를 저장했습니다.',
  });

  const close = async () => {
    if (
      config.dirty &&
      !(await dialog.confirm('변경한 내용이 저장되지 않습니다. 닫을까요?', { confirmText: '닫기' }))
    )
      return;
    onClose();
  };

  return (
    <Modal open={open} onClose={save.loading ? undefined : close} size="lg">
      <Modal.Header title="즐겨찾기 편집" closeButton />
      <Modal.Body>
        <FavoriteMenuPicker items={items} value={config.draft} onChange={config.setDraft} />
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
