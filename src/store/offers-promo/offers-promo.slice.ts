import { createSlice, PayloadAction, } from '@reduxjs/toolkit';
import { initialState } from './const';
import { NameSpace } from '../const';
import { fetchOffersPromo } from '../api-action';

export const offersPromoSlice = createSlice({
  name: NameSpace.OffersPromo,
  initialState,
  reducers: {
    setErrorConnectionOffersPromo(state, action: PayloadAction<boolean>) {
      state.isErrorConnectionOffers = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffersPromo.pending, (state) => {
        state.isLoadingOffersPromo = true;
      })
      .addCase(fetchOffersPromo.rejected, (state) => {
        state.isLoadingOffersPromo = false;
        state.isErrorConnectionOffers = true;
      })
      .addCase(fetchOffersPromo.fulfilled, (state, action) => {
        state.offersPromo = action.payload;
        state.isLoadingOffersPromo = false;
        state.isErrorConnectionOffers = false;
      });
  }
});

export const { setErrorConnectionOffersPromo } = offersPromoSlice.actions;
