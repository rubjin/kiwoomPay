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
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import {
  SCREENS,
  STATUSES,
  SYSTEMS,
  type ScreenInfo,
  type ScreenStatus,
  type SystemId,
} from './screens';

const STATUS_TONE: Record<ScreenStatus, BadgeTone> = {
  작업중: 'info',
  작업완료: 'success',
  삭제: 'neutral',
  보류: 'warning',
};

const columnsOf = (baseUrl: string): GridPlaceholderColumn<ScreenInfo>[] => [
  // 위아래 줄의 이름이 같으면 합침 (앞 depth도 같을 때만)
  { key: 'depth1', header: '1depth', width: 110, merge: true },
  { key: 'depth2', header: '2depth', width: 170, merge: true },
  { key: 'depth3', header: '3depth', width: 150, merge: true },
  { key: 'id', header: '화면ID', width: 120 },
  { key: 'name', header: '화면명', width: 330, align: 'left' },
  {
    key: 'path',
    header: '경로',
    width: 220,
    align: 'left',
    render: (s) =>
      s.status === '삭제' ? (
        s.path
      ) : (
        <TextLink href={baseUrl + s.path} target="_blank" rel="noreferrer">
          {s.path}
        </TextLink>
      ),
  },
  {
    key: 'type',
    header: '화면타입',
    width: 110,
    render: (s) => (s.pattern ? `${s.type} (${s.pattern})` : s.type),
  },
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
  { key: 'planVersion', header: '기획반영버전', width: 200 },
  { key: 'updatedAt', header: '최종업데이트일', width: 120 },
  {
    key: 'tempWork',
    header: '기타',
    align: 'left',
    render: (s) => (s.tempWork ? `임의 작업: ${s.tempWork}` : '-'),
  },
];

/** 줄 key — 같은 경로를 여는 줄이 있어 화면ID · 화면명까지 넣어 고유하게 */
const rowKey = (s: ScreenInfo) => `${s.system}|${s.id}|${s.name}`;

/** 화면 확인용 목록 (임의 작업 — 시안 없음). 시스템별 작업 현황과 화면 링크 */
export function App() {
  const [system, setSystem] = useState<SystemId>('internal');
  const [status, setStatus] = useState<'all' | ScreenStatus>('all');
  const current = SYSTEMS.find((s) => s.id === system) ?? SYSTEMS[0]!;
  const ofSystem = SCREENS.filter((s) => s.system === system);
  const rows = status === 'all' ? ofSystem : ofSystem.filter((s) => s.status === status);
  const countOf = (st: ScreenStatus) => ofSystem.filter((s) => s.status === st).length;

  return (
    <PageLayout>
      <PageLayout.Title title="화면 목록 (임의 작업)" />

      <Tab value={system} onChange={(v) => setSystem(v as SystemId)}>
        {SYSTEMS.map((s) => (
          <Tab.Item key={s.id} value={s.id} count={SCREENS.filter((x) => x.system === s.id).length}>
            {s.label}
          </Tab.Item>
        ))}
      </Tab>

      <ResultSummary
        title="작업 현황"
        items={[
          { label: '총 본수', value: ofSystem.length, unit: '본' },
          ...STATUSES.map((st) => ({ label: st, value: countOf(st), unit: '본' })),
        ]}
      />

      <ResultPanel
        title={`${current.label} 화면`}
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
