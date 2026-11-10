import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Icon, getIconSizes, iconNames, type IconSize } from './Icon';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-24)',
  alignItems: 'flex-end',
};

const meta = {
  title: 'Components/Icon/Icon',
  component: Icon,
  args: { name: 'search', size: 24 },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'inline-radio', options: [12, 16, 20, 24] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const cell: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--kp-space-8)',
};

/** 12 · 16 · 20 · 24. 크기마다 따로 그려진 variant를 쓴다. */
export const Sizes: Story = {
  render: () => (
    <div style={row}>
      {([12, 16, 20, 24] as IconSize[]).map((size) => (
        <div key={size} style={cell}>
          <Icon name="chevron-right" size={size} />
          <span>{size}px</span>
        </div>
      ))}
    </div>
  ),
};

/** 선 아이콘은 글자색을 따른다. 부모의 color로 상태에 맞는 색을 준다. */
export const Colors: Story = {
  render: () => (
    <div style={row}>
      {[
        ['기본', 'var(--kp-color-text-body)'],
        ['보조', 'var(--kp-color-text-secondary)'],
        ['강조', 'var(--kp-color-text-accent)'],
        ['비활성', 'var(--kp-color-text-disabled)'],
        ['오류', 'var(--kp-color-status-error-text)'],
      ].map(([label, color]) => (
        <div key={label} style={{ ...cell, color }}>
          <Icon name="download" size={24} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  ),
};

/** 상태 아이콘은 고유한 색을 가진다 (토큰 변수로 연결되어 있다). */
export const Status: Story = {
  render: () => (
    <div style={row}>
      {(
        [
          'info-circle-filled',
          'check-circle-filled',
          'warning-circle-filled',
          'alert-circle-filled',
          'help-circle-filled',
          'delete',
        ] as const
      ).map((name) => (
        <div key={name} style={cell}>
          <Icon name={name} size={24} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};

function GalleryExample() {
  const [query, setQuery] = useState('');
  const [size, setSize] = useState<IconSize>(24);
  const [dark, setDark] = useState(false);
  const filtered = iconNames.filter((name) => name.includes(query.trim().toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kp-space-16)' }}>
      <div style={{ display: 'flex', gap: 'var(--kp-space-16)', alignItems: 'center' }}>
        <input
          type="search"
          placeholder="아이콘 이름 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            height: 32,
            padding: '0 12px',
            border: '1px solid var(--kp-color-line-default)',
            borderRadius: 6,
          }}
        />
        {([12, 16, 20, 24] as IconSize[]).map((s) => (
          <label key={s} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
            <input
              type="radio"
              name="gallery-size"
              checked={size === s}
              onChange={() => setSize(s)}
            />
            {s}px
          </label>
        ))}
        <label style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
          어두운 배경(화이트 아이콘)
        </label>
        <span>
          {filtered.length} / {iconNames.length}개
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))',
          gap: 'var(--kp-space-8)',
        }}
      >
        {filtered.map((name) => (
          <div
            key={name}
            style={{
              ...cell,
              padding: 'var(--kp-space-16) var(--kp-space-8)',
              // 선 아이콘은 글자색(currentColor)을 따르므로 color만 바꾸면 화이트 버전이 된다
              color: dark ? 'var(--kp-color-text-inverse)' : 'var(--kp-color-text-body)',
              background: dark ? 'var(--kp-color-neutral-800)' : 'var(--kp-color-bg-surface)',
              border: '1px solid var(--kp-color-line-subtle)',
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <Icon name={name} size={size} />
            <code style={{ fontSize: 12 }}>{name}</code>
            <span style={{ fontSize: 11, opacity: 0.7 }}>{getIconSizes(name).join(' · ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 화이트 버전: 별도 아이콘 없이 부모의 color를 흰색으로 주면 된다 (헤더·색 버튼 등 어두운 배경).
 * 상태 아이콘(*-filled)은 고유한 색을 유지한다.
 */
export const OnDark: Story = {
  render: () => (
    <div
      style={{
        ...row,
        padding: 'var(--kp-space-24)',
        color: 'var(--kp-color-text-inverse)',
        background: 'var(--kp-color-neutral-800)',
        borderRadius: 8,
      }}
    >
      {(
        ['search', 'bell-on', 'setting', 'user', 'logout', 'menu', 'check-circle-filled'] as const
      ).map((name) => (
        <div key={name} style={cell}>
          <Icon name={name} size={24} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};

/** 전체 아이콘. 아래 숫자는 직접 제공되는 크기이고, 없는 크기는 가장 가까운 크기를 줄여서 그린다. */
export const Gallery: Story = {
  render: () => <GalleryExample />,
};
