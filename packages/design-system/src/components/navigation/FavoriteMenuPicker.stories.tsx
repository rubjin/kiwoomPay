import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { FavoriteCount, FavoriteMenuPicker } from './FavoriteMenuPicker';
import type { LnbMenuItem } from './lnbUtils';

const leaf = (id: string, label: string): LnbMenuItem => ({ id, label });
const menu: LnbMenuItem[] = [
  {
    id: 'trade',
    label: '거래내역',
    children: [leaf('trade-all', '통합 거래 내역'), leaf('trade-card', '카드 거래 내역')],
  },
  {
    id: 'stats',
    label: '통계내역',
    children: [
      {
        id: 'stats-sales',
        label: '매출통계',
        children: [
          leaf('sales-total', '통합매출'),
          leaf('sales-payment', '결제별 상세매출'),
          leaf('sales-period', '기간별 비교매출'),
          leaf('sales-diff', '기간비교증감'),
        ],
      },
      { id: 'stats-rm', label: 'RM관리', children: [leaf('rm-1', 'RM 현황')] },
      { id: 'stats-bad', label: '대손통계', children: [leaf('bad-1', '대손 현황')] },
      { id: 'stats-report', label: '보고자료', children: [leaf('report-1', '월간 보고')] },
      { id: 'stats-bond', label: '채권현황', children: [leaf('bond-1', '채권 목록')] },
      {
        id: 'stats-ext',
        label: '정산자금외부관리조회',
        children: [leaf('ext-1', '외부관리 조회')],
      },
    ],
  },
  { id: 'settle', label: '정산내역', children: [leaf('settle-1', '가맹점 정산')] },
  { id: 'ops', label: '운영관리', children: [leaf('ops-1', '가맹점 관리')] },
  { id: 'addon', label: '부가서비스', children: [leaf('addon-1', '지급대행')] },
  { id: 'rm', label: 'RM관리', children: [leaf('rm-fds', '이상거래 모니터링')] },
];

const meta = {
  title: 'Components/Favorite Menu Picker',
  component: FavoriteMenuPicker,
  args: { items: menu },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FavoriteMenuPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function FavoriteEditExample({ inline = false, initial = [] as string[] }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <Modal open inline={inline} size="md">
        <Modal.Header
          title="즐겨찾기 편집"
          closeButton
          addon={<FavoriteCount count={value.length} max={10} />}
        />
        <Modal.Body>
          <FavoriteMenuPicker
            items={menu}
            value={value}
            onChange={setValue}
            defaultOpenIds={['stats', 'stats-sales']}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line">
            취소
          </Button>
          <Button size="lg">저장</Button>
        </Modal.Footer>
      </Modal>
      <p data-testid="state" style={{ marginTop: 16 }}>
        선택: {value.join(',')}
      </p>
    </>
  );
}

/** 즐겨찾기 편집 Modal (Figma Modal_Favorite Edit Modal): 검색 · 1Depth 펼침 · 3Depth 선택 (최대 10) */
export const FavoriteEdit: Story = {
  parameters: { controls: { disable: true } },
  render: () => <FavoriteEditExample inline />,
};

/** 최대 개수(10)를 채우면 나머지는 고를 수 없다 */
export const Full: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FavoriteEditExample
      inline
      initial={[
        'trade-all',
        'trade-card',
        'sales-total',
        'sales-payment',
        'rm-1',
        'bad-1',
        'report-1',
        'bond-1',
        'ext-1',
        'settle-1',
      ]}
    />
  ),
};
