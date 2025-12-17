export type CouponState = {
  coupon: string | null;
  discount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};
