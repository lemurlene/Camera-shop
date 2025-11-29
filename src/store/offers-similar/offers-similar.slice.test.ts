import { offersSimilarSlice, setErrorConnectionStatusOffers } from './offers-similar.slice';
import { fetchOffersSimilar } from '../api-action';
import { initialState } from './const';
import { mockOffers } from '../../mocks/mock-offers';
import { adaptOffersToClient } from '../../adapters';

describe('offers similar slice reducer', () => {
  it('should return initial state when passed an empty action', () => {
    const action = { type: '' };
    const result = offersSimilarSlice.reducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it('should handle setErrorConnectionStatusOffers action', () => {
    const action = setErrorConnectionStatusOffers(true);
    const result = offersSimilarSlice.reducer(initialState, action);
    expect(result.isErrorConnectionOffers).toBe(true);
  });

  describe('extraReducers for fetchOffersSimilar', () => {
    it('should set isLoadingOffersSimilar to true on pending', () => {
      const action = { type: fetchOffersSimilar.pending.type };
      const result = offersSimilarSlice.reducer(initialState, action);
      expect(result.isLoadingOffersSimilar).toBe(true);
    });

    it('should set isLoadingOffersSimilar to false on rejected', () => {
      const previousState = {
        ...initialState,
        isLoadingOffersSimilar: true
      };
      const action = { type: fetchOffersSimilar.rejected.type };
      const result = offersSimilarSlice.reducer(previousState, action);
      expect(result.isLoadingOffersSimilar).toBe(false);
    });

    it('should set adapted offersSimilar and reset loading state on fulfilled with payload', () => {
      const mockSimilarOffers = mockOffers.slice(0, 3);
      const adaptedOffers = adaptOffersToClient(mockSimilarOffers);

      const previousState = {
        ...initialState,
        isLoadingOffersSimilar: true
      };
      const action = {
        type: fetchOffersSimilar.fulfilled.type,
        payload: mockSimilarOffers,
      };
      const result = offersSimilarSlice.reducer(previousState, action);

      expect(result.offersSimilar).toEqual(adaptedOffers);
      expect(result.isLoadingOffersSimilar).toBe(false);
    });

    it('should not set offersSimilar when payload is undefined on fulfilled', () => {
      const previousState = {
        ...initialState,
        isLoadingOffersSimilar: true
      };
      const action = {
        type: fetchOffersSimilar.fulfilled.type,
        payload: undefined,
      };
      const result = offersSimilarSlice.reducer(previousState, action);

      expect(result.offersSimilar).toEqual([]);
      expect(result.isLoadingOffersSimilar).toBe(false);
    });

    it('should handle empty offersSimilar array on fulfilled', () => {
      const emptyOffers: never[] = [];
      const adaptedOffers = adaptOffersToClient(emptyOffers);

      const previousState = { ...initialState, isLoadingOffersSimilar: true };
      const action = {
        type: fetchOffersSimilar.fulfilled.type,
        payload: emptyOffers,
      };
      const result = offersSimilarSlice.reducer(previousState, action);

      expect(result.offersSimilar).toEqual(adaptedOffers);
      expect(result.offersSimilar).toHaveLength(0);
      expect(result.isLoadingOffersSimilar).toBe(false);
    });
  });
});
