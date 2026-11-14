import { CODE_FALLBACK, type CodeGroup } from '@/constants/codes';
import type { Option } from '@/constants/options';

/**
 * 공통코드 목록 조회.
 * TODO(API) 공통코드 API가 정해지면 바꾼다. 예: http.get(`/codes/${group}`) → [{ code, name }] → { value, label }
 * 지금은 임시값을 돌려준다
 */
export async function fetchCodes(group: CodeGroup): Promise<Option[]> {
  return CODE_FALLBACK[group];
}
