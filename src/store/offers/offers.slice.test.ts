import { offersSlice, setErrorConnectionOffers } from './offers.slice';
import { fetchOffers } from '../api-action';
import { initialState } from './const';
import { mockOffers } from '../../mocks/mock-offers';
import { adaptOffersToClient } from '../../adapters';

describe('offers slice reducer', () => {
  it('should return initial state when passed an empty action', () => {
    const action = { type: '' };
    const result = offersSlice.reducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it('should handle setErrorConnectionOffers action', () => {
    const action = setErrorConnectionOffers(true);
    const result = offersSlice.reducer(initialState, action);
    expect(result.isErrorConnectionOffers).toBe(true);
  });

  describe('extraReducers for fetchOffers', () => {
    it('should set isLoadingOffers to true on pending', () => {
      const action = { type: fetchOffers.pending.type };
      const result = offersSlice.reducer(initialState, action);
      expect(result.isLoadingOffers).toBe(true);
    });

    it('should set isLoadingOffers to false and isErrorConnectionOffers to true on rejected', () => {
      const previousState = { ...initialState, isLoadingOffers: true, isErrorConnectionOffers: false };
      const action = { type: fetchOffers.rejected.type };
      const result = offersSlice.reducer(previousState, action);
      expect(result.isLoadingOffers).toBe(false);
      expect(result.isErrorConnectionOffers).toBe(true);
    });

    it('should set adapted offers and reset loading/error states on fulfilled', () => {
      const adaptedOffers = adaptOffersToClient(mockOffers);
      const previousState = {
        ...initialState,
        isLoadingOffers: true,
        isErrorConnectionOffers: true
      };
      const action = {
        type: fetchOffers.fulfilled.type,
        payload: mockOffers,
      };
      const result = offersSlice.reducer(previousState, action);

      expect(result.offers).toEqual(adaptedOffers);
      expect(result.isLoadingOffers).toBe(false);
      expect(result.isErrorConnectionOffers).toBe(false);
    });

    it('should handle empty offers array on fulfilled', () => {
      const emptyOffers: never[] = [];
      const adaptedOffers = adaptOffersToClient(emptyOffers);
      const previousState = { ...initialState, isLoadingOffers: true };
      const action = {
        type: fetchOffers.fulfilled.type,
        payload: emptyOffers,
      };
      const result = offersSlice.reducer(previousState, action);

      expect(result.offers).toEqual(adaptedOffers);
      expect(result.offers).toHaveLength(0);
      expect(result.isLoadingOffers).toBe(false);
    });
  });
});
