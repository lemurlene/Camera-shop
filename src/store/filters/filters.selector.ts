import { NameSpace } from '../const';
import { State } from '../type';

const selectCurrentCategory = (state: Pick<State, typeof NameSpace.Filters>) => state[NameSpace.Filters].category;
const selectCurrentType = (state: Pick<State, typeof NameSpace.Filters>) => state[NameSpace.Filters].type;
const selectCurrentLevel = (state: Pick<State, typeof NameSpace.Filters>) => state[NameSpace.Filters].level;
const selectMinPrice = (state: Pick<State, typeof NameSpace.Filters>) => state[NameSpace.Filters].minPrice;
const selectMaxPrice = (state: Pick<State, typeof NameSpace.Filters>) => state[NameSpace.Filters].maxPrice;
const selectAllFilters = (state: Pick<State, typeof NameSpace.Filters>) => state[NameSpace.Filters];

export {
  selectCurrentCategory,
  selectCurrentType,
  selectCurrentLevel,
  selectMinPrice,
  selectMaxPrice,
  selectAllFilters
};
