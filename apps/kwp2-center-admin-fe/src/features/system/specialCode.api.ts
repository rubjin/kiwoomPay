import { paginate, wait } from '@/mocks/utils';
import type { SearchResultPage } from '@kiwoompay/design-system';
import {
  SpecialCodeError,
  type LinkedFunction,
  type SpecialCode,
  type SpecialCodeInput,
  type SpecialCodeSearchParams,
} from './specialCode.types';
import { SPECIAL_CODES, USED_SPECIAL_CODES } from '@/mocks/system/specialCode.mock';

// TODO(API) 특수권한 코드 API가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 데이터 (임의 작업: 코드 · 연결 기능 · 사용 이력 — 화면설계서도 "표시 코드 · 건수는 설계용 예시"). 메모리에만 저장한다

let nextSeq = 5;

/** 특수권한 코드 목록 (검색 조건 적용, 코드순) */
export async function fetchSpecialCodes(params: SpecialCodeSearchParams): Promise<SpecialCode[]> {
  await wait(250);
  const code = params.code.trim().toLowerCase();
  const name = params.name.trim();
  return SPECIAL_CODES.map((s) => ({ ...s.code, linkedCount: s.links.length })).filter(
    (c) =>
      (!code || c.code.toLowerCase().includes(code)) &&
      (!name || c.name.includes(name)) &&
      params.uses.includes(c.use ? 'Y' : 'N'),
  );
}

/** 연결된 기능 (한 페이지 5건 — 화면설계서) */
export async function fetchLinkedFunctions(
  code: string,
  page: number,
  pageSize = 5,
): Promise<SearchResultPage<LinkedFunction>> {
  await wait(200);
  const rows = SPECIAL_CODES.find((s) => s.code.code === code)?.links ?? [];
  return paginate(rows, { page, pageSize });
}

/** 저장 (신규 · 수정) → 코드. 권한명 중복이면 DUPLICATE_NAME */
export async function saveSpecialCode(input: SpecialCodeInput): Promise<string> {
  await wait(400);
  const name = input.name.trim();
  if (SPECIAL_CODES.some((s) => s.code.code !== input.code && s.code.name === name)) {
    throw new SpecialCodeError('DUPLICATE_NAME');
  }
  const fields = { name, description: input.description.trim(), use: input.use };
  const found = input.code ? SPECIAL_CODES.find((s) => s.code.code === input.code) : undefined;
  if (found) {
    Object.assign(found.code, fields);
    return found.code.code;
  }
  const code = `SP${String(nextSeq++).padStart(4, '0')}`;
  SPECIAL_CODES.push({ code: { code, linkedCount: 0, ...fields }, links: [] });
  return code;
}

/** 삭제. 기능 연결 · 신청 · 결재 · 부여 · 사용 이력이 있으면 IN_USE */
export async function deleteSpecialCode(code: string): Promise<void> {
  await wait(300);
  const i = SPECIAL_CODES.findIndex((s) => s.code.code === code);
  if (i < 0) return;
  if (SPECIAL_CODES[i]!.links.length > 0 || USED_SPECIAL_CODES.has(code))
    throw new SpecialCodeError('IN_USE');
  SPECIAL_CODES.splice(i, 1);
}
