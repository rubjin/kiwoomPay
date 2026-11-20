import {
  Button,
  ControlGroup,
  Field,
  Radio,
  RadioGroup,
  SelectBox,
  Stack,
  TextField,
} from '@kiwoompay/design-system';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import type { Option } from '@/constants/options';
import type {
  FunctionInput,
  FunctionItem,
  FunctionType,
  PermissionKind,
} from '@/features/system/functionCode.types';
import type { MenuNode } from '@/features/system/menu.types';

// 라벨 폭 — 메뉴관리 메뉴 정보와 같게 (TODO(시안))
const LABEL_WIDTH = 120;
const DISABLED_SPECIAL = '일반 기능 - 선택 불가';

interface FunctionInfoFormProps {
  menu: MenuNode;
  /** 이 메뉴의 탭 기능 (소속 탭 선택지) */
  tabs: FunctionItem[];
  value: FunctionInput;
  onChange: (patch: Partial<FunctionInput>) => void;
  /** 특수권한 코드 선택지 (사용 중인 코드) */
  specialCodes: Option[];
  /** 기능 식별키 서버 검증 오류 (중복) */
  keyError?: string | null;
  /** [코드 관리] — 특수권한 코드 관리 팝업(KWPC10010203) */
  onManageCodes: () => void;
}

/**
 * 화면설계서 KWPC10010202 ④ 기능 정보 / 특수권한.
 * 소속 메뉴 · 기능코드는 읽기 전용, 소속 탭은 버튼·기능만, 특수권한 코드 · 적용 방식은 권한구분 특수만
 */
export function FunctionInfoForm({
  menu,
  tabs,
  value,
  onChange,
  specialCodes,
  keyError,
  onManageCodes,
}: FunctionInfoFormProps) {
  const types = useCodeOptions('FUNCTION_TYPE');
  const kinds = useCodeOptions('PERMISSION_KIND');
  const applies = useCodeOptions('SPECIAL_APPLY');
  const isTab = value.type === 'TAB';
  const special = value.kind === 'SPECIAL';
  const tabOptions = [
    { value: '', label: '선택 안 함' },
    ...tabs
      .filter((t) => t.code !== value.code)
      .map((t) => ({ value: t.code, label: `${t.name} (${t.code})` })),
  ];

  return (
    <Stack gap={16}>
      <Field label="소속 메뉴" labelWidth={LABEL_WIDTH}>
        <TextField fullWidth readOnly value={`${menu.name} (${menu.id})`} />
      </Field>
      <Field label="기능코드" labelWidth={LABEL_WIDTH}>
        <TextField fullWidth readOnly value={value.code ?? ''} placeholder="저장 시 자동 생성" />
      </Field>
      <Field label="기능명" labelWidth={LABEL_WIDTH} required>
        <TextField
          fullWidth
          value={value.name}
          placeholder="기능명을 입력해주세요"
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </Field>
      <Field label="기능유형" labelWidth={LABEL_WIDTH} required>
        <SelectBox
          fullWidth
          options={types}
          value={value.type}
          onChange={(type) =>
            onChange({ type: type as FunctionType, tabCode: type === 'TAB' ? '' : value.tabCode })
          }
        />
      </Field>
      <Field label="소속 탭" labelWidth={LABEL_WIDTH} disabled={isTab}>
        <SelectBox
          fullWidth
          options={tabOptions}
          value={isTab ? '' : value.tabCode}
          onChange={(tabCode) => onChange({ tabCode })}
        />
      </Field>
      <Field label="권한구분" labelWidth={LABEL_WIDTH} required>
        <SelectBox
          fullWidth
          options={kinds}
          value={value.kind}
          onChange={(kind) =>
            onChange(
              kind === 'SPECIAL'
                ? { kind: 'SPECIAL' }
                : { kind: kind as PermissionKind, specialCode: '', specialApply: '' },
            )
          }
        />
      </Field>
      <Field
        label="기능 식별키"
        labelWidth={LABEL_WIDTH}
        required
        feedback={keyError ? 'negative' : undefined}
        helperText={keyError ?? undefined}
      >
        <TextField
          fullWidth
          value={value.key}
          placeholder="기능 식별키를 입력해주세요"
          onChange={(e) => onChange({ key: e.target.value })}
        />
      </Field>
      <Field label="특수권한 코드" labelWidth={LABEL_WIDTH} required={special} disabled={!special}>
        <ControlGroup grow>
          <SelectBox
            fullWidth
            options={specialCodes}
            value={special ? value.specialCode : ''}
            placeholder={special ? '특수권한 코드를 선택해주세요' : DISABLED_SPECIAL}
            onChange={(specialCode) => onChange({ specialCode })}
          />
          <Button variant="neutral" appearance="line" onClick={onManageCodes}>
            코드 관리
          </Button>
        </ControlGroup>
      </Field>
      <Field
        label="특수권한 적용 방식"
        labelWidth={LABEL_WIDTH}
        required={special}
        disabled={!special}
      >
        <SelectBox
          fullWidth
          options={applies}
          value={special ? value.specialApply : ''}
          placeholder={special ? '적용 방식을 선택해주세요' : DISABLED_SPECIAL}
          onChange={(specialApply) => onChange({ specialApply })}
        />
      </Field>
      <Field label="정렬순서" labelWidth={LABEL_WIDTH}>
        <TextField
          fieldWidth="md"
          inputMode="numeric"
          value={value.sortOrder}
          onChange={(e) => onChange({ sortOrder: e.target.value.replace(/\D/g, '') })}
        />
      </Field>
      <Field label="사용여부" labelWidth={LABEL_WIDTH} required>
        <RadioGroup
          direction="horizontal"
          value={value.use ? 'Y' : 'N'}
          onChange={(v) => onChange({ use: v === 'Y' })}
        >
          <Radio value="Y" label="사용" />
          <Radio value="N" label="미사용" />
        </RadioGroup>
      </Field>
    </Stack>
  );
}
