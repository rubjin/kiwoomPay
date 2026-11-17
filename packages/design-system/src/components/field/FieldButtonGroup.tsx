import { useContext, type CSSProperties, type ReactNode } from 'react';
import { Button } from '../Button';
import { ControlGroup } from '../layout/ControlGroup';
import { FieldContext, type FieldSize } from './fieldContext';

export interface FieldButtonGroupProps {
  /** 입력 (SearchField · LookupField의 TextField) */
  children: ReactNode;
  /** 버튼 문구 ([조회] · [찾기]) */
  buttonLabel: ReactNode;
  /** solid(기본): Neutral 채움 — 조회 / line: Neutral 테두리 — 찾기(팝업 열기) */
  buttonAppearance?: 'solid' | 'line';
  onButtonClick?: () => void;
  /** 입력 크기 — 없으면 감싸는 Field의 size, 그것도 없으면 md. 버튼도 같은 size */
  size?: FieldSize;
  /** 입력이 남는 폭을 채움 → 묶음도 부모 폭을 채운다 */
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * 입력 + 붙는 버튼 한 묶음 (사이 8, 같은 size). SearchField searchLabel · LookupField가 같이 쓴다.
 * 동작(Enter · 버튼이 하는 일)은 각 컴포넌트가 정하고, 이 묶음은 배치 · 크기 · 폭만 맞춘다
 */
export function FieldButtonGroup({
  children,
  buttonLabel,
  buttonAppearance = 'solid',
  onButtonClick,
  size,
  fullWidth,
  disabled,
  className,
  style,
}: FieldButtonGroupProps) {
  const field = useContext(FieldContext);
  return (
    <ControlGroup grow={fullWidth} className={className} style={style}>
      {children}
      <Button
        variant="neutral"
        appearance={buttonAppearance}
        size={size ?? field?.size ?? 'md'}
        disabled={disabled ?? field?.disabled}
        onClick={onButtonClick}
      >
        {buttonLabel}
      </Button>
    </ControlGroup>
  );
}
