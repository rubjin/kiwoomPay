import type { BizCpid, BizRow } from '@/types/common/bizLookup';
import { wait } from '@/api/mock';

// TODO(API) 사업자 · 하위 CPID 조회 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터
// (시안 처리_사업자 찾기 팝업.png · CPID 선택 멀티셀렉트.png)
const BIZ: BizRow[] = [
  { bizNo: '000-00-00000', name: '테스트상사', cpidCount: 10000 },
  { bizNo: '000-00-00001', name: '테스트상사 리테일', cpidCount: 12 },
  { bizNo: '000-00-00002', name: '테스트상사 서비스', cpidCount: 1 },
  { bizNo: '000-00-00003', name: '테스트상사 유통', cpidCount: 128 },
  { bizNo: '000-00-00004', name: '테스트상사 온라인', cpidCount: 3 },
];

const SERVICES = ['신용카드', '계좌이체', '가상계좌'];
const CYCLES = ['D+1', 'D+1', 'D+2', 'D+1', '주정산', '월 1회'];

export async function searchBusinesses(name: string, bizNo: string): Promise<BizRow[]> {
  await wait(300);
  const n = name.trim();
  const b = bizNo.replace(/\D/g, '');
  return BIZ.filter(
    (r) => (!n || r.name.includes(n)) && (!b || r.bizNo.replace(/\D/g, '').includes(b)),
  );
}

/** 사업자 하위 CPID. 예시는 사업자 순번으로 CPID를 만든다 (1만 개짜리도 앞 200개만) */
export async function fetchBizCpids(bizNo: string): Promise<BizCpid[]> {
  await wait(200);
  const biz = BIZ.find((r) => r.bizNo === bizNo);
  const count = Math.min(biz?.cpidCount ?? 0, 200);
  const seq = Number(bizNo.slice(-1)) + 1;
  return Array.from({ length: count }, (_, i) => {
    const cpid = `CPID${seq}${String(i + 1).padStart(5, '0')}`;
    const group = Math.floor(i / 3) * 3 + 1;
    return {
      cpid,
      serviceName: SERVICES[i % SERVICES.length] as string,
      cycle: CYCLES[i % CYCLES.length] as string,
      finalCpid: `CPID${seq}${String(group).padStart(5, '0')}`,
    };
  });
}
