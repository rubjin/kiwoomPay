import { optionLabel } from '@kiwoompay/design-system';
import type { CodeGroup } from '@/constants/codes';
import { ALL_OPTION } from '@/constants/options';
import { getCodeOptions } from '@/store/code';

/**
 * 공통코드 값 → 이름 ('all'은 "전체"). 다중 값은 쉼표로.
 * 적용 조건 칩 · 내 검색조건 요약(searchFields format)처럼 React 밖에서 쓴다
 */
export const codeLabel = (group: CodeGroup, value: string | string[]) =>
  optionLabel([ALL_OPTION, ...getCodeOptions(group)], value);
