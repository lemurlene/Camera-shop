import { memo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectMinPrice, selectMaxPrice, changeMinPrice, changeMaxPrice } from '../../store/filters';
import { PriceFilterMemo } from './price-filter';
import { CategoryFilterMemo } from './category-filter';
import { TypeFilterMemo } from './type-filter';
import { LevelFilterMemo } from './level-filter';
import { ResetFilterButtonMemo } from './reset-filter-button';

interface CatalogFiltersProps {
  priceRange: {
    min: number;
    max: number;
  };
}

const CatalogFilters = ({ priceRange }: CatalogFiltersProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const minPrice = useAppSelector(selectMinPrice);
  const maxPrice = useAppSelector(selectMaxPrice);

  useEffect(() => {
    if (minPrice !== null && minPrice < priceRange.min) {
      dispatch(changeMinPrice(priceRange.min));
    }
    if (maxPrice !== null && maxPrice > priceRange.max) {
      dispatch(changeMaxPrice(priceRange.max));
    }
  }, [priceRange.min, priceRange.max, minPrice, maxPrice, dispatch]);

  return (
    <div className="catalog-filter">
      <form action="#" onSubmit={(e) => e.preventDefault()}>
        <h2 className="visually-hidden">Фильтр</h2>
        <PriceFilterMemo priceRange={priceRange} />
        <CategoryFilterMemo />
        <TypeFilterMemo />
        <LevelFilterMemo />
        <ResetFilterButtonMemo />
      </form>
    </div>
  );
};

const CatalogFiltersMemo = memo(CatalogFilters);

export default CatalogFiltersMemo;
