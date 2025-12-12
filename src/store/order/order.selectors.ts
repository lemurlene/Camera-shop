import { State } from '../type';
import { NameSpace } from '../const';

const selectOrderStatus = (state: State) => state[NameSpace.Order]?.status || 'idle';
const selectOrderError = (state: State) => state[NameSpace.Order]?.error || null;
const selectIsOrderLoading = (state: State) => state[NameSpace.Order]?.status === 'loading';
const selectIsOrderSucceeded = (state: State) => state[NameSpace.Order]?.status === 'succeeded';
const selectIsOrderFailed = (state: State) => state[NameSpace.Order]?.status === 'failed';

export { selectOrderStatus, selectOrderError, selectIsOrderLoading, selectIsOrderSucceeded, selectIsOrderFailed };
