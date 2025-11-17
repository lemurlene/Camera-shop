import { createSlice, PayloadAction, } from '@reduxjs/toolkit';
import { adaptOffersToClient } from '../../adapters';
import { initialState } from './const';
import { NameSpace } from '../const';
import { fetchOffers } from '../api-action';

export const offersSlice = createSlice({
  name: NameSpace.Offers,
  initialState,
  reducers: {
    setErrorConnectionOffers(state, action: PayloadAction<boolean>) {
      state.isErrorConnectionOffers = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.isLoadingOffers = true;
      })
      .addCase(fetchOffers.rejected, (state) => {
        state.isLoadingOffers = false;
        state.isErrorConnectionOffers = true;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = adaptOffersToClient(action.payload);
        state.isLoadingOffers = false;
        state.isErrorConnectionOffers = false;
      });
  }
});

export const { setErrorConnectionOffers } = offersSlice.actions;
