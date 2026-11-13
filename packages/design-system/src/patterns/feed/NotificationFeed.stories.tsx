import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { PageLayout } from '../../components/layout';
import { useAction } from '../action';
import { DialogProvider, useDialog } from '../common';
import {
  HubCard,
  HubDivider,
  HubEmpty,
  HubGrid,
  HubInfo,
  HubInfoList,
  HubLinkRow,
  HubPanel,
  HubStats,
  HubSubtitle,
} from './HubCard';
import { NotificationFeed, type NotificationItem } from './NotificationFeed';

const meta = {
  title: 'Patterns/P06 Notification Feed',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <DialogProvider>
        <Story />
      </DialogProvider>
    ),
  ],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

// ── 예시 값 (Figma KWPC2000_마이페이지_GUI_최초진입) ──────────────
const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    category: '정산',
    title: '대사 차액 대상 3건이 발생했습니다.',
    date: '2026-09-07 13:42',
    unread: true,
  },
  {
    id: 'n2',
    category: '리스크/FDS',
    title: 'ABC상점이 고위험 가맹점으로 판정되었습니다.',
    date: '2026-09-05 13:42',
    unread: true,
  },
  {
    id: 'n3',
    category: '리스크/FDS',
    title: '신규 가맹점 심사 6건이 배정되었습니다.',
    date: '2026-09-04 13:42',
    unread: true,
  },
  {
    id: 'n4',
    category: '지급',
    title: 'CPID KWP12345 지급이 실패했습니다.',
    date: '2026-09-03 13:42',
  },
  {
    id: 'n5',
    category: '문의/민원',
    title: '미답변 가맹점 문의가 5건 남아 있습니다.',
    date: '2026-09-02 13:42',
  },
  {
    id: 'n6',
    category: '정산',
    title: '9월 1주차 정산 보고서가 생성되었습니다.',
    date: '2026-09-01 09:10',
  },
];
const COUNTS = [
  { key: 'settlement', label: '정산', count: 4 },
  { key: 'risk', label: '리스크/FDS', count: 3, icon: <Icon name="info-circle" size={16} /> },
  { key: 'payout', label: '지급', count: 2 },
  { key: 'review', label: '심사/계약', count: 1 },
  { key: 'cs', label: '문의/민원', count: 2 },
];
const HINT = {
  menu: '현재 사용자에게 부여된 메뉴 접근 권한을 기준으로 산정합니다. 메뉴 내 조회·등록·수정·다운로드 등 상세 기능 권한은 권한관리 화면에서 확인할 수 있습니다.',
  template:
    '사용자에게 적용된 기본 권한 묶음입니다. 템플릿에 정의된 메뉴·기능 권한을 기본으로 하며 별도로 부여된 예외 권한이 추가될 수 있습니다.',
  scope:
    '사용자가 조회·처리할 수 있는 데이터의 범위입니다. CPID 등 업무 데이터 접근 기준에 따라 제한될 수 있습니다.',
  special:
    '업무상 별도 승인이 필요한 한시적 권한입니다. 권한별 유효기간이 적용되며 기간 만료 시 사용할 수 없습니다.',
};
// 권한관리 카드 라벨 칸 (도움말 아이콘 포함, Figma 152)
const PERMISSION_LABEL_WIDTH = 152;
const CARD_COLUMNS = [470, 532, 598];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 마이페이지 Hub (KWPC2000): 계정관리 · 권한관리 · 알림센터(P06 축약형, 최근 5건) */
function MypageHub({ empty = false }: { empty?: boolean }) {
  const dialog = useDialog();
  const [items, setItems] = useState(empty ? [] : NOTIFICATIONS);
  // 업무유형별 미확인 건수 — 0건도 칩으로 보여 준다 (Figma 알림 없음)
  const [counts, setCounts] = useState(empty ? COUNTS.map((c) => ({ ...c, count: 0 })) : COUNTS);
  const specials = empty
    ? []
    : [
        { label: '마스킹 해제', value: '~ 2027-03-31 까지' },
        { label: '개인정보 다운로드', value: '~ 2026-12-31 까지' },
      ];
  // 미확인 전체 건수 (목록은 최근 5건만) — 서버가 준다
  const [unread, setUnread] = useState(empty ? 0 : 12);
  const go = (name: string) => dialog.alert(`${name}(으)로 이동합니다. (예시)`);

  const readAll = useAction({
    confirm: `미확인 알림 ${unread}건을 모두 읽음 처리할까요?`,
    confirmOptions: { confirmText: '읽음 처리' },
    run: () => wait(300), // TODO(API) 모두 읽음 처리
    onSuccess: () => {
      setItems((list) => list.map((i) => ({ ...i, unread: false })));
      setUnread(0);
      setCounts((list) => list.map((c) => ({ ...c, count: 0 })));
    },
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '20px 24px',
        minHeight: '100vh',
        background: 'var(--kp-color-bg-page)',
      }}
    >
      <PageLayout.Title title="마이페이지" />
      <HubGrid columns={CARD_COLUMNS}>
        <HubCard title="계정관리" onMore={() => go('계정관리')}>
          <HubInfoList>
            <HubInfo label="사용자명">홍길동</HubInfo>
            <HubInfo label="로그인 ID">kwpay1234</HubInfo>
            <HubInfo label="소속">PG운영팀</HubInfo>
            <HubInfo label="계정 상태">
              <Badge size="sm" tone="success">
                정상
              </Badge>
            </HubInfo>
            <HubInfo label="로그인 상태">
              <Badge size="sm" tone="error">
                계정잠김
              </Badge>
            </HubInfo>
            <HubInfo label="최근 로그인 일시">2026-08-29 15:30</HubInfo>
            <HubInfo label="비밀번호 변경일">
              2026-07-05 <HubInfo.Sub>(47일 경과)</HubInfo.Sub>
            </HubInfo>
          </HubInfoList>
        </HubCard>

        <HubCard title="권한관리" onMore={() => go('권한관리')}>
          <HubInfo label="보유 메뉴 권한" hint={HINT.menu} labelWidth={PERMISSION_LABEL_WIDTH}>
            12개 메뉴 접근 가능
          </HubInfo>
          <HubDivider />
          <HubInfo label="권한 템플릿" hint={HINT.template} labelWidth={PERMISSION_LABEL_WIDTH}>
            정산운영 기본형
          </HubInfo>
          <HubInfo label="데이터 접근범위" hint={HINT.scope} labelWidth={PERMISSION_LABEL_WIDTH}>
            전체 CPID
          </HubInfo>
          <HubDivider />
          <HubSubtitle hint={HINT.special}>특수권한</HubSubtitle>
          {specials.length > 0 ? (
            <>
              <HubPanel items={specials} />
              <HubLinkRow label="권한 신청 현황" value="1건" onClick={() => go('권한 신청 현황')} />
            </>
          ) : (
            // 특수권한 없음: 권한 신청 현황 → 빈 상태 + [특수권한 신청] (Figma 순서)
            <>
              <HubLinkRow label="권한 신청 현황" value="1건" onClick={() => go('권한 신청 현황')} />
              <HubEmpty
                message="현재 보유 중인 특수권한이 없습니다."
                action={
                  <Button
                    size="sm"
                    variant="neutral"
                    appearance="line"
                    onClick={() => go('특수권한 신청')}
                  >
                    특수권한 신청
                  </Button>
                }
              />
            </>
          )}
        </HubCard>

        <HubCard title="알림센터" onMore={() => go('알림센터')}>
          <NotificationFeed
            items={items}
            unreadCount={unread}
            counts={counts}
            limit={5}
            onReadAll={() => readAll.execute()}
            onSelect={(item) => {
              if (item.unread) setUnread((n) => n - 1);
              setItems((list) => list.map((i) => (i.id === item.id ? { ...i, unread: false } : i)));
              void go(`${item.category} 관련 업무`);
            }}
          />
        </HubCard>
      </HubGrid>
    </div>
  );
}

/** 마이페이지 Hub: 알림 선택 → 읽음 + 관련 업무 이동, [모두 읽음 처리] → Confirm */
export const MypageHubStory: Story = {
  name: 'Mypage Hub',
  parameters: {
    controls: { disable: true },
    tempWork: '알림 선택 · 모두 읽음 처리 동작(이동 대상 · 확인 문구) · 예시 데이터',
  },
  render: () => <MypageHub />,
};

/** 특수권한 없음 · 알림 없음 (Figma 28815:71127): [특수권한 신청], 미확인 0건 · 칩 0건 · "최근 수신된 알림이 없습니다." */
export const MypageHubEmpty: Story = {
  name: 'Mypage Hub · 권한 없음 / 알림 없음',
  parameters: { controls: { disable: true }, tempWork: '[특수권한 신청] 이동 대상 · 예시 데이터' },
  render: () => <MypageHub empty />,
};

/** NotificationFeed 단독: 전체 목록(limit 없음) */
export const Feed: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <div style={{ width: 598 }}>
      <NotificationFeed items={NOTIFICATIONS} counts={COUNTS} onReadAll={() => {}} />
    </div>
  ),
};

/** 알림 없음: 미확인 0건 · 칩 0건 · 목록 자리 가운데 문구 ([모두 읽음 처리] 숨김) */
export const Empty: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <div style={{ width: 598 }}>
      <NotificationFeed
        items={[]}
        counts={COUNTS.map((c) => ({ ...c, count: 0 }))}
        onReadAll={() => {}}
      />
    </div>
  ),
};

/** HubStats: 요약 수치 줄 (Figma 마이페이지 권한관리 · 나의 권한 현황). onClick이 있으면 값이 Primary · 누를 수 있음 */
export const Stats: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PageLayout.Section title="나의 권한 현황" divider>
      <HubStats
        items={[
          { label: '권한 템플릿', value: '운영관리 기본형' },
          { label: '접근 가능 메뉴', value: '12개' },
          { label: '조회 CPID 범위', value: '전체 CPID' },
          { label: '사용 중 특수권한', value: '2 / 2' },
          { label: '권한 신청 현황', value: '1건', onClick: () => {} },
        ]}
      />
    </PageLayout.Section>
  ),
};
