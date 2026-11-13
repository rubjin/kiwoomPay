import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { FavoriteMenuPicker, findPath } from '../../components/navigation';
import { FAVORITE_MENU, FAVORITE_SELECTED } from '../../stories/favoriteMenuData';
import { useAction } from '../action';
import { DialogProvider, useDialog } from '../common';
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
