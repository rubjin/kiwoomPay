/**
 * 화면ID: [KWPC01010000] 대시보드
 * 위치: 메인 > 대시보드 · /main/dashboard
 */
import {
  // 대시보드 틀
  DashboardSection,
  DashboardGrid,
  DashboardCard,
  // 지표
  KpiCard,
  KpiTile,
  MetricSummary,
  // 차트 · 목록
  BarList,
  ComboChart,
  DonutChart,
  CarouselNav,
  InfoChip,
  EventFeed,
  NoticeList,
  Stack,
  StatusView,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MENU } from '@/constants/menu';
import { fetchDashboard } from '@/features/main/dashboard.api';
import type { DashboardData } from '@/features/main/dashboard.types';
import { formatNumber } from '@/utils/format';

// 줄 높이 (Figma 카드 높이 — 1920 화면에서 한 화면에 들어가게)
const ROW_KPI = 100;
const ROW_MONTHLY = 128;
const ROW_CHART = 237;
const ROW_LIST = 291;
// 최근 리스크 등록 가맹점 한 쪽 (2 × 2)
const RISK_PAGE_SIZE = 4;
// 거래금액 추이 축 (억원 · 천건)
const AMOUNT_TICKS = [0, 1, 2, 3, 4, 5];
const COUNT_TICKS = [0, 5, 10, 15, 20, 25];
const AGENCY_TICKS = [0, 5, 10, 15];
// TODO(정책) 제목 옆 Info 아이콘 문구 — 시안에 아이콘만 있고 문구가 없다 (화면 문구는 기획 확정 후)
const INFO_PENDING = '(안내 문구 미정)';

/**
 * 메인 대시보드 (Figma KWPC01010000 · 29850:112276) — 당일 정산 진행현황 · 당월 거래 실적 · RM 리스크 ·
 * 거래금액 추이 · 결제수단 비중 · 영업 실적 · 공지 · 당일 알림. 조회 조건 없이 들어오면 바로 불러온다.
 * TODO(정책) 카드 링크 · KPI 클릭 이동 대상은 기획서가 없어 해당 메뉴(2depth)로 연결
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [failed, setFailed] = useState(false);
  const [riskPage, setRiskPage] = useState(1);

  useEffect(() => {
    // 대시보드는 진입 시 바로 조회 (조회 조건 없음 — "최초 진입 시 조회하지 않음"의 예외)
    fetchDashboard()
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  if (!data) return <StatusView status={failed ? 'error' : 'loading'} />;

  const go = (path: string) => () => navigate(path);
  const toSettlement = go(MENU.KWPC0601);
  const s = data.settlement;
  const riskPages = Math.ceil(data.riskMerchants.length / RISK_PAGE_SIZE);
  const riskMerchants = data.riskMerchants.slice(
    (riskPage - 1) * RISK_PAGE_SIZE,
    riskPage * RISK_PAGE_SIZE,
  );
  const reference = `${data.monthlyBaseDate} 기준`;

  return (
    <Stack gap={12}>
      {/* 01 당일 정산 진행현황 */}
      <DashboardSection title="당일 정산 진행현황" aside={`기준일 ${data.baseDate}`}>
        <DashboardGrid columns={[1, 1, 1, 1, 1]} rowHeight={ROW_KPI}>
          <KpiCard
            variant="hero"
            label="정산 대상"
            value={s.target}
            unit="건"
            onClick={toSettlement}
          />
          <KpiCard label="지급 예정" value={s.scheduled} unit="건" onClick={toSettlement} />
          <KpiCard label="정산 완료" value={s.settled} unit="건" onClick={toSettlement} />
          <KpiCard label="지급 완료" value={s.paid} unit="건" onClick={toSettlement} />
          <DashboardGrid columns={[1]} gap={8}>
            <KpiCard
              variant="status"
              tone="warning"
              label="보류/상계"
              value={s.held}
              unit="건"
              onClick={toSettlement}
            />
            <KpiCard
              variant="status"
              tone="error"
              label="지급 실패"
              value={s.failed}
              unit="건"
              onClick={toSettlement}
            />
          </DashboardGrid>
        </DashboardGrid>
      </DashboardSection>

      {/* 02 당월 거래 실적 · RM 리스크 */}
      <DashboardGrid columns={[1, 1]} rowHeight={ROW_MONTHLY}>
        <DashboardGrid columns={[1, 1]}>
          <DashboardCard
            title="당월 거래금액"
            info={INFO_PENDING}
            linkLabel="거래내역 보기"
            onLinkClick={go(MENU.KWPC0401)}
            gap={4}
          >
            <MetricSummary
              value={data.monthlyAmount.value}
              unit="원"
              delta={data.monthlyAmount.delta}
              deltaLabel="전월 대비"
              reference={reference}
            />
          </DashboardCard>
          <DashboardCard
            title="당월 거래건수"
            info={INFO_PENDING}
            linkLabel="거래내역 보기"
            onLinkClick={go(MENU.KWPC0401)}
            gap={4}
          >
            <MetricSummary
              value={data.monthlyCount.value}
              unit="건"
              delta={data.monthlyCount.delta}
              deltaLabel="전월 대비"
              reference={reference}
            />
          </DashboardCard>
        </DashboardGrid>
        <DashboardCard split>
          <DashboardCard bare title="RM 리스크 관리 현황" gap={12}>
            <BarList
              items={data.riskCounts.map((r) => ({
                label: r.type,
                value: r.count,
                display: `${formatNumber(r.count)}건`,
              }))}
              max={20} // TODO(시안) 막대 100% 기준 (시안 18건 = 90%)
            />
          </DashboardCard>
          <DashboardCard
            bare
            title="최근 리스크 등록 가맹점"
            titleSize="xs"
            titleAddon={<CarouselNav page={riskPage} total={riskPages} onChange={setRiskPage} />}
            linkLabel="전체보기"
            onLinkClick={go(MENU.KWPC0502)}
          >
            <Stack columns={2} gap={8}>
              {riskMerchants.map((m) => (
                <InfoChip key={m.name} label={m.name} badge={m.type} value={m.reason} />
              ))}
            </Stack>
          </DashboardCard>
        </DashboardCard>
      </DashboardGrid>

      {/* 03 거래금액 추이 · 결제수단 비중 · 영업 실적 */}
      <DashboardGrid columns={[1, 1]} rowHeight={ROW_CHART}>
        <DashboardCard
          title="당월 거래금액 추이"
          titleSize="md"
          linkLabel="통계 상세 보기"
          onLinkClick={go(MENU.KWPC0501)}
          gap={12}
        >
          <ComboChart
            data={data.trend}
            xKey="date"
            bars={[
              { key: 'amount', name: '거래금액' },
              { key: 'settlement', name: '정산금액' },
            ]}
            line={{ key: 'count', name: '거래건수' }}
            leftAxis={{ unit: '금액(억원)', ticks: AMOUNT_TICKS }}
            rightAxis={{ unit: '건수(천건)', ticks: COUNT_TICKS }}
            formatValue={(key, value) => (key === 'count' ? `${value}천건` : `${value}억원`)}
          />
        </DashboardCard>
        <DashboardGrid columns={[1, 1]}>
          <DashboardCard
            title="당월 결제수단별 거래비중"
            linkLabel="통계 상세 보기"
            onLinkClick={go(MENU.KWPC0501)}
          >
            <DonutChart
              items={data.payMethods.map((p) => ({ name: p.name, value: p.share }))}
              centerLabel="총 거래금액"
              centerValue={`₩${formatNumber(data.monthlyAmount.value)}`}
            />
          </DashboardCard>
          <DashboardCard title="영업 실적 요약" aside={data.monthlyPeriod}>
            <DashboardGrid columns={[1, 1]} gap={8}>
              <KpiTile
                label="신규 가맹점"
                value={data.sales.newMerchants.value}
                unit="건"
                delta={data.sales.newMerchants.delta}
                onClick={go(MENU.KWPC0703)}
              />
              <KpiTile
                label="영업대행사 실적"
                value={data.sales.agencyResults.value}
                unit="건"
                delta={data.sales.agencyResults.delta}
                onClick={go(MENU.KWPC0703)}
              />
              <KpiTile
                label="청구정산 대상"
                value={data.sales.claimTargets.value}
                unit="건"
                delta={data.sales.claimTargets.delta}
                onClick={go(MENU.KWPC0601)}
              />
              <KpiTile
                label="목표 달성률"
                value={data.sales.goalRate.value}
                unit="%"
                delta={data.sales.goalRate.delta}
                onClick={go(MENU.KWPC0703)}
              />
            </DashboardGrid>
          </DashboardCard>
        </DashboardGrid>
      </DashboardGrid>

      {/* 04 영업대행사 실적 · 공지 · 당일 알림 */}
      <DashboardGrid columns={[1, 1]} rowHeight={ROW_LIST}>
        <DashboardGrid columns={[536, 262]} gap={12}>
          <DashboardCard
            title="영업대행사별 실적 비교"
            period={data.monthlyPeriod}
            linkLabel="전체보기"
            onLinkClick={go(MENU.KWPC0703)}
            gap={4}
          >
            <BarList
              variant="ranked"
              axisLabel="실적 금액 (억원)"
              ticks={AGENCY_TICKS}
              items={data.agencies.map((a) => ({
                label: a.name,
                value: a.amount,
                display: `${a.amount}억`,
              }))}
            />
          </DashboardCard>
          <DashboardCard title="공지사항" linkLabel="전체보기" onLinkClick={go(MENU.KWPC0705)}>
            <NoticeList
              items={data.notices.map((n) => ({
                key: n.id,
                category: n.category,
                title: n.title,
                date: n.date,
                unread: n.unread,
                muted: n.past,
              }))}
              onItemClick={go(MENU.KWPC0705)} // TODO(정책) 공지 상세로
            />
          </DashboardCard>
        </DashboardGrid>
        <DashboardGrid columns={[1, 1]}>
          <DashboardCard
            title="당일 업무 알림"
            info={INFO_PENDING}
            linkLabel="전체보기"
            onLinkClick={go(MENU.KWPC0203)}
          >
            <EventFeed items={data.workAlerts.map(({ id, ...a }) => ({ key: id, ...a }))} />
          </DashboardCard>
          <DashboardCard
            title="당일 시스템 알림"
            info={INFO_PENDING}
            linkLabel="전체보기"
            onLinkClick={go(MENU.KWPC0203)}
          >
            <EventFeed items={data.systemAlerts.map(({ id, ...a }) => ({ key: id, ...a }))} />
          </DashboardCard>
        </DashboardGrid>
      </DashboardGrid>
    </Stack>
  );
}
