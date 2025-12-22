import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './const';
import { NameSpace } from '../const';
import { checkCoupon } from '../api-action';
import { LoadingStatus } from '../../const/enum';

export const couponSlice = createSlice({
  name: NameSpace.Coupon,
  initialState,
  reducers: {
    resetCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      state.status = LoadingStatus.Idle;
      state.error = null;
    },
    setCoupon: (state, action: PayloadAction<string>) => {
      state.coupon = action.payload;
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkCoupon.pending, (state) => {
        state.status = LoadingStatus.Loading;
        state.error = null;
      })
      .addCase(checkCoupon.fulfilled, (state, action) => {
        state.status = LoadingStatus.Success;
        state.discount = action.payload;
        state.coupon = action.meta.arg;
        state.error = null;
      })
      .addCase(checkCoupon.rejected, (state, action) => {
        state.status = LoadingStatus.Error;
        state.error = action.payload as string || 'Неверный промокод';
        state.coupon = null;
        state.discount = 0;
      });
  },
});

export const { resetCoupon, setCoupon, setDiscount } = couponSlice.actions;
