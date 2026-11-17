import {
  // 화면 틀
  PageLayout,
  SectionHeading,
  Button,
  Icon,
  // 조회 조건 · 결과 (P01)
  SearchPanel,
  Field,
  DateRangeField,
  SelectBox,
  SearchField,
  StatusView,
  ResultFooter,
  Pagination,
  useSearchResult,
  // 알림 (P06)
  NotificationSummary,
  NotificationAccordion,
  NotificationDetail,
  HighlightText,
  useDialog,
} from '@kiwoompay/design-system';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotifications,
  fetchUnreadSummary,
  readNotifications,
} from '@/features/mypage/notification.api';
import type {
  Notification,
  NotificationParams,
  NotificationUnreadSummary,
} from '@/features/mypage/notification.types';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import { codeLabel } from '@/utils/code';
import { rangeOfQuickPeriod } from '@/utils/period';

/** 확인상태 선택지 (화면 전용) */
const READ_STATES = [
  { value: 'all', label: '전체' },
  { value: 'unread', label: '미확인' },
  { value: 'read', label: '확인' },
];

/** 업무유형 칩 아이콘 (Figma는 리스크/FDS만) */
const TYPE_ICONS: Record<string, 'info-circle' | undefined> = { RISK: 'info-circle' };

/** 기본 수신기간: 최근 3개월 (Figma 06-16 ~ 09-16) */
const createInitialParams = (): NotificationParams => ({
  period: rangeOfQuickPeriod('3m'),
  type: 'all',
  readState: 'all',
  keyword: '',
});

// 검색어 칸 (Figma 500)
const KEYWORD_FIELD = { width: 500 };

/**
 * KWPC02030000 마이페이지 · 알림센터 (Figma 29008:79135) — P01 조회 + P06 알림.
 * 미확인 요약 · 조회 조건 한 카드 → 알림 목록(아코디언, 누르면 펼치고 읽음) → Total · Pagination.
 * 내 알림이라 진입 시 바로 조회 (다운로드 센터와 같은 예외, TODO(정책))
 */
export function NotificationCenterPage() {
  const dialog = useDialog();
  const navigate = useNavigate();
  const types = useCodeOptions('NOTIFICATION_TYPE');
  const typeOptions = [{ value: 'all', label: '전체' }, ...types];

  const [summary, setSummary] = useState<NotificationUnreadSummary | null>(null);
  const loadSummary = useCallback(() => void fetchUnreadSummary().then(setSummary), []);
  useEffect(loadSummary, [loadSummary]);

  const result = useSearchResult({
    initialParams: createInitialParams(),
    fetch: fetchNotifications,
    autoSearch: true,
  });
  const { params, setParam } = result;
  const keyword = result.appliedParams?.keyword;
  const [expanded, setExpanded] = useState<string | null>(null);
  // 화면에서 읽음 처리한 알림 (다시 조회하기 전까지 목록에 반영)
  const [readIds, setReadIds] = useState<string[]>([]);

  const toggle = async (item: Notification, open: boolean) => {
    setExpanded(open ? item.id : null);
    if (open && item.unread && !readIds.includes(item.id)) {
      setReadIds((ids) => [...ids, item.id]);
      await readNotifications(item.id);
      loadSummary();
    }
  };

  const readAll = async () => {
    const ok = await dialog.confirm('미확인 알림을 모두 읽음으로 처리할까요?');
    if (!ok) return;
    await readNotifications();
    loadSummary();
    void result.refresh();
  };

  const search = () => {
    setExpanded(null);
    setReadIds([]);
    void result.search();
  };

  return (
    <>
      <PageLayout.Title title="알림센터" />

      <SearchPanel
        actionsPlacement="inline"
        header={
          <NotificationSummary
            unreadCount={summary?.unread ?? 0}
            counts={(summary?.counts ?? []).map((c) => {
              const icon = TYPE_ICONS[c.type];
              return {
                key: c.type,
                label: codeLabel('NOTIFICATION_TYPE', c.type),
                count: c.count,
                icon: icon ? <Icon name={icon} size={16} /> : undefined,
              };
            })}
            onReadAll={readAll}
          />
        }
        onSearch={search}
        onReset={result.reset}
        loading={result.loading}
      >
        <Field label="수신기간">
          <DateRangeField value={params.period} onChange={(period) => setParam('period', period)} />
        </Field>
        <Field label="업무유형">
          <SelectBox
            options={typeOptions}
            value={params.type}
            onChange={(type) => setParam('type', type)}
          />
        </Field>
        <Field label="확인상태">
          <SelectBox
            options={READ_STATES}
            value={params.readState}
            onChange={(readState) => setParam('readState', readState)}
          />
        </Field>
        <Field label="검색어" style={KEYWORD_FIELD}>
          <SearchField
            fullWidth
            placeholder="알림 제목 · 내용을 입력해 주세요"
            value={params.keyword}
            onChange={(e) => setParam('keyword', e.target.value)}
          />
        </Field>
      </SearchPanel>

      <SectionHeading size="md" as="h2" title="알림 목록" />
      {result.status === 'success' ? (
        <NotificationAccordion
          expandedId={expanded}
          onToggle={(item, open) => {
            const notification = result.items.find((n) => n.id === item.id);
            if (notification) void toggle(notification, open);
          }}
          empty="조회된 알림이 없습니다."
          items={result.items.map((n) => ({
            id: n.id,
            category: codeLabel('NOTIFICATION_TYPE', n.type),
            title: <HighlightText text={n.title} query={keyword} />,
            date: n.createdAt,
            // 펼친 동안은 미확인 모양 유지 (Figma 미확인·펼침), 접으면 읽음으로
            unread: n.unread && (!readIds.includes(n.id) || expanded === n.id),
            detail: (
              <NotificationDetail
                message={n.message}
                related={
                  n.related && {
                    path: n.related.path,
                    action: (
                      <Button
                        variant="neutral"
                        appearance="line"
                        onClick={() => n.related && navigate(n.related.to)}
                      >
                        {n.related.label}
                      </Button>
                    ),
                  }
                }
                meta={[
                  { label: '알림유형', value: n.alertType },
                  { label: '업무유형', value: codeLabel('NOTIFICATION_TYPE', n.type) },
                  { label: '발생일시', value: n.createdAt },
                  { label: '알림ID', value: n.alertNo },
                ]}
              />
            ),
          }))}
        />
      ) : (
        <StatusView status={result.status === 'idle' ? 'loading' : result.status} />
      )}

      <ResultFooter total={result.total}>
        <Pagination
          totalPages={result.totalPages}
          page={result.page}
          onChange={(page) => {
            setExpanded(null);
            result.setPage(page);
          }}
          disabled={result.status !== 'success'}
        />
      </ResultFooter>
    </>
  );
}
