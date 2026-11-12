/**
 * 코드 복사(Show code)에 보이는 스토리 소스를 사용 코드만 남기도록 정리한다.
 * - 고정 예시 스토리(`render: () => …`)는 스토리 객체 전체 대신 render가 그리는 JSX만 보여 준다 (parameters 등 제거)
 * - 배치용 감싸기(속성이 style · key뿐인 div, 예시 칸 `Case`)는 벗기고 안의 내용만 남긴다
 * - prettier로 다시 정렬한다
 * args를 쓰는 스토리(Playground 등)는 Storybook이 만든 JSX 그대로 둔다.
 */

type Node = {
  type: string;
  start: number;
  end: number;
  [key: string]: unknown;
};

const WRAPPER_TAGS = new Set(['div', 'Case']);
const LAYOUT_ATTRS = new Set(['style', 'key']);

function isNode(value: unknown): value is Node {
  return typeof value === 'object' && value !== null && typeof (value as Node).type === 'string';
}

function children(node: Node): Node[] {
  const out: Node[] = [];
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc' || key === 'extra') continue;
    if (Array.isArray(value)) value.filter(isNode).forEach((v) => out.push(v));
    else if (isNode(value)) out.push(value);
  }
  return out;
}

function find(node: Node, test: (n: Node) => boolean): Node | undefined {
  if (test(node)) return node;
  for (const child of children(node)) {
    const hit = find(child, test);
    if (hit) return hit;
  }
  return undefined;
}

function tagName(el: Node): string | undefined {
  const name = (el.openingElement as Node | undefined)?.name as Node | undefined;
  return name?.type === 'JSXIdentifier' ? (name.name as string) : undefined;
}

function isWrapper(el: Node): boolean {
  if (el.type !== 'JSXElement' || !el.closingElement) return false;
  const name = tagName(el);
  if (!name || !WRAPPER_TAGS.has(name)) return false;
  if (name === 'Case') return true;
  const attrs = (el.openingElement as Node).attributes as Node[];
  return attrs.every(
    (a) => a.type === 'JSXAttribute' && LAYOUT_ATTRS.has((a.name as Node).name as string),
  );
}

type Parse = (text: string) => Node;

/** 감싸기 하나를 벗긴다. 더 벗길 것이 없으면 null */
function unwrapOnce(code: string, parse: Parse): string | null {
  const program = parse(code);
  // 부모 정보가 필요해 직접 순회
  let target: { el: Node; parent: Node | undefined } | undefined;
  const walk = (node: Node, parent: Node | undefined) => {
    if (target) return;
    if (isWrapper(node)) {
      target = { el: node, parent };
      return;
    }
    children(node).forEach((c) => walk(c, node));
  };
  walk(program, undefined);
  if (!target) return null;

  const { el, parent } = target;
  const items = (el.children as Node[]).filter(
    (c) => !(c.type === 'JSXText' && !(c.value as string).trim()),
  );
  const lines = items.map((c) => code.slice(c.start, c.end));
  // Case의 이름 · 설명(label · description)은 주석으로 남겨 복사한 코드에서도 어떤 케이스인지 알 수 있게
  if (tagName(el) === 'Case') {
    const text = (attr: string) => {
      const value = ((el.openingElement as Node).attributes as Node[]).find(
        (a) => a.type === 'JSXAttribute' && (a.name as Node).name === attr,
      )?.value as Node | undefined;
      return value?.type === 'StringLiteral' ? (value.value as string) : undefined;
    };
    const comment = [text('label'), text('description')].filter(Boolean).join(' — ');
    if (comment) lines.unshift(`{/* ${comment} */}`);
  }
  const inner = lines.join('\n');
  const inJsx = parent?.type === 'JSXElement' || parent?.type === 'JSXFragment';
  const single = lines.length === 1 && items[0]?.type === 'JSXElement';
  const replacement = inJsx || single ? inner : lines.length === 0 ? 'null' : `<>\n${inner}\n</>`;
  return code.slice(0, el.start) + replacement + code.slice(el.end);
}

export async function cleanStorySource(code: string): Promise<string> {
  // 고정 예시 스토리의 소스는 스토리 객체(`{ parameters, render }`)로 들어온다
  if (!code.trimStart().startsWith('{') || !code.includes('render')) return code;
  try {
    const [{ format }, babel, estree] = await Promise.all([
      import('prettier/standalone'),
      import('prettier/plugins/babel'),
      import('prettier/plugins/estree'),
    ]);
    const parser = babel.parsers['babel-ts'];
    const parse: Parse = (text) => parser.parse(text, {} as never) as unknown as Node;

    const wrapped = `(${code})`;
    const render = find(
      parse(wrapped),
      (n) =>
        n.type === 'ObjectProperty' &&
        ((n.key as Node).name === 'render' || (n.key as Node).value === 'render'),
    );
    const fn = render?.value as Node | undefined;
    if (!fn || (fn.type !== 'ArrowFunctionExpression' && fn.type !== 'FunctionExpression')) {
      return code;
    }
    // 인자를 쓰는 render나 훅이 있는 함수 본문은 함수째 보여 준다
    const body = fn.body as Node;
    const usesArgs = (fn.params as Node[]).length > 0;
    let snippet =
      body.type === 'BlockStatement' || usesArgs
        ? wrapped.slice(fn.start, fn.end)
        : wrapped.slice(body.start, body.end);

    for (let i = 0; i < 50; i++) {
      const next = unwrapOnce(snippet, parse);
      if (next === null) break;
      snippet = next;
    }

    const formatted = await format(snippet, {
      parser: 'babel-ts',
      plugins: [babel, estree],
      printWidth: 100,
      singleQuote: true,
    });
    return formatted.trim().replace(/;$/, '');
  } catch {
    return code;
  }
}
