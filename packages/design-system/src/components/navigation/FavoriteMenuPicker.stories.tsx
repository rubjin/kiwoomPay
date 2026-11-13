import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FAVORITE_MENU, FAVORITE_SELECTED } from '../../stories/favoriteMenuData';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { FavoriteMenuPicker } from './FavoriteMenuPicker';

const meta = {
  title: 'Composites/Feedback/Favorite Menu Picker',
  component: FavoriteMenuPicker,
  args: { items: FAVORITE_MENU },
  parameters: { tempWork: '펼침 화살표 · 칩 → 화살표 색, 예시 메뉴', layout: 'padded' },
} satisfies Meta<typeof FavoriteMenuPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 즐겨찾기 편집 Modal (lg 880): 검색 → 즐겨찾기 메뉴(칩) → 메뉴 트리 → [취소][저장] */
function FavoriteEditExample({
  initial = FAVORITE_SELECTED,
  openIds = [] as string[],
  query,
}: {
  initial?: string[];
  openIds?: string[];
  query?: string;
}) {
  const [value, setValue] = useState(initial);
  return (
    <Modal open inline size="lg">
      <Modal.Header title="즐겨찾기 편집" closeButton />
      <Modal.Body>
        <FavoriteMenuPicker
          items={FAVORITE_MENU}
          value={value}
          onChange={setValue}
          defaultOpenIds={openIds}
          defaultQuery={query}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button size="lg" variant="neutral" appearance="line">
          취소
        </Button>
        <Button size="lg">저장</Button>
      </Modal.Footer>
    </Modal>
  );
}

/** 접힌 트리 (Figma 528) */
export const FavoriteEdit: Story = {
  parameters: { controls: { disable: true } },
  render: () => <FavoriteEditExample />,
};

/** 펼친 트리: 1Depth 44 · 2Depth 40(Neutral 100) · 3Depth 체크박스 40 — 넘치면 트리 안에서 스크롤 (Figma 751) */
export const Expanded: Story = {
  parameters: { controls: { disable: true } },
  render: () => <FavoriteEditExample openIds={['m1', 'm1-1', 'm1-2']} />,
};

/** 검색: 트리 대신 일치하는 메뉴 목록 (이름 강조 + 경로) */
export const Search: Story = {
  parameters: {
    controls: { disable: true },
    tempWork: '검색 결과 줄 크기 · 경로 글자 (사용자 이미지 기준)',
  },
  render: () => <FavoriteEditExample query="정산" />,
};

/** 10개를 고르면 나머지는 고를 수 없다 · 칩이 넘치면 → 버튼 */
export const Full: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FavoriteEditExample
      initial={[...FAVORITE_SELECTED, 'm3-1-3', 'm3-1-4', 'm3-1-5', 'm3-1-6', 'm3-1-7']}
      openIds={['m3', 'm3-1']}
    />
  ),
};

/** 본문만 (조작용) */
export const Playground: Story = {
  args: { defaultValue: FAVORITE_SELECTED, defaultOpenIds: ['m1', 'm1-1'] },
  render: (args) => (
    <div style={{ width: 840 }}>
      <FavoriteMenuPicker {...args} />
    </div>
  ),
};
