import { CouponState } from './type';
import { LoadingStatus } from '../../const/enum';

export const initialState: CouponState = {
  coupon: null,
  discount: 0,
  status: LoadingStatus.Idle,
  error: null,
};
