import { memo, useCallback, useState, useEffect, ChangeEvent, KeyboardEvent, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  changeCategory,
  changeType,
  changeLevel,
  changeMinPrice,
  changeMaxPrice,
  resetFilters
} from '../../store/filters/filters.slice';
import {
  selectCurrentCategory,
  selectCurrentType,
  selectCurrentLevel,
  selectMinPrice,
  selectMaxPrice
} from '../../store/filters/filters.selector';
import {
  Categories, Levels, Types,
  CATEGORY_KEYS, LEVEL_KEYS, TYPE_KEYS
} from '../../const/const';

interface CatalogFiltersProps {
  priceRange: {
    min: number;
    max: number;
  };
}

const CatalogFilters = ({ priceRange }: CatalogFiltersProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const currentCategory = useAppSelector(selectCurrentCategory);
  const currentType = useAppSelector(selectCurrentType);
  const currentLevel = useAppSelector(selectCurrentLevel);
  const minPrice = useAppSelector(selectMinPrice);
  const maxPrice = useAppSelector(selectMaxPrice);

  const [localMinPrice, setLocalMinPrice] = useState<string>('');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>('');

  const resetButtonRef = useRef<HTMLButtonElement>(null);

  const handleReset = useCallback(() => {
    dispatch(resetFilters());
    setLocalMinPrice('');
    setLocalMaxPrice('');
  }, [dispatch]);

  const handleCategoryChange = useCallback((categoryKey: keyof typeof Categories) => {
    dispatch(changeCategory(categoryKey === currentCategory ? null : categoryKey));
  }, [dispatch, currentCategory]);

  const handleCategoryKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>, categoryKey: keyof typeof Categories) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryChange(categoryKey);
    }
  }, [handleCategoryChange]);

  const handleTypeChange = useCallback((typeKey: keyof typeof Types) => {
    dispatch(changeType(typeKey));
  }, [dispatch]);

  const handleTypeKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>, typeKey: keyof typeof Types) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTypeChange(typeKey);
    }
  }, [handleTypeChange]);

  const handleLevelChange = useCallback((levelKey: keyof typeof Levels) => {
    dispatch(changeLevel(levelKey));
  }, [dispatch]);

  const handleLevelKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>, levelKey: keyof typeof Levels) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLevelChange(levelKey);
    }
  }, [handleLevelChange]);

  const handleResetKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleReset();
    }
  }, [handleReset]);

  const handleMinPriceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalMinPrice(e.target.value);
  }, []);

  const handleMaxPriceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalMaxPrice(e.target.value);
  }, []);

  const handleMinPriceKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }, []);

  const handleMaxPriceKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }, []);

  const applyMinPrice = useCallback(() => {
    if (localMinPrice === '') {
      dispatch(changeMinPrice(null));
      return;
    }

    let numValue = parseInt(localMinPrice, 10);

    if (isNaN(numValue) || numValue < 0) {
      setLocalMinPrice('');
      dispatch(changeMinPrice(null));
      return;
    }
    if (numValue < priceRange.min) {
      numValue = priceRange.min;
    }
    if (numValue > priceRange.max) {
      numValue = priceRange.max;
    }
    if (maxPrice !== null && numValue > maxPrice) {
      numValue = maxPrice;
    }

    setLocalMinPrice(numValue.toString());
    dispatch(changeMinPrice(numValue));
  }, [localMinPrice, priceRange, maxPrice, dispatch]);

  const applyMaxPrice = useCallback(() => {
    if (localMaxPrice === '') {
      dispatch(changeMaxPrice(null));
      return;
    }

    let numValue = parseInt(localMaxPrice, 10);

    if (isNaN(numValue) || numValue < 0) {
      setLocalMaxPrice('');
      dispatch(changeMaxPrice(null));
      return;
    }
    if (numValue < priceRange.min) {
      numValue = priceRange.min;
    }
    if (numValue > priceRange.max) {
      numValue = priceRange.max;
    }
    if (minPrice !== null && numValue < minPrice) {
      numValue = minPrice;
    }

    setLocalMaxPrice(numValue.toString());
    dispatch(changeMaxPrice(numValue));
  }, [localMaxPrice, priceRange, minPrice, dispatch]);

  const handleMinPriceBlur = useCallback(() => {
    applyMinPrice();
  }, [applyMinPrice]);

  const handleMaxPriceBlur = useCallback(() => {
    applyMaxPrice();
  }, [applyMaxPrice]);

  useEffect(() => {
    setLocalMinPrice(minPrice !== null ? minPrice.toString() : '');
  }, [minPrice]);

  useEffect(() => {
    setLocalMaxPrice(maxPrice !== null ? maxPrice.toString() : '');
  }, [maxPrice]);

  useEffect(() => {
    if (minPrice !== null && minPrice < priceRange.min) {
      dispatch(changeMinPrice(priceRange.min));
    }

    if (maxPrice !== null && maxPrice > priceRange.max) {
      dispatch(changeMaxPrice(priceRange.max));
    }
  }, [priceRange.min, priceRange.max, minPrice, maxPrice, dispatch]);

  const hasActiveFilters = currentCategory !== null ||
    currentType.length > 0 ||
    currentLevel.length > 0 ||
    minPrice !== null ||
    maxPrice !== null;

  const isTypeDisabled = (typeKey: keyof typeof Types): boolean =>
    currentCategory === 'videocamera' && (typeKey === 'film' || typeKey === 'snapshot');

  const isTypeChecked = (typeKey: keyof typeof Types): boolean =>
    currentType.includes(typeKey);

  const isLevelChecked = (levelKey: keyof typeof Levels): boolean =>
    currentLevel.includes(levelKey);

  return (
    <div className="catalog-filter">
      <form action="#" onSubmit={(e) => e.preventDefault()}>
        <h2 className="visually-hidden">Фильтр</h2>
        <fieldset className="catalog-filter__block">
          <legend className="title title--h5">Цена, ₽</legend>
          <div className="catalog-filter__price-range">
            <div className="custom-input">
              <label>
                <input
                  type="number"
                  name="priceMin"
                  placeholder={priceRange.min.toString()}
                  value={localMinPrice}
                  onChange={handleMinPriceChange}
                  onBlur={handleMinPriceBlur}
                  onKeyDown={handleMinPriceKeyDown}
                  min={0}
                  aria-label="Минимальная цена"
                />
              </label>
            </div>
            <div className="custom-input">
              <label>
                <input
                  type="number"
                  name="priceMax"
                  placeholder={priceRange.max.toString()}
                  value={localMaxPrice}
                  onChange={handleMaxPriceChange}
                  onBlur={handleMaxPriceBlur}
                  onKeyDown={handleMaxPriceKeyDown}
                  min={0}
                  aria-label="Максимальная цена"
                />
              </label>
            </div>
          </div>
        </fieldset>
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
        <fieldset className="catalog-filter__block">
          <legend className="title title--h5">Тип камеры</legend>
          {TYPE_KEYS.map((typeKey) => (
            <div key={typeKey} className="custom-checkbox catalog-filter__item">
              <label>
                <input
                  type="checkbox"
                  name="type"
                  checked={isTypeChecked(typeKey)}
                  onChange={() => handleTypeChange(typeKey)}
                  onKeyDown={(e) => handleTypeKeyDown(e, typeKey)}
                  disabled={isTypeDisabled(typeKey)}
                  aria-checked={isTypeChecked(typeKey)}
                  aria-disabled={isTypeDisabled(typeKey)}
                  tabIndex={0}
                />
                <span className="custom-checkbox__icon"></span>
                <span className="custom-checkbox__label">
                  {Types[typeKey]}
                </span>
              </label>
            </div>
          ))}
        </fieldset>
        <fieldset className="catalog-filter__block">
          <legend className="title title--h5">Уровень</legend>
          {LEVEL_KEYS.map((levelKey) => (
            <div key={levelKey} className="custom-checkbox catalog-filter__item">
              <label>
                <input
                  type="checkbox"
                  name="level"
                  checked={isLevelChecked(levelKey)}
                  onChange={() => handleLevelChange(levelKey)}
                  onKeyDown={(e) => handleLevelKeyDown(e, levelKey)}
                  aria-checked={isLevelChecked(levelKey)}
                  tabIndex={0}
                />
                <span className="custom-checkbox__icon"></span>
                <span className="custom-checkbox__label">
                  {Levels[levelKey]}
                </span>
              </label>
            </div>
          ))}
        </fieldset>
        <button
          ref={resetButtonRef}
          className="btn catalog-filter__reset-btn"
          type="reset"
          onClick={handleReset}
          onKeyDown={handleResetKeyDown}
          disabled={!hasActiveFilters}
          aria-disabled={!hasActiveFilters}
          tabIndex={0}
        >
          Сбросить фильтры
        </button>
      </form>
    </div>
  );
};

const CatalogFiltersMemo = memo(CatalogFilters);

export default CatalogFiltersMemo;
