import type { DateRange } from '@kiwoompay/design-system';

/** 권한 변경 이력 팝업 — 조회 조건 ('all'은 전체) */
export interface PermissionChangeParams {
  /** 변경기간 */
  period: DateRange;
  /** 구분 (공통코드 PERMISSION_CHANGE_TYPE) */
  type: string;
  /** 변경 유형 (PERMISSION_CHANGE_KIND) */
  kind: string;
}

/** 권한 변경 이력 1행 */
export interface PermissionChange {
  id: string;
  /** 변경일시 (YYYY-MM-DD HH:mm) */
  changedAt: string;
  /** 구분 코드 */
  type: string;
  /** 권한 대상 (메뉴 경로 · 템플릿 · 특수권한 이름 · 범위) */
  target: string;
  /** 변경 유형 코드 */
  kind: string;
  before: string;
  after: string;
  processor: string;
  reason: string;
}
