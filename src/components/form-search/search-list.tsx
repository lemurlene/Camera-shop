import { memo } from 'react';
import { sortOffersSearch } from '../sort/utils';
import { useNavigate } from 'react-router-dom';
import { OfferSearchType } from '../../const/type';
import { AppRoute } from '../../const/enum';

interface SearchListProps {
  isListOpen: boolean;
  searchValue: string;
  offers: OfferSearchType[];
  focusedIndex: number;
  onSuggestionClick: (suggestion: OfferSearchType) => void;
  onSuggestionHover: (index: number) => void;
  listRef: React.RefObject<HTMLUListElement>;
}

function SearchList({
  isListOpen,
  searchValue,
  offers,
  focusedIndex,
  onSuggestionClick,
  onSuggestionHover,
  listRef,
}: SearchListProps) {
  const navigate = useNavigate();

  const sortedOffers = sortOffersSearch(offers);

  const handleSuggestionSelect = (offer: OfferSearchType) => {
    onSuggestionClick(offer);
    navigate(`${AppRoute.Catalog}/${offer.id}`);
  };

  if (!isListOpen) {
    return null;
  }

  if (sortedOffers.length === 0 && searchValue) {
    return (
      <div className="form-search__select-list">
        <div className="form-search__select-item">Ничего не найдено</div>
      </div>
    );
  }

  if (sortedOffers.length === 0) {
    return null;
  }

  return (
    <ul
      ref={listRef}
      id="search-suggestions"
      className="form-search__select-list"
      role="listbox"
      aria-label="Результаты поиска"
    >
      {sortedOffers.map((suggestion, index) => (
        <li
          key={suggestion.id}
          className={`form-search__select-item ${index === focusedIndex ? 'form-search__select-item--focused' : ''
          }`}
          tabIndex={-1}
          role="option"
          aria-selected={index === focusedIndex}
          onClick={() => handleSuggestionSelect(suggestion)}
          onMouseEnter={() => onSuggestionHover(index)}
        >
          {suggestion.name}
        </li>
      ))}
    </ul>
  );
}

export const SearchListMemo = memo(SearchList);
