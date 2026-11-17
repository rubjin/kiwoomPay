import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Segmented } from '../../components/selection';
import { DateRangeField, Field, SelectBox, TextField } from '../../components/field';
import { ControlGroup } from '../../components/layout';
import { LookupField } from '../lookup';
import { SearchPanel } from './SearchPanel';

const meta = {
  title: 'Composites/Search/Search Panel',
  component: SearchPanel,
  parameters: { layout: 'padded' },
  args: { children: null },
  argTypes: {
    loading: { control: 'boolean' },
    defaultCollapsed: { control: 'boolean' },
    defaultExpanded: { control: 'boolean' },
  },
} satisfies Meta<typeof SearchPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

const status = [
  { value: 'all', label: '전체' },
  { value: 'done', label: '정상' },
];

export const Playground: Story = {
  args: { loading: false, defaultCollapsed: false, defaultExpanded: false },
  render: (args) => (
    <SearchPanel
      {...args}
      onSearch={() => {}}
      onReset={() => {}}
      detail={
        <Field label="고객명">
          <TextField />
        </Field>
      }
    >
      <Field label="CPID">
        <TextField placeholder="CPID 입력" />
      </Field>
      <Field label="지급예정일">
        <DateRangeField />
      </Field>
    </SearchPanel>
  ),
};

/**
 * 필드 흐름: 필드를 순서대로 나열하면 폭이 남을 때 다음 필드가 같은 줄로 올라오고, 모자라면 다음 줄로 내려간다(사이 16).
 * 줄을 강제로 나누지 않는다. 캔버스 폭을 바꿔 확인
 */
export const Flow: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <SearchPanel onSearch={() => {}} onReset={() => {}}>
      <Field label="사업자번호">
        <LookupField placeholder="사업자번호를 입력해주세요" />
      </Field>
      {/* 기간 + 퀵 기간은 한 묶음(ControlGroup, 사이 8) — 줄이 바뀌어도 떨어지지 않는다 */}
      <Field label="조회기간">
        <ControlGroup>
          <DateRangeField />
          <Segmented size="md" defaultValue="1w" aria-label="기간">
            <Segmented.Item value="1w">1주일</Segmented.Item>
            <Segmented.Item value="1m">1개월</Segmented.Item>
          </Segmented>
        </ControlGroup>
      </Field>
      <Field label="거래구분">
        <SelectBox options={status} defaultValue="all" />
      </Field>
      <Field label="결제수단">
        <SelectBox options={status} defaultValue="all" />
      </Field>
      <Field label="거래번호">
        <TextField placeholder="거래번호 입력" />
      </Field>
    </SearchPanel>
  ),
};

/** 상세 검색 5칸 격자 (SearchPanel.Grid): 줄이 바뀌어도 칸이 위아래로 맞는다. 펼치면 배경 Primary 50 */
export const DetailGrid: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <SearchPanel
      onSearch={() => {}}
      defaultExpanded
      detail={
        <SearchPanel.Grid columns={5}>
          {[
            '고객명',
            '구매자 ID',
            '카드번호',
            '승인번호',
            '전화번호',
            '예금주명',
            '가상계좌번호',
            '상품권',
            '결제요청코드',
          ].map((label) => (
            <Field key={label} label={label}>
              <TextField fullWidth placeholder={`${label} 입력`} />
            </Field>
          ))}
          <Checkbox
            size="sm"
            label="개인정보 포함 검색"
            defaultChecked
            style={{ justifySelf: 'end' }}
          />
        </SearchPanel.Grid>
      }
    >
      <Field label="거래번호">
        <TextField placeholder="거래번호 입력" />
      </Field>
    </SearchPanel>
  ),
};

/** 검색 조건 전체 접힘 (Figma 상태별 GUI 05): 제목 줄만 남는다 */
export const Collapsed: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <SearchPanel defaultCollapsed onSearch={() => {}} onReset={() => {}} detail={<span />}>
      <Field label="CPID">
        <TextField />
      </Field>
    </SearchPanel>
  ),
};

/** actionsPlacement="inline": 조건이 한 줄뿐인 화면 — [초기화] · [조회]를 필드 줄 끝에 (제목 16 · 접기 없음, 다운로드 센터) */
export const InlineActions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <SearchPanel title="검색조건" actionsPlacement="inline" onSearch={() => {}} onReset={() => {}}>
      <Field label="처리상태" style={{ width: 183 }}>
        <SelectBox fullWidth options={status} defaultValue="all" />
      </Field>
      <Field label="요청일">
        <DateRangeField defaultValue={{ start: '2026-08-01', end: '2026-08-31' }} />
      </Field>
      <Field label="파일명" style={{ flex: '1 1 240px' }}>
        <TextField fullWidth placeholder="파일명 또는 요청명을 입력해주세요" />
      </Field>
    </SearchPanel>
  ),
};

/** variant="plain": 팝업 안 조회 조건 — 카드 · 상자 없이 제목(md 16) 아래 필드 한 줄 + [초기화] · [조회] */
export const Plain: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <SearchPanel variant="plain" title="조회 조건" onSearch={() => {}} onReset={() => {}}>
      <Field label="신청기간">
        <DateRangeField defaultValue={{ start: '2026-08-15', end: '2026-09-15' }} />
      </Field>
      <Field label="구분">
        <SelectBox options={status} defaultValue="all" />
      </Field>
      <Field label="상태">
        <SelectBox options={status} defaultValue="all" />
      </Field>
    </SearchPanel>
  ),
};
