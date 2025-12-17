import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { initialState } from './const';
import { fetchOfferComments, postOfferComment } from '../api-action';

const reviewsSlice = createSlice({
  name: NameSpace.Reviews,
  initialState,
  reducers: {
    clearReviewsErrors: (state) => {
      state.commentsError = null;
      state.postCommentError = null;
    },
    clearPostCommentError: (state) => {
      state.postCommentError = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOfferComments.pending, (state) => {
        state.isLoadingComments = true;
        state.commentsError = null;
      })
      .addCase(fetchOfferComments.rejected, (state, action) => {
        state.isLoadingComments = false;
        state.commentsError = (action.payload as string) ?? 'Не удалось загрузить отзывы';
      })
      .addCase(fetchOfferComments.fulfilled, (state, action) => {
        state.isLoadingComments = false;
        state.commentsError = null;
        state.offerComments = action.payload ?? [];
      })

      .addCase(postOfferComment.pending, (state) => {
        state.isLoadingComment = true;
        state.postCommentError = null;
      })
      .addCase(postOfferComment.rejected, (state, action) => {
        state.isLoadingComment = false;
        state.postCommentError = (action.payload as string) ?? 'Не удалось отправить отзыв';
      })
      .addCase(postOfferComment.fulfilled, (state, action) => {
        state.isLoadingComment = false;
        state.postCommentError = null;
        state.offerComments = [action.payload, ...state.offerComments];
      });
  }
});

export const { clearReviewsErrors, clearPostCommentError } = reviewsSlice.actions;
export default reviewsSlice;
