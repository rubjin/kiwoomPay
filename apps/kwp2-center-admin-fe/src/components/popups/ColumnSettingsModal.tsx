/**
 * 화면ID: (IA에 없음) 표시항목설정 팝업
 * 위치: 조회 화면 결과 제목 줄 [표시항목설정] — 통합 거래내역 · 가맹점 정산 실행/처리 (팝업, 여러 화면 공통)
 */
import {
  Button,
  ColumnPicker,
  Modal,
  useAction,
  type ColumnPickerItem,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';

interface ColumnSettingsModalProps {
  open: boolean;
  /** 모든 열 (지금 순서) */
  items: ColumnPickerItem[];
  /** 지금 보이는 열 */
  value: string[];
  /** 기본 열 · 순서 ([초기화] 기준) */
  defaultItems: ColumnPickerItem[];
  onApply: (items: ColumnPickerItem[], value: string[]) => void;
  onClose: () => void;
}

/**
 * 표시항목설정 — 결과 표에 보일 열 · 순서 (디자인 시스템 ColumnPicker). 화면 쪽 상태는 hooks/useColumnSettings.
 * (임의 작업) TODO(시안) 팝업 시안 없음 — 엑셀 다운로드 설정(P07 V02)과 같은 틀 · Modal lg.
 * TODO(API) 사용자별 표시항목 저장 — 지금은 화면을 닫으면 처음으로
 */
export function ColumnSettingsModal({
  open,
  items,
  value,
  defaultItems,
  onApply,
  onClose,
}: ColumnSettingsModalProps) {
  const [draftItems, setDraftItems] = useState(items);
  const [draftValue, setDraftValue] = useState(value);

  // 열 때마다 지금 표 상태로 시작
  useEffect(() => {
    if (!open) return;
    setDraftItems(items);
    setDraftValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 열릴 때만
  }, [open]);

  const apply = useAction({
    validate: () => (draftValue.length === 0 ? '표시할 항목을 1개 이상 선택해주세요.' : null),
    run: async () => onApply(draftItems, draftValue),
    onSuccess: onClose,
  });

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header title="표시항목설정" closeButton />
      <Modal.Body>
        <ColumnPicker
          description="표에 보여줄 항목을 선택하고, 항목의 순서를 변경할 수 있어요."
          items={draftItems}
          onItemsChange={setDraftItems}
          value={draftValue}
          onChange={setDraftValue}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          onClick={() => {
            setDraftItems(defaultItems);
            setDraftValue(defaultItems.map((i) => i.value));
          }}
        >
          초기화
        </Button>
        <Button size="lg" variant="neutral" appearance="line" onClick={onClose}>
          취소
        </Button>
        <Button size="lg" onClick={() => void apply.execute()}>
          적용
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
