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
  Tab,
  TextButton,
  Stack,
  Text,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import { fetchPermissionOverview } from '@/features/mypage/permission.api';
import { fetchPermissionRequests } from '@/features/mypage/permissionRequest.api';
import { MENU } from '@/constants/menu';
import type { PermissionOverview } from '@/features/mypage/permission.types';
import type { PermissionRequest } from '@/features/mypage/permissionRequest.types';
import { rangeOfQuickPeriod } from '@/utils/period';
import { MypageTabs } from '../components/MypageTabs';
import {
  PERMISSION_REQUEST_COLUMNS,
  PermissionRequestModal,
} from '../components/PermissionRequestModal';
import { PERMISSION_HINT } from '../components/permissionHints';
import { SpecialPermissionRequestModal } from './components/SpecialPermissionRequestModal';
import { ExceptionPermissionModal } from './components/ExceptionPermissionModal';
import { MenuPermissionRequestModal } from './components/MenuPermissionRequestModal';
import { fetchPermissionChanges } from '@/features/mypage/permissionChange.api';
import type { PermissionChange } from '@/features/mypage/permissionChange.types';
import {
  PERMISSION_CHANGE_COLUMNS,
  PermissionChangeModal,
  createPermissionChangeParams,
} from '../components/PermissionChangeModal';

// 첫 줄 카드 1083 : 532 · 셋째 줄 같은 폭 · 카드 줄 사이 16
const TOP_COLUMNS = [1083, 532];
const BOTTOM_COLUMNS = [1, 1];
const LABEL_WIDTH = 144; // 라벨 시작 ↔ 값 156 (+ HubInfo 간격 12)
const INFO_ROW_GAP = 13; // 줄 높이 20 + 13 = 33
const RECENT_LIMIT = 3;
// 특수권한 줄: 이름 ↔ 상태 ↔ 기간 (시안 345 · 195), 줄 간격 32
const SPECIAL_COLUMNS = '345px 195px 1fr';

/**
 * KWPC02020000 마이페이지 · 권한관리.
 * 나의 권한 현황 · 기본 권한 정보 → 권한 신청 현황(최근 3건) · 권한 변경 이력 탭 → 메뉴 및 기능 권한 · 특수권한
 */
export function PermissionPage() {
  const [overview, setOverview] = useState<PermissionOverview | null>(null);
  const [recent, setRecent] = useState<{ items: PermissionRequest[]; total: number } | null>(null);
  const [recentChanges, setRecentChanges] = useState<{
    items: PermissionChange[];
    total: number;
  } | null>(null);
  const [changeOpen, setChangeOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState('request');
  const [requestOpen, setRequestOpen] = useState(false);
  const [specialOpen, setSpecialOpen] = useState(false);
  const [exceptionOpen, setExceptionOpen] = useState(false);
  const [menuRequestOpen, setMenuRequestOpen] = useState(false);

  useEffect(() => {
    void fetchPermissionOverview().then(setOverview);
    // 최근 신청 내역: 팝업 기본 조건(최근 1개월 · 전체)의 앞 3건
    void fetchPermissionRequests({
      params: { period: rangeOfQuickPeriod('1m'), type: 'all', status: 'all' },
      page: 1,
      pageSize: RECENT_LIMIT,
    }).then(setRecent);
    // 최근 변경 이력: 팝업 기본 조건(최근 1개월 · 전체)의 앞 3건
    void fetchPermissionChanges({
      params: createPermissionChangeParams(),
      page: 1,
      pageSize: RECENT_LIMIT,
    }).then(setRecentChanges);
  }, []);

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
                    <Text>최근 신청 내역 · 총 {recent.total}건</Text>
                    <TextButton size="sm" onClick={() => setRequestOpen(true)}>
                      상세보기
                    </TextButton>
                  </ControlGroup>
                )}
                {historyTab === 'change' && recentChanges && (
                  <ControlGroup spacing="lg">
                    <Text>최근 변경 이력 · 총 {recentChanges.total}건</Text>
                    <TextButton size="sm" onClick={() => setChangeOpen(true)}>
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
                // 최근 변경 이력 3건 (열은 권한 변경 이력 팝업과 같음, 임의 작업 — 탭 내용 시안 없음)
                <GridPlaceholder
                  columns={PERMISSION_CHANGE_COLUMNS}
                  rows={recentChanges?.items ?? []}
                  rowKey={(r) => r.id}
                  empty="최근 변경 이력이 없습니다."
                />
              )}
            </PageLayout.Section>

            <HubGrid columns={BOTTOM_COLUMNS}>
              <PageLayout.Section
                title="메뉴 및 기능 권한"
                titleAddon={<InfoTip content={PERMISSION_HINT.menu} />}
                divider
                actions={
                  <Button {...line} onClick={() => setMenuRequestOpen(true)}>
                    권한 신청
                  </Button>
                }
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Stack gap={8}>
                    <HubSubtitle>보유 기능 권한</HubSubtitle>
                    <Text as="p">
                      현재 적용된 메뉴별 기능 권한 및 부여 구분을 팝업에서 확인할 수 있습니다.
                    </Text>
                  </Stack>
                  <Button size="sm" variant="dark" onClick={() => setExceptionOpen(true)}>
                    보유 기능 권한 보기
                  </Button>
                </div>
              </PageLayout.Section>

              <PageLayout.Section
                title="특수권한"
                titleAddon={<InfoTip content={PERMISSION_HINT.special} />}
                divider
                actions={
                  <Button {...line} onClick={() => setSpecialOpen(true)}>
                    특수권한 신청
                  </Button>
                }
              >
                <Stack gap={12}>
                  {overview.specials.map((s) => (
                    <Text
                      key={s.name}
                      as="div"
                      variant="body-sm"
                      tone="body"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: SPECIAL_COLUMNS,
                        alignItems: 'center',
                      }}
                    >
                      <span>{s.name}</span>
                      <span>
                        <Badge size="sm" tone={s.status.tone}>
                          {s.status.label}
                        </Badge>
                      </span>
                      <span>{s.period}</span>
                    </Text>
                  ))}
                </Stack>
              </PageLayout.Section>
            </HubGrid>
          </Stack>
        )}
      </Stack>

      <PermissionRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
      <SpecialPermissionRequestModal open={specialOpen} onClose={() => setSpecialOpen(false)} />
      <ExceptionPermissionModal open={exceptionOpen} onClose={() => setExceptionOpen(false)} />
      <MenuPermissionRequestModal
        open={menuRequestOpen}
        onClose={() => setMenuRequestOpen(false)}
      />
      <PermissionChangeModal open={changeOpen} onClose={() => setChangeOpen(false)} />
    </>
  );
}
