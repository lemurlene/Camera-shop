import { offersPromoSlice, setErrorConnectionOffersPromo } from './offers-promo.slice';
import { fetchOffersPromo } from '../api-action';
import { initialState } from './const';
import { mockPromoOffers } from '../../mocks/mock-promo-offers';

describe('offers promo slice reducer', () => {
  it('should return initial state when passed an empty action', () => {
    const action = { type: '' };
    const result = offersPromoSlice.reducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  it('should handle setErrorConnectionOffersPromo action', () => {
    const action = setErrorConnectionOffersPromo(true);
    const result = offersPromoSlice.reducer(initialState, action);
    expect(result.isErrorConnectionOffers).toBe(true);
  });

  describe('extraReducers for fetchOffersPromo', () => {
    it('should set isLoadingOffersPromo to true on pending', () => {
      const action = { type: fetchOffersPromo.pending.type };
      const result = offersPromoSlice.reducer(initialState, action);
      expect(result.isLoadingOffersPromo).toBe(true);
    });

    it('should set isLoadingOffersPromo to false and isErrorConnectionOffers to true on rejected', () => {
      const previousState = {
        ...initialState,
        isLoadingOffersPromo: true,
        isErrorConnectionOffers: false
      };
      const action = { type: fetchOffersPromo.rejected.type };
      const result = offersPromoSlice.reducer(previousState, action);
      expect(result.isLoadingOffersPromo).toBe(false);
      expect(result.isErrorConnectionOffers).toBe(true);
    });

    it('should set offersPromo and reset loading/error states on fulfilled', () => {
      const previousState = {
        ...initialState,
        isLoadingOffersPromo: true,
        isErrorConnectionOffers: true
      };
      const action = {
        type: fetchOffersPromo.fulfilled.type,
        payload: mockPromoOffers,
      };
      const result = offersPromoSlice.reducer(previousState, action);

      expect(result.offersPromo).toEqual(mockPromoOffers);
      expect(result.isLoadingOffersPromo).toBe(false);
      expect(result.isErrorConnectionOffers).toBe(false);
    });

    it('should handle empty offersPromo array on fulfilled', () => {
      const emptyOffers: never[] = [];
      const previousState = { ...initialState, isLoadingOffersPromo: true };
      const action = {
        type: fetchOffersPromo.fulfilled.type,
        payload: emptyOffers,
      };
      const result = offersPromoSlice.reducer(previousState, action);

      expect(result.offersPromo).toEqual(emptyOffers);
      expect(result.offersPromo).toHaveLength(0);
      expect(result.isLoadingOffersPromo).toBe(false);
      expect(result.isErrorConnectionOffers).toBe(false);
    });
  });
});
