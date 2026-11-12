import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Tab } from '../Tab';
import { Field, TextField } from '../field';
import { LookupSearch } from './LookupSearch';

// ── 예시용 그리드 자리 (실제 화면은 IBSheet8) ─────────────
const cell: CSSProperties = {
  padding: 8,
  borderRight: '1px solid var(--kp-color-neutral-200)',
  borderBottom: '1px solid var(--kp-color-neutral-200)',
  textAlign: 'center',
  font: '400 14px/1.5 var(--kp-font-family-base)',
  color: 'var(--kp-color-text-body)',
};
const head: CSSProperties = { ...cell, fontWeight: 700, background: 'var(--kp-color-neutral-100)' };

function GridPlaceholder({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        borderTop: '1px solid var(--kp-color-neutral-200)',
      }}
      aria-label="IBSheet8 그리드 자리(예시)"
    >
      <thead>
        <tr>
          {['', ...columns].map((c, i) => (
            <th key={i} style={{ ...head, width: i === 0 ? 39 : undefined }}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {[String(i + 1), ...r].map((v, j) => (
              <td key={j} style={cell}>
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const bizRows = Array.from({ length: 10 }, (_, i) => [
  '897-123-00005',
  '(주)ABC네트웍스',
  '홍길동',
  i % 2 === 0 ? 'test' : '',
]);
const bizGrid = (
  <GridPlaceholder columns={['사업자번호', '업체명', '대표자명', '폴더명']} rows={bizRows} />
);

const meta = {
  title: 'Components/Lookup Search',
  component: LookupSearch,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof LookupSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 조회 전 (Figma Modal/Lookup/사업자번호 검색/Initial) */
export const Initial: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Modal open inline size="lg">
      <Modal.Header title="사업자번호 검색" closeButton />
      <Modal.Body>
        <LookupSearch />
      </Modal.Body>
    </Modal>
  ),
};

/** 결과 (Figma Select Box/Modal/Search Result (Lookup)): 라벨 있는 검색 + IBSheet 그리드 + Footer */
export const Result: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Modal open inline size="lg">
      <Modal.Header title="사업자번호 검색" closeButton />
      <Modal.Body>
        <LookupSearch label="업체명" defaultQuery="ABC">
          {bizGrid}
        </LookupSearch>
      </Modal.Body>
      <Modal.Footer>
        <Button size="lg" variant="neutral" appearance="line">
          닫기
        </Button>
        <Button size="lg">확인</Button>
      </Modal.Footer>
    </Modal>
  ),
};

/** 결과 없음 (Figma … (Lookup) / Empty): 찾기 방식 Tab + 조건 2개 */
export const Empty: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Modal open inline width={880}>
      <Modal.Header title="표준산업 분류코드 조회" closeButton />
      <Modal.Body>
        <LookupSearch
          header={
            <Tab variant="button" defaultValue="keyword" fullWidth>
              <Tab.Item value="category">분류로 찾기</Tab.Item>
              <Tab.Item value="keyword">키워드로 찾기</Tab.Item>
            </Tab>
          }
          extraFields={
            <Field label="표준산업분류코드" style={{ flex: 1 }}>
              <TextField fullWidth placeholder="입력해주세요" />
            </Field>
          }
          label="분류명"
          defaultQuery="키움페이"
          empty
        />
      </Modal.Body>
    </Modal>
  ),
};

/** 열기 → 조회(가짜 API) → 결과 · 결과 없음 */
export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState<'initial' | 'result' | 'empty'>('initial');
    const [loading, setLoading] = useState(false);
    const search = (query: string) => {
      setLoading(true);
      setTimeout(() => {
        setState(query.includes('ABC') ? 'result' : 'empty');
        setLoading(false);
      }, 300);
    };
    return (
      <>
        <Button
          variant="neutral"
          onClick={() => {
            setState('initial');
            setOpen(true);
          }}
        >
          사업자번호 검색
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} size="lg">
          <Modal.Header title="사업자번호 검색" closeButton />
          <Modal.Body>
            <LookupSearch
              label="업체명"
              loading={loading}
              onSearch={search}
              empty={state === 'empty'}
            >
              {state === 'result' && bizGrid}
            </LookupSearch>
          </Modal.Body>
        </Modal>
      </>
    );
  },
};
