export type OrderState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export type OrderRequest = {
  camerasIds: number[];
  coupon: string | null;
};
