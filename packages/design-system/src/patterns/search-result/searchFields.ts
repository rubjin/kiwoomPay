import type { ReactNode } from 'react';
import type { AppliedFilter } from './AppliedFilters';

/** 검색 조건 영역: basic(항상 보임) · detail(상세 검색) */
export type SearchFieldGroup = 'basic' | 'detail';

/**
 * 검색 조건 1개의 정의. 화면은 검색 조건을 이 목록으로 한 번 정리해 두고
 * 적용된 검색 조건 칩 · 내 검색조건(저장 · 불러오기 · 요약)에 같이 쓴다.
 */
export interface SearchFieldDef<P> {
  /** 식별자 (저장된 검색조건에서 항목을 찾을 때) */
  key: string;
  /** 표시 이름 (예: 조회기간 · 결제수단) */
  label: string;
  group?: SearchFieldGroup;
  /** 값 → 표시 문구. 비어 있어 표시하지 않을 때는 null */
  format: (params: P) => ReactNode | null;
  /** 적용된 검색 조건 칩에 보일지 (기본 true). 저장 요약에만 쓰는 항목(예: 조회기준일)은 false */
  applied?: boolean;
}

export interface SearchFieldSummary {
  key: string;
  label: string;
  value: ReactNode;
  group: SearchFieldGroup;
}

/** 정의대로 조건을 읽어 [이름, 값] 목록으로 (저장된 검색조건 요약 · 상세 화면) */
export function summarizeSearch<P>(defs: SearchFieldDef<P>[], params: P): SearchFieldSummary[] {
  return defs.flatMap((def) => {
    const value = def.format(params);
    if (value === null || value === undefined || value === '') return [];
    return [{ key: def.key, label: def.label, value, group: def.group ?? 'basic' }];
  });
}

/** 적용된 검색 조건 칩 (AppliedFilters items). 조회 전(null)이면 빈 목록 */
export function toAppliedFilters<P>(
  defs: SearchFieldDef<P>[],
  params: P | null | undefined,
): AppliedFilter[] {
  if (!params) return [];
  return summarizeSearch(
    defs.filter((def) => def.applied !== false),
    params,
  ).map(({ label, value }) => ({ label, value }));
}

/** 옵션 목록에서 값의 이름 찾기 (예: 'all' → '전체'). 다중 값은 쉼표로 */
export function optionLabel(
  options: { value: string; label: string }[],
  value: string | string[],
): string {
  const values = Array.isArray(value) ? value : [value];
  return values.map((v) => options.find((o) => o.value === v)?.label ?? v).join(', ');
}

/** 문자열 조건: 비어 있으면 표시하지 않음 */
export const textValue = (value: string | undefined | null) =>
  value?.trim() ? value.trim() : null;
