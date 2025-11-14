import { useAppDispatch } from './';
import { useUrlState } from './use-url-state';
import {
  changeCategory,
  setTypes,
  setLevels,
  changeMinPrice,
  changeMaxPrice,
  resetFilters
} from '../store/filters/filters.slice';
import { Categories, Types, Levels, CATEGORY_KEYS, TYPE_KEYS, LEVEL_KEYS } from '../const/const';

export const useFilterUrl = () => {
  const { getParam, getParamAll, setParams } = useUrlState();
  const dispatch = useAppDispatch();

  const initializeFiltersFromUrl = () => {
    const category = getParam('category');
    const types = getParamAll('type');
    const levels = getParamAll('level');
    const minPrice = getParam('minPrice');
    const maxPrice = getParam('maxPrice');

    if (category && CATEGORY_KEYS.includes(category as keyof typeof Categories)) {
      dispatch(changeCategory(category as keyof typeof Categories));
    }

    const validTypes = types.filter((type) =>
      TYPE_KEYS.includes(type as keyof typeof Types)
    ) as (keyof typeof Types)[];
    dispatch(setTypes(validTypes));

    const validLevels = levels.filter((level) =>
      LEVEL_KEYS.includes(level as keyof typeof Levels)
    ) as (keyof typeof Levels)[];
    dispatch(setLevels(validLevels));

    if (minPrice) {
      const price = parseInt(minPrice, 10);
      if (!isNaN(price)) {
        dispatch(changeMinPrice(price));
      }
    }

    if (maxPrice) {
      const price = parseInt(maxPrice, 10);
      if (!isNaN(price)) {
        dispatch(changeMaxPrice(price));
      }
    }
  };

  const updateUrlFromFilters = (filters: {
    category: string | null;
    type: string[];
    level: string[];
    minPrice: number | null;
    maxPrice: number | null;
  }) => {
    const params: Record<string, string | string[] | null> = {};

    if (filters.category) {
      params.category = filters.category;
    } else {
      params.category = null;
    }

    if (filters.type.length > 0) {
      params.type = filters.type;
    } else {
      params.type = null;
    }

    if (filters.level.length > 0) {
      params.level = filters.level;
    } else {
      params.level = null;
    }

    if (filters.minPrice !== null) {
      params.minPrice = filters.minPrice.toString();
    } else {
      params.minPrice = null;
    }

    if (filters.maxPrice !== null) {
      params.maxPrice = filters.maxPrice.toString();
    } else {
      params.maxPrice = null;
    }

    setParams(params);
  };

  const resetFiltersAndUrl = () => {
    dispatch(resetFilters());
    setParams({
      category: null,
      type: null,
      level: null,
      minPrice: null,
      maxPrice: null
    });
  };

  return {
    initializeFiltersFromUrl,
    updateUrlFromFilters,
    resetFiltersAndUrl
  };
};
