import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Pagination } from '../Pagination';
import { SearchArea } from '../SearchArea';
import { WorkTab } from '../Tab';
import { DateRangeField, Field, SearchField, SelectBox } from '../field';
import { Footer, Header, Lnb, type LnbMenuItem } from '../navigation';
import { PageLayout } from './PageLayout';

const meta = {
  title: 'Components/Page Layout',
  component: PageLayout,
  parameters: { layout: 'fullscreen' },
  args: { children: null },
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── 예시용 자리 표시 (IBSheet8 그리드 등) ──────────
const placeholder: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: 'var(--kp-color-text-secondary)',
  fontSize: 13,
};

function Slot({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...placeholder, ...style }}>{children}</div>;
}

const footerSlot = (
  <Footer
    logo={<strong>DAOU DATA</strong>}
    items={[
      '대표이사 : 김상준',
      '사업자등록번호 : 220-81-01733',
      '04156 서울특별시 마포구 독막로 311 (염리동, 재화스퀘어) 3층, 5층',
      '대표전화 : 1588-5984',
      'FAX : 02-6280-3268',
    ]}
    copyright="Copyright ⓒ DAOU Tech Inc. All Rights Reserved."
  />
);

const headerSlot = (
  <Header>
    <Header.Search />
    <Header.UserInfo
      items={[
        { label: '아이디', value: 'kw*******' },
        { label: '이름', value: '홍*동' },
        { label: '소속', value: 'PG운영팀' },
        { label: '권한', value: '관리자' },
      ]}
    />
    <Header.Divider />
    <Header.Session remaining={10038} />
    <Header.Divider />
    <Header.Masking />
    <Header.Divider />
    <Header.Download count={1} />
    <Header.Actions>
      <Header.IconButton icon="user" label="내 정보" />
      <Header.IconButton icon="bell" label="알림" dot />
      <Header.IconButton icon="power" label="로그아웃" />
    </Header.Actions>
  </Header>
);

const menu: LnbMenuItem[] = [
  { id: 'dashboard', label: '대시보드', icon: 'home', href: '#dashboard' },
  {
    id: 'trade',
    label: '거래내역',
    icon: 'card-check',
    children: [
      { id: 'trade-total', label: '통합 거래내역', href: '#trade-total' },
      { id: 'trade-cancel', label: '취소내역조회', href: '#trade-cancel' },
    ],
  },
  { id: 'stats', label: '통계내역', icon: 'bar-chart', href: '#stats' },
  { id: 'settle', label: '정산내역', icon: 'file-text', href: '#settle' },
  { id: 'operation', label: '운영관리', icon: 'building', href: '#operation' },
  { id: 'extra', label: '부가서비스', icon: 'archive', href: '#extra' },
];

const lnb = (
  <Lnb
    items={menu}
    activeId="trade-total"
    logo={<strong style={{ color: 'var(--kp-color-primary-800)' }}>KIWOOM PAY</strong>}
  />
);

const tabActions = [
  { key: 'new', label: '새 업무 탭으로 열기', onSelect: () => {} },
  { key: 'close', label: '현재 탭 닫기', onSelect: () => {} },
  { key: 'others', label: '다른 탭 모두 닫기', onSelect: () => {} },
];

const workTab = (
  <WorkTab defaultValue="trade" actions={tabActions}>
    <WorkTab.Item value="dashboard" closable={false}>
      대시보드
    </WorkTab.Item>
    <WorkTab.Item value="trade">통합 거래내역</WorkTab.Item>
  </WorkTab>
);

const chip: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 32,
  padding: '0 12px',
  fontSize: 13,
  background: 'var(--kp-color-primary-50)',
  border: '1px solid var(--kp-color-neutral-300)',
  borderRadius: 4,
};

function Grid({ rows = 10 }: { rows?: number }) {
  return (
    <Slot
      style={{
        height: 41 + rows * 39,
        border: '1px dashed var(--kp-color-neutral-300)',
        borderRadius: 4,
      }}
    >
      IBSheet8 Grid 영역 — Header · Row · Cell · Column · Freeze · Scroll은 Grid Guide / IBSheet8
    </Slot>
  );
}

// ── Stories ──────────────────────────────────────────────

/** 01. Page Structure: 공통 Shell + 조회형 화면 Section 순서 */
export const Structure: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PageLayout lnb={lnb} header={headerSlot} workTab={workTab} footer={footerSlot}>
      <PageLayout.Title
        title="PAGE HEADER · 화면명"
        actions={
          <Button appearance="line" variant="neutral">
            화면별 Action
          </Button>
        }
      />
      <PageLayout.Section title="SEARCH AREA" divider>
        <Slot style={{ height: 32 }}>조회조건 영역 (기본 검색 / 상세 검색)</Slot>
      </PageLayout.Section>
      <PageLayout.Section title="APPLIED FILTERS" layout="inline" compact>
        <Slot style={{ height: 32 }}>적용된 검색조건 · 선택 영역 (선택)</Slot>
      </PageLayout.Section>
      <PageLayout.Section title="RESULT SUMMARY" layout="inline" compact>
        <Slot style={{ height: 60 }}>요약 데이터 (선택)</Slot>
      </PageLayout.Section>
      <PageLayout.Section
        title="RESULT SECTION"
        titleAddon={<Slot>GRID UTILITY</Slot>}
        actions={<Slot>DATA BUSINESS ACTION</Slot>}
      >
        <Grid rows={3} />
      </PageLayout.Section>
      <PageLayout.Section plain>
        <Slot style={{ height: 40 }}>TOTAL · 결과 건수 / PAGINATION</Slot>
      </PageLayout.Section>
    </PageLayout>
  ),
};

function TradeListPage() {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <PageLayout
      lnb={lnb}
      header={headerSlot}
      workTab={workTab}
      workTabActions={<WorkTab.ActionMenu count={2} actions={tabActions} />}
      footer={footerSlot}
    >
      <PageLayout.Title
        title="통합 거래내역"
        actions={
          <>
            <Button appearance="line" variant="neutral">
              내 검색조건 선택
            </Button>
            <Button appearance="line" variant="neutral">
              내 검색조건 관리
            </Button>
          </>
        }
      />
      <PageLayout.Section title="검색 조건" divider>
        <SearchArea
          expanded={expanded}
          onExpandedChange={setExpanded}
          detail={
            <>
              <Field label="결제수단">
                <SelectBox
                  options={[{ value: 'all', label: '전체' }]}
                  defaultValue="all"
                  style={{ width: 200 }}
                />
              </Field>
              <Field label="처리상태">
                <SelectBox
                  options={[{ value: 'all', label: '전체' }]}
                  defaultValue="all"
                  style={{ width: 200 }}
                />
              </Field>
            </>
          }
        >
          <Field label="조회기간">
            <DateRangeField />
          </Field>
          <Field label="상태">
            <SelectBox
              options={[{ value: 'all', label: '전체' }]}
              defaultValue="all"
              style={{ width: 200 }}
            />
          </Field>
          <Field label="검색어">
            <SearchField placeholder="가맹점명 또는 가맹점ID" style={{ width: 320 }} />
          </Field>
        </SearchArea>
      </PageLayout.Section>
      <PageLayout.Section title="적용된 검색 조건" layout="inline" compact>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span style={chip}>조회기간 2026-08-25 00:00 ~ 2026-08-31 23:59</span>
          <span style={chip}>거래구분 전체</span>
          <span style={chip}>결제수단 전체</span>
        </div>
      </PageLayout.Section>
      <PageLayout.Section title="조회 요약" layout="inline" compact>
        <Slot style={{ height: 60 }}>요약 카드 (Data Display 가이드에서 제작 예정)</Slot>
      </PageLayout.Section>
      <PageLayout.Section
        title="조회 결과"
        titleAddon={
          <>
            <Button size="sm" appearance="line" variant="neutral">
              표시항목설정
            </Button>
            <Button
              size="sm"
              appearance="line"
              variant="neutral"
              leadingIcon={<Icon name="download" size={16} />}
            >
              엑셀 다운로드
            </Button>
          </>
        }
        actions={
          <Button size="sm" disabled>
            선택 취소
          </Button>
        }
      >
        <Grid />
      </PageLayout.Section>
      <PageLayout.Section plain>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 12 }}>
            Total: <strong style={{ color: 'var(--kp-color-primary-500)' }}>4,169</strong>
          </span>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Pagination totalPages={10} page={page} onChange={setPage} />
          </div>
        </div>
      </PageLayout.Section>
    </PageLayout>
  );
}

/** 02. 1920 GUI 구성 예시 (통합 거래내역). [상세조건]을 펼치면 아래 Section이 밀려 내려간다 */
export const TradeList: Story = {
  parameters: { controls: { disable: true } },
  render: () => <TradeListPage />,
};

/** LNB · Work Tab 없는 최소 구성 (팝업 창 등) */
export const ContentOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PageLayout>
      <PageLayout.Title title="화면명" />
      <PageLayout.Section title="내용">
        <Slot style={{ height: 120 }}>Section</Slot>
      </PageLayout.Section>
    </PageLayout>
  ),
};

/** 제목 옆 요소 (titleAddon): 현재 대상 문맥 · 상태 Badge (Figma KWPC07010101 조회수정) */
export const TitleAddon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PageLayout>
      <PageLayout.Title
        title="가맹점 기본/계약 정보 관리"
        titleAddon={
          <Badge size="sm" tone="success" dot>
            정상
          </Badge>
        }
        actions={
          <Button variant="neutral" appearance="line">
            내 검색조건 관리
          </Button>
        }
      />
    </PageLayout>
  ),
};
