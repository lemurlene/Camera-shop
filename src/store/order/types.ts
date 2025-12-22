import { LoadingStatusEnum } from '../../const/type';

export type OrderState = {
  status: LoadingStatusEnum;
  error: string | null;
};

export type OrderRequest = {
  camerasIds: number[];
  Coupon: string | null;
};
