import {
  selectOffersSimilar,
  selectOffersSimilarLoading,
  selectErrorConnectionOffers
} from './offers-similar.selector';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';
import { mockOffers } from '../../mocks/mock-offers';

describe('OffersSimilar selectors', () => {
  describe('selectOffersSimilar', () => {
    it('should return similar offers array from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersSimilar]: {
          offersSimilar: mockOffers,
          isLoadingOffersSimilar: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersSimilar(fakeState);

      expect(result).toEqual(mockOffers);
    });

    it('should return empty array when similar offers are not set', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersSimilar]: {
          offersSimilar: [],
          isLoadingOffersSimilar: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersSimilar(fakeState);

      expect(result).toEqual([]);
    });

    it('should return correct number of similar offers', () => {
      const limitedOffers = mockOffers.slice(0, 3);
      const fakeState = makeFakeStore({
        [NameSpace.OffersSimilar]: {
          offersSimilar: limitedOffers,
          isLoadingOffersSimilar: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersSimilar(fakeState);

      expect(result).toHaveLength(limitedOffers.length);
    });
  });

  describe('selectOffersSimilarLoading', () => {
    it('should return loading status true from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersSimilar]: {
          offersSimilar: [],
          isLoadingOffersSimilar: true,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersSimilarLoading(fakeState);

      expect(result).toBe(true);
    });

    it('should return loading status false from state when similar offers are loaded', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersSimilar]: {
          offersSimilar: mockOffers,
          isLoadingOffersSimilar: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersSimilarLoading(fakeState);

      expect(result).toBe(false);
    });

    it('should return loading status false from state when similar offers array is empty', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersSimilar]: {
          offersSimilar: [],
          isLoadingOffersSimilar: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersSimilarLoading(fakeState);

      expect(result).toBe(false);
    });
  });

  describe('selectErrorConnectionOffers', () => {
    it('should return error connection status true from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersSimilar]: {
          offersSimilar: [],
          isLoadingOffersSimilar: false,
          isErrorConnectionOffers: true
        },
      });

      const result = selectErrorConnectionOffers(fakeState);

      expect(result).toBe(true);
    });

    it('should return error connection status false from state when similar offers are loaded successfully', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersSimilar]: {
          offersSimilar: mockOffers,
          isLoadingOffersSimilar: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectErrorConnectionOffers(fakeState);

      expect(result).toBe(false);
    });

    it('should return error connection status false from state when similar offers array is empty but no error', () => {
      const fakeState = makeFakeStore({
        [NameSpace.OffersSimilar]: {
          offersSimilar: [],
          isLoadingOffersSimilar: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectErrorConnectionOffers(fakeState);

      expect(result).toBe(false);
    });
  });
});
