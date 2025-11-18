import { memo } from 'react';

interface ResetButtonProps {
  searchValue: string;
  onReset: () => void;
}

function ResetButton({ searchValue, onReset }: ResetButtonProps) {
  return (
    <button
      className="form-search__reset"
      type="button"
      onClick={onReset}
      aria-label="Сбросить поиск"
      style={{ display: searchValue ? 'flex' : 'none' }}
    >
      <svg width="10" height="10" aria-hidden="true">
        <use xlinkHref="#icon-close"></use>
      </svg>
      <span className="visually-hidden">Сбросить поиск</span>
    </button>
  );
}

export const ResetButtonMemo = memo(ResetButton);
