import { forwardRef, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { mergeRefs } from '../../utils';
import { Icon } from '../Icon';
import { FieldButtonGroup } from './FieldButtonGroup';
import { TextField, type TextFieldProps } from './TextField';

export interface SearchFieldProps extends Omit<
  TextFieldProps,
  'leadingIcon' | 'trailingIcon' | 'suffix' | 'clearable' | 'type'
> {
  /** Enter · [조회] 버튼을 누르면 호출된다 (한글 조합 중 Enter는 무시) */
  onSearch?: (value: string) => void;
  /**
   * 옆에 붙는 조회 버튼 문구 (예: '조회'). 주면 [검색 입력][버튼]을 한 묶음(ControlGroup, 사이 8)으로 그린다.
   * 버튼은 Neutral · 필드와 같은 size. fullWidth면 입력이 남는 폭을 채운다. className · style은 묶음에 적용
   */
  searchLabel?: ReactNode;
  /** 조회 중: 다시 조회하지 않음 (중복 실행 차단 — 버튼 모양은 그대로) */
  loading?: boolean;
}

/**
 * 검색어 입력 전용. 검색 아이콘과 지우기 버튼이 기본 포함된다.
 * 조회 버튼이 필요하면 searchLabel — 옆에 Button을 따로 두지 않는다.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      onSearch,
      onKeyDown,
      placeholder = '검색어를 입력해주세요',
      searchLabel,
      loading = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const search = (value: string) => {
      if (!loading) onSearch?.(value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
        search(event.currentTarget.value);
      }
    };

    const field = (
      <TextField
        {...rest}
        ref={mergeRefs(ref, inputRef)}
        className={searchLabel === undefined ? className : undefined}
        style={searchLabel === undefined ? style : undefined}
        type="text"
        enterKeyHint="search"
        placeholder={placeholder}
        leadingIcon={<Icon name="search" size={20} />}
        clearable
        onKeyDown={handleKeyDown}
      />
    );

    if (searchLabel === undefined) return field;

    return (
      <FieldButtonGroup
        buttonLabel={searchLabel}
        onButtonClick={() => search(inputRef.current?.value ?? '')}
        size={rest.size}
        fullWidth={rest.fullWidth}
        disabled={rest.disabled}
        className={className}
        style={style}
      >
        {field}
      </FieldButtonGroup>
    );
  },
);

SearchField.displayName = 'SearchField';
