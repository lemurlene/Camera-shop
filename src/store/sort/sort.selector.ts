import { NameSpace } from '../const';
import { State } from '../type';

const selectSortType = (state: Pick<State, typeof NameSpace.Sort>) =>
  state[NameSpace.Sort].currentSortType;

const selectSortOrder = (state: Pick<State, typeof NameSpace.Sort>) =>
  state[NameSpace.Sort].currentSortOrder;

export { selectSortType, selectSortOrder };
