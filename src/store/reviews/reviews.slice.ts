import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { initialState } from './const';

import { fetchOfferComments, postOfferComment } from '../api-action';


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
      })
      .addCase(postOfferComment.pending, (state) => {
        state.isLoadingComment = true;
      })
      .addCase(postOfferComment.rejected, (state) => {
        state.isLoadingComment = false;
      })
      .addCase(postOfferComment.fulfilled, (state, action) => {
        state.offerComments = state.offerComments.concat([action.payload]);
        state.isLoadingComment = false;
      });
  }
});

export default reviewsSlice;
