// 예시 데이터: 대시보드 1화면분 (Figma KWPC01010000 값, 날짜는 오늘 기준)
// main/dashboard.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type { DashboardData } from '@/features/main/dashboard.types';
import { toYmd } from '@/utils/period';
import { DAY } from '@/mocks/utils';

const mmdd = (d: Date) => toYmd(d).slice(5);

const today = new Date();
const yesterday = new Date(today.getTime() - DAY);
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
const daysAgo = (n: number) => new Date(yesterday.getTime() - n * DAY);

// 최근 7일 (어제까지) — 거래금액 · 정산금액 억원, 거래건수 천건
const TREND = [
  [2.6, 1.8, 18],
  [2.1, 1.4, 16],
  [2.5, 1.7, 18.5],
  [3.0, 2.0, 19.5],
  [2.7, 1.8, 17.5],
  [3.3, 2.2, 20.5],
  [3.6, 2.3, 21.5],
] as const;

const RISK_MERCHANTS = [
  ['ABC커머스', '보증보험', '만료 임박'],
  ['대한유통', '정산한도', '한도 초과'],
  ['스마트페이', '담보한도', '한도 부족'],
  ['한빛쇼핑', '보증보험', '만료'],
  ['그린마켓', '정산한도', '한도 초과'],
  ['오션트래블', '보증보험', '만료 임박'],
  ['미래교육', '기타', '민원 증가'],
  ['하늘약국', '담보한도', '한도 부족'],
  ['코리아게임즈', '보증보험', '만료'],
  ['서울푸드', '정산한도', '한도 초과'],
  ['바른가구', '기타', '이상거래 의심'],
  ['동방레저', '보증보험', '만료 임박'],
] as const;

export const DASHBOARD: DashboardData = {
  baseDate: toYmd(today),
  settlement: { target: 12480, scheduled: 1360, settled: 10860, paid: 9430, held: 48, failed: 7 },
  monthlyAmount: { value: 4286950120, delta: 6.8 },
  monthlyCount: { value: 312480, delta: 12.3 },
  monthlyBaseDate: toYmd(yesterday),
  monthlyPeriod: `${toYmd(monthStart)} ~ ${mmdd(yesterday)}`,
  riskCounts: [
    { type: '보증보험', count: 18 },
    { type: '정산한도', count: 12 },
    { type: '기타 리스크', count: 5 },
  ],
  riskMerchants: RISK_MERCHANTS.map(([name, type, reason]) => ({ name, type, reason })),
  trend: TREND.map(([amount, settlement, count], i) => ({
    date: mmdd(daysAgo(TREND.length - 1 - i)),
    amount,
    settlement,
    count,
  })),
  payMethods: [
    { name: '신용카드', share: 52.3 },
    { name: '신용카드K', share: 14.6 },
    { name: '해외카드', share: 7.8 },
    { name: '가상계좌', share: 6.5 },
    { name: '계좌이체', share: 5.9 },
    { name: '휴대폰', share: 4.2 },
    { name: '문화상품권', share: 3.1 },
    { name: '간편결제', share: 2.8 },
    { name: '기타', share: 2.6 },
  ],
  sales: {
    newMerchants: { value: 128, delta: 15.3 },
    agencyResults: { value: 86, delta: 7.5 },
    claimTargets: { value: 312, delta: 4.7 },
    goalRate: { value: 92.6, delta: -2.1 },
  },
  agencies: [
    { name: '키움파트너스', amount: 12.46 },
    { name: '리래마케팅', amount: 8.92 },
    { name: 'K테이영업', amount: 7.56 },
    { name: '하나영업지원', amount: 5.38 },
    { name: '스마트컴퍼니', amount: 4.22 },
  ],
  notices: [
    {
      id: 'n1',
      category: '일반',
      title: '7월 정산 일정 안내',
      date: mmdd(today),
      unread: true,
      past: false,
    },
    {
      id: 'n2',
      category: '시스템',
      title: '시스템 점검 작업 안내',
      date: mmdd(yesterday),
      unread: true,
      past: false,
    },
    {
      id: 'n3',
      category: '정책',
      title: '보증보험 갱신 프로세스 변경 안내',
      date: mmdd(monthStart),
      unread: false,
      past: false,
    },
    {
      id: 'n4',
      category: '업무',
      title: 'AML 재이행 절차 안내',
      date: mmdd(monthStart),
      unread: false,
      past: true,
    },
    {
      id: 'n5',
      category: '기타',
      title: '하계 휴가 기간 고객센터 운영 안내',
      date: mmdd(monthStart),
      unread: false,
      past: true,
    },
  ],
  workAlerts: [
    { id: 'w1', time: '10:24', category: '정산', message: '정산 미완료 4건' },
    { id: 'w2', time: '09:18', category: '보증보험', message: '보증보험 만료 예정 가맹점 4건' },
    { id: 'w3', time: '08:56', category: '이상거래', message: '이상거래 건수가 18% 증가했습니다.' },
    { id: 'w4', time: '08:30', category: '승인', message: '특수권한 신청 2건' },
    { id: 'w5', time: '08:25', category: 'AML', message: 'AML 재이행 대상 12건 예정' },
  ],
  systemAlerts: [
    { id: 's1', time: '10:24', category: '원천사 장애', message: '신한카드 승인 서비스 장애' },
    { id: 's2', time: '09:18', category: '지연', message: 'OO VAN 연결 장애' },
    { id: 's3', time: '08:56', category: '점검', message: 'OO은행 계좌이체 서비스 점검' },
    { id: 's4', time: '08:25', category: '정상화', message: '신한카드 승인 서비스 정상화' },
    { id: 's5', time: '08:25', category: '정상화', message: '신한카드 승인 서비스 정상화' },
  ],
};
