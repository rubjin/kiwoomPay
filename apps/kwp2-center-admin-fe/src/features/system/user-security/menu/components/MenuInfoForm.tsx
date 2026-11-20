import { Field, Radio, RadioGroup, SelectBox, Stack, TextField } from '@kiwoompay/design-system';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import type { MenuInput, MenuNode, MenuType } from '@/features/system/menu.types';
import { MAX_MENU_LEVEL, findMenu, parentOptions } from './menuTree';

// 라벨 폭 — 화면설계서 라벨 칸 116 + 여백 (TODO(시안))
const LABEL_WIDTH = 120;

interface MenuInfoFormProps {
  root: MenuNode;
  value: MenuInput;
  onChange: (patch: Partial<MenuInput>) => void;
  /** 메뉴명 서버 검증 오류 (중복) */
  nameError?: string | null;
}

/**
 * 화면설계서 KWPC10010201 ③ 메뉴 정보. 메뉴ID · 메뉴레벨은 자동이라 읽기 전용,
 * 페이지 설명은 3Depth만 · PROG_LINK는 그룹 메뉴면 입력하지 않는다
 */
export function MenuInfoForm({ root, value, onChange, nameError }: MenuInfoFormProps) {
  const menuTypes = useCodeOptions('MENU_TYPE');
  const editing = value.id ? findMenu(root, value.id) : undefined;
  const parent = findMenu(root, value.parentId);
  const level = (parent?.level ?? 0) + 1;
  const isGroup = value.type === 'GROUP';

  return (
    <Stack gap={16}>
      <Field label="시스템" labelWidth={LABEL_WIDTH}>
        <TextField fullWidth readOnly value={`${root.name} (${root.id})`} />
      </Field>
      <Field
        label="메뉴ID"
        labelWidth={LABEL_WIDTH}
        helperText="메뉴 등록 시 자동 생성 · 수정 불가"
      >
        <TextField fullWidth readOnly value={value.id ?? ''} placeholder="저장 시 자동 생성" />
      </Field>
      <Field
        label="메뉴명"
        labelWidth={LABEL_WIDTH}
        required
        feedback={nameError ? 'negative' : undefined}
        helperText={nameError ?? '동일 상위메뉴 아래 메뉴명 중복 불가'}
      >
        <TextField
          fullWidth
          value={value.name}
          placeholder="메뉴명을 입력해주세요"
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </Field>
      <Field
        label="페이지 설명"
        labelWidth={LABEL_WIDTH}
        disabled={level !== MAX_MENU_LEVEL}
        helperText="3Depth 메뉴만 입력 가능 · 페이지 타이틀 옆 안내문으로 표시 · 미입력 시 미노출"
      >
        <TextField
          fullWidth
          value={level === MAX_MENU_LEVEL ? value.description : ''}
          placeholder="페이지 설명을 입력해주세요"
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </Field>
      <Field
        label="상위메뉴"
        labelWidth={LABEL_WIDTH}
        required
        helperText="자기 자신 · 하위메뉴 선택 불가 / 최대 3Depth"
      >
        <SelectBox
          fullWidth
          options={parentOptions(root, editing)}
          value={value.parentId}
          onChange={(parentId) => onChange({ parentId })}
        />
      </Field>
      <Field
        label="메뉴레벨"
        labelWidth={LABEL_WIDTH}
        helperText="상위메뉴 기준 자동 결정 · 3Depth 하위메뉴 등록 불가"
      >
        <TextField fullWidth readOnly value={`${level}Depth`} />
      </Field>
      <Field
        label="메뉴유형"
        labelWidth={LABEL_WIDTH}
        required
        helperText="그룹 메뉴는 하위메뉴 펼침만, 업무 화면은 이동경로 사용"
      >
        <SelectBox
          fullWidth
          options={menuTypes}
          value={value.type}
          onChange={(type) => onChange({ type: type as MenuType })}
        />
      </Field>
      <Field
        label="PROG_LINK"
        labelWidth={LABEL_WIDTH}
        disabled={isGroup}
        helperText="실제 화면으로 이동하는 메뉴만 설정 · 개발 라우트 확인 필요"
      >
        <TextField
          fullWidth
          value={isGroup ? '' : value.progLink}
          placeholder="/system/user-security/menu"
          onChange={(e) => onChange({ progLink: e.target.value })}
        />
      </Field>
      <Field
        label="정렬순서"
        labelWidth={LABEL_WIDTH}
        helperText="동일 상위메뉴의 정렬 순서 · 미입력 시 마지막 배치"
      >
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
