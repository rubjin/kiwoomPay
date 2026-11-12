import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { TextButton, TextLink } from './TextButton';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--kp-space-16)',
};

const meta = {
  title: 'Components/Action/Button/TextButton',
  component: TextButton,
  args: { children: '이력조회' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
  },
  parameters: { tempWork: 'Neutral 텍스트 버튼 색' },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 화면 안에서 기능을 실행한다 (초기화, 전체보기 등). 배경·테두리가 없다. */
export const TextAction: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <TextButton variant="primary">이력조회</TextButton>
      <TextButton variant="neutral">전체보기</TextButton>
      <TextButton variant="primary" size="sm">
        이력조회
      </TextButton>
      <TextButton variant="neutral" size="sm">
        전체보기
      </TextButton>
      <TextButton disabled>비활성</TextButton>
    </div>
  ),
};

/** 다른 화면·외부 페이지로 이동한다. 모든 상태에서 밑줄을 유지한다. */
export const Link: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <TextLink href="#guide">이용가이드 안내</TextLink>
      <TextLink href="#guide" size="sm">
        이용가이드 안내
      </TextLink>
      <TextLink href="#guide" disabled>
        비활성
      </TextLink>
    </div>
  ),
};
