import { createSlice } from '@reduxjs/toolkit';
import { sendOrder } from '../api-action';
import { initialState } from './const';
import { NameSpace } from '../const';
import { LoadingStatus } from '../../const/enum';

export const orderSlice = createSlice({
  name: NameSpace.Order,
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.status = LoadingStatus.Idle;
      state.error = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.status = LoadingStatus.Loading;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state) => {
        state.status = LoadingStatus.Success;
        state.error = null;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.status = LoadingStatus.Error;
        state.error = action.payload as string || 'Ошибка при оформлении заказа';
      });
  },
});

export const { resetOrder, clearOrderError } = orderSlice.actions;
