import { wait } from '@/mocks/utils';
import {
  FunctionError,
  type FunctionInput,
  type FunctionItem,
  type FunctionSearchParams,
  type SpecialApply,
} from './functionCode.types';
import { FUNCTIONS, USED_FUNCTION_CODES } from '@/mocks/system/functionCode.mock';

// TODO(API) 기능 코드 API가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 데이터 (임의 작업: 기능 목록 · 식별키 · 특수권한 코드 · 사용 이력). 메모리에만 저장한다

let nextSeq = 9000;

/** 3Depth 메뉴의 기능 목록 (검색 조건 적용, 정렬순서대로) */
export async function fetchFunctions(
  menuId: string,
  params: FunctionSearchParams,
): Promise<FunctionItem[]> {
  await wait(300);
  const code = params.code.trim().toLowerCase();
  const name = params.name.trim();
  return FUNCTIONS.filter(
    (f) =>
      f.menuId === menuId &&
      (!code || f.code.toLowerCase().includes(code)) &&
      (!name || f.name.includes(name)) &&
      params.types.includes(f.type) &&
      params.kinds.includes(f.kind) &&
      params.uses.includes(f.use ? 'Y' : 'N'),
  )
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((f) => ({ ...f }));
}

/** 메뉴의 탭 기능 (소속 탭 선택지) — 검색 조건과 상관없이 전체 */
export async function fetchMenuTabs(menuId: string): Promise<FunctionItem[]> {
  await wait(100);
  return FUNCTIONS.filter((f) => f.menuId === menuId && f.type === 'TAB')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((f) => ({ ...f }));
}

/** 저장 (신규 · 수정) → 기능코드. 같은 메뉴 안 식별키 중복이면 DUPLICATE_KEY */
export async function saveFunction(input: FunctionInput): Promise<string> {
  await wait(400);
  const key = input.key.trim();
  if (FUNCTIONS.some((f) => f.menuId === input.menuId && f.code !== input.code && f.key === key)) {
    throw new FunctionError('DUPLICATE_KEY');
  }
  const siblings = FUNCTIONS.filter((f) => f.menuId === input.menuId);
  const special = input.kind === 'SPECIAL';
  const fields = {
    name: input.name.trim(),
    type: input.type,
    tabCode: input.type === 'BUTTON' && input.tabCode ? input.tabCode : null,
    kind: input.kind,
    key,
    specialCode: special ? input.specialCode : null,
    specialApply: special ? (input.specialApply as SpecialApply) : null,
    sortOrder: input.sortOrder.trim()
      ? Number(input.sortOrder)
      : Math.max(0, ...siblings.map((f) => f.sortOrder)) + 1,
    use: input.use,
  };
  const found = input.code ? FUNCTIONS.find((f) => f.code === input.code) : undefined;
  if (found) {
    Object.assign(found, fields);
    return found.code;
  }
  const code = `F${nextSeq++}`;
  FUNCTIONS.push({ code, menuId: input.menuId, ...fields });
  return code;
}

/** 삭제. 권한 부여 · 사용 이력이 있으면 IN_USE */
export async function deleteFunction(code: string): Promise<void> {
  await wait(300);
  if (USED_FUNCTION_CODES.has(code)) throw new FunctionError('IN_USE');
  const i = FUNCTIONS.findIndex((f) => f.code === code);
  if (i >= 0) FUNCTIONS.splice(i, 1);
}

/** 모든 메뉴의 일반 기능 (사용 중) — 권한 템플릿 권한 항목용. 특수권한 기능은 템플릿에서 부여하지 않아 뺀다 */
export async function fetchNormalFunctions(): Promise<FunctionItem[]> {
  await wait(150);
  return FUNCTIONS.filter((f) => f.kind === 'NORMAL' && f.use)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((f) => ({ ...f }));
}
