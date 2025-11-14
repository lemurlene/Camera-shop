import { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useUrl } from '../../contexts/url-context';
import {
  changeCategory,
  setTypes,
  setLevels,
  changeMinPrice,
  changeMaxPrice
} from '../../store/filters/filters.slice';
import { selectAllFilters } from '../../store/filters/filters.selector';

const CATEGORY_VALUES = ['photocamera', 'videocamera'] as const;
const TYPE_VALUES = ['digital', 'film', 'snapshot', 'collection'] as const;
const LEVEL_VALUES = ['zero', 'non-professional', 'professional'] as const;

type ValidCategory = typeof CATEGORY_VALUES[number];
type ValidType = typeof TYPE_VALUES[number];
type ValidLevel = typeof LEVEL_VALUES[number];

interface FilterSyncWrapperProps {
  children: ReactNode;
}

export const FilterSyncWrapper = ({ children }: FilterSyncWrapperProps) => {
  const { getParam, getParamAll, setParams } = useUrl();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectAllFilters);

  useEffect(() => {
    const category = getParam('category');
    if (category && CATEGORY_VALUES.includes(category as ValidCategory)) {
      dispatch(changeCategory(category as ValidCategory));
    }

    const types = getParamAll('type').filter((type) =>
      TYPE_VALUES.includes(type as ValidType)
    ) as ValidType[];
    if (types.length > 0) {
      dispatch(setTypes(types));
    }

    const levels = getParamAll('level').filter((level) =>
      LEVEL_VALUES.includes(level as ValidLevel)
    ) as ValidLevel[];
    if (levels.length > 0) {
      dispatch(setLevels(levels));
    }

    const minPriceParam = getParam('minPrice');
    const maxPriceParam = getParam('maxPrice');

    if (minPriceParam) {
      const price = parseInt(minPriceParam, 10);
      if (!isNaN(price)) {
        dispatch(changeMinPrice(price));
      }
    }

    if (maxPriceParam) {
      const price = parseInt(maxPriceParam, 10);
      if (!isNaN(price)) {
        dispatch(changeMaxPrice(price));
      }
    }
  }, [dispatch, getParam, getParamAll]);

  useEffect(() => {
    setParams({
      category: filters.category,
      type: filters.type.length > 0 ? filters.type : null,
      level: filters.level.length > 0 ? filters.level : null,
      minPrice: filters.minPrice !== null ? filters.minPrice.toString() : null,
      maxPrice: filters.maxPrice !== null ? filters.maxPrice.toString() : null,
    });
  }, [filters, setParams]);

  return children as JSX.Element;
};
