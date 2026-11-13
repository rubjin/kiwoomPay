/** 사업자 찾기 팝업 — 조회 결과 사업자 */
export interface BizRow {
  bizNo: string;
  name: string;
  /** 하위 CPID 수 */
  cpidCount: number;
}

/** 사업자 하위 CPID (CPID 조회 범위 선택) */
export interface BizCpid {
  cpid: string;
  serviceName: string;
  cycle: string;
  finalCpid: string;
}

/** 사업자 찾기 결과 — 호출 화면의 조회 조건에 넣는다 */
export interface BizLookupResult {
  bizNo: string;
  name: string;
  /** 고른 CPID. 전체면 allCpids true · cpids는 전부 */
  cpids: string[];
  allCpids: boolean;
}
