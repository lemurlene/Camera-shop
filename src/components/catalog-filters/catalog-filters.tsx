import { memo, useCallback, useState, useEffect, ChangeEvent } from 'react';
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

const СatalogFilters = ({ priceRange }: CatalogFiltersProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const currentCategory = useAppSelector(selectCurrentCategory);
  const currentType = useAppSelector(selectCurrentType);
  const currentLevel = useAppSelector(selectCurrentLevel);
  const minPrice = useAppSelector(selectMinPrice);
  const maxPrice = useAppSelector(selectMaxPrice);

  const [localMinPrice, setLocalMinPrice] = useState<string>('');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>('');

  const handleCategoryChange = useCallback((categoryKey: keyof typeof Categories) => {
    dispatch(changeCategory(categoryKey === currentCategory ? null : categoryKey));
  }, [dispatch, currentCategory]);

  const handleTypeChange = useCallback((typeKey: keyof typeof Types) => {
    dispatch(changeType(typeKey));
  }, [dispatch]);

  const handleLevelChange = useCallback((levelKey: keyof typeof Levels) => {
    dispatch(changeLevel(levelKey));
  }, [dispatch]);

  const handleMinPriceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMinPrice(value);
    const numValue = value === '' ? null : Math.max(0, parseInt(value, 10) || 0);
    dispatch(changeMinPrice(numValue));
  }, [dispatch]);

  const handleMaxPriceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMaxPrice(value);
    const numValue = value === '' ? null : Math.max(0, parseInt(value, 10) || 0);
    dispatch(changeMaxPrice(numValue));
  }, [dispatch]);

  const handleMinPriceBlur = useCallback(() => {
    if (localMinPrice === '') {
      return;
    }

    let numValue = parseInt(localMinPrice, 10);
    if (isNaN(numValue)) {
      setLocalMinPrice('');
      dispatch(changeMinPrice(null));
      return;
    }

    if (numValue < priceRange.min) {
      numValue = priceRange.min;
    } else if (numValue > priceRange.max) {
      numValue = priceRange.max;
    }

    setLocalMinPrice(numValue.toString());
    dispatch(changeMinPrice(numValue));
  }, [localMinPrice, priceRange, dispatch]);

  const handleMaxPriceBlur = useCallback(() => {
    if (localMaxPrice === '') {
      return;
    }

    let numValue = parseInt(localMaxPrice, 10);
    if (isNaN(numValue)) {
      setLocalMaxPrice('');
      dispatch(changeMaxPrice(null));
      return;
    }

    if (numValue > priceRange.max) {
      numValue = priceRange.max;
    } else if (numValue < priceRange.min) {
      numValue = priceRange.min;
    }

    if (minPrice !== null && numValue < minPrice) {
      numValue = minPrice;
    }

    setLocalMaxPrice(numValue.toString());
    dispatch(changeMaxPrice(numValue));
  }, [localMaxPrice, priceRange, minPrice, dispatch]);

  const handleReset = useCallback(() => {
    dispatch(resetFilters());
    setLocalMinPrice('');
    setLocalMaxPrice('');
  }, [dispatch]);

  useEffect(() => {
    setLocalMinPrice(minPrice !== null ? minPrice.toString() : '');
  }, [minPrice]);

  useEffect(() => {
    setLocalMaxPrice(maxPrice !== null ? maxPrice.toString() : '');
  }, [maxPrice]);

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
                  min={0}
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
                  min={0}
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
                  disabled={isTypeDisabled(typeKey)}
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
          className="btn catalog-filter__reset-btn"
          type="reset"
          onClick={handleReset}
          disabled={!hasActiveFilters}
        >
          Сбросить фильтры
        </button>
      </form>
    </div>
  );
};

const СatalogFiltersMemo = memo(СatalogFilters);

export default СatalogFiltersMemo;
