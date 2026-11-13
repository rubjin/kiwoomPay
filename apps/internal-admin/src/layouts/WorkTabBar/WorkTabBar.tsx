import { WORK_TAB_LIMIT, WorkTab, useDialog, type WorkTabAction } from '@kiwoompay/design-system';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { config } from '@/app/config';
import { screenNameOf } from '@/constants/screens';
import { useWorkTabs } from '@/store/workTabs';

/**
 * KWPC0102 Work Tab (열린 업무 화면). 화면을 열면 Tab이 생기고, Tab을 누르면 그 화면으로 이동한다.
 * TODO(이관): Tab을 바꿔도 화면 상태(검색 조건 · 입력) 유지 — 지금은 이동할 때 다시 그린다
 */
export function useWorkTabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dialog = useDialog();
  const { tabs, open, close, togglePin, keep } = useWorkTabs();
  const title = screenNameOf(pathname);

  // 화면에 들어오면 Tab 추가 (404 등 화면명이 없는 경로는 제외)
  useEffect(() => {
    if (!title) return;
    if (!open({ path: pathname, title })) {
      void dialog.alert(
        `업무 화면은 최대 ${WORK_TAB_LIMIT}개까지 열 수 있습니다. 사용하지 않는 화면을 닫아 주세요.`,
      );
    }
  }, [pathname, title, open, dialog]);

  const activeIndex = tabs.findIndex((t) => t.path === pathname);
  const current = tabs[activeIndex];

  const closeTab = (path: string) => {
    const index = tabs.findIndex((t) => t.path === path);
    close(path);
    if (path === pathname) {
      const next = tabs.filter((t) => t.path !== path);
      const neighbor = next[index] ?? next[index - 1];
      if (neighbor) navigate(neighbor.path);
    }
  };

  const actions: WorkTabAction[] = [
    {
      key: 'new',
      label: '새 업무 탭으로 열기',
      disabled: !current,
      // 같은 화면을 브라우저 새 탭으로 (TODO(정책) 같은 화면 Work Tab 복제 여부)
      onSelect: () => current && window.open(config.basename + current.path, '_blank'),
    },
    {
      key: 'pin',
      label: current?.fixed ? '탭 고정 해제' : '탭 고정',
      disabled: !current,
      onSelect: () => current && togglePin(current.path),
    },
    {
      key: 'close',
      label: '현재 탭 닫기',
      disabled: !current || current.fixed,
      onSelect: () => current && closeTab(current.path),
    },
    {
      key: 'others',
      label: '다른 탭 모두 닫기',
      onSelect: () => keep((t) => t.path === pathname),
    },
    {
      key: 'right',
      label: '오른쪽 탭 닫기',
      disabled: activeIndex === -1 || activeIndex === tabs.length - 1,
      onSelect: () => keep((_, i) => i <= activeIndex),
    },
  ];

  const workTab = (
    <WorkTab
      value={current?.path ?? ''}
      onChange={(path) => navigate(path)}
      onClose={closeTab}
      actions={actions}
    >
      {tabs.map((t) => (
        <WorkTab.Item key={t.path} value={t.path} closable={!t.fixed}>
          {t.title}
        </WorkTab.Item>
      ))}
    </WorkTab>
  );

  const workTabActions = <WorkTab.ActionMenu count={tabs.length} actions={actions} />;

  return { workTab, workTabActions };
}
