import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button';
import { DialogProvider, useDialog } from './DialogProvider';

const meta = {
  title: 'Composites/Feedback/Dialog',
  parameters: { controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function DialogDemo() {
  const dialog = useDialog();
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="neutral" appearance="line" onClick={() => dialog.alert('저장되었습니다.')}>
        alert
      </Button>
      <Button
        onClick={async () => {
          const ok = await dialog.confirm('선택한 원장 2건을 지급확정할까요?', {
            confirmText: '지급확정',
          });
          await dialog.alert(ok ? '지급확정되었습니다.' : '취소했습니다.');
        }}
      >
        confirm → alert
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          dialog.confirm('선택한 거래를 강제취소할까요?', {
            variant: 'danger',
            confirmText: '강제취소',
          })
        }
      >
        confirm (danger)
      </Button>
    </div>
  );
}

/**
 * Dialog (useDialog): 성공 · 실패 안내는 Alert로 통일 (Toast 없음). 앱 최상위에 DialogProvider 한 번.
 * alert → Promise<void>, confirm → Promise<boolean>
 */
export const Playground: Story = {
  render: () => (
    <DialogProvider>
      <DialogDemo />
    </DialogProvider>
  ),
};
