import { offerSlice, setErrorConnectionStatusOffer } from './offer.slice';
import { getOfferInfoById } from '../api-action';
import { initialState } from './const';
import { mockOffers } from '../../mocks/mock-offers';
import { adaptOfferToClient } from '../../adapters';

describe('offer slice reducer', () => {
  it('should return initial state when passed an empty action', () => {
    const action = { type: '' };
    const result = offerSlice.reducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it('should handle setErrorConnectionStatusOffer action', () => {
    const action = setErrorConnectionStatusOffer(true);
    const result = offerSlice.reducer(initialState, action);
    expect(result.isErrorConnectionOffer).toBe(true);
  });

  describe('extraReducers for getOfferInfoById', () => {
    it('should set isLoadingOffer to true on pending', () => {
      const action = { type: getOfferInfoById.pending.type };
      const result = offerSlice.reducer(initialState, action);
      expect(result.isLoadingOffer).toBe(true);
    });

    it('should set isLoadingOffer to false and isErrorConnectionOffer to false on rejected', () => {
      const previousState = { ...initialState, isLoadingOffer: true, isErrorConnectionOffer: true };
      const action = { type: getOfferInfoById.rejected.type };
      const result = offerSlice.reducer(previousState, action);
      expect(result.isLoadingOffer).toBe(false);
      expect(result.isErrorConnectionOffer).toBe(false);
    });

    it('should set adapted offer and isLoadingOffer false on fulfilled', () => {
      const fakeOffer = mockOffers[0];
      const adaptedOffer = adaptOfferToClient(fakeOffer);

      const previousState = { ...initialState, isLoadingOffer: true };
      const action = {
        type: getOfferInfoById.fulfilled.type,
        payload: fakeOffer,
      };
      const result = offerSlice.reducer(previousState, action);

      expect(result.offer).toEqual(adaptedOffer);
      expect(result.isLoadingOffer).toBe(false);
    });

    it('should not set offer when payload is undefined on fulfilled', () => {
      const previousState = { ...initialState, isLoadingOffer: true };
      const action = {
        type: getOfferInfoById.fulfilled.type,
        payload: undefined,
      };
      const result = offerSlice.reducer(previousState, action);
      expect(result.offer).toBeNull();
      expect(result.isLoadingOffer).toBe(false);
    });
  });
});
