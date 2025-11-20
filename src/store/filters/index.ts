import {
  selectCurrentCategory,
  selectCurrentType,
  selectCurrentLevel,
  selectMinPrice,
  selectMaxPrice,
  selectAllFilters
} from './filters.selector';
import {
  filtersSlice, changeCategory,
  changeType,
  changeLevel,
  changeMinPrice,
  changeMaxPrice,
  resetFilters,
  setTypes,
  setLevels,
} from './filters.slice';

export {
  selectCurrentCategory,
  selectCurrentType,
  selectCurrentLevel,
  selectMinPrice,
  selectMaxPrice,
  selectAllFilters, filtersSlice,
  changeCategory,
  changeType,
  changeLevel,
  changeMinPrice,
  changeMaxPrice,
  resetFilters,
  setTypes,
  setLevels,
};
