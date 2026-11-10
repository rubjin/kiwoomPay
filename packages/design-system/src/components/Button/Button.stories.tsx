import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Button, type ButtonAppearance, type ButtonSize, type ButtonVariant } from './Button';

const variants: ButtonVariant[] = ['primary', 'neutral', 'dark', 'danger'];
const appearances: ButtonAppearance[] = ['solid', 'line'];
const sizes: ButtonSize[] = ['lg', 'md', 'sm'];

// Icon 컴포넌트(Phase 2) 전 임시 아이콘. 실제 사용 시 Icon 컴포넌트를 넣는다.
const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 4v11" />
    <path d="M7 11l5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 5l7 7-7 7" />
  </svg>
);

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--kp-space-8)',
};
const stack: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--kp-space-16)',
};

const meta = {
  title: 'Components/Button/Button',
  component: Button,
  args: { children: '버튼명' },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    appearance: { control: 'inline-radio', options: appearances },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { variant: 'primary', appearance: 'solid', size: 'md' },
};

/** variant(4) × appearance(2). 한 화면·팝업에는 Primary Solid를 1개만 둔다. */
export const Variants: Story = {
  render: () => (
    <div style={stack}>
      {appearances.map((appearance) => (
        <div key={appearance} style={row}>
          {variants.map((variant) => (
            <Button key={variant} variant={variant} appearance={appearance}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Large 48 · Medium 40 · Small 32 */
export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      {appearances.map((appearance) => (
        <div key={appearance} style={row}>
          {sizes.map((size) => (
            <Button key={size} size={size} appearance={appearance}>
              {size}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Text Only / Leading Icon / Trailing Icon / Icon Only. 아이콘은 앞·뒤 중 하나만 쓴다. */
export const Icons: Story = {
  render: () => (
    <div style={stack}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          <Button size={size}>텍스트</Button>
          <Button size={size} leadingIcon={<DownloadIcon />}>
            다운로드
          </Button>
          <Button size={size} trailingIcon={<ChevronRightIcon />}>
            다음
          </Button>
          <Button size={size} iconOnly icon={<DownloadIcon />} aria-label="다운로드" />
          <Button
            size={size}
            appearance="line"
            iconOnly
            icon={<DownloadIcon />}
            aria-label="다운로드"
          />
        </div>
      ))}
    </div>
  ),
};

/** Default · Disabled · Loading. Hover / Pressed는 마우스로 확인한다. */
export const States: Story = {
  render: () => (
    <div style={stack}>
      {appearances.map((appearance) => (
        <div key={appearance} style={row}>
          {variants.map((variant) => (
            <div key={variant} style={{ ...row, flexDirection: 'column', alignItems: 'stretch' }}>
              <Button variant={variant} appearance={appearance}>
                Default
              </Button>
              <Button variant={variant} appearance={appearance} disabled>
                Disabled
              </Button>
              <Button variant={variant} appearance={appearance} loading>
                Loading
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** 긴 텍스트는 말줄임. 부모 폭을 넘지 않는다. */
export const LongText: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <Button appearance="line" variant="neutral" leadingIcon={<DownloadIcon />}>
        아주 긴 버튼 이름이 들어가는 경우에도 말줄임으로 처리됩니다
      </Button>
    </div>
  ),
};
