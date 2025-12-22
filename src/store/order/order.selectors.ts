import { State } from '../type';
import { NameSpace } from '../const';
import { LoadingStatus } from '../../const/enum';

const selectOrderStatus = (state: State) => state[NameSpace.Order]?.status || LoadingStatus.Idle;
const selectOrderError = (state: State) => state[NameSpace.Order]?.error || null;
const selectIsOrderLoading = (state: State) => state[NameSpace.Order]?.status === LoadingStatus.Loading;
const selectIsOrderSucceeded = (state: State) => state[NameSpace.Order]?.status === LoadingStatus.Success;
const selectIsOrderFailed = (state: State) => state[NameSpace.Order]?.status === LoadingStatus.Error;

export { selectOrderStatus, selectOrderError, selectIsOrderLoading, selectIsOrderSucceeded, selectIsOrderFailed };
