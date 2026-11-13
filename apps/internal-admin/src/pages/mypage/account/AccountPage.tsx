import {
  Badge,
  Button,
  HubGrid,
  HubInfo,
  HubInfoList,
  Infobox,
  PageLayout,
  useDialog,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import { fetchAccountInfo } from '@/api/mypage/account';
import { MENU } from '@/constants/menu';
import type { AccountInfo } from '@/types/mypage/account';
import { MypageTabs } from '../components/MypageTabs';

// 시안 계정관리.png 측정: 카드 폭 980 : 636 · 라벨 시작 ↔ 값 156 (라벨 칸 144 + HubInfo 간격 12)
// · 줄 간격 왼쪽 39 · 오른쪽 56 (줄 높이 20 + 간격)
const CARD_COLUMNS = [980, 636];
const LABEL_WIDTH = 144;
const LEFT_ROW_GAP = 19;
const RIGHT_ROW_GAP = 36;
// 기본 계정정보 두 열 (시안 489 : 457)
const INFO_COLUMNS = 'minmax(0, 489fr) minmax(0, 457fr)';

/**
 * KWPC02010100 마이페이지 · 계정관리 (시안 temp/페이지/마이페이지/계정관리.png).
 * 기본 계정정보 · 비밀번호 및 로그인 보안 카드 + 계정정보 변경 안내. 정보는 조회만(직접 수정 불가)
 */
export function AccountPage() {
  const dialog = useDialog();
  const [account, setAccount] = useState<AccountInfo | null>(null);

  useEffect(() => {
    void fetchAccountInfo().then(setAccount);
  }, []);

  // TODO(시안) 계정 상태 이력(KWPC02010103) · 비밀번호 변경(KWPC02010101) · 로그인 이력(KWPC02010102) 팝업
  const notReady = (name: string) => dialog.alert(`${name} 팝업은 준비 중입니다.`);
  const line = { size: 'sm', variant: 'neutral', appearance: 'line' } as const;

  return (
    <>
      <PageLayout.Title title="마이페이지" />

      {/* 탭 · 카드 · 안내를 붙여 둔다 (탭 밑줄이 카드 위 선에 닿음) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <MypageTabs current={MENU.KWPC0201} />

        {account && (
          <>
            <HubGrid columns={CARD_COLUMNS}>
              <PageLayout.Section
                title="기본 계정정보"
                divider
                actions={
                  <Button {...line} onClick={() => notReady('계정 상태 이력')}>
                    계정 상태 이력
                  </Button>
                }
              >
                <div style={{ display: 'grid', gridTemplateColumns: INFO_COLUMNS }}>
                  <HubInfoList gap={LEFT_ROW_GAP}>
                    <HubInfo label="사용자명" labelWidth={LABEL_WIDTH}>
                      {account.userName}
                    </HubInfo>
                    <HubInfo label="소속" labelWidth={LABEL_WIDTH}>
                      {account.department}
                    </HubInfo>
                    <HubInfo label="계정 상태" labelWidth={LABEL_WIDTH}>
                      <Badge size="sm" tone={account.accountStatus.tone}>
                        {account.accountStatus.label}
                      </Badge>
                    </HubInfo>
                    <HubInfo label="계정 생성일" labelWidth={LABEL_WIDTH}>
                      {account.createdAt}
                    </HubInfo>
                  </HubInfoList>
                  <HubInfoList gap={LEFT_ROW_GAP}>
                    <HubInfo label="로그인 ID" labelWidth={LABEL_WIDTH}>
                      {account.loginId}
                    </HubInfo>
                    <HubInfo label="휴대전화 번호" labelWidth={LABEL_WIDTH}>
                      {account.phone}
                    </HubInfo>
                    <HubInfo label="이메일 주소" labelWidth={LABEL_WIDTH}>
                      {account.email}
                    </HubInfo>
                  </HubInfoList>
                </div>
              </PageLayout.Section>

              <PageLayout.Section
                title="비밀번호 및 로그인 보안"
                divider
                actions={
                  <>
                    <Button {...line} onClick={() => notReady('비밀번호 변경')}>
                      비밀번호 변경
                    </Button>
                    <Button {...line} onClick={() => notReady('로그인 이력')}>
                      로그인 이력
                    </Button>
                  </>
                }
              >
                <HubInfoList gap={RIGHT_ROW_GAP}>
                  <HubInfo label="비밀번호 변경일" labelWidth={LABEL_WIDTH}>
                    {account.passwordChangedAt}
                  </HubInfo>
                  <HubInfo label="최근 로그인 일시" labelWidth={LABEL_WIDTH}>
                    {account.lastLoginAt}
                  </HubInfo>
                  <HubInfo label="최근 로그인 IP" labelWidth={LABEL_WIDTH}>
                    {account.lastLoginIp}
                  </HubInfo>
                </HubInfoList>
              </PageLayout.Section>
            </HubGrid>

            <Infobox style={{ marginTop: 'var(--kp-space-16)' }}>
              <Infobox.Item
                title="계정정보 변경 안내"
                actionLabel="변경 요청"
                action={
                  <Infobox.Link href={`mailto:${account.adminEmail}`}>
                    {account.adminEmail}
                  </Infobox.Link>
                }
              >
                휴대전화번호·이메일 등 기본 계정정보는 직접 수정할 수 없습니다. 변경이 필요한 경우
                시스템 관리자에게 요청해 주세요.
              </Infobox.Item>
            </Infobox>
          </>
        )}
      </div>
    </>
  );
}
