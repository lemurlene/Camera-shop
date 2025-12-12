export type CouponType = 'camera-333' | 'camera-444' | 'camera-555';

export type CouponState = {
  coupon: string | null;
  discount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};
