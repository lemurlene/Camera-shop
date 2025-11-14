import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './const';
import { NameSpace } from '../const';
import { getOfferInfoById } from '../api-action';

export const offerSlice = createSlice({
  name: NameSpace.Offer,
  initialState,
  reducers: {
    setErrorConnectionStatusOffer(state, action: PayloadAction<boolean>) {
      state.isErrorConnectionOffer = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getOfferInfoById.pending, (state) => {
        state.isLoadingOffer = true;
      })
      .addCase(getOfferInfoById.rejected, (state) => {
        state.isLoadingOffer = false;
        state.isErrorConnectionOffer = false;
      })
      .addCase(getOfferInfoById.fulfilled, (state, action) => {
        if (action.payload) {
          state.offer = action.payload;
        }
        state.isLoadingOffer = false;
      });
  }
});

export const { setErrorConnectionStatusOffer } = offerSlice.actions;
