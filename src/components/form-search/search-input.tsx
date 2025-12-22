import { memo, useCallback } from 'react';

interface SearchInputProps {
  searchValue: string;
  isListOpen: boolean;
  onInputChange: (value: string) => void;
  onInputFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

function SearchInput({
  searchValue,
  isListOpen,
  onInputChange,
  onInputFocus,
  onKeyDown,
  inputRef
}: SearchInputProps) {
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  }, [onInputChange]);

  return (
    <label>
      <svg className="form-search__icon" width="16" height="16" aria-hidden="true">
        <use xlinkHref="#icon-lens"></use>
      </svg>
      <input
        ref={inputRef}
        className="form-search__input"
        type="text"
        autoComplete="off"
        placeholder="Поиск по сайту"
        value={searchValue}
        onChange={handleInputChange}
        onFocus={onInputFocus}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isListOpen}
        aria-controls="search-suggestions"
      />
    </label>
  );
}

export const SearchInputMemo = memo(SearchInput);
