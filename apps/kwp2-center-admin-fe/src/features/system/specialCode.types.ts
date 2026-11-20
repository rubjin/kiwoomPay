/** 특수권한 코드 (기능에 연결해 쓰는 권한 종류 · 기준 코드) */
export interface SpecialCode {
  /** SP0001 … 등록 시 서버가 만든다 */
  code: string;
  name: string;
  description: string;
  use: boolean;
  /** 연결된 기능 수 */
  linkedCount: number;
}

/** 특수권한 코드에 연결된 기능 (조회 전용 — 연결 · 적용 방식 변경은 기능 코드 관리에서) */
export interface LinkedFunction {
  id: string;
  /** 적용 위치 (1Depth 메뉴명) */
  location: string;
  name: string;
  /** 적용 방식 표시 이름 (버튼 노출 · 옵션 노출 · 실행 시 검증) */
  apply: string;
}

export interface SpecialCodeSearchParams {
  code: string;
  name: string;
  /** 사용 · 미사용 — 둘 다면 전체 */
  uses: ('Y' | 'N')[];
}

/** 특수권한 정보 입력값. code가 null이면 신규 등록 */
export interface SpecialCodeInput {
  code: string | null;
  name: string;
  description: string;
  use: boolean;
}

export type SpecialCodeErrorCode = 'DUPLICATE_NAME' | 'IN_USE';

export class SpecialCodeError extends Error {
  constructor(readonly code: SpecialCodeErrorCode) {
    super(code);
  }
}
