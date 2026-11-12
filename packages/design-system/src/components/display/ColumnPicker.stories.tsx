import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { ColumnPicker, type ColumnPickerItem } from './ColumnPicker';

const columns: ColumnPickerItem[] = [
  '민원접수',
  '전체취소',
  '부분취소',
  '결제일',
  'CP명(서비스명)',
  'CPID',
  '결제서비스',
  '거래번호',
  '주문번호',
  '구매자 ID',
  '고객명',
  '결제기관',
  '결제인증값',
  '카드번호',
].map((label, i) => ({ value: `c${i}`, label }));

const meta = {
  title: 'Composites/Result/Column Picker',
  component: ColumnPicker,
  args: { items: columns },
  parameters: { tempWork: '드래그 중 표시 · 놓을 위치 표시', layout: 'padded' },
} satisfies Meta<typeof ColumnPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function ExcelDownloadExample({ inline = false }: { inline?: boolean }) {
  const [items, setItems] = useState(columns);
  const [value, setValue] = useState(['c0', 'c1', 'c2']);
  return (
    <>
      <Modal open inline={inline} width={876}>
        <Modal.Header title="엑셀 다운로드" closeButton />
        <Modal.Body>
          <ColumnPicker items={items} onItemsChange={setItems} value={value} onChange={setValue} />
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line">
            취소
          </Button>
          <Button size="lg">다운로드</Button>
        </Modal.Footer>
      </Modal>
      <p data-testid="state" style={{ marginTop: 16 }}>
        순서: {items.map((i) => i.label).join(', ')} / 선택: {value.join(',')}
      </p>
    </>
  );
}

/** 엑셀 다운로드 Modal (Figma Modal/Modal_Excel Download): 항목 선택 · 드래그로 순서 변경 */
export const ExcelDownload: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ExcelDownloadExample inline />,
};
