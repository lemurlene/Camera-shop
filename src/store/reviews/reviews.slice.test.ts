import reviewsSlice from './reviews.slice';
import { fetchOfferComments } from '../api-action';
import { initialState } from './const';
import { mockReviews } from '../../mocks/mock-reviews';

describe('reviews slice reducer', () => {
  it('should return initial state when passed an empty action', () => {
    const action = { type: '' };
    const result = reviewsSlice.reducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  describe('extraReducers for fetchOfferComments', () => {
    it('should set isLoadingComments to true on pending', () => {
      const action = { type: fetchOfferComments.pending.type };
      const result = reviewsSlice.reducer(initialState, action);
      expect(result.isLoadingComments).toBe(true);
    });

    it('should set isLoadingComments to false on rejected', () => {
      const previousState = {
        ...initialState,
        isLoadingComments: true
      };
      const action = { type: fetchOfferComments.rejected.type };
      const result = reviewsSlice.reducer(previousState, action);
      expect(result.isLoadingComments).toBe(false);
    });

    it('should set offerComments and reset loading state on fulfilled with payload', () => {
      const mockComments = mockReviews.slice(0, 3);
      const previousState = {
        ...initialState,
        isLoadingComments: true
      };
      const action = {
        type: fetchOfferComments.fulfilled.type,
        payload: mockComments,
      };
      const result = reviewsSlice.reducer(previousState, action);

      expect(result.offerComments).toEqual(mockComments);
      expect(result.isLoadingComments).toBe(false);
    });

    it('should not set offerComments when payload is undefined on fulfilled', () => {
      const previousState = {
        ...initialState,
        isLoadingComments: true
      };
      const action = {
        type: fetchOfferComments.fulfilled.type,
        payload: undefined,
      };
      const result = reviewsSlice.reducer(previousState, action);

      expect(result.offerComments).toEqual([]);
      expect(result.isLoadingComments).toBe(false);
    });

    it('should handle empty comments array on fulfilled', () => {
      const emptyComments: never[] = [];
      const previousState = { ...initialState, isLoadingComments: true };
      const action = {
        type: fetchOfferComments.fulfilled.type,
        payload: emptyComments,
      };
      const result = reviewsSlice.reducer(previousState, action);

      expect(result.offerComments).toEqual(emptyComments);
      expect(result.offerComments).toHaveLength(0);
      expect(result.isLoadingComments).toBe(false);
    });
  });
});
