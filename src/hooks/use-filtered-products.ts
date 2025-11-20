import { useAppSelector } from './';
import { useMemo } from 'react';
import { selectOffers } from '../store/offers';
import { selectAllFilters } from '../store/filters';
import { selectSortType, selectSortOrder } from '../store/sort';
import { CategoryToKey, TypeToKey, LevelToKey } from '../const/const';
import { sortOffers } from '../components/sort/utils';

const useFilteredProducts = () => {
  const products = useAppSelector(selectOffers);
  const filters = useAppSelector(selectAllFilters);
  const sortType = useAppSelector(selectSortType);
  const sortOrder = useAppSelector(selectSortOrder);

  const filteredWithoutPrice = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    return products.filter((product) => {
      const productCategoryKey = CategoryToKey[product.category as keyof typeof CategoryToKey];
      const productTypeKey = TypeToKey[product.type as keyof typeof TypeToKey];
      const productLevelKey = LevelToKey[product.level as keyof typeof LevelToKey];

      const categoryMatch = !filters.category || productCategoryKey === filters.category;
      const levelMatch = !filters.level || filters.level.length === 0 ||
        filters.level.some((level) => level && productLevelKey === level);
      const typeMatch = !filters.type || filters.type.length === 0 ||
        filters.type.some((type) => type && productTypeKey === type);

      return categoryMatch && levelMatch && typeMatch;
    });
  }, [products, filters.category, filters.type, filters.level]);

  const filteredWithPrice = useMemo(() => filteredWithoutPrice.filter((product) => {
    const minPriceMatch = !filters.minPrice || product.price >= filters.minPrice;
    const maxPriceMatch = !filters.maxPrice || product.price <= filters.maxPrice;

    return minPriceMatch && maxPriceMatch;
  }), [filteredWithoutPrice, filters.minPrice, filters.maxPrice]);

  const filteredAndSortedProducts = useMemo(() => sortOffers(filteredWithPrice, sortType, sortOrder), [filteredWithPrice, sortType, sortOrder]);

  const filteredPriceRange = useMemo(() => {
    if (filteredWithoutPrice.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = filteredWithoutPrice.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [filteredWithoutPrice]);

  return {
    filteredProducts: filteredAndSortedProducts,
    filteredPriceRange
  };
};

export { useFilteredProducts };
