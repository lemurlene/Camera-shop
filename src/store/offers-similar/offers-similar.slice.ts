import { createSlice, PayloadAction, } from '@reduxjs/toolkit';
import { initialState } from './const';
import { NameSpace } from '../const';
import { fetchOffersSimilar } from '../api-action';
import { adaptOffersToClient } from '../../adapters';

export const offersSimilarSlice = createSlice({
  name: NameSpace.OffersSimilar,
  initialState,
  reducers: {
    setErrorConnectionStatusOffers(state, action: PayloadAction<boolean>) {
      state.isErrorConnectionOffers = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffersSimilar.pending, (state) => {
        state.isLoadingOffersSimilar = true;
      })
      .addCase(fetchOffersSimilar.rejected, (state) => {
        state.isLoadingOffersSimilar = false;
      })
      .addCase(fetchOffersSimilar.fulfilled, (state, action) => {
        if (action.payload) {
          state.offersSimilar = adaptOffersToClient(action.payload);
        }
        state.isLoadingOffersSimilar = false;
      });
  }
});

export const { setErrorConnectionStatusOffers } = offersSimilarSlice.actions;
