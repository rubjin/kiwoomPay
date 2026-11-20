import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Stack } from '../layout';
import { BarList } from './BarList';
import { ComboChart, DonutChart } from './Charts';
import { DashboardCard } from './DashboardCard';
import { DashboardGrid, DashboardSection } from './DashboardLayout';
import { CarouselNav, EventFeed, InfoChip, NoticeList } from './DashboardLists';
import { Delta, KpiCard, KpiTile, MetricSummary } from './Kpi';

const meta = {
  title: 'Components/Chart & KPI',
  component: DashboardCard,
  args: { title: '카드 제목' },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DashboardCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => undefined;

const TREND = [
  { date: '07-11', amount: 2.6, settlement: 1.8, count: 18 },
  { date: '07-12', amount: 2.1, settlement: 1.4, count: 16 },
  { date: '07-13', amount: 2.5, settlement: 1.7, count: 18.5 },
  { date: '07-14', amount: 3.0, settlement: 2.0, count: 19.5 },
  { date: '07-15', amount: 2.7, settlement: 1.8, count: 17.5 },
  { date: '07-16', amount: 3.3, settlement: 2.2, count: 20.5 },
  { date: '07-17', amount: 3.6, settlement: 2.3, count: 21.5 },
];

const PAY_METHODS = [
  ['신용카드', 52.3],
  ['신용카드K', 14.6],
  ['해외카드', 7.8],
  ['가상계좌', 6.5],
  ['계좌이체', 5.9],
  ['휴대폰', 4.2],
  ['문화상품권', 3.1],
  ['간편결제', 2.8],
  ['기타', 2.6],
] as const;

/** 카드 틀: 제목 · Info · 기간 | 링크 > + 본문 */
export const Card: Story = {
  render: (args) => (
    <DashboardGrid columns={[1, 1]} rowHeight={128}>
      <DashboardCard {...args} info="안내 문구" linkLabel="전체보기" onLinkClick={noop}>
        본문
      </DashboardCard>
      <DashboardCard title="영업 실적 요약" aside="2026-07-01 ~ 07-17">
        링크 대신 오른쪽 기간
      </DashboardCard>
    </DashboardGrid>
  ),
};

/** KPI 카드 3종: hero(강조) · default · status(보류/상계 · 지급 실패) — 영역 제목 줄은 DashboardSection */
export const KpiCards: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DashboardSection title="당일 정산 진행현황" aside="기준일 2026-07-18">
      <DashboardGrid columns={[1, 1, 1]} rowHeight={100}>
        <KpiCard variant="hero" label="정산 대상" value={12480} unit="건" onClick={noop} />
        <KpiCard label="지급 예정" value={1360} unit="건" onClick={noop} />
        <DashboardGrid columns={[1]} gap={8}>
          <KpiCard
            variant="status"
            tone="warning"
            label="보류/상계"
            value={48}
            unit="건"
            onClick={noop}
          />
          <KpiCard
            variant="status"
            tone="error"
            label="지급 실패"
            value={7}
            unit="건"
            onClick={noop}
          />
        </DashboardGrid>
      </DashboardGrid>
    </DashboardSection>
  ),
};

/** 값 + 증감 + 기준일 · 회색 칸(KpiTile) · 증감(Delta) */
export const Metrics: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DashboardGrid columns={[1, 1]} rowHeight={237}>
      <DashboardCard
        title="당월 거래금액"
        info="안내 문구"
        linkLabel="거래내역 보기"
        onLinkClick={noop}
        gap={4}
      >
        <MetricSummary
          value={4286950120}
          unit="원"
          delta={6.8}
          deltaLabel="전월 대비"
          reference="2026-07-17 기준"
        />
      </DashboardCard>
      <DashboardCard title="영업 실적 요약" aside="2026-07-01 ~ 07-17">
        <DashboardGrid columns={[1, 1]} gap={8}>
          <KpiTile label="신규 가맹점" value={128} unit="건" delta={15.3} onClick={noop} />
          <KpiTile label="영업대행사 실적" value={86} unit="건" delta={7.5} onClick={noop} />
          <KpiTile label="청구정산 대상" value={312} unit="건" delta={4.7} onClick={noop} />
          <KpiTile label="목표 달성률" value={92.6} unit="%" delta={-2.1} onClick={noop} />
        </DashboardGrid>
      </DashboardCard>
      <Stack direction="row" gap={16}>
        <Delta value={6.8} />
        <Delta value={-2.1} />
        <Delta value={0} />
      </Stack>
    </DashboardGrid>
  ),
};

/** 막대 + 선 혼합 (Recharts) — 마우스를 올리면 툴팁 */
export const Combo: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DashboardCard
      title="당월 거래금액 추이"
      titleSize="md"
      linkLabel="통계 상세 보기"
      onLinkClick={noop}
      gap={12}
    >
      <ComboChart
        data={TREND}
        xKey="date"
        bars={[
          { key: 'amount', name: '거래금액' },
          { key: 'settlement', name: '정산금액' },
        ]}
        line={{ key: 'count', name: '거래건수' }}
        leftAxis={{ unit: '금액(억원)', ticks: [0, 1, 2, 3, 4, 5] }}
        rightAxis={{ unit: '건수(천건)', ticks: [0, 5, 10, 15, 20, 25] }}
        formatValue={(key, value) => (key === 'count' ? `${value}천건` : `${value}억원`)}
      />
    </DashboardCard>
  ),
};

/** 비중 도넛 (Recharts) + 범례 — 계열 색은 Chart Category 01~09 */
export const Donut: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DashboardCard title="당월 결제수단별 거래비중" linkLabel="통계 상세 보기" onLinkClick={noop}>
      <DonutChart
        items={PAY_METHODS.map(([name, value]) => ({ name, value }))}
        centerLabel="총 거래금액"
        centerValue="₩4,286,950,120"
      />
    </DashboardCard>
  ),
};

/** 가로 막대 목록: compact(RM 리스크) · ranked(순위 + 축) — 라이브러리 없이 CSS */
export const Bars: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DashboardGrid columns={[1, 2]} rowHeight={291}>
      <DashboardCard title="RM 리스크 관리 현황" gap={12}>
        <BarList
          max={20}
          items={[
            { label: '보증보험', value: 18, display: '18건' },
            { label: '정산한도', value: 12, display: '12건' },
            { label: '기타 리스크', value: 5, display: '5건' },
          ]}
        />
      </DashboardCard>
      <DashboardCard title="영업대행사별 실적 비교" period="2026-07-01 ~ 07-17" gap={4}>
        <BarList
          variant="ranked"
          axisLabel="실적 금액 (억원)"
          ticks={[0, 5, 10, 15]}
          items={[
            { label: '키움파트너스', value: 12.46, display: '12.46억' },
            { label: '리래마케팅', value: 8.92, display: '8.92억' },
            { label: 'K테이영업', value: 7.56, display: '7.56억' },
            { label: '하나영업지원', value: 5.38, display: '5.38억' },
            { label: '스마트컴퍼니', value: 4.22, display: '4.22억' },
          ]}
        />
      </DashboardCard>
    </DashboardGrid>
  ),
};

/** split 카드: 칸 사이 세로선, 칸마다 bare 카드 · 쪽 넘김(CarouselNav) · 칩(InfoChip) */
export const SplitWithCarousel: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [page, setPage] = useState(1);
    return (
      <DashboardGrid columns={[1]} rowHeight={128}>
        <DashboardCard split>
          <DashboardCard bare title="RM 리스크 관리 현황" gap={12}>
            <BarList max={20} items={[{ label: '보증보험', value: 18, display: '18건' }]} />
          </DashboardCard>
          <DashboardCard
            bare
            title="최근 리스크 등록 가맹점"
            titleSize="xs"
            titleAddon={<CarouselNav page={page} total={3} onChange={setPage} />}
            linkLabel="전체보기"
            onLinkClick={noop}
          >
            <Stack columns={2} gap={8}>
              <InfoChip label="ABC커머스" badge="보증보험" value="만료 임박" />
              <InfoChip label="대한유통" badge="정산한도" value="한도 초과" />
              <InfoChip label="스마트페이" badge="담보한도" value="한도 부족" />
              <InfoChip label="한빛쇼핑" badge="보증보험" value="만료" />
            </Stack>
          </DashboardCard>
        </DashboardCard>
      </DashboardGrid>
    );
  },
};

/** 공지 목록(NoticeList) · 당일 알림(EventFeed) — 줄은 카드 높이에 고르게 */
export const Lists: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DashboardGrid columns={[262, 399]} rowHeight={291}>
      <DashboardCard title="공지사항" linkLabel="전체보기" onLinkClick={noop}>
        <NoticeList
          onItemClick={noop}
          items={[
            { category: '일반', title: '7월 정산 일정 안내', date: '07-18', unread: true },
            { category: '시스템', title: '시스템 점검 작업 안내', date: '07-17', unread: true },
            { category: '정책', title: '보증보험 갱신 프로세스 변경 안내', date: '07-01' },
            { category: '업무', title: 'AML 재이행 절차 안내', date: '07-01', muted: true },
            {
              category: '기타',
              title: '하계 휴가 기간 고객센터 운영 안내',
              date: '07-01',
              muted: true,
            },
          ]}
        />
      </DashboardCard>
      <DashboardCard
        title="당일 시스템 알림"
        info="안내 문구"
        linkLabel="전체보기"
        onLinkClick={noop}
      >
        <EventFeed
          items={[
            { time: '10:24', category: '원천사 장애', message: '신한카드 승인 서비스 장애' },
            { time: '09:18', category: '지연', message: 'OO VAN 연결 장애' },
            { time: '08:56', category: '점검', message: 'OO은행 계좌이체 서비스 점검' },
            { time: '08:25', category: '정상화', message: '신한카드 승인 서비스 정상화' },
          ]}
        />
      </DashboardCard>
    </DashboardGrid>
  ),
};
