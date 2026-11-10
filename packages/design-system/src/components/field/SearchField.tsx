import { forwardRef, type KeyboardEvent } from 'react';
import { SearchIcon } from './icons';
import { TextField, type TextFieldProps } from './TextField';

export interface SearchFieldProps extends Omit<
  TextFieldProps,
  'leadingIcon' | 'trailingIcon' | 'suffix' | 'clearable' | 'type'
> {
  /** Enter를 누르면 호출된다 (한글 조합 중에는 호출하지 않는다) */
  onSearch?: (value: string) => void;
}

/** 검색어 입력 전용. 검색 아이콘과 지우기 버튼이 기본 포함된다. 조회 버튼은 옆에 Button을 둔다. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ onSearch, onKeyDown, placeholder = '검색어를 입력해주세요', ...rest }, ref) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
        onSearch?.(event.currentTarget.value);
      }
    };

    return (
      <TextField
        {...rest}
        ref={ref}
        type="text"
        enterKeyHint="search"
        placeholder={placeholder}
        leadingIcon={<SearchIcon />}
        clearable
        onKeyDown={handleKeyDown}
      />
    );
  },
);

SearchField.displayName = 'SearchField';
