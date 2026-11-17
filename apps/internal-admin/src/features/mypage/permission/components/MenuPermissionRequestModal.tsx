import {
  // 팝업 틀 · 배치
  Modal,
  Button,
  TextButton,
  Stack,
  HubGrid,
  Infobox,
  // 입력
  Field,
  SearchField,
  SelectBox,
  TextArea,
  Badge,
  // 선택 (P07)
  TreeOptionTable,
  SelectedOptionList,
  filterTree,
  treeGroupIds,
  type TreeOptionNode,
  // 처리 흐름 (P04)
  useAction,
} from '@kiwoompay/design-system';
import { useEffect, useMemo, useState } from 'react';
import {
  fetchMenuPermissionTree,
  requestMenuPermissions,
  type MenuPermissionNode,
} from '@/features/mypage/menuPermission.api';

const REASON_MAX = 200;

/** 펼침 깊이 선택지 (Tree Depth) */
const DEPTHS = [
  { value: '1', label: '1Depth' },
  { value: '2', label: '2Depth' },
  { value: '3', label: '3Depth' },
];

/** 왼쪽 트리 · 오른쪽 확인 폭 비율 (Figma 880 : 436) */
const PANEL_COLUMNS = [880, 436];

/** 승인대기 권한은 비활성 체크박스 + 승인대기 Badge */
const toTreeNodes = (nodes: MenuPermissionNode[]): TreeOptionNode[] =>
  nodes.map((n) => ({
    ...n,
    children: n.children && toTreeNodes(n.children),
    options: n.options?.map((o) => ({
      value: o.value,
      label: o.label,
      disabled: o.pending,
      addon: o.pending ? (
        <Badge size="sm" tone="warning">
          승인대기
        </Badge>
      ) : undefined,
    })),
  }));

/** 끝 메뉴 id → 경로 · 항목 이름 */
function indexLeaves(nodes: MenuPermissionNode[], path: string[] = []) {
  const map = new Map<string, { path: string; options: Map<string, string> }>();
  for (const n of nodes) {
    const here = [...path, n.label];
    if (n.children) for (const [k, v] of indexLeaves(n.children, here)) map.set(k, v);
    else
      map.set(n.id, {
        path: here.join(' > '),
        options: new Map((n.options ?? []).map((o) => [o.value, o.label])),
      });
  }
  return map;
}

/**
 * 마이페이지 권한관리 · 메뉴 권한 신청 팝업 (KWPC02020002, Figma 29244:76072 · 76377) — 메뉴 및 기능 권한 [권한 신청]에서 연다.
 * 안내 → ① 신청할 권한 선택(트리: 검색 · Tree Depth · 모두 접기/펼치기, 승인대기 권한은 선택 불가) | ② 신청 예정 권한 확인(체크를 풀면 빠짐)
 * → 신청 사유 → [취소][권한 신청](선택 · 사유가 있어야 활성). 폭: Figma 1380 → Modal xl 1280
 */
export function MenuPermissionRequestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tree, setTree] = useState<MenuPermissionNode[]>([]);
  const [query, setQuery] = useState('');
  const [depth, setDepth] = useState('3');
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) return;
    void fetchMenuPermissionTree().then((data) => {
      setTree(data);
      // 처음: 모두 펼치되 정산자료관리처럼 고를 게 적은 묶음은 접힘 (Figma) — 지금은 첫 1Depth의 두 번째 묶음만 접음 (임의 작업)
      setExpanded(treeGroupIds(data).filter((id) => id !== 'settlement-data'));
    });
  }, [open]);

  const nodes = useMemo(() => filterTree(toTreeNodes(tree), query), [tree, query]);
  const leaves = useMemo(() => indexLeaves(tree), [tree]);
  // 검색 중에는 남은 줄을 모두 펼친다
  const shownExpanded = query.trim() ? treeGroupIds(nodes) : expanded;

  const groups = Object.entries(selected).map(([id, values]) => {
    const leaf = leaves.get(id);
    return {
      key: id,
      title: leaf?.path ?? id,
      items: values.map((v) => ({ value: v, label: leaf?.options.get(v) ?? v })),
    };
  });
  const permissionCount = groups.reduce((n, g) => n + g.items.length, 0);

  const close = () => {
    setQuery('');
    setDepth('3');
    setSelected({});
    setReason('');
    onClose();
  };

  const apply = useAction({
    run: () => requestMenuPermissions({ items: selected, reason: reason.trim() }),
    onSuccess: close,
    success: '메뉴 권한 신청이 완료되었습니다. 승인 결과는 알림으로 안내합니다.',
    failure: '메뉴 권한을 신청하지 못했습니다. 잠시 후 다시 시도해 주세요.',
  });

  return (
    <Modal open={open} onClose={apply.loading ? undefined : close} size="xl">
      <Modal.Header title="메뉴 권한 신청" closeButton />
      <Modal.Body>
        <Stack>
          <Infobox>
            <Infobox.Item title="신청 방법">
              왼쪽에서 필요한 메뉴·기능 권한을 선택하고, 오른쪽에서 신청 내역을 확인하세요.
            </Infobox.Item>
            <Infobox.Item title="신청 제한">
              이미 보유했거나 승인대기 중인 기능 권한은 중복 신청할 수 없습니다.
            </Infobox.Item>
          </Infobox>

          <HubGrid columns={PANEL_COLUMNS}>
            <Modal.Section
              step={1}
              title="신청할 권한 선택"
              description="메뉴에서 필요한 기능을 선택하세요"
            >
              <TreeOptionTable
                nodes={nodes}
                expandedIds={shownExpanded}
                onExpandedChange={setExpanded}
                value={selected}
                onChange={setSelected}
                toolbar={
                  <>
                    <SearchField
                      fullWidth
                      placeholder="메뉴명을 입력해주세요"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <Field label="Tree Depth">
                      <SelectBox
                        options={DEPTHS}
                        value={depth}
                        onChange={(d) => {
                          setDepth(d);
                          // 1Depth: 모두 접힘 · 2Depth: 1Depth만 펼침 · 3Depth: 모두 펼침
                          setExpanded(treeGroupIds(tree, Number(d) - 1));
                        }}
                      />
                    </Field>
                    <TextButton onClick={() => setExpanded([])}>모두 접기</TextButton>
                    <TextButton onClick={() => setExpanded(treeGroupIds(tree))}>
                      모두 펼치기
                    </TextButton>
                  </>
                }
              />
            </Modal.Section>
            <Modal.Section
              step={2}
              title="신청 예정 권한 확인"
              description="신청 전 선택 내역 확인·해제"
            >
              <SelectedOptionList
                summary={`${groups.length}개 메뉴 · ${permissionCount}개 권한`}
                groups={groups}
                onRemove={(key, value) =>
                  setSelected((prev) => {
                    const rest = (prev[key] ?? []).filter((v) => v !== value);
                    const next = { ...prev };
                    if (rest.length > 0) next[key] = rest;
                    else delete next[key];
                    return next;
                  })
                }
                emptyTitle="선택한 권한이 없습니다."
                emptyDescription="왼쪽 메뉴에서 신청할 권한을 선택해 주세요."
              />
            </Modal.Section>
          </HubGrid>

          <Field label="신청 사유" labelPosition="top" required="text">
            <TextArea
              fullWidth
              rows={3}
              maxLength={REASON_MAX}
              showCounter
              placeholder="신청 사유를 입력해 주세요."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Field>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={apply.loading}
          onClick={close}
        >
          취소
        </Button>
        <Button
          size="lg"
          disabled={permissionCount === 0 || !reason.trim()}
          onClick={() => void apply.execute()}
        >
          권한 신청
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
