import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties, type MouseEvent } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Checkbox } from '../selection/Checkbox';
import { Lnb } from './Lnb';
import type { LnbMenuItem } from './lnbUtils';

// 시안의 메뉴 구성 (href는 예시)
const menu: LnbMenuItem[] = [
  { id: 'dashboard', label: '대시보드', icon: 'home', href: '#dashboard' },
  {
    id: 'trade',
    label: '거래내역',
    icon: 'card-check',
    children: [
      { id: 'trade-list', label: '거래내역조회', href: '#trade-list' },
      { id: 'trade-cancel', label: '취소내역조회', href: '#trade-cancel' },
    ],
  },
  {
    id: 'stats',
    label: '통계내역',
    icon: 'bar-chart',
    children: [
      {
        id: 'sales',
        label: '매출통계',
        children: [
          { id: 'sales-total', label: '통합매출', href: '#sales-total' },
          { id: 'sales-period', label: '기간별 비교매출', href: '#sales-period' },
          { id: 'sales-payment', label: '결제별 상세매출', href: '#sales-payment' },
          { id: 'sales-diff', label: '기간비교증감', href: '#sales-diff' },
          { id: 'sales-cpid', label: 'CPID별 거래실적비교', href: '#sales-cpid' },
        ],
      },
      {
        id: 'rm',
        label: 'RM관리',
        children: [{ id: 'rm-list', label: 'RM 실적조회', href: '#rm-list' }],
      },
      { id: 'loss', label: '대손통계', href: '#loss' },
      { id: 'report', label: '보고자료', href: '#report' },
      { id: 'bond', label: '채권현황', href: '#bond' },
      { id: 'settle-ext', label: '정산자금외부관리조회', href: '#settle-ext' },
    ],
  },
  {
    id: 'settle',
    label: '정산내역',
    icon: 'file-text',
    children: [
      {
        id: 'settle-main',
        label: '정산내역',
        children: [{ id: 'settle-total', label: '통합정산내역조회', href: '#settle-total' }],
      },
      {
        id: 'settle-claim',
        label: '청구정산내역',
        children: [{ id: 'settle-auth', label: '인증청구정산관리', href: '#settle-auth' }],
      },
      {
        id: 'settle-partner',
        label: '원천/제휴사입금관리',
        children: [
          { id: 'settle-card', label: '카드사 차액정산내역', href: '#settle-card' },
          {
            id: 'settle-guide',
            label: '외부 정산 안내(새 창)',
            href: 'https://example.com',
            external: true,
          },
        ],
      },
    ],
  },
  {
    id: 'ops',
    label: '운영관리',
    icon: 'building',
    children: [{ id: 'ops-merchant', label: '가맹점관리', href: '#ops-merchant' }],
  },
  {
    id: 'archive',
    label: '자료실',
    icon: 'archive',
    children: [{ id: 'archive-list', label: '자료실 목록', href: '#archive-list' }],
  },
  {
    id: 'security',
    label: '보안관리',
    icon: 'shield-check',
    children: [{ id: 'security-log', label: '접속이력', href: '#security-log' }],
  },
];

// 로고 이미지는 별도 자산이 필요하다 (예시는 임시 텍스트)
const Logo = () => (
  <strong style={{ fontSize: 18, color: 'var(--kp-color-primary-800)', whiteSpace: 'nowrap' }}>
    KIWOOM PAY
  </strong>
);

const frame: CSSProperties = { height: 760, display: 'flex' };

const meta = {
  title: 'Components/LNB',
  component: Lnb,
  args: {
    items: menu,
    activeId: 'sales-total',
    logo: <Logo />,
    favoriteIds: ['sales-total', 'sales-payment', 'settle-total'],
  },
  decorators: [
    (Story) => (
      <div style={frame}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Lnb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 전체 메뉴 · 현재 화면(통합매출): 3Depth Active, 2Depth(매출통계) Current + Open, 1Depth(통계내역) Current */
export const Expanded: Story = {};

/** 접은 모드: 폭 48, 1Depth 아이콘과 현재 위치(통계내역)만 유지. 아이콘을 누르면 펼치고 해당 메뉴를 연다 */
export const Collapsed: Story = { args: { defaultCollapsed: true } };

/** 즐겨찾기 List: 메뉴명 + 원래 메뉴 경로 */
export const Favorites: Story = {
  args: { defaultView: 'favorites', onFavoriteEdit: () => alert('즐겨찾기 편집 (Modal)') },
};

/** 즐겨찾기 Empty: 편집 Action 제공 */
export const FavoritesEmpty: Story = {
  args: { defaultView: 'favorites', favoriteIds: [], onFavoriteEdit: () => alert('즐겨찾기 편집') },
};

function InteractiveExample() {
  const [activeId, setActiveId] = useState('sales-total');
  const [favoriteIds, setFavoriteIds] = useState(['sales-total', 'sales-payment']);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);

  const onNavigate = (item: LnbMenuItem, event: MouseEvent<HTMLElement>) => {
    if (!item.external) event.preventDefault(); // 예시: 실제로는 href로 페이지 이동
    setActiveId(item.id);
  };

  const openEdit = () => {
    setDraft(favoriteIds);
    setEditing(true);
  };

  // 즐겨찾기 편집: Modal + LNB 메뉴 트리 (3Depth·하위 없는 2Depth만 선택)
  const leafGroups = menu.flatMap((d1) =>
    (d1.children ?? []).map((d2) => ({ d1, d2, leaves: d2.children ?? [d2] })),
  );

  return (
    <>
      <Lnb
        items={menu}
        activeId={activeId}
        onNavigate={onNavigate}
        logo={<Logo />}
        favoriteIds={favoriteIds}
        onFavoriteEdit={openEdit}
      />
      <main style={{ padding: 24 }}>
        <p>현재 화면: {activeId}</p>
        <p>
          메뉴를 누르면 Active가 바뀌고, 검색창에 &quot;정산&quot;을 입력하면 검색 결과가 나온다.
        </p>
      </main>
      <Modal open={editing} onClose={() => setEditing(false)} width={400}>
        <Modal.Header title="즐겨찾기 편집" closeButton />
        <Modal.Body>
          {leafGroups.map(({ d1, d2, leaves }) => (
            <fieldset key={d2.id} style={{ border: 0, padding: 0, margin: '0 0 16px' }}>
              <legend style={{ fontWeight: 600, marginBottom: 8 }}>
                {d1.label} &gt; {d2.label}
              </legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {leaves.map((leaf) => (
                  <Checkbox
                    key={leaf.id}
                    label={leaf.label}
                    checked={draft.includes(leaf.id)}
                    onChange={(e) =>
                      setDraft(
                        e.target.checked
                          ? [...draft, leaf.id]
                          : draft.filter((id) => id !== leaf.id),
                      )
                    }
                  />
                ))}
              </div>
            </fieldset>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line" onClick={() => setEditing(false)}>
            취소
          </Button>
          <Button
            size="lg"
            onClick={() => {
              setFavoriteIds(draft);
              setEditing(false);
            }}
          >
            적용
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

/** 실제 동작: 메뉴 선택 · 펼치기 · 접기 · 즐겨찾기 탭 · 검색 · 즐겨찾기 편집(Modal) */
export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: () => <InteractiveExample />,
};
