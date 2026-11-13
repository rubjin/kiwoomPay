import {
  Badge,
  GridPlaceholder,
  PageLayout,
  ResultFooter,
  ResultPanel,
  ResultSummary,
  Segmented,
  Tab,
  TextLink,
  type BadgeTone,
  type ResultSummaryTone,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { rowsOf, type ScreenRow } from './rows';
import { STATUSES, SYSTEMS, type ScreenStatus, type SystemId } from './screens';

const SUMMARY_TONE: Record<ScreenStatus, ResultSummaryTone | undefined> = {
  미작업: undefined,
  작업중: 'info',
  작업완료: 'success',
  삭제: 'error',
  보류: 'warning',
};

const STATUS_TONE: Record<ScreenStatus, BadgeTone> = {
  미작업: 'neutral',
  작업중: 'info',
  작업완료: 'success',
  삭제: 'error',
  보류: 'warning',
};

const columnsOf = (baseUrl: string): GridPlaceholderColumn<ScreenRow>[] => [
  // 위아래 줄의 이름이 같으면 합침 (앞 depth도 같을 때만)
  { key: 'depth1', header: '1depth', width: 110, merge: true },
  { key: 'depth2', header: '2depth', width: 170, merge: true },
  { key: 'depth3', header: '3depth', width: 170, merge: true },
  { key: 'name', header: '화면명', width: 330, align: 'left' },
  { key: 'id', header: '화면ID', width: 130 },
  {
    key: 'path',
    header: '경로',
    width: 220,
    align: 'left',
    render: (s) =>
      !s.path ? (
        '-'
      ) : s.status === '삭제' ? (
        s.path
      ) : (
        <TextLink href={baseUrl + s.path} target="_blank" rel="noreferrer">
          {s.path}
        </TextLink>
      ),
  },
  { key: 'kind', header: '화면유형', width: 120 },
  { key: 'change', header: '신규구분', width: 90 },
  {
    key: 'status',
    header: '상태',
    width: 90,
    render: (s) => (
      <Badge size="sm" tone={STATUS_TONE[s.status]}>
        {s.status}
      </Badge>
    ),
  },
  { key: 'planVersion', header: '기획반영버전', width: 140 },
  { key: 'updatedAt', header: '최종업데이트일', width: 120 },
  { key: 'etc', header: '기타', align: 'left' },
];

const rowKey = (s: ScreenRow) => s.key;

/** 화면 확인용 목록 (임의 작업 — 시안 없음). 시스템별 작업 현황과 화면 링크 */
export function App() {
  const [system, setSystem] = useState<SystemId>('internal');
  const [status, setStatus] = useState<'all' | ScreenStatus>('all');
  // 1depth 메뉴 탭 ('all' = 전체). 시스템을 바꾸면 전체로
  const [menu, setMenu] = useState('all');
  const current = SYSTEMS.find((s) => s.id === system) ?? SYSTEMS[0]!;
  const ofSystem = rowsOf(system);
  const menus = [...new Set(ofSystem.map((s) => s.depth1))];
  const ofMenu = menu === 'all' ? ofSystem : ofSystem.filter((s) => s.depth1 === menu);
  const rows = status === 'all' ? ofMenu : ofMenu.filter((s) => s.status === status);
  const countOf = (st: ScreenStatus) => ofSystem.filter((s) => s.status === st).length;

  return (
    <PageLayout>
      <PageLayout.Title title="화면 목록 (임의 작업)" />

      <Tab
        value={system}
        onChange={(v) => {
          setSystem(v as SystemId);
          setMenu('all');
        }}
      >
        {SYSTEMS.map((s) => (
          <Tab.Item key={s.id} value={s.id} count={rowsOf(s.id).length}>
            {s.label}
          </Tab.Item>
        ))}
      </Tab>

      <ResultSummary
        title="작업 현황"
        items={[
          { label: '총 본수', value: ofSystem.length, unit: '본' },
          // 숫자는 표 배지와 같은 상태 색 (미작업은 기본색)
          ...STATUSES.map((st) => ({
            label: st,
            value: countOf(st),
            unit: '본',
            tone: SUMMARY_TONE[st],
          })),
        ]}
      />

      {/* 1depth 메뉴로 이동 (건수는 숫자 배지 최대 99라 글자로) */}
      <Tab variant="button" size="sm" value={menu} onChange={setMenu} aria-label="1depth 메뉴">
        <Tab.Item value="all">전체 ({ofSystem.length})</Tab.Item>
        {menus.map((m) => (
          <Tab.Item key={m} value={m}>
            {m} ({ofSystem.filter((s) => s.depth1 === m).length})
          </Tab.Item>
        ))}
      </Tab>

      <ResultPanel
        title={`${current.label} 화면${menu === 'all' ? '' : ` · ${menu}`}`}
        status={rows.length === 0 ? 'empty' : 'success'}
        statusProps={{ title: '해당하는 화면이 없습니다', description: null }}
        actions={
          <Segmented
            value={status}
            onChange={(v) => setStatus(v as typeof status)}
            aria-label="상태"
          >
            <Segmented.Item value="all">전체</Segmented.Item>
            {STATUSES.map((st) => (
              <Segmented.Item key={st} value={st}>
                {st}
              </Segmented.Item>
            ))}
          </Segmented>
        }
      >
        <GridPlaceholder columns={columnsOf(current.url)} rows={rows} rowKey={rowKey} />
      </ResultPanel>

      <ResultFooter total={rows.length} />
    </PageLayout>
  );
}
