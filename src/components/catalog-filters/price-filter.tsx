import { memo, useCallback, useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeMinPrice, changeMaxPrice, selectMinPrice, selectMaxPrice } from '../../store/filters';

interface PriceFilterProps {
  priceRange: {
    min: number;
    max: number;
  };
}

const PriceFilter = ({ priceRange }: PriceFilterProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const minPrice = useAppSelector(selectMinPrice);
  const maxPrice = useAppSelector(selectMaxPrice);

  const [localMinPrice, setLocalMinPrice] = useState<string>('');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>('');

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

  return (
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
  );
};

export const PriceFilterMemo = memo(PriceFilter);
