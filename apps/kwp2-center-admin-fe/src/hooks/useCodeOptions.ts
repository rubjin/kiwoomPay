import { useEffect, useMemo } from 'react';
import { ALL_OPTION, type Option } from '@/constants/options';
import { useCodeStore } from '@/store/code';
import { CODE_FALLBACK, type CodeGroup } from '@/constants/codes';

/**
 * 공통코드 선택지 (SelectBox · RadioGroup · MultiSelect options).
 * 처음에는 임시값을 바로 돌려주고, 받아 오면 다시 그린다. 같은 그룹은 앱 전체에서 한 번만 요청
 *
 * @example const payMethods = useCodeOptions('PAY_METHOD', { withAll: true });
 */
export function useCodeOptions(group: CodeGroup, { withAll = false } = {}): Option[] {
  const loaded = useCodeStore((s) => s.codes[group]);
  const load = useCodeStore((s) => s.load);

  useEffect(() => {
    load(group);
  }, [group, load]);

  return useMemo(() => {
    const options = loaded ?? CODE_FALLBACK[group];
    return withAll ? [ALL_OPTION, ...options] : options;
  }, [loaded, group, withAll]);
}
