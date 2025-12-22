import { describe, it, expect } from 'vitest';
import type { AnyAction } from '@reduxjs/toolkit';
import { couponSlice, resetCoupon, setCoupon, setDiscount } from './coupon.slice';
import { checkCoupon } from '../api-action';
import { LoadingStatusEnum } from '../../const/type';
import { LoadingStatus } from '../../const/enum';

type CouponState = {
  coupon: string | null;
  discount: number;
  status: LoadingStatusEnum;
  error: string | null;
};

describe('CouponSlice', () => {
  const reducer = couponSlice.reducer;

  const makeState = (patch: Partial<CouponState> = {}): CouponState => ({
    coupon: null,
    discount: 0,
    status: LoadingStatus.Idle,
    error: null,
    ...patch,
  });

  it('should return initial state for unknown action', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' } as AnyAction) as CouponState;
    expect(state).toEqual(makeState());
  });

  it('resetCoupon resets Coupon state', () => {
    const prev = makeState({
      coupon: 'camera-333',
      discount: 15,
      status: LoadingStatus.Error,
      error: 'some error',
    });

    const next = reducer(prev, resetCoupon()) as CouponState;

    expect(next).toEqual(makeState());
  });

  it('setCoupon sets Coupon', () => {
    const prev = makeState();
    const next = reducer(prev, setCoupon('camera-444')) as CouponState;

    expect(next.coupon).toBe('camera-444');

  });

  it('setDiscount sets discount', () => {
    const prev = makeState();
    const next = reducer(prev, setDiscount(20)) as CouponState;

    expect(next.discount).toBe(20);
  });

  it('checkCoupon.pending sets loading and clears error', () => {
    const prev = makeState({ error: 'old error', status: LoadingStatus.Idle });

    const next = reducer(prev, { type: checkCoupon.pending.type } as AnyAction) as CouponState;

    expect(next.status).toBe(LoadingStatus.Loading);
    expect(next.error).toBeNull();
  });

  it('checkCoupon.fulfilled sets succeeded, discount, Coupon(meta.arg) and clears error', () => {
    const prev = makeState({ status: LoadingStatus.Loading, error: 'old error' });

    const action = {
      type: checkCoupon.fulfilled.type,
      payload: 15,
      meta: { arg: 'camera-333' },
    } as unknown as AnyAction;

    const next = reducer(prev, action) as CouponState;

    expect(next.status).toBe(LoadingStatus.Success);
    expect(next.discount).toBe(15);
    expect(next.coupon).toBe('camera-333');
    expect(next.error).toBeNull();
  });

  it('checkCoupon.rejected sets failed, resets Coupon/discount and uses payload error', () => {
    const prev = makeState({ status: LoadingStatus.Loading, coupon: 'camera-333', discount: 15 });

    const action = {
      type: checkCoupon.rejected.type,
      payload: 'Неверный промокод',
    } as unknown as AnyAction;

    const next = reducer(prev, action) as CouponState;

    expect(next.status).toBe(LoadingStatus.Error);
    expect(next.coupon).toBeNull();
    expect(next.discount).toBe(0);
    expect(next.error).toBe('Неверный промокод');
  });

  it('checkCoupon.rejected falls back to default error when payload is missing', () => {
    const prev = makeState({ status: LoadingStatus.Loading, coupon: 'camera-333', discount: 15 });

    const action = {
      type: checkCoupon.rejected.type,
      payload: undefined,
    } as unknown as AnyAction;

    const next = reducer(prev, action) as CouponState;

    expect(next.status).toBe(LoadingStatus.Error);
    expect(next.error).toBe('Неверный промокод');
  });
});
