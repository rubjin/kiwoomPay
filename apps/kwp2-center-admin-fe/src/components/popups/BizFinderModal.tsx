/**
 * 화면ID: [KWPC06010203] 사업자 찾기 팝업
 * 위치: 정산내역 > 가맹점 정산 관리 > 정산 실행/처리 · /settlement/merchant/execute (팝업, 여러 화면 공통)
 */
import {
  Button,
  Field,
  GridPlaceholder,
  LookupSearch,
  Modal,
  Pagination,
  ResultFooter,
  Stack,
  TableMultiSelect,
  TextField,
  useDialog,
  type GridPlaceholderColumn,
  type TableMultiSelectColumn,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { fetchBizCpids, searchBusinesses } from '@/api/bizLookup.api';
import type { BizCpid, BizLookupResult, BizRow } from '@/api/bizLookup.types';
import { formatCount } from '@/utils/format';

const PAGE_SIZE = 10;

// CPID 선택 패널 열 (시안: 체크 36 · CPID 103 · 나머지 같은 폭)
const CPID_COLUMNS: TableMultiSelectColumn<BizCpid>[] = [
  { key: 'cpid', header: 'CPID', width: 103 },
  { key: 'serviceName', header: '서비스명' },
  { key: 'cycle', header: '정산주기' },
  { key: 'finalCpid', header: '최종정산 CPID' },
];

export interface BizFinderModalProps {
  open: boolean;
  /** [조회 조건 적용] — 고른 사업자 · CPID 범위 */
  onSelect: (result: BizLookupResult) => void;
  onCancel: () => void;
}

function BizLookupBody({ onSelect, onCancel }: Omit<BizFinderModalProps, 'open'>) {
  const dialog = useDialog();
  const [name, setName] = useState('');
  const [bizNo, setBizNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BizRow[] | null>(null);
  const [page, setPage] = useState(1);
  // 고른 사업자 · 하위 CPID · 고른 CPID (사업자를 고르면 전체 선택으로 시작)
  const [picked, setPicked] = useState<string | null>(null);
  const [cpids, setCpids] = useState<BizCpid[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);

  const search = async () => {
    setLoading(true);
    try {
      setResults(await searchBusinesses(name, bizNo));
      setPage(1);
      setPicked(null);
      setCpids([]);
      setChosen([]);
    } finally {
      setLoading(false);
    }
  };

  const pick = async (key: string) => {
    setPicked(key);
    const list = await fetchBizCpids(key);
    setCpids(list);
    setChosen(list.map((c) => c.cpid));
  };

  const apply = async () => {
    const biz = results?.find((r) => r.bizNo === picked);
    if (!biz) {
      await dialog.alert('사업자를 선택해주세요.');
      return;
    }
    if (chosen.length === 0) {
      await dialog.alert('CPID 조회 범위를 1개 이상 선택해주세요.');
      return;
    }
    onSelect({
      bizNo: biz.bizNo,
      name: biz.name,
      cpids: chosen,
      allCpids: chosen.length === cpids.length,
    });
  };

  const columns: GridPlaceholderColumn<BizRow>[] = [
    { key: 'name', header: '사업자명', width: 200, align: 'left' },
    { key: 'bizNo', header: '사업자번호', width: 130 },
    {
      key: 'cpidCount',
      header: '하위 CPID',
      width: 110,
      align: 'right',
      render: (r) => formatCount(r.cpidCount, '개'),
    },
    {
      key: 'scope',
      header: 'CPID 조회 범위',
      // 드롭다운 위아래 8 (시안 줄 56 = 8 + 40 + 8)
      render: (r) => <Stack paddingBlock={8}>{scopeOf(r)}</Stack>,
    },
  ];

  // 고른 사업자만 범위를 바꿀 수 있다. 나머지는 "전체 N개" 비활성 (시안)
  function scopeOf(r: BizRow) {
    return r.bizNo === picked ? (
      <TableMultiSelect
        fullWidth
        aria-label={`${r.name} CPID 조회 범위`}
        title="CPID 선택"
        searchPlaceholder="CPID / 서비스명 / 정산주기 / 최종정산CPID 검색"
        panelWidth={591}
        rows={cpids}
        rowKey={(c) => c.cpid}
        columns={CPID_COLUMNS}
        value={chosen}
        onChange={setChosen}
        placeholder="CPID를 선택해주세요"
      />
    ) : (
      <TableMultiSelect
        fullWidth
        disabled
        aria-label={`${r.name} CPID 조회 범위`}
        rows={[]}
        rowKey={(c: BizCpid) => c.cpid}
        columns={CPID_COLUMNS}
        placeholder={`전체 ${formatCount(r.cpidCount, '개')}`}
      />
    );
  }

  const total = results?.length ?? 0;
  const rows = results?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];

  return (
    <>
      <Modal.Body>
        <LookupSearch
          keyword={false}
          loading={loading}
          onSearch={() => void search()}
          extraFields={
            <>
              <Field label="사업자명" grow>
                <TextField
                  fullWidth
                  placeholder="사업자명을 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field label="사업자번호" grow>
                <TextField
                  fullWidth
                  placeholder="사업자번호를 입력해주세요"
                  value={bizNo}
                  onChange={(e) => setBizNo(e.target.value)}
                />
              </Field>
            </>
          }
        >
          {results && (
            <Modal.Section title="조회 결과" gap={8}>
              <Stack>
                <GridPlaceholder
                  columns={columns}
                  rows={rows}
                  rowKey={(r) => r.bizNo}
                  selectable="single"
                  selectedKeys={picked ? [picked] : []}
                  onSelectionChange={([key]) => key && void pick(key)}
                  empty="조회 결과가 없습니다."
                />
                <ResultFooter total={total}>
                  <Pagination
                    totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
                    page={page}
                    onChange={setPage}
                  />
                </ResultFooter>
              </Stack>
            </Modal.Section>
          )}
        </LookupSearch>
      </Modal.Body>
      {/* 조회 전에는 Footer 없음 (시안 최초 상태) */}
      {results && (
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line" onClick={onCancel}>
            취소
          </Button>
          <Button size="lg" onClick={() => void apply()}>
            조회 조건 적용
          </Button>
        </Modal.Footer>
      )}
    </>
  );
}

/**
 * 사업자 찾기 팝업 — 여러 화면 공통.
 * 사업자명 · 사업자번호로 조회 → 사업자 하나 선택(라디오) → 그 사업자의 CPID 조회 범위(TableMultiSelect) → [조회 조건 적용].
 * 폭: 시안 1056 → Modal lg 880 (표준 크기). 호출은 useLookup (P03)
 */
export function BizFinderModal({ open, onSelect, onCancel }: BizFinderModalProps) {
  return (
    <Modal open={open} onClose={onCancel} size="lg">
      <Modal.Header title="사업자 찾기" />
      {open && <BizLookupBody onSelect={onSelect} onCancel={onCancel} />}
    </Modal>
  );
}
