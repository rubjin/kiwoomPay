import {
  ActionBar,
  Button,
  Radio,
  RadioGroup,
  TextField,
  optionLabel,
  useAction,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { cancelTransactions } from '@/features/transaction/integratedTransaction.api';
import { useCodeOptions } from '@/hooks/useCodeOptions';

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
  const cancelTypes = useCodeOptions('CANCEL_TYPE');
  const [cancelType, setCancelType] = useState('normal');
  const [reason, setReason] = useState('');
  const typeLabel = optionLabel(cancelTypes, cancelType);

  // TODO(정책) 취소 가능 상태 · 부분취소 금액 · 금액 영향 미리보기(P04 V04 · V05)는 화면설계서 확인 후
  const cancel = useAction({
    validate: () => (!reason.trim() ? '취소사유를 입력해주세요.' : null),
    confirm: `선택한 거래 ${selected.length}건을 ${typeLabel}할까요?`,
    confirmOptions: { confirmText: typeLabel, variant: 'danger' },
    run: () => cancelTransactions(selected, cancelType, reason),
    // 갱신된 목록 위에 완료 Alert를 띄운다
    onSuccess: async () => {
      setReason('');
      await onCancelled();
    },
    success: `${typeLabel} 요청이 완료되었습니다.`,
    failure: '취소 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  });
  const off = disabled || cancel.loading || selected.length === 0;

  return (
    <ActionBar label="취소사유" grow>
      <TextField
        size="sm"
        fullWidth
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
        {cancelTypes.map((t) => (
          <Radio key={t.value} value={t.value} label={t.label} />
        ))}
      </RadioGroup>
      <Button size="sm" variant="dark" disabled={off} onClick={() => void cancel.execute()}>
        선택 취소
      </Button>
    </ActionBar>
  );
}
