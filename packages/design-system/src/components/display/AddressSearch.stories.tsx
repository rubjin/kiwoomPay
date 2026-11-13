import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { AddressResultRow } from './AddressResultRow';
import { AddressSearch, type AddressItem } from './AddressSearch';

const sample: AddressItem[] = [
  {
    zipCode: '04155',
    roadAddress: '서울특별시 마포구 독막로 314 (염리동)',
    jibunAddress: '서울특별시 마포구 염리동 172-10',
  },
  {
    zipCode: '04153',
    roadAddress: '서울특별시 마포구 독막로 268 (대흥동)',
    jibunAddress: '서울특별시 마포구 대흥동 660',
  },
  {
    zipCode: '04096',
    roadAddress: '서울특별시 마포구 독막로 241 (대흥동)',
    jibunAddress: '서울특별시 마포구 대흥동 325-78',
  },
  {
    zipCode: '04048',
    roadAddress: '서울특별시 마포구 독막로 57 (합정동)',
    jibunAddress: '서울특별시 마포구 합정동 410-19',
  },
];

const meta = {
  title: 'Composites/Search/Address Search',
  component: AddressSearch,
  parameters: { tempWork: '결과 없음 영역 위치', layout: 'padded' },
} satisfies Meta<typeof AddressSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Lookup Modal(lg 880) 안: 조회 전 · 결과 · 결과 없음 (시안) */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--kp-space-20)', alignItems: 'flex-start' }}>
      <Modal open inline size="lg">
        <Modal.Header title="주소 검색" closeButton />
        <Modal.Body>
          <AddressSearch />
        </Modal.Body>
      </Modal>
      <Modal open inline size="lg">
        <Modal.Header title="주소 검색" closeButton />
        <Modal.Body>
          <AddressSearch defaultQuery="독막로" results={sample} total={12} onSelect={() => {}} />
        </Modal.Body>
      </Modal>
      <Modal open inline size="lg">
        <Modal.Header title="주소 검색" closeButton />
        <Modal.Body>
          <AddressSearch defaultQuery="검색되지 않는 주소" results={[]} />
        </Modal.Body>
      </Modal>
    </div>
  ),
};

/** 결과 한 줄 (Address Result Row) */
export const ResultRow: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 760 }}>
      <AddressResultRow
        zipCode="04155"
        roadAddress="서울특별시 마포구 독막로 314 (염리동)"
        jibunAddress="서울특별시 마포구 염리동 172-10"
        onSelect={() => {}}
      />
    </div>
  ),
};

/** 열기 → 조회(가짜 API) → 선택하면 닫히고 값 반영 */
export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<AddressItem[] | undefined>();
    const [loading, setLoading] = useState(false);
    const [picked, setPicked] = useState<AddressItem | null>(null);
    const search = (query: string) => {
      setLoading(true);
      setTimeout(() => {
        setResults(query ? sample.filter((item) => item.roadAddress.includes(query)) : []);
        setLoading(false);
      }, 300);
    };
    return (
      <div style={{ display: 'flex', gap: 'var(--kp-space-12)', alignItems: 'center' }}>
        <Button
          variant="neutral"
          onClick={() => {
            setResults(undefined);
            setOpen(true);
          }}
        >
          주소 검색
        </Button>
        <span data-testid="picked">
          {picked ? `(${picked.zipCode}) ${picked.roadAddress}` : '선택 안 함'}
        </span>
        <Modal open={open} onClose={() => setOpen(false)} size="lg">
          <Modal.Header title="주소 검색" closeButton />
          <Modal.Body>
            <AddressSearch
              results={results}
              loading={loading}
              onSearch={search}
              onSelect={(item) => {
                setPicked(item);
                setOpen(false);
              }}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  },
};
