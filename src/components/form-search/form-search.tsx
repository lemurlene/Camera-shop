import { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAppSelector } from '../../hooks';
import { selectOffers } from '../../store/offers';
import { SearchInputMemo } from './search-input';
import { ResetButtonMemo } from './reset-button';
import { SearchListMemo } from './search-list';
import type { OfferSearchType } from '../../const/type';

const MIN_CHARS = 3;

function FormSearch() {
  const [isListOpen, setIsListOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const products = useAppSelector(selectOffers);

  const searchOffers: OfferSearchType[] = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        name: product.name,
      })),
    [products]
  );

  const normalized = searchValue.trim().toLowerCase();
  const canSearch = normalized.length >= MIN_CHARS;

  const filteredOffers = useMemo(() => {
    if (!canSearch) {
      return [];
    }
    return searchOffers.filter((item) => item.name.toLowerCase().includes(normalized));
  }, [canSearch, normalized, searchOffers]);

  const formSearchClasses = `form-search ${isListOpen ? 'list-opened' : ''}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideList = listRef.current?.contains(target);
      const clickedInsideInput = inputRef.current?.contains(target);

      if (!clickedInsideList && !clickedInsideInput) {
        setIsListOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setSearchValue(value);
    const nextCanSearch = value.trim().length >= MIN_CHARS;
    setIsListOpen(nextCanSearch);
    setFocusedIndex(-1);
  }, []);

  const handleInputFocus = useCallback(() => {
    if (searchValue.trim().length >= MIN_CHARS) {
      setIsListOpen(true);
    }
  }, [searchValue]);

  const handleSuggestionClick = useCallback((offer: OfferSearchType) => {
    setSearchValue(offer.name);
    setIsListOpen(false);
    setFocusedIndex(-1);
  }, []);

  const handleSuggestionHover = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  const handleFormReset = useCallback(() => {
    setSearchValue('');
    setIsListOpen(false);
    setFocusedIndex(-1);

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isListOpen) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => (prev < filteredOffers.length - 1 ? prev + 1 : 0));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOffers.length - 1));
          break;

        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredOffers.length) {
            handleSuggestionClick(filteredOffers[focusedIndex]);
          }
          break;

        case 'Escape':
        case 'Tab':
          setIsListOpen(false);
          setFocusedIndex(-1);
          break;

        default:
          break;
      }
    },
    [isListOpen, focusedIndex, filteredOffers, handleSuggestionClick]
  );

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[focusedIndex] as HTMLElement | undefined;
      activeItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  return (
    <div className={formSearchClasses}>
      <form onSubmit={(e) => e.preventDefault()} role="search">
        <SearchInputMemo
          searchValue={searchValue}
          isListOpen={isListOpen}
          onInputChange={handleInputChange}
          onInputFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
        />

        <ResetButtonMemo searchValue={searchValue} onReset={handleFormReset} />

        <SearchListMemo
          isListOpen={isListOpen}
          searchValue={searchValue}
          offers={filteredOffers}
          focusedIndex={focusedIndex}
          onSuggestionClick={handleSuggestionClick}
          onSuggestionHover={handleSuggestionHover}
          listRef={listRef}
        />
      </form>
    </div>
  );
}

export const FormSearchMemo = memo(FormSearch);
export default FormSearchMemo;
