import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Icon } from '../Icon';
import { Button, type ButtonAppearance, type ButtonSize, type ButtonVariant } from './Button';

const variants: ButtonVariant[] = ['primary', 'neutral', 'dark', 'danger'];
const appearances: ButtonAppearance[] = ['solid', 'line'];
const sizes: ButtonSize[] = ['lg', 'md', 'sm'];

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
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={stack}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          <Button size={size}>텍스트</Button>
          <Button size={size} leadingIcon={<Icon name="download" size={20} />}>
            다운로드
          </Button>
          <Button size={size} trailingIcon={<Icon name="chevron-right" size={20} />}>
            다음
          </Button>
          <Button
            size={size}
            iconOnly
            icon={<Icon name="download" size={20} />}
            aria-label="다운로드"
          />
          <Button
            size={size}
            appearance="line"
            iconOnly
            icon={<Icon name="download" size={20} />}
            aria-label="다운로드"
          />
        </div>
      ))}
    </div>
  ),
};

/** Default · Disabled · Loading(로딩 아이콘 + "처리 중"). Hover / Pressed는 마우스로 확인한다. */
export const States: Story = {
  parameters: { controls: { disable: true } },
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
/** 로딩: 크기별 · 아이콘 전용. 문구는 loadingText로 바꿀 수 있다. */
export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={stack}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          <Button size={size} loading>
            저장
          </Button>
          <Button size={size} appearance="line" loading>
            저장
          </Button>
          <Button size={size} loading loadingText="업로드 중">
            업로드
          </Button>
          <Button
            size={size}
            iconOnly
            icon={<Icon name="download" size={20} />}
            aria-label="다운로드"
            loading
          />
        </div>
      ))}
    </div>
  ),
};

export const LongText: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 200 }}>
      <Button appearance="line" variant="neutral" leadingIcon={<Icon name="download" size={20} />}>
        아주 긴 버튼 이름이 들어가는 경우에도 말줄임으로 처리됩니다
      </Button>
    </div>
  ),
};
