/** 개별 예외 권한 1행 — 템플릿 권한에 메뉴 단위로 더하거나 뺀 권한 */
export interface ExceptionPermission {
  id: string;
  /** 메뉴 경로 (1depth > 2depth > 3depth) */
  menuPath: string;
  /** 템플릿 권한 (예: 조회, 수정). 없으면 빈 배열 */
  templateActions: string[];
  /** 개별로 더한 권한 */
  addedActions: string[];
  /** 개별로 뺀 권한 */
  excludedActions: string[];
  /** 최종 적용일 (YYYY-MM-DD HH:mm) */
  appliedAt: string;
  processor: string;
}

/** 목록 보기: 전체 · 추가가 있는 메뉴 · 제외가 있는 메뉴 */
export type ExceptionFilter = 'all' | 'added' | 'excluded';

export interface ExceptionPermissionOverview {
  /** 적용 권한 템플릿 이름 */
  templateName: string;
  /** 개별 추가 · 제외 권한 건수 (메뉴별 권한 수 합) */
  addedCount: number;
  excludedCount: number;
}
