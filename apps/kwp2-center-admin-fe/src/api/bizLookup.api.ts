import type { BizCpid, BizRow } from '@/api/bizLookup.types';
import { wait } from '@/mocks/utils';
import { BUSINESSES, CPID_SERVICES, SETTLE_CYCLES } from '@/mocks/common/bizLookup.mock';

// TODO(API) 사업자 · 하위 CPID 조회 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

export async function searchBusinesses(name: string, bizNo: string): Promise<BizRow[]> {
  await wait(300);
  const n = name.trim();
  const b = bizNo.replace(/\D/g, '');
  return BUSINESSES.filter(
    (r) => (!n || r.name.includes(n)) && (!b || r.bizNo.replace(/\D/g, '').includes(b)),
  );
}

/** 사업자 하위 CPID. 예시는 사업자 순번으로 CPID를 만든다 (1만 개짜리도 앞 200개만) */
export async function fetchBizCpids(bizNo: string): Promise<BizCpid[]> {
  await wait(200);
  const biz = BUSINESSES.find((r) => r.bizNo === bizNo);
  const count = Math.min(biz?.cpidCount ?? 0, 200);
  const seq = Number(bizNo.slice(-1)) + 1;
  return Array.from({ length: count }, (_, i) => {
    const cpid = `CPID${seq}${String(i + 1).padStart(5, '0')}`;
    const group = Math.floor(i / 3) * 3 + 1;
    return {
      cpid,
      serviceName: CPID_SERVICES[i % CPID_SERVICES.length] as string,
      cycle: SETTLE_CYCLES[i % SETTLE_CYCLES.length] as string,
      finalCpid: `CPID${seq}${String(group).padStart(5, '0')}`,
    };
  });
}
