import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { WORK_TAB_LIMIT, WorkTab, type WorkTabAction } from './WorkTab';

const meta = {
  title: 'Layout/Work Tab',
  component: WorkTab,
  args: { defaultValue: 'b', children: null },
  parameters: { tempWork: '메뉴 위치 간격 · 메뉴 항목 Hover · 비활성 표현' },
} satisfies Meta<typeof WorkTab>;

export default meta;
type Story = StoryObj<typeof meta>;

const log = (text: string) => () => console.info(text);

const sampleActions: WorkTabAction[] = [
  { key: 'new', label: '새 업무 탭으로 열기', onSelect: log('새 업무 탭으로 열기') },
  { key: 'pin', label: '탭 고정', onSelect: log('탭 고정') },
  { key: 'close', label: '현재 탭 닫기', onSelect: log('현재 탭 닫기') },
  { key: 'others', label: '다른 탭 모두 닫기', onSelect: log('다른 탭 모두 닫기') },
  { key: 'right', label: '오른쪽 탭 닫기', onSelect: log('오른쪽 탭 닫기') },
];

const row: CSSProperties = { display: 'flex', gap: 24, alignItems: 'flex-end' };

export const Playground: Story = {
  render: (args) => (
    <WorkTab {...args} actions={sampleActions} onClose={log('닫기')}>
      <WorkTab.Item value="a">가맹점 조회</WorkTab.Item>
      <WorkTab.Item value="b">정산내역</WorkTab.Item>
      <WorkTab.Item value="c">인증청구정산관리</WorkTab.Item>
    </WorkTab>
  ),
};

/** Default · Hover(마우스를 올려 확인: 회색 배경 + 닫기) · Active(Workspace에 1개, 더보기 + 닫기 + 아래 선) */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <WorkTab>
        <WorkTab.Item value="default">메뉴명</WorkTab.Item>
      </WorkTab>
      <WorkTab>
        <WorkTab.Item value="hover">메뉴명 (Hover)</WorkTab.Item>
      </WorkTab>
      <WorkTab defaultValue="active" actions={sampleActions}>
        <WorkTab.Item value="active">메뉴명</WorkTab.Item>
      </WorkTab>
    </div>
  ),
};

/** 열린 업무 화면을 좌 → 우 순서로 Gap 없이 배치. 최대 10개 */
export const WorkspaceBar: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <WorkTab defaultValue="10" actions={sampleActions} onClose={log('닫기')}>
      {Array.from({ length: 9 }, (_, i) => (
        <WorkTab.Item key={i} value={String(i + 1)}>
          {`(${i + 1}) Default`}
        </WorkTab.Item>
      ))}
      <WorkTab.Item value="10">(10) Active</WorkTab.Item>
    </WorkTab>
  ),
};

/** 긴 메뉴명은 말줄임 + 전체 이름 title. 고정 Tab처럼 닫을 수 없으면 closable={false} */
export const LongLabelAndFixed: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <WorkTab defaultValue="b" actions={sampleActions}>
      <WorkTab.Item value="a" closable={false}>
        대시보드
      </WorkTab.Item>
      <WorkTab.Item value="b">가맹점별 정산 보류 · 해제 이력 상세 조회</WorkTab.Item>
      <WorkTab.Item value="c">카드사 지역정산내역</WorkTab.Item>
    </WorkTab>
  ),
};

/** Tab 관리 메뉴: Trigger를 누르면 레이어로 노출 (Modal 아님) */
export const ActionMenu: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ paddingBottom: 220 }}>
      <WorkTab.ActionMenu count={10} actions={sampleActions} />
    </div>
  ),
};

// ── Interactive ─────────────────────────────────────────
interface OpenTab {
  id: string;
  title: string;
  fixed?: boolean;
}

const menus = [
  '가맹점 조회',
  '정산내역',
  '인증청구정산관리',
  '통합정산내역관리',
  '카드사 지역정산내역',
  '정산자금외부관리조회',
  '결제 취소 요청',
  '세금계산서 발행',
  '거래 승인 내역',
  '수수료 정책 관리',
  '가맹점 계약 관리',
];

function WorkspaceDemo() {
  const [tabs, setTabs] = useState<OpenTab[]>([
    { id: '0', title: '가맹점 조회' },
    { id: '1', title: '정산내역' },
    { id: '2', title: '인증청구정산관리' },
  ]);
  const [active, setActive] = useState('1');
  const [limitAlert, setLimitAlert] = useState(false);
  const [seq, setSeq] = useState(3);

  const open = (title: string) => {
    if (tabs.length >= WORK_TAB_LIMIT) {
      setLimitAlert(true);
      return;
    }
    const id = String(seq);
    setSeq(seq + 1);
    setTabs([...tabs, { id, title }]);
    setActive(id);
  };

  const keep = (next: OpenTab[]) => {
    setTabs(next);
    if (!next.some((tab) => tab.id === active)) setActive(next[next.length - 1]?.id ?? '');
  };

  const close = (id: string) => {
    const index = tabs.findIndex((tab) => tab.id === id);
    const next = tabs.filter((tab) => tab.id !== id);
    setTabs(next);
    if (id === active) setActive((next[index] ?? next[index - 1])?.id ?? '');
  };

  const current = tabs.find((tab) => tab.id === active);
  const activeIndex = tabs.findIndex((tab) => tab.id === active);

  const actions: WorkTabAction[] = [
    {
      key: 'new',
      label: '새 업무 탭으로 열기',
      onSelect: () => current && open(current.title),
      disabled: !current,
    },
    {
      key: 'pin',
      label: current?.fixed ? '탭 고정 해제' : '탭 고정',
      disabled: !current,
      onSelect: () => {
        if (!current) return;
        const toggled = { ...current, fixed: !current.fixed };
        const rest = tabs.filter((tab) => tab.id !== current.id);
        // 고정 Tab은 앞쪽에 모은다. 고정·해제한 Tab은 고정 묶음의 경계로 옮긴다
        const fixedCount = rest.filter((tab) => tab.fixed).length;
        setTabs([...rest.slice(0, fixedCount), toggled, ...rest.slice(fixedCount)]);
      },
    },
    {
      key: 'close',
      label: '현재 탭 닫기',
      disabled: !current || current.fixed,
      onSelect: () => current && close(current.id),
    },
    {
      key: 'others',
      label: '다른 탭 모두 닫기',
      onSelect: () => keep(tabs.filter((tab) => tab.id === active || tab.fixed)),
    },
    {
      key: 'right',
      label: '오른쪽 탭 닫기',
      disabled: activeIndex === tabs.length - 1,
      onSelect: () => keep(tabs.filter((tab, i) => i <= activeIndex || tab.fixed)),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 220 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {menus.slice(3).map((title) => (
          <Button
            key={title}
            size="sm"
            variant="neutral"
            appearance="line"
            onClick={() => open(title)}
          >
            {title} 열기
          </Button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        <WorkTab
          style={{ flex: 1 }}
          value={active}
          onChange={setActive}
          onClose={close}
          actions={actions}
        >
          {tabs.map((tab) => (
            <WorkTab.Item key={tab.id} value={tab.id} closable={!tab.fixed}>
              {tab.title}
            </WorkTab.Item>
          ))}
        </WorkTab>
        <WorkTab.ActionMenu count={tabs.length} actions={actions} />
      </div>
      <p style={{ margin: 0 }}>현재 화면: {current?.title ?? '없음'}</p>

      <Modal open={limitAlert} onClose={() => setLimitAlert(false)}>
        <Modal.Header title="알림" />
        <Modal.Body>
          <Modal.Description>
            Work Tab은 최대 {WORK_TAB_LIMIT}개까지 열 수 있습니다. 사용하지 않는 탭을 닫은 뒤 다시
            시도해 주세요.
          </Modal.Description>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setLimitAlert(false)}>확인</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

/** 열기 · 전환 · 닫기 · Tab 관리 메뉴 · 10개 초과 얼럿 */
export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: () => <WorkspaceDemo />,
};
