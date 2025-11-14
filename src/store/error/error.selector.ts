import { NameSpace } from '../const';
import { State } from '../type';

const selectError = (state: State): string | null => state[NameSpace.Error].error;

export { selectError };
