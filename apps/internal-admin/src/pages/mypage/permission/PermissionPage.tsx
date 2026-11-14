import {
  Badge,
  Button,
  ControlGroup,
  GridPlaceholder,
  HubGrid,
  HubInfo,
  HubInfoList,
  HubStats,
  HubSubtitle,
  InfoTip,
  PageLayout,
  StatusView,
  Tab,
  TextButton,
  useDialog,
  Stack,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import { fetchPermissionOverview } from '@/api/mypage/permission';
import { fetchPermissionRequests } from '@/api/mypage/permissionRequest';
import { MENU } from '@/constants/menu';
import type { PermissionOverview } from '@/types/mypage/permission';
import type { PermissionRequest } from '@/types/mypage/permissionRequest';
import { rangeOfQuickPeriod } from '@/utils/period';
import { MypageTabs } from '../components/MypageTabs';
import {
  PERMISSION_REQUEST_COLUMNS,
  PermissionRequestModal,
} from '../components/PermissionRequestModal';
import { PERMISSION_HINT } from '../components/permissionHints';

// 시안 권한관리.png 측정: 첫 줄 카드 1083 : 532 · 셋째 줄 같은 폭 · 카드 줄 사이 16
const TOP_COLUMNS = [1083, 532];
const BOTTOM_COLUMNS = [1, 1];
const LABEL_WIDTH = 144; // 라벨 시작 ↔ 값 156 (+ HubInfo 간격 12)
const INFO_ROW_GAP = 13; // 줄 높이 20 + 13 = 33
const RECENT_LIMIT = 3;
// 특수권한 줄: 이름 ↔ 상태 ↔ 기간 (시안 345 · 195), 줄 간격 32
const SPECIAL_COLUMNS = '345px 195px 1fr';

const caption = { margin: 0, fontSize: 12, color: 'var(--kp-color-text-secondary)' } as const;

/**
 * KWPC02020000 마이페이지 · 권한관리 (시안 temp/페이지/마이페이지/권한관리.png).
 * 나의 권한 현황 · 기본 권한 정보 → 권한 신청 현황(최근 3건) · 권한 변경 이력 탭 → 메뉴 및 기능 권한 · 특수권한
 */
export function PermissionPage() {
  const dialog = useDialog();
  const [overview, setOverview] = useState<PermissionOverview | null>(null);
  const [recent, setRecent] = useState<{ items: PermissionRequest[]; total: number } | null>(null);
  const [historyTab, setHistoryTab] = useState('request');
  const [requestOpen, setRequestOpen] = useState(false);

  useEffect(() => {
    void fetchPermissionOverview().then(setOverview);
    // 최근 신청 내역: 팝업 기본 조건(최근 1개월 · 전체)의 앞 3건
    void fetchPermissionRequests({
      params: { period: rangeOfQuickPeriod('1m'), type: 'all', status: 'all' },
      page: 1,
      pageSize: RECENT_LIMIT,
    }).then(setRecent);
  }, []);

  // TODO(시안) 메뉴 권한 신청(KWPC02020002) · 특수권한 신청(KWPC02020004) · 개별 권한(KWPC02020001) 팝업
  const notReady = (name: string) => dialog.alert(`${name} 팝업은 준비 중입니다.`);
  const line = { size: 'sm', variant: 'neutral', appearance: 'line' } as const;

  return (
    <>
      <PageLayout.Title title="마이페이지" />

      <Stack gap={0}>
        <MypageTabs current={MENU.KWPC0202} />

        {overview && (
          <Stack>
            <HubGrid columns={TOP_COLUMNS}>
              <PageLayout.Section
                title="나의 권한 현황"
                titleAddon={
                  <Badge size="sm" tone="primary">
                    현재 설정
                  </Badge>
                }
                divider
              >
                <HubStats
                  items={[
                    { label: '권한 템플릿', value: overview.template },
                    { label: '접근 가능 메뉴', value: `${overview.menuCount}개` },
                    { label: '조회 CPID 범위', value: overview.cpidScope },
                    {
                      label: '사용 중 특수권한',
                      value: `${overview.specialInUse} / ${overview.specialTotal}`,
                    },
                    {
                      label: '권한 신청 현황',
                      value: `${overview.pendingRequests}건`,
                      onClick: () => setRequestOpen(true),
                    },
                  ]}
                />
              </PageLayout.Section>

              <PageLayout.Section
                title="기본 권한 정보"
                titleAddon={<InfoTip content={PERMISSION_HINT.basic} />}
                divider
              >
                <HubInfoList gap={INFO_ROW_GAP}>
                  <HubInfo label="소속" labelWidth={LABEL_WIDTH}>
                    {overview.department}
                  </HubInfo>
                  <HubInfo label="사용자 유형" labelWidth={LABEL_WIDTH}>
                    {overview.userType}
                  </HubInfo>
                  <HubInfo label="템플릿 적용일" labelWidth={LABEL_WIDTH}>
                    {overview.templateAppliedAt}
                  </HubInfo>
                </HubInfoList>
              </PageLayout.Section>
            </HubGrid>

            <PageLayout.Section>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Tab size="sm" value={historyTab} onChange={setHistoryTab} aria-label="권한 이력">
                  <Tab.Item value="request">권한 신청 현황</Tab.Item>
                  <Tab.Item value="change">권한 변경 이력</Tab.Item>
                </Tab>
                {historyTab === 'request' && recent && (
                  <ControlGroup spacing="lg">
                    <span style={caption}>최근 신청 내역 · 총 {recent.total}건</span>
                    <TextButton size="sm" onClick={() => setRequestOpen(true)}>
                      상세보기
                    </TextButton>
                  </ControlGroup>
                )}
              </div>
              {historyTab === 'request' ? (
                <GridPlaceholder
                  columns={PERMISSION_REQUEST_COLUMNS}
                  rows={recent?.items ?? []}
                  rowKey={(r) => r.id}
                  empty="최근 신청 내역이 없습니다."
                />
              ) : (
                // TODO(시안) 권한 변경 이력 탭 내용 (IA KWPC02020200 권한 변경이력) — 임의 작업
                <StatusView
                  status="idle"
                  title="권한 변경 이력"
                  description="시안 확인 후 작업합니다."
                />
              )}
            </PageLayout.Section>

            <HubGrid columns={BOTTOM_COLUMNS}>
              <PageLayout.Section
                title="메뉴 및 기능 권한"
                titleAddon={<InfoTip content={PERMISSION_HINT.menu} />}
                divider
                actions={
                  <Button {...line} onClick={() => notReady('권한 신청')}>
                    권한 신청
                  </Button>
                }
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Stack gap={8}>
                    <HubSubtitle>보유 기능 권한</HubSubtitle>
                    <p style={caption}>
                      현재 적용된 메뉴별 기능 권한 및 부여 구분을 팝업에서 확인할 수 있습니다.
                    </p>
                  </Stack>
                  <Button size="sm" variant="dark" onClick={() => notReady('보유 기능 권한')}>
                    보유 기능 권한 보기
                  </Button>
                </div>
              </PageLayout.Section>

              <PageLayout.Section
                title="특수권한"
                titleAddon={<InfoTip content={PERMISSION_HINT.special} />}
                divider
                actions={
                  <Button {...line} onClick={() => notReady('특수권한 신청')}>
                    특수권한 신청
                  </Button>
                }
              >
                <Stack gap={12}>
                  {overview.specials.map((s) => (
                    <div
                      key={s.name}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: SPECIAL_COLUMNS,
                        alignItems: 'center',
                        fontSize: 13,
                        color: 'var(--kp-color-text-body)',
                      }}
                    >
                      <span>{s.name}</span>
                      <span>
                        <Badge size="sm" tone={s.status.tone}>
                          {s.status.label}
                        </Badge>
                      </span>
                      <span>{s.period}</span>
                    </div>
                  ))}
                </Stack>
              </PageLayout.Section>
            </HubGrid>
          </Stack>
        )}
      </Stack>

      <PermissionRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </>
  );
}
