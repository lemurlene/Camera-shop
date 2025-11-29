import {
  selectOffersPromo,
  selectOffersPromoLoading,
  selectErrorConnectionOffersPromo
} from './offers-promo.selector';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';
import { mockPromoOffers } from '../../mocks/mock-promo-offers';

describe('OffersPromo selectors', () => {
  describe('selectOffersPromo', () => {
    it('should return promo offers array from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersPromo]: {
          offersPromo: mockPromoOffers,
          isLoadingOffersPromo: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersPromo(fakeState);

      expect(result).toEqual(mockPromoOffers);
    });

    it('should return empty array when promo offers are not set', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersPromo]: {
          offersPromo: [],
          isLoadingOffersPromo: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersPromo(fakeState);

      expect(result).toEqual([]);
    });

    it('should return correct number of promo offers', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersPromo]: {
          offersPromo: mockPromoOffers,
          isLoadingOffersPromo: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersPromo(fakeState);

      expect(result).toHaveLength(mockPromoOffers.length);
    });
  });

  describe('selectOffersPromoLoading', () => {
    it('should return loading status true from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersPromo]: {
          offersPromo: [],
          isLoadingOffersPromo: true,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersPromoLoading(fakeState);

      expect(result).toBe(true);
    });

    it('should return loading status false from state when promo offers are loaded', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersPromo]: {
          offersPromo: mockPromoOffers,
          isLoadingOffersPromo: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersPromoLoading(fakeState);

      expect(result).toBe(false);
    });

    it('should return loading status false from state when promo offers array is empty', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersPromo]: {
          offersPromo: [],
          isLoadingOffersPromo: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersPromoLoading(fakeState);

      expect(result).toBe(false);
    });
  });

  describe('selectErrorConnectionOffersPromo', () => {
    it('should return error connection status true from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersPromo]: {
          offersPromo: [],
          isLoadingOffersPromo: false,
          isErrorConnectionOffers: true
        },
      });

      const result = selectErrorConnectionOffersPromo(fakeState);

      expect(result).toBe(true);
    });

    it('should return error connection status false from state when promo offers are loaded successfully', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersPromo]: {
          offersPromo: mockPromoOffers,
          isLoadingOffersPromo: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectErrorConnectionOffersPromo(fakeState);

      expect(result).toBe(false);
    });

    it('should return error connection status false from state when promo offers array is empty but no error', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersPromo]: {
          offersPromo: [],
          isLoadingOffersPromo: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectErrorConnectionOffersPromo(fakeState);

      expect(result).toBe(false);
    });
  });
});
