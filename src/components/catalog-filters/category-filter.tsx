import { memo, useCallback, KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeCategory, selectCurrentCategory } from '../../store/filters';
import { Categories, CATEGORY_KEYS } from '../../const/const';

const CategoryFilter = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const currentCategory = useAppSelector(selectCurrentCategory);

  const handleCategoryChange = useCallback((categoryKey: keyof typeof Categories) => {
    dispatch(changeCategory(categoryKey === currentCategory ? null : categoryKey));
  }, [dispatch, currentCategory]);

  const handleCategoryKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>, categoryKey: keyof typeof Categories) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryChange(categoryKey);
    }
  }, [handleCategoryChange]);

  return (
    <fieldset className="catalog-filter__block">
      <legend className="title title--h5">Категория</legend>
      {CATEGORY_KEYS.map((categoryKey) => (
        <div key={categoryKey} className="custom-radio catalog-filter__item">
          <label>
            <input
              type="radio"
              name="category"
              checked={currentCategory === categoryKey}
              onChange={() => handleCategoryChange(categoryKey)}
              onKeyDown={(e) => handleCategoryKeyDown(e, categoryKey)}
              aria-checked={currentCategory === categoryKey}
              tabIndex={0}
            />
            <span className="custom-radio__icon"></span>
            <span className="custom-radio__label">
              {Categories[categoryKey]}
            </span>
          </label>
        </div>
      ))}
    </fieldset>
  );
};

export const CategoryFilterMemo = memo(CategoryFilter);
