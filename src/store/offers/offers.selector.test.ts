import {
  selectOffers,
  selectOffersLoading,
  selectErrorConnectionOffers
} from './offers.selector';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';
import { mockOffers } from '../../mocks/mock-offers';

describe('Offers selectors', () => {
  describe('selectOffers', () => {
    it('should return offers array from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offers]: {
          offers: mockOffers,
          isLoadingOffers: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffers(fakeState);

      expect(result).toEqual(mockOffers);
    });

    it('should return empty array when offers are not set', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offers]: {
          offers: [],
          isLoadingOffers: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffers(fakeState);

      expect(result).toEqual([]);
    });

    it('should return correct number of offers', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offers]: {
          offers: mockOffers,
          isLoadingOffers: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffers(fakeState);

      expect(result).toHaveLength(mockOffers.length);
    });
  });

  describe('selectOffersLoading', () => {
    it('should return loading status true from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offers]: {
          offers: [],
          isLoadingOffers: true,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersLoading(fakeState);

      expect(result).toBe(true);
    });

    it('should return loading status false from state when offers are loaded', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offers]: {
          offers: mockOffers,
          isLoadingOffers: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersLoading(fakeState);

      expect(result).toBe(false);
    });

    it('should return loading status false from state when offers array is empty', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offers]: {
          offers: [],
          isLoadingOffers: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectOffersLoading(fakeState);

      expect(result).toBe(false);
    });
  });

  describe('selectErrorConnectionOffers', () => {
    it('should return error connection status true from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offers]: {
          offers: [],
          isLoadingOffers: false,
          isErrorConnectionOffers: true
        },
      });

      const result = selectErrorConnectionOffers(fakeState);

      expect(result).toBe(true);
    });

    it('should return error connection status false from state when offers are loaded successfully', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offers]: {
          offers: mockOffers,
          isLoadingOffers: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectErrorConnectionOffers(fakeState);

      expect(result).toBe(false);
    });

    it('should return error connection status false from state when offers array is empty but no error', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offers]: {
          offers: [],
          isLoadingOffers: false,
          isErrorConnectionOffers: false
        },
      });

      const result = selectErrorConnectionOffers(fakeState);

      expect(result).toBe(false);
    });
  });
});
