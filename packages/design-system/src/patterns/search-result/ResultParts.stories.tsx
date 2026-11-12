import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button';
import { Pagination } from '../../components/Pagination';
import { AppliedFilters } from './AppliedFilters';
import { GridPlaceholder } from './GridPlaceholder';
import { ResultFooter } from './ResultFooter';
import { ResultPanel } from './ResultPanel';
import { ResultSummary } from './ResultSummary';

const meta = {
  title: 'Components/Search Result/Result Parts',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const bg = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 12,
  padding: 12,
  background: 'var(--kp-color-bg-page)',
};

/** 적용된 검색 조건: 조회 전 안내 · 조회 후 칩 (조회에 사용한 조건) */
export const AppliedFilter: Story = {
  name: 'AppliedFilters',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={bg}>
      <AppliedFilters items={[]} />
      <AppliedFilters
        items={[
          { label: '조회기간', value: '2026-08-25 00:00 ~ 2026-08-31 23:59' },
          { label: '거래구분', value: '전체' },
          { label: '결제수단', value: '신용카드, 간편결제' },
        ]}
      />
    </div>
  ),
};

/** 조회 요약: 값 1개 (건) · 값 여러 개 (건 • 원) · 조회 전 '-' */
export const Summary: Story = {
  name: 'ResultSummary',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={bg}>
      <ResultSummary
        items={[
          { label: '조회 대상', value: 28 },
          { label: '조치 필요', value: 4 },
          { label: '지급완료', value: null },
        ]}
      />
      <ResultSummary
        items={[
          { label: '전체 거래', values: [{ value: 11080 }, { value: 918900000, unit: '원' }] },
          { label: '승인', values: [{ value: 9842 }, { value: 842560000, unit: '원' }] },
          { label: '취소', values: [{ value: undefined }, { value: undefined, unit: '원' }] },
        ]}
      />
    </div>
  ),
};

/** 조회 결과 카드 + Total · Pagination. Grid는 IBSheet8 (여기서는 GridPlaceholder 미리보기) */
export const Panel: Story = {
  name: 'ResultPanel · ResultFooter',
  parameters: {
    controls: { disable: true },
    tempWork: 'GridPlaceholder (IBSheet 연결 전 미리보기)',
  },
  render: () => (
    <div style={bg}>
      <ResultPanel
        titleActions={
          <Button size="sm" variant="neutral" appearance="line">
            엑셀 다운로드
          </Button>
        }
        actions={<Button size="sm">등록</Button>}
      >
        <GridPlaceholder
          columns={[
            { key: 'id', header: '거래번호', width: 200 },
            { key: 'name', header: '가맹점명', width: 200 },
          ]}
          rows={[
            { id: 'T001', name: '키움쇼핑' },
            { id: 'T002', name: '다우커머스' },
          ]}
          rowKey={(r) => r.id}
          selectable
        />
      </ResultPanel>
      <ResultFooter total={2}>
        <Pagination totalPages={1} page={1} />
      </ResultFooter>
    </div>
  ),
};

/** 결과 상태: success 외에는 Grid 머리 아래에 StatusView */
export const PanelStates: Story = {
  name: 'ResultPanel 상태',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...bg, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <ResultPanel status="idle" statusProps={{ title: '거래내역을 조회해주세요' }} />
      <ResultPanel status="empty" />
    </div>
  ),
};
