// 메인 > 대시보드 (KWPC01010000) 응답 형식 — TODO(API) 스펙이 정해지면 맞춘다

/** 값 + 증감(%) */
export interface DashboardMetric {
  value: number;
  /** 전월(전 기간) 대비 증감 % */
  delta: number;
}

/** 당일 정산 진행현황 건수 */
export interface DashboardSettlement {
  target: number;
  scheduled: number;
  settled: number;
  paid: number;
  /** 보류 · 상계 */
  held: number;
  /** 지급 실패 */
  failed: number;
}

export interface DashboardRiskMerchant {
  name: string;
  /** 리스크 유형 (보증보험 · 정산한도 · 담보한도 …) */
  type: string;
  /** 사유 (만료 임박 · 한도 초과 …) */
  reason: string;
}

export interface DashboardTrendDay {
  /** MM-DD */
  date: string;
  /** 거래금액 (억원) */
  amount: number;
  /** 정산금액 (억원) */
  settlement: number;
  /** 거래건수 (천건) */
  count: number;
}

export interface DashboardNotice {
  id: string;
  category: string;
  title: string;
  /** MM-DD */
  date: string;
  unread: boolean;
  /** 지난 공지 (흐리게) */
  past: boolean;
}

export interface DashboardAlert {
  id: string;
  /** HH:mm */
  time: string;
  category: string;
  message: string;
}

export interface DashboardData {
  /** 기준일 YYYY-MM-DD */
  baseDate: string;
  settlement: DashboardSettlement;
  /** 당월 거래금액 (원) */
  monthlyAmount: DashboardMetric;
  /** 당월 거래건수 (건) */
  monthlyCount: DashboardMetric;
  /** 당월 실적 기준일 YYYY-MM-DD (어제) */
  monthlyBaseDate: string;
  /** 당월 기간 (YYYY-MM-DD ~ MM-DD) */
  monthlyPeriod: string;
  riskCounts: { type: string; count: number }[];
  riskMerchants: DashboardRiskMerchant[];
  /** 최근 7일 */
  trend: DashboardTrendDay[];
  /** 결제수단별 비중 (%) */
  payMethods: { name: string; share: number }[];
  sales: {
    newMerchants: DashboardMetric;
    agencyResults: DashboardMetric;
    claimTargets: DashboardMetric;
    /** 목표 달성률 (%) */
    goalRate: DashboardMetric;
  };
  /** 영업대행사별 실적 (억원) — 상위 5 */
  agencies: { name: string; amount: number }[];
  notices: DashboardNotice[];
  workAlerts: DashboardAlert[];
  systemAlerts: DashboardAlert[];
}
