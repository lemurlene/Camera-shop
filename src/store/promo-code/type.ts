import { LoadingStatusEnum } from '../../const/type';

export type CouponState = {
  coupon: string | null;
  discount: number;
  status: LoadingStatusEnum;
  error: string | null;
};
