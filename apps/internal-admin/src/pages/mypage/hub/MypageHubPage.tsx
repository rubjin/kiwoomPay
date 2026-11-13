import {
  // 화면 틀
  PageLayout,
  // Hub 카드 · 요약 줄
  HubGrid,
  HubCard,
  HubInfoList,
  HubInfo,
  HubDivider,
  HubEmpty,
  HubSubtitle,
  HubPanel,
  HubLinkRow,
  Badge,
  Button,
  Icon,
  // 알림 (P06)
  NotificationFeed,
  type NotificationItem,
  // 흐름 훅
  useAction,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchMypageHub, markNotificationsRead } from '@/api/mypage/mypageHub';
import { MENU } from '@/constants/menu';
import type { MypageHub } from '@/types/mypage/mypageHub';
import { PermissionRequestModal } from '../components/PermissionRequestModal';
import { PERMISSION_HINT } from '../components/permissionHints';

// 카드 폭 비율 (Figma 1632 안 470 · 532 · 598)
const CARD_COLUMNS = [470, 532, 598];
// 권한관리 라벨 칸 (도움말 아이콘 포함)
const PERMISSION_LABEL_WIDTH = 152;
const RECENT_LIMIT = 5;
// 업무유형 칩 아이콘 (Figma: 리스크/FDS만) TODO(시안) 유형별 아이콘 규칙
const TYPE_ICONS: Record<string, string | undefined> = { RISK: 'info-circle' };

/**
 * KWPC2000 마이페이지 (Figma 28762:69925) — 계정관리 · 권한관리 · 알림센터 요약 Hub.
 * 알림센터 카드는 페이지 패턴 P06 Notification Feed 축약형(최근 5건).
 */
export function MypageHubPage() {
  const navigate = useNavigate();
  const [hub, setHub] = useState<MypageHub | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  // 화면 목록의 예시 보기 (?example=empty → 특수권한 없음 · 알림 없음). TODO(API) 연결 후 삭제
  const example = useSearchParams()[0].get('example');

  useEffect(() => {
    void fetchMypageHub(example).then(setHub);
  }, [example]);

  const readAll = useAction({
    confirm: () => `미확인 알림 ${hub?.notification.unread ?? 0}건을 모두 읽음 처리할까요?`,
    confirmOptions: { confirmText: '읽음 처리' },
    run: () => markNotificationsRead(),
    onSuccess: () =>
      setHub(
        (h) =>
          h && {
            ...h,
            notification: {
              unread: 0,
              // 칩은 0건으로 남긴다 (Figma 알림 없음)
              counts: h.notification.counts.map((c) => ({ ...c, count: 0 })),
              recent: h.notification.recent.map((n) => ({ ...n, unread: false })),
            },
          },
      ),
  });

  const openNotification = (item: NotificationItem) => {
    const target = hub?.notification.recent.find((n) => n.id === item.id);
    if (target?.unread) {
      void markNotificationsRead(target.id);
      setHub(
        (h) =>
          h && {
            ...h,
            notification: {
              ...h.notification,
              unread: Math.max(0, h.notification.unread - 1),
              recent: h.notification.recent.map((n) =>
                n.id === target.id ? { ...n, unread: false } : n,
              ),
            },
          },
      );
    }
    // TODO(정책) 알림 유형별 관련 업무 화면으로 이동. 지금은 알림센터
    navigate(MENU.KWPC0203);
  };

  if (!hub) return <PageLayout.Title title="마이페이지" />;
  const { account, permission, notification } = hub;
  const requestRow = (
    <HubLinkRow
      label="권한 신청 현황"
      value={`${permission.pendingRequests}건`}
      onClick={() => setRequestOpen(true)}
    />
  );

  return (
    <>
      <PageLayout.Title title="마이페이지" />
      <HubGrid columns={CARD_COLUMNS}>
        <HubCard title="계정관리" onMore={() => navigate(MENU.KWPC0201)}>
          <HubInfoList>
            <HubInfo label="사용자명">{account.userName}</HubInfo>
            <HubInfo label="로그인 ID">{account.loginId}</HubInfo>
            <HubInfo label="소속">{account.department}</HubInfo>
            <HubInfo label="계정 상태">
              <Badge size="sm" tone={account.accountStatus.tone}>
                {account.accountStatus.label}
              </Badge>
            </HubInfo>
            <HubInfo label="로그인 상태">
              <Badge size="sm" tone={account.loginStatus.tone}>
                {account.loginStatus.label}
              </Badge>
            </HubInfo>
            <HubInfo label="최근 로그인 일시">{account.lastLoginAt}</HubInfo>
            <HubInfo label="비밀번호 변경일">
              {account.passwordChangedAt}{' '}
              <HubInfo.Sub>({account.passwordAgeDays}일 경과)</HubInfo.Sub>
            </HubInfo>
          </HubInfoList>
        </HubCard>

        <HubCard title="권한관리" onMore={() => navigate(MENU.KWPC0202)}>
          <HubInfo
            label="보유 메뉴 권한"
            hint={PERMISSION_HINT.menu}
            labelWidth={PERMISSION_LABEL_WIDTH}
          >
            {permission.menuCount}개 메뉴 접근 가능
          </HubInfo>
          <HubDivider />
          <HubInfo
            label="권한 템플릿"
            hint={PERMISSION_HINT.template}
            labelWidth={PERMISSION_LABEL_WIDTH}
          >
            {permission.template}
          </HubInfo>
          <HubInfo
            label="데이터 접근범위"
            hint={PERMISSION_HINT.scope}
            labelWidth={PERMISSION_LABEL_WIDTH}
          >
            {permission.dataScope}
          </HubInfo>
          <HubDivider />
          <HubSubtitle hint={PERMISSION_HINT.special}>특수권한</HubSubtitle>
          {permission.specials.length > 0 ? (
            <>
              <HubPanel
                items={permission.specials.map((s) => ({
                  label: s.name,
                  value: `~ ${s.until} 까지`,
                }))}
              />
              {requestRow}
            </>
          ) : (
            // 특수권한 없음: 권한 신청 현황 → 빈 상태 + [특수권한 신청] (Figma 28815:71127 순서)
            <>
              {requestRow}
              <HubEmpty
                message="현재 보유 중인 특수권한이 없습니다."
                action={
                  <Button
                    size="sm"
                    variant="neutral"
                    appearance="line"
                    // TODO(정책) 특수권한 신청 화면 · 팝업
                    onClick={() => navigate(MENU.KWPC0202)}
                  >
                    특수권한 신청
                  </Button>
                }
              />
            </>
          )}
        </HubCard>

        <HubCard title="알림센터" onMore={() => navigate(MENU.KWPC0203)}>
          <NotificationFeed
            unreadCount={notification.unread}
            counts={notification.counts.map((c) => {
              const icon = TYPE_ICONS[c.type];
              return {
                key: c.type,
                label: c.label,
                count: c.count,
                icon: icon ? <Icon name={icon as 'info-circle'} size={16} /> : undefined,
              };
            })}
            items={notification.recent.map((n) => ({
              id: n.id,
              category: n.typeLabel,
              title: n.title,
              date: n.createdAt,
              unread: n.unread,
            }))}
            limit={RECENT_LIMIT}
            onReadAll={() => readAll.execute()}
            onSelect={openNotification}
          />
        </HubCard>
      </HubGrid>
      <PermissionRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </>
  );
}
