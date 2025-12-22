import { OrderState } from './types';
import { LoadingStatus } from '../../const/enum';

export const initialState: OrderState = {
  status: LoadingStatus.Idle,
  error: null,
};
