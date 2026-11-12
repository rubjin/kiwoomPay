import { createContext, useContext } from 'react';

/** sm 32 · md 40 · lg 48 (lg는 md와 글자 · 여백이 같고 높이만 크다) */
export type FieldSize = 'sm' | 'md' | 'lg';
export type FieldFeedback = 'positive' | 'negative';

export interface FieldContextValue {
  id: string;
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
  const feedback = options.feedback ?? field?.feedback;
  return {
    id: options.id ?? field?.id,
    size: options.size ?? field?.size ?? 'md',
    feedback,
    disabled: options.disabled ?? field?.disabled,
    describedBy:
      [options['aria-describedby'], field?.describedBy].filter(Boolean).join(' ') || undefined,
    invalid: feedback === 'negative' ? true : undefined,
  };
}
