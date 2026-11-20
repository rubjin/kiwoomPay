import type { SearchResultPage } from '@kiwoompay/design-system';
import { paginate, wait } from '@/mocks/utils';
import { fetchNormalFunctions } from './functionCode.api';
import { fetchMenuTree } from './menu.api';
import type { MenuNode } from './menu.types';
import {
  TemplateError,
  type PermissionTemplate,
  type TemplateChangeType,
  type TemplateHistoryItem,
  type TemplateHistoryParams,
  type TemplateInput,
  type TemplateSearchParams,
} from './permissionTemplate.types';
import {
  TEMPLATES,
  USED_TEMPLATE_IDS,
  TEMPLATE_HISTORY,
} from '@/mocks/system/permissionTemplate.mock';

// TODO(API) 권한 템플릿 API가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 데이터 (임의 작업: 템플릿 · 연결 계정 수 · 권한 구성 · 변경 이력). 메모리에만 저장한다

let nextSeq = 7;

const copy = (t: PermissionTemplate): PermissionTemplate => ({
  ...t,
  menuIds: [...t.menuIds],
  functionCodes: [...t.functionCodes],
});

// ── 변경 이력 ─────────────────────────────────────────

let historySeq = 1000;
/** TODO(API) 처리자는 로그인 사용자 — 지금은 예시 */
const CURRENT_USER = 'admin01';

const nowText = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const findMenu = (node: MenuNode, id: string): MenuNode | undefined => {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findMenu(child, id);
    if (found) return found;
  }
  return undefined;
};

/** 저장 전 · 후를 비교해 변경 이력을 남긴다 (변경 항목별 전후값 · 처리자) */
async function recordHistory(before: PermissionTemplate | undefined, after: PermissionTemplate) {
  const list = (TEMPLATE_HISTORY[after.id] ??= []);
  const add = (type: TemplateChangeType, item: string, b: string, a: string) =>
    list.unshift({
      id: `H${historySeq++}`,
      changedAt: nowText(),
      changedBy: CURRENT_USER,
      type,
      item,
      before: b,
      after: a,
    });
  if (!before) {
    add('CREATE', '템플릿 생성', '-', after.name);
    return;
  }
  if (before.name !== after.name) add('INFO', '템플릿명', before.name, after.name);
  if (before.description !== after.description) {
    add('INFO', '템플릿 설명', before.description || '-', after.description || '-');
  }
  if (before.use !== after.use) {
    add('USE', '템플릿 사용여부', before.use ? '사용' : '미사용', after.use ? '사용' : '미사용');
  }
  const [root, functions] = await Promise.all([fetchMenuTree(), fetchNormalFunctions()]);
  const menuName = (id: string) => findMenu(root, id)?.name ?? id;
  const functionLabel = (code: string) => {
    const f = functions.find((x) => x.code === code);
    return f ? `${menuName(f.menuId)} / ${f.name}` : code;
  };
  const diff = (b: string[], a: string[], label: (v: string) => string) => {
    for (const v of a.filter((x) => !b.includes(x))) add('PERMISSION', label(v), '미부여', '부여');
    for (const v of b.filter((x) => !a.includes(x))) add('PERMISSION', label(v), '부여', '미부여');
  };
  diff(before.menuIds, after.menuIds, (id) => `${menuName(id)} / 접근`);
  diff(before.functionCodes, after.functionCodes, functionLabel);
}

// ── API ───────────────────────────────────────────────

/** 템플릿 목록 (템플릿명 부분일치 · 사용여부) */
export async function fetchTemplates(params: TemplateSearchParams): Promise<PermissionTemplate[]> {
  await wait(250);
  const name = params.name.trim();
  return TEMPLATES.filter(
    (t) => (!name || t.name.includes(name)) && params.uses.includes(t.use ? 'Y' : 'N'),
  ).map(copy);
}

/** 저장 (신규 · 수정) → 템플릿 id. 템플릿명 중복이면 DUPLICATE_NAME. 저장하면 변경 이력이 남는다 */
export async function saveTemplate(input: TemplateInput): Promise<string> {
  await wait(400);
  const name = input.name.trim();
  if (TEMPLATES.some((t) => t.id !== input.id && t.name === name)) {
    throw new TemplateError('DUPLICATE_NAME');
  }
  const fields = {
    name,
    description: input.description.trim(),
    use: input.use,
    menuIds: [...input.menuIds],
    functionCodes: [...input.functionCodes],
  };
  const found = input.id ? TEMPLATES.find((t) => t.id === input.id) : undefined;
  if (found) {
    const before = copy(found);
    Object.assign(found, fields);
    await recordHistory(before, found);
    return found.id;
  }
  const id = `T${String(nextSeq++).padStart(2, '0')}`;
  const created = { id, linkedAccounts: 0, ...fields };
  TEMPLATES.push(created);
  await recordHistory(undefined, created);
  return id;
}

/** 삭제. 연결 계정 · 과거 적용 · 사용 이력이 있으면 IN_USE */
export async function deleteTemplate(id: string): Promise<void> {
  await wait(300);
  const i = TEMPLATES.findIndex((t) => t.id === id);
  if (i < 0) return;
  if (TEMPLATES[i]!.linkedAccounts > 0 || USED_TEMPLATE_IDS.has(id))
    throw new TemplateError('IN_USE');
  TEMPLATES.splice(i, 1);
}

/** 템플릿 변경 이력 (변경일시 최신순, 5건씩 — 화면설계서). 조회 전용 */
export async function fetchTemplateHistory(
  id: string,
  params: TemplateHistoryParams,
  page: number,
  pageSize = 5,
): Promise<SearchResultPage<TemplateHistoryItem>> {
  await wait(200);
  const { start, end } = params.period;
  const rows = (TEMPLATE_HISTORY[id] ?? [])
    .filter((h) => {
      const day = h.changedAt.slice(0, 10);
      return (
        (!start || day >= start) &&
        (!end || day <= end) &&
        (params.type === 'all' || h.type === params.type)
      );
    })
    .sort((a, b) => b.changedAt.localeCompare(a.changedAt));
  return paginate(rows, { page, pageSize });
}
