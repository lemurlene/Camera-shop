import { memo, useCallback, KeyboardEvent, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { resetFilters, selectCurrentCategory, selectCurrentType, selectCurrentLevel, selectMinPrice, selectMaxPrice } from '../../store/filters';

interface ResetFilterButtonProps {
  onReset?: () => void;
}

const ResetFilterButton = ({ onReset }: ResetFilterButtonProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const currentCategory = useAppSelector(selectCurrentCategory);
  const currentType = useAppSelector(selectCurrentType);
  const currentLevel = useAppSelector(selectCurrentLevel);
  const minPrice = useAppSelector(selectMinPrice);
  const maxPrice = useAppSelector(selectMaxPrice);

  const resetButtonRef = useRef<HTMLButtonElement>(null);

  const handleFilterReset = useCallback(() => {
    dispatch(resetFilters());
    onReset?.();
  }, [dispatch, onReset]);

  const handleResetKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFilterReset();
    }
  }, [handleFilterReset]);

  const hasActiveFilters = currentCategory !== null ||
    currentType.length > 0 ||
    currentLevel.length > 0 ||
    minPrice !== null ||
    maxPrice !== null;

  return (
    <button
      ref={resetButtonRef}
      className="btn catalog-filter__reset-btn"
      type="reset"
      onClick={handleFilterReset}
      onKeyDown={handleResetKeyDown}
      disabled={!hasActiveFilters}
      aria-disabled={!hasActiveFilters}
      tabIndex={0}
    >
      Сбросить фильтры
    </button>
  );
};

export const ResetFilterButtonMemo = memo(ResetFilterButton);
