import { Header as HeaderBase } from '@kiwoompay/design-system';

// KWPC0102 헤더. TODO(이관): 사용자 정보 · 세션 타이머 · 마스킹 상태는 store/auth와 API로 연결, 마스킹 해제 팝업
export function Header() {
  return (
    <HeaderBase>
      <HeaderBase.Search />
      <HeaderBase.UserInfo
        items={[
          { label: '아이디', value: 'kw*******' },
          { label: '이름', value: '홍*동' },
          { label: '소속', value: 'PG운영팀' },
          { label: '권한', value: '관리자' },
        ]}
      />
      <HeaderBase.Divider />
      <HeaderBase.Session remaining={3 * 3600} />
      <HeaderBase.Divider />
      <HeaderBase.Masking />
      <HeaderBase.Divider />
      <HeaderBase.Download />
      <HeaderBase.Actions>
        <HeaderBase.IconButton icon="user" label="내 정보" />
        <HeaderBase.IconButton icon="bell" label="알림" />
        <HeaderBase.IconButton icon="power" label="로그아웃" />
      </HeaderBase.Actions>
    </HeaderBase>
  );
}
