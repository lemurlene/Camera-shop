import { describe, it, expect } from 'vitest';
import { makeFakeStore } from '../../mocks/make-fake-store';
import {
  selectCoupon,
  selectDiscount,
  selectCouponStatus,
  selectCouponError,
  selectIsCouponLoading,
} from './';
import { NameSpace } from '../const';
import { LoadingStatus } from '../../const/enum';

describe('promo-code selectors', () => {
  it('selectCoupon returns Coupon', () => {
    const store = makeFakeStore();

    const state = {
      ...store,
      [NameSpace.Coupon]: {
        ...store[NameSpace.Coupon],
        coupon: 'camera-333',
      },
    };

    expect(selectCoupon(state)).toBe('camera-333');
  });

  it('selectDiscount returns discount', () => {
    const store = makeFakeStore();

    const state = {
      ...store,
      [NameSpace.Coupon]: {
        ...store[NameSpace.Coupon],
        discount: 15,
      },
    };

    expect(selectDiscount(state)).toBe(15);
  });

  it('selectCouponStatus returns status', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Coupon]: {
        coupon: 'camera-333',
        discount: 15,
        status: LoadingStatus.Success,
        error: null,
      },
    });

    expect(selectCouponStatus(fakeState)).toBe(LoadingStatus.Success);
  });

  it('selectCouponError returns error', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Coupon]: {
        coupon: '123456',
        discount: 0,
        status: LoadingStatus.Loading,
        error: 'Неверный промокод',
      },
    });

    expect(selectCouponError(fakeState)).toBe('Неверный промокод');
  });

  it('selectIsCouponLoading returns true when status is loading', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Coupon]: {
        coupon: '123456',
        discount: 0,
        status: LoadingStatus.Loading,
        error: null,
      },
    });

    expect(selectIsCouponLoading(fakeState)).toBe(true);
  });

  it('selectIsCouponLoading returns false when status is not loading', () => {
    const fakeState = makeFakeStore({
      [NameSpace.Coupon]: {
        coupon: null,
        discount: 0,
        status: LoadingStatus.Idle,
        error: null,
      },
    });

    expect(selectIsCouponLoading(fakeState)).toBe(false);
  });
});

