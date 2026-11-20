/**
 * 화면ID: [KWPC02010100] 계정관리
 * 위치: 마이페이지 > 계정관리 > 계정정보 · /mypage/account
 */
import {
  Badge,
  Button,
  HubGrid,
  HubInfo,
  HubInfoList,
  Infobox,
  PageLayout,
  Stack,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import { fetchAccountInfo } from '@/features/mypage/account.api';
import { MENU } from '@/constants/menu';
import type { AccountInfo } from '@/features/mypage/account.types';
import { MypageTabs } from '../components/MypageTabs';
import { PasswordChangeModal } from './components/PasswordChangeModal';
import { LoginHistoryModal } from './components/LoginHistoryModal';
import { AccountStatusHistoryModal } from './components/AccountStatusHistoryModal';

// 카드 폭 980 : 636 · 라벨 시작 ↔ 값 156 (라벨 칸 144 + HubInfo 간격 12)
// · 줄 간격 왼쪽 39 · 오른쪽 56 (줄 높이 20 + 간격)
const CARD_COLUMNS = [980, 636];
const LABEL_WIDTH = 144;
const LEFT_ROW_GAP = 19;
const RIGHT_ROW_GAP = 36;

/**
 * KWPC02010100 마이페이지 · 계정관리.
 * 기본 계정정보 · 비밀번호 및 로그인 보안 카드 + 계정정보 변경 안내. 정보는 조회만(직접 수정 불가)
 */
export function AccountPage() {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  /** 열린 팝업: 비밀번호 변경(KWPC02010101) · 로그인 이력(KWPC02010102) · 계정 상태 이력(KWPC02010103) */
  const [popup, setPopup] = useState<'password' | 'loginHistory' | 'statusHistory' | null>(null);
  const closePopup = () => setPopup(null);

  useEffect(() => {
    void fetchAccountInfo().then(setAccount);
  }, []);

  const line = { size: 'sm', variant: 'neutral', appearance: 'line' } as const;

  return (
    <>
      <PageLayout.Title title="마이페이지" />

      {/* 탭 · 카드 · 안내를 붙여 둔다 (탭 밑줄이 카드 위 선에 닿음) */}
      <Stack gap={0}>
        <MypageTabs current={MENU.KWPC0201} />

        {account && (
          <Stack>
            <HubGrid columns={CARD_COLUMNS}>
              <PageLayout.Section
                title="기본 계정정보"
                divider
                actions={
                  <Button {...line} onClick={() => setPopup('statusHistory')}>
                    계정 상태 이력
                  </Button>
                }
              >
                <Stack columns={2} gap={0}>
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
                </Stack>
              </PageLayout.Section>

              <PageLayout.Section
                title="비밀번호 및 로그인 보안"
                divider
                actions={
                  <>
                    <Button {...line} onClick={() => setPopup('password')}>
                      비밀번호 변경
                    </Button>
                    <Button {...line} onClick={() => setPopup('loginHistory')}>
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

            <Infobox>
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
          </Stack>
        )}
      </Stack>
      <PasswordChangeModal
        open={popup === 'password'}
        onClose={closePopup}
        onChanged={(passwordChangedAt) =>
          setAccount((prev) => (prev ? { ...prev, passwordChangedAt } : prev))
        }
      />
      <LoginHistoryModal open={popup === 'loginHistory'} onClose={closePopup} />
      <AccountStatusHistoryModal open={popup === 'statusHistory'} onClose={closePopup} />
    </>
  );
}
