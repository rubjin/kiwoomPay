import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { InfoStrip } from './InfoStrip';

const meta = {
  title: 'Components/Info Strip',
  component: InfoStrip,
  args: {
    items: [
      {
        label: '현재 상태',
        value: (
          <Badge tone="success" size="md">
            정상
          </Badge>
        ),
      },
      { label: '최종 변경일시', value: '2026-08-29 15:30:00' },
      { label: '최근 변경사유', value: '관리자 잠금 해제' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InfoStrip>;
export default meta;
type Story = StoryObj<typeof meta>;

/** 현재 상태 요약 (Figma 마이페이지 계정 상태 이력 "현재 계정 상태") */
export const Playground: Story = {};

/** 이름 위 · 값 아래 (Figma 개별 예외 권한 "권한 적용 기준"). onClick이 있는 값은 Primary 밑줄 */
export const Stacked: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <InfoStrip
      layout="stacked"
      columns="405px 250px 302px 1fr"
      items={[
        { label: '적용 권한 템플릿', value: '운영관리 기본형' },
        { label: '전체', value: '33건', onClick: () => undefined },
        {
          label: '개별 추가 권한',
          value: (
            <Badge size="sm" tone="primary">
              21건
            </Badge>
          ),
        },
        {
          label: '개별 제외 권한',
          value: (
            <Badge size="sm" tone="error">
              12건
            </Badge>
          ),
        },
      ]}
    />
  ),
};

/** 왼쪽 정렬 한 줄 + 쌍 사이 구분선 (다운로드 요청 상세 "요청 조건") — 이름 13 회색 · 값 14 SemiBold */
export const Divided: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <InfoStrip
      layout="divided"
      items={[
        { label: '거래일', value: '2026-08-01 ~ 2026-08-31' },
        { label: '거래상태', value: '승인' },
        { label: '결제수단', value: '전체' },
        { label: '가맹점', value: '전체' },
      ]}
    />
  ),
};
