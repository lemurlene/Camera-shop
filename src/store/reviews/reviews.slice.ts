import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { initialState } from './const';

import { fetchOfferComments } from '../api-action';


const reviewsSlice = createSlice({
  name: NameSpace.Reviews,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOfferComments.pending, (state) => {
        state.isLoadingComments = true;
      })
      .addCase(fetchOfferComments.rejected, (state) => {
        state.isLoadingComments = false;
      })
      .addCase(fetchOfferComments.fulfilled, (state, action) => {
        if (action.payload) {
          state.offerComments = action.payload;
        }
        state.isLoadingComments = false;
      });
  }
});

export default reviewsSlice;
