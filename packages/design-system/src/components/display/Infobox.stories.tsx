import type { Meta, StoryObj } from '@storybook/react-vite';
import { Infobox } from './Infobox';

const mail = 'pg-admin@daoudata.co.kr';
const account = (
  <Infobox.Item
    title="계정정보 변경 안내"
    actionLabel="변경 요청"
    action={<Infobox.Link href={`mailto:${mail}`}>{mail}</Infobox.Link>}
  >
    휴대전화번호·이메일 등 기본 계정정보는 직접 수정할 수 없습니다. 변경이 필요한 경우 시스템
    관리자에게 요청해 주세요.
  </Infobox.Item>
);
const history = (
  <Infobox.Item
    title="이력 확인 안내"
    actionLabel="변경 요청"
    action={<Infobox.Link href={`mailto:${mail}`}>{mail}</Infobox.Link>}
  >
    계정 상태 및 로그인 이력은 해당 영역의 이력 버튼을 통해 확인할 수 있습니다.
  </Infobox.Item>
);

const stack = { display: 'grid', gap: 'var(--kp-space-24)', width: 1242 };

const meta = {
  title: 'Components/Infobox',
  component: Infobox,
  args: { tone: 'info', children: account },
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'neutral'] },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ width: 1242 }}>
      <Infobox {...args} />
    </div>
  ),
} satisfies Meta<typeof Infobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Info · Neutral × 한 줄 · 여러 줄 (시안) */
export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={stack}>
      <Infobox>{account}</Infobox>
      <Infobox>
        {account}
        {history}
      </Infobox>
      <Infobox tone="neutral">{account}</Infobox>
      <Infobox tone="neutral">
        {account}
        {history}
      </Infobox>
    </div>
  ),
};

/** 오른쪽 영역 없음 · 제목 없음(한 줄 안내) · 좁은 폭(설명 줄바꿈) */
export const Variations: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...stack, width: 640 }}>
      <Infobox>
        <Infobox.Item title="조회 안내">최근 3개월 거래만 조회할 수 있습니다.</Infobox.Item>
      </Infobox>
      <Infobox>
        <Infobox.Item>
          대용량 파일은 비동기로 생성되며, 완료 후 목록에서 다운로드할 수 있습니다.
        </Infobox.Item>
      </Infobox>
      <Infobox>{account}</Infobox>
    </div>
  ),
};

/**
 * 쓰임별 톤 (사용자 확정):
 * 화면 전체에 대한 안내 = info(배경 #F0F7FC · 테두리 #BDDDF1),
 * 표 · 섹션에 대한 안내 = neutral(배경 #F8FAFC · 테두리 #D5DCE5).
 * 설명 13 Regular #435064 · 제목 13 SemiBold #111827 · 제목 ↔ 설명 8.
 * 같은 내용의 안내 여러 개는 아이콘 하나 + 점 목록(bullets)
 */
export const Usage: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...stack, width: 880 }}>
      {/* 화면 전체 — 설명만 */}
      <Infobox>
        <Infobox.Item>
          대용량 파일은 비동기로 생성되며, 완료 후 목록에서 다운로드할 수 있습니다. 처리 결과는
          알림센터에서 안내합니다.
        </Infobox.Item>
      </Infobox>
      {/* 표 · 섹션 — 설명만, 여러 개는 점 목록 */}
      <Infobox tone="neutral">
        <Infobox.Item
          bullets={[
            '미사용 메뉴는 권한 보유와 관계없이 미노출 및 직접 접근 차단',
            '상위메뉴가 미사용이면 하위메뉴에도 적용하되 기존 메뉴 · 권한 설정 유지',
            '3Depth 메뉴에 사용 이력이 있으면 삭제 불가, 미사용 처리',
          ]}
        />
      </Infobox>
      {/* 제목 있음 — 한 줄 */}
      <Infobox>
        <Infobox.Item title="조회 안내">최근 3개월 거래만 조회할 수 있습니다.</Infobox.Item>
      </Infobox>
      {/* 제목 있음 — 제목 아래 점 목록 (간격 8) */}
      <Infobox tone="neutral">
        <Infobox.Item
          title="처리 안내"
          bullets={[
            '지급보류된 원장은 보류해제 전까지 지급되지 않습니다.',
            '보류 사유는 처리 이력에 남습니다.',
          ]}
        />
      </Infobox>
    </div>
  ),
};
