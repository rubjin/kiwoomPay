/**
 * 화면ID: [KWPC02020004] 특수권한 신청 팝업
 * 위치: 마이페이지 > 권한관리 · /mypage/permission (팝업)
 */
import {
  // 팝업 틀 · 배치
  Modal,
  Button,
  Stack,
  ControlGroup,
  // 대상 표 · 입력
  GridPlaceholder,
  Badge,
  Field,
  DateField,
  TextArea,
  type BadgeTone,
  type GridPlaceholderColumn,
  // 처리 흐름 (P04)
  useAction,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import {
  fetchSpecialPermissionOptions,
  requestSpecialPermission,
} from '@/features/mypage/specialPermission.api';
import type {
  SpecialPermissionOption,
  SpecialPermissionState,
} from '@/features/mypage/specialPermission.types';
import { orDash } from '@/utils/format';

const STATE_BADGE: Record<SpecialPermissionState, { label: string; tone: BadgeTone }> = {
  IN_USE: { label: '사용 중', tone: 'success' },
  PENDING: { label: '승인대기', tone: 'warning' },
  NONE: { label: '미보유', tone: 'neutral' },
  // (임의 작업) 만료 Badge 색 — 시안 없음
  EXPIRED: { label: '만료', tone: 'error' },
};

/** 신청할 수 있는 상태 (미보유 · 만료) */
const REQUESTABLE: SpecialPermissionState[] = ['NONE', 'EXPIRED'];

/** 신청 대상 열 (Figma 선택 56 · 특수권한 160 · 설명 나머지 · 현재 상태 120 · 유효기간 192) */
const COLUMNS: GridPlaceholderColumn<SpecialPermissionOption>[] = [
  { key: 'name', header: '특수권한', width: 160 },
  { key: 'description', header: '설명', align: 'left' },
  {
    key: 'state',
    header: '현재 상태',
    width: 120,
    render: (r) => (
      <Badge size="sm" tone={STATE_BADGE[r.state].tone}>
        {STATE_BADGE[r.state].label}
      </Badge>
    ),
  },
  { key: 'period', header: '유효기간', width: 192, render: (r) => orDash(r.period) },
];

const REASON_MAX = 200;

interface Form {
  permissionId: string | null;
  start: string;
  end: string;
  reason: string;
}
type Errors = Partial<Record<'period' | 'reason', string>>;

const EMPTY: Form = { permissionId: null, start: '', end: '', reason: '' };

// (임의 작업) 기간 순서 오류 문구 — 시안은 빈 값 문구만
function validate(form: Form): Errors {
  const errors: Errors = {};
  if (!form.start || !form.end) errors.period = '사용 희망 기간의 시작일과 종료일을 입력해 주세요.';
  else if (form.start > form.end) errors.period = '종료일은 시작일보다 앞설 수 없습니다.';
  if (!form.reason.trim()) errors.reason = '신청 사유를 입력해 주세요.';
  return errors;
}

/**
 * 마이페이지 권한관리 · 특수권한 신청 팝업 (KWPC02020004, Figma 29253:76688) — 특수권한 카드 [특수권한 신청]에서 연다.
 * 신청 대상(라디오 하나 — 사용 중 · 승인대기는 선택 불가) → 사용 희망 기간 → 신청 사유 → [취소][신청].
 * [신청]: 기간 · 사유 오류는 입력 아래(Alert 없음), 한 번 누른 뒤에는 입력마다 다시 검사 → 신청 → 닫고 완료 안내.
 * 폭: Figma 1040 → Modal lg 880 (표준 크기)
 */
export function SpecialPermissionRequestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [options, setOptions] = useState<SpecialPermissionOption[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) void fetchSpecialPermissionOptions().then(setOptions);
  }, [open]);

  const close = () => {
    setForm(EMPTY);
    setErrors({});
    setSubmitted(false);
    onClose();
  };

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };

  const apply = useAction({
    // (임의 작업) 권한을 고르지 않았을 때 안내 — 시안 없음
    validate: () => (form.permissionId ? null : '신청할 특수권한을 선택해 주세요.'),
    run: () =>
      requestSpecialPermission({
        permissionId: form.permissionId as string,
        start: form.start,
        end: form.end,
        reason: form.reason.trim(),
      }),
    onSuccess: close,
    success: '특수권한 신청이 완료되었습니다. 승인 결과는 알림으로 안내합니다.',
    failure: '특수권한을 신청하지 못했습니다. 잠시 후 다시 시도해 주세요.',
  });

  const submit = () => {
    setSubmitted(true);
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) void apply.execute();
  };

  return (
    <Modal open={open} onClose={apply.loading ? undefined : close} size="lg">
      <Modal.Header title="특수권한 신청" closeButton />
      <Modal.Body>
        <Stack>
          <Modal.Section
            title="신청 대상 특수권한"
            description="현재 사용 중이거나 승인대기 중인 권한은 중복 신청할 수 없습니다."
            gap={8}
          >
            <GridPlaceholder
              columns={COLUMNS}
              rows={options}
              rowKey={(r) => r.id}
              selectable="single"
              isRowSelectable={(r) => REQUESTABLE.includes(r.state)}
              selectedKeys={form.permissionId ? [form.permissionId] : []}
              onSelectionChange={([id]) => set('permissionId', id ?? null)}
            />
          </Modal.Section>

          <Field
            label="사용 희망 기간"
            labelPosition="top"
            required="text"
            feedback={errors.period ? 'negative' : undefined}
            helperText={errors.period}
            aside="승인 결과에 따라 신청 희망기간과 실제 유효기간이 달라질 수 있습니다."
          >
            <ControlGroup>
              <DateField
                aria-label="시작일"
                value={form.start}
                feedback={errors.period ? 'negative' : undefined}
                onChange={(start) => set('start', start)}
              />
              <span aria-hidden>~</span>
              <DateField
                aria-label="종료일"
                value={form.end}
                feedback={errors.period ? 'negative' : undefined}
                onChange={(end) => set('end', end)}
              />
            </ControlGroup>
          </Field>

          <Field
            label="신청 사유"
            labelPosition="top"
            required="text"
            feedback={errors.reason ? 'negative' : undefined}
            helperText={errors.reason}
          >
            <TextArea
              fullWidth
              rows={3}
              maxLength={REASON_MAX}
              showCounter
              placeholder="업무상 특수권한이 필요한 사유를 입력해주세요."
              value={form.reason}
              onChange={(e) => set('reason', e.target.value)}
            />
          </Field>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={apply.loading}
          onClick={close}
        >
          취소
        </Button>
        <Button size="lg" onClick={submit}>
          신청
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
