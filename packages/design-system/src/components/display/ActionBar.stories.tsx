import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { TextField } from '../field';
import { Radio, RadioGroup } from '../selection';
import { ActionBar } from './ActionBar';

const meta = {
  title: 'Composites/Result/Action Bar',
  component: ActionBar,
  args: { label: '취소사유', children: null },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 취소사유입력 (Figma 29406:96321): 사유 입력 · 취소 유형 · [선택 취소] */
export const CancelReason: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [reason, setReason] = useState('');
    const [type, setType] = useState('normal');
    return (
      <>
        <ActionBar label="취소사유">
          <TextField
            size="sm"
            placeholder="취소사유 입력"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            fieldWidth="md"
            aria-label="취소사유"
          />
          <RadioGroup
            value={type}
            onChange={setType}
            size="sm"
            direction="horizontal"
            aria-label="취소 유형"
          >
            <Radio value="normal" label="일반취소" />
            <Radio value="offset" label="상계취소" />
            <Radio value="force" label="강제취소" />
          </RadioGroup>
          <Button size="sm" variant="dark" onClick={() => alert(`${type} / ${reason}`)}>
            선택 취소
          </Button>
        </ActionBar>
        <p data-testid="state" style={{ marginTop: 16 }}>
          {type} / {reason}
        </p>
      </>
    );
  },
};

/** grow: 바가 남는 폭을 채우고 첫 입력이 늘어난다 (조회 결과 하단 취소사유 줄 — 인라인 flex 대신) */
export const Grow: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', width: 960 }}>
      <ActionBar label="취소사유" grow>
        <TextField size="sm" fullWidth placeholder="취소사유 입력" aria-label="취소사유" />
        <RadioGroup defaultValue="normal" size="sm" direction="horizontal" aria-label="취소 유형">
          <Radio value="normal" label="일반취소" />
          <Radio value="offset" label="상계취소" />
        </RadioGroup>
        <Button size="sm" variant="dark">
          선택 취소
        </Button>
      </ActionBar>
    </div>
  ),
};
