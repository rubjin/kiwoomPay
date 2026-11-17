import { createContext, useContext, useId } from 'react';

/** sm 32 · md 40 · lg 48 (lg는 md와 글자 · 여백이 같고 높이만 크다) */
/** 입력 · 셀렉트 폭 옵션: auto 내용 폭(값에 맞게) · xs 72(우편번호) · sm 150(CPID · 사업자번호) · md 200 · lg 270 (fullWidth가 우선) */
export type FieldWidth = 'auto' | 'xs' | 'sm' | 'md' | 'lg';

export type FieldSize = 'sm' | 'md' | 'lg';
export type FieldFeedback = 'positive' | 'negative';

export interface FieldContextValue {
  id: string;
  /** Field id(라벨이 가리키는 id)를 받은 컨트롤 — 첫 컨트롤만 받아 id가 겹치지 않게 한다 */
  owner: { current?: string };
  describedBy?: string;
  size: FieldSize;
  feedback?: FieldFeedback;
  disabled?: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

interface ControlOptions {
  id?: string;
  size?: FieldSize;
  feedback?: FieldFeedback;
  disabled?: boolean;
  'aria-describedby'?: string;
}

/** 컨트롤의 prop과 감싸고 있는 Field의 값을 합친다. prop이 우선한다. */
export function useFieldControl(options: ControlOptions) {
  const field = useContext(FieldContext);
  const self = useId();
  // 한 Field 안에 컨트롤이 여럿이면(주소 · 상세 주소, 날짜 + 시각) 처음 그린 컨트롤만 Field id를 쓴다
  if (field && field.owner.current === undefined) field.owner.current = self;
  const owns = field?.owner.current === self;
  const feedback = options.feedback ?? field?.feedback;
  return {
    id: options.id ?? (owns ? field?.id : undefined),
    size: options.size ?? field?.size ?? 'md',
    feedback,
    disabled: options.disabled ?? field?.disabled,
    describedBy:
      [options['aria-describedby'], field?.describedBy].filter(Boolean).join(' ') || undefined,
    invalid: feedback === 'negative' ? true : undefined,
  };
}
