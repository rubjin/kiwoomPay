import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import type { DateRange } from '../DatePicker';
import { DateRangeField, Field, SearchField, SelectBox, TextField } from '../field';
import { SearchArea } from './SearchArea';

const all = { value: 'all', label: '전체' };
const statusOptions = [all, { value: 'ok', label: '정상' }, { value: 'stop', label: '중지' }];
const payOptions = [
  all,
  { value: 'card', label: '신용카드' },
  { value: 'bank', label: '계좌이체' },
];
const procOptions = [
  all,
  { value: 'done', label: '처리완료' },
  { value: 'wait', label: '처리대기' },
];

// 아래 필드 조합은 예시. 실제 검색 조건 · 기본값 · 필수 여부는 화면설계서에서 정한다
const BasicFields = () => (
  <>
    <Field label="조회기간" labelPosition="top" size="sm">
      <DateRangeField />
    </Field>
    <Field label="상태" labelPosition="top" size="sm" style={{ width: 200 }}>
      <SelectBox options={statusOptions} defaultValue="all" fullWidth />
    </Field>
    <Field label="검색어" labelPosition="top" size="sm" style={{ width: 320 }}>
      <SearchField placeholder="가맹점명 또는 가맹점ID" fullWidth />
    </Field>
  </>
);

const DetailFields = () => (
  <>
    <Field label="결제수단" labelPosition="top" size="sm" style={{ width: 200 }}>
      <SelectBox options={payOptions} defaultValue="all" fullWidth />
    </Field>
    <Field label="처리상태" labelPosition="top" size="sm" style={{ width: 200 }}>
      <SelectBox options={procOptions} defaultValue="all" fullWidth />
    </Field>
    <Field label="가맹점ID" labelPosition="top" size="sm" style={{ width: 240 }}>
      <SearchField placeholder="ID를 입력해주세요" fullWidth />
    </Field>
  </>
);

const DetailActions = () => (
  <>
    <Button size="sm" variant="neutral" appearance="line">
      조건 저장
    </Button>
    <Button size="sm" appearance="line">
      내 검색조건
    </Button>
  </>
);

const meta = {
  title: 'Components/Search/SearchArea',
  component: SearchArea,
  args: { children: null },
} satisfies Meta<typeof SearchArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Basic: 항상 노출되는 핵심 검색 조건 + 초기화 · 조회 · 상세조건 */
export const Basic: Story = {
  render: () => (
    <SearchArea detail={<DetailFields />} detailActions={<DetailActions />}>
      <BasicFields />
    </SearchArea>
  ),
};

/** Detail · Expanded: 상세조건을 펼치면 추가 필드와 개인 검색조건 기능 */
export const DetailExpanded: Story = {
  render: () => (
    <SearchArea defaultExpanded detail={<DetailFields />} detailActions={<DetailActions />}>
      <BasicFields />
    </SearchArea>
  ),
};

/** 상세 조건이 없는 화면: [상세조건] 버튼 없음 */
export const BasicOnly: Story = {
  render: () => (
    <SearchArea>
      <BasicFields />
    </SearchArea>
  ),
};

/** Validation: 입력 오류는 Field의 feedback · helperText로 표시 */
export const Validation: Story = {
  render: () => (
    <SearchArea>
      <Field
        label="조회기간"
        labelPosition="top"
        size="sm"
        feedback="negative"
        helperText="조회기간은 최대 3개월입니다."
      >
        <DateRangeField defaultValue={{ start: '2026-01-01', end: '2026-06-30' }} />
      </Field>
      <Field label="가맹점ID" labelPosition="top" size="sm" required style={{ width: 240 }}>
        <TextField placeholder="ID를 입력해주세요" fullWidth />
      </Field>
    </SearchArea>
  ),
};

function InteractiveExample() {
  const empty: DateRange = { start: '', end: '' };
  const [period, setPeriod] = useState<DateRange>(empty);
  const [status, setStatus] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState('');

  const search = () => {
    setLoading(true);
    setLog(`조회: ${JSON.stringify({ period, status, keyword })}`);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div>
      <SearchArea
        onSearch={search}
        onReset={() => {
          setPeriod(empty);
          setStatus('all');
          setKeyword('');
          setLog('초기화');
        }}
        loading={loading}
        detail={<DetailFields />}
        detailActions={<DetailActions />}
      >
        <Field label="조회기간" labelPosition="top" size="sm">
          <DateRangeField value={period} onChange={setPeriod} />
        </Field>
        <Field label="상태" labelPosition="top" size="sm" style={{ width: 200 }}>
          <SelectBox options={statusOptions} value={status} onChange={setStatus} fullWidth />
        </Field>
        <Field label="검색어" labelPosition="top" size="sm" style={{ width: 320 }}>
          <SearchField
            placeholder="가맹점명 또는 가맹점ID"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            fullWidth
          />
        </Field>
      </SearchArea>
      <p style={{ marginTop: 16 }}>{log || '검색어 입력 후 Enter 또는 [조회]'}</p>
    </div>
  );
}

/** 실제 동작: Enter · [조회] → onSearch, [초기화] → onReset, 조회 중 로딩 */
export const Interactive: Story = {
  render: () => <InteractiveExample />,
};
