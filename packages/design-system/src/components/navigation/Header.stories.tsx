import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Header } from './Header';

const frame = {
  width: 1680,
  height: 66,
  background: 'var(--kp-color-bg-surface)',
  borderBottom: '1px solid var(--kp-color-line-subtle)',
};

const masked = [
  { label: '아이디', value: 'kw*******' },
  { label: '이름', value: '홍*동' },
  { label: '소속', value: 'PG운영팀' },
  { label: '권한', value: '관리자' },
];
const unmaskedInfo = [
  { label: '아이디', value: 'kwpay1234' },
  { label: '이름', value: '홍길동' },
  { label: '소속', value: 'PG운영팀' },
  { label: '권한', value: '관리자' },
];

function Example({ unmasked = false, session = 10038, masking = 3595 }) {
  return (
    <div style={frame}>
      <Header>
        <Header.Search />
        <Header.UserInfo items={unmasked ? unmaskedInfo : masked} />
        <Header.Divider />
        <Header.Session remaining={session} />
        <Header.Divider />
        <Header.Masking unmasked={unmasked} remaining={masking} />
        <Header.Divider />
        <Header.Download count={1} />
        <Header.Actions>
          <Header.IconButton icon="user" label="내 정보" />
          <Header.IconButton icon="bell" label="알림" dot />
          <Header.IconButton icon="power" label="로그아웃" />
        </Header.Actions>
      </Header>
    </div>
  );
}

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본(마스킹) · 마스킹 해제 중 (시안, 1680 = 1920 - LNB 240) */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--kp-space-20)' }}>
      <Example />
      <Example unmasked />
    </div>
  ),
};

/** 카운트다운 · 연장 · 해제 · 적용 동작 예시 (타이머는 화면에서 관리) */
export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [session, setSession] = useState(3 * 3600);
    const [masking, setMasking] = useState<number | null>(null);
    useEffect(() => {
      const id = setInterval(() => {
        setSession((s) => Math.max(0, s - 1));
        setMasking((m) => (m === null ? null : m > 1 ? m - 1 : null));
      }, 1000);
      return () => clearInterval(id);
    }, []);
    return (
      <div style={frame}>
        <Header>
          <Header.Search onSearch={(value) => alert(`검색: ${value}`)} />
          <Header.UserInfo items={masking === null ? masked : unmaskedInfo} />
          <Header.Divider />
          <Header.Session remaining={session} onExtend={() => setSession(3 * 3600)} />
          <Header.Divider />
          <Header.Masking
            unmasked={masking !== null}
            remaining={masking ?? 0}
            onUnmask={() => setMasking(3600)}
            onExtend={() => setMasking(3600)}
            onApply={() => setMasking(null)}
          />
          <Header.Divider />
          <Header.Download />
          <Header.Actions>
            <Header.IconButton icon="user" label="내 정보" />
            <Header.IconButton icon="bell" label="알림" />
            <Header.IconButton icon="power" label="로그아웃" />
          </Header.Actions>
        </Header>
      </div>
    );
  },
};
