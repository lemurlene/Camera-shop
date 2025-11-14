import { useMemo } from 'react';
import { useAppSelector } from './';
import { selectOffers } from '../store/offers/offers.selector';
import { selectAllFilters } from '../store/filters/filters.selector';
import { selectSortType, selectSortOrder } from '../store/sort/sort.selector';
import { CategoryToKey, TypeToKey, LevelToKey } from '../const/const';
import { sortOffers } from '../components/sort/utils';

const useFilteredProducts = () => {
  const products = useAppSelector(selectOffers);
  const filters = useAppSelector(selectAllFilters);
  const sortType = useAppSelector(selectSortType);
  const sortOrder = useAppSelector(selectSortOrder);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    const filtered = products.filter((product) => {
      const productCategoryKey = CategoryToKey[product.category as keyof typeof CategoryToKey];
      const productTypeKey = TypeToKey[product.type as keyof typeof TypeToKey];
      const productLevelKey = LevelToKey[product.level as keyof typeof LevelToKey];

      const categoryMatch = !filters.category || productCategoryKey === filters.category;
      const levelMatch = !filters.level || filters.level.length === 0 ||
        filters.level.some((level) => level && productLevelKey === level);
      const typeMatch = !filters.type || filters.type.length === 0 ||
        filters.type.some((type) => type && productTypeKey === type);
      const minPriceMatch = !filters.minPrice || product.price >= filters.minPrice;
      const maxPriceMatch = !filters.maxPrice || product.price <= filters.maxPrice;

      return categoryMatch && levelMatch && typeMatch && minPriceMatch && maxPriceMatch;
    });

    return sortOffers(filtered, sortType, sortOrder);
  }, [products, filters, sortType, sortOrder]);

  const filteredPriceRange = useMemo(() => {
    if (filteredAndSortedProducts.length === 0) {
      const allPrices = products?.map((p) => p.price) || [];
      return {
        min: allPrices.length > 0 ? Math.min(...allPrices) : 0,
        max: allPrices.length > 0 ? Math.max(...allPrices) : 0
      };
    }

    const prices = filteredAndSortedProducts.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [filteredAndSortedProducts, products]);

  return {
    filteredProducts: filteredAndSortedProducts,
    filteredPriceRange
  };
};

export { useFilteredProducts };
