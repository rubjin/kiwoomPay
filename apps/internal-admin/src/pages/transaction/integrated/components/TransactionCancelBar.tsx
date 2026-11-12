import {
  ActionBar,
  Button,
  Radio,
  RadioGroup,
  TextField,
  optionLabel,
  useDialog,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { cancelTransactions } from '@/api/transaction/integratedTransaction';

const CANCEL_TYPES = [
  { value: 'normal', label: '일반취소' },
  { value: 'offset', label: '상계취소' },
  { value: 'force', label: '강제취소' },
];

export interface TransactionCancelBarProps {
  /** 선택한 거래번호 */
  selected: string[];
  /** 조회 결과가 없을 때 등 */
  disabled?: boolean;
  /** 취소 요청 성공 후 목록 갱신 (완료 Alert 전에 기다린다) */
  onCancelled: () => Promise<void>;
}

/** 결과 제목 줄 오른쪽 취소사유 바 — 행을 선택해야 활성 (Figma 목록: 비활성 · 상세검색: 1건 선택 시 활성) */
export function TransactionCancelBar({
  selected,
  disabled,
  onCancelled,
}: TransactionCancelBarProps) {
  const dialog = useDialog();
  const [cancelType, setCancelType] = useState('normal');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const off = disabled || processing || selected.length === 0;

  const cancelSelected = async () => {
    if (!reason.trim()) {
      await dialog.alert('취소사유를 입력해주세요.');
      return;
    }
    const typeLabel = optionLabel(CANCEL_TYPES, cancelType);
    // TODO(정책) 취소 가능 상태 · 부분취소 금액 · 금액 영향 미리보기(P04 V04 · V05)는 화면설계서 확인 후
    const ok = await dialog.confirm(`선택한 거래 ${selected.length}건을 ${typeLabel}할까요?`, {
      confirmText: typeLabel,
      variant: 'danger',
    });
    if (!ok) return;
    setProcessing(true);
    try {
      await cancelTransactions(selected, cancelType, reason);
    } catch {
      setProcessing(false);
      await dialog.alert('취소 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setReason('');
    // 갱신된 목록 위에 완료 Alert를 띄운다
    await onCancelled();
    setProcessing(false);
    await dialog.alert(`${typeLabel} 요청이 완료되었습니다.`);
  };

  return (
    <ActionBar label="취소사유" style={{ flex: '1 1 0' }}>
      <TextField
        size="sm"
        fullWidth
        style={{ flex: '1 1 0' }}
        placeholder="취소사유 입력"
        disabled={off}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <RadioGroup
        size="sm"
        direction="horizontal"
        aria-label="취소 구분"
        disabled={off}
        value={cancelType}
        onChange={setCancelType}
      >
        {CANCEL_TYPES.map((t) => (
          <Radio key={t.value} value={t.value} label={t.label} />
        ))}
      </RadioGroup>
      <Button size="sm" variant="dark" disabled={off} onClick={cancelSelected}>
        선택 취소
      </Button>
    </ActionBar>
  );
}
