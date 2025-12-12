import { CouponState } from './type';

export const initialState: CouponState = {
  coupon: null,
  discount: 0,
  status: 'idle',
  error: null,
};
