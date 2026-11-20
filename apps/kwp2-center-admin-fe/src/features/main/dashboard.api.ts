import type { DashboardData } from '@/features/main/dashboard.types';
import { wait } from '@/mocks/utils';
import { DASHBOARD } from '@/mocks/main/dashboard.mock';

// TODO(API) 대시보드 API(한 번에 받을지 카드별로 받을지)가 정해지면 바꾼다. 지금은 화면 확인용 예시 데이터

export async function fetchDashboard(): Promise<DashboardData> {
  await wait(300);
  return DASHBOARD;
}
