import {
  selectOffer,
  selectOfferLoading,
  selectErrorConnection
} from './offer.selector';
import { makeFakeStore } from '../../mocks/make-fake-store';
import { NameSpace } from '../const';
import { mockOffers } from '../../mocks/mock-offers';

describe('Offer selectors', () => {
  describe('selectOffer', () => {
    it('should return offer from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offer]: {
          offer: mockOffers[0],
          isLoadingOffer: false,
          isErrorConnectionOffer: false
        },
      });

      const result = selectOffer(fakeState);

      expect(result).toEqual(mockOffers[0]);
    });

    it('should return null when offer is not set', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offer]: {
          offer: null,
          isLoadingOffer: false,
          isErrorConnectionOffer: false
        },
      });

      const result = selectOffer(fakeState);

      expect(result).toBeNull();
    });
  });

  describe('selectOfferLoading', () => {
    it('should return loading status true from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offer]: {
          offer: null,
          isLoadingOffer: true,
          isErrorConnectionOffer: false
        },
      });

      const result = selectOfferLoading(fakeState);

      expect(result).toBe(true);
    });

    it('should return loading status false from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offer]: {
          offer: mockOffers[0],
          isLoadingOffer: false,
          isErrorConnectionOffer: false
        },
      });

      const result = selectOfferLoading(fakeState);

      expect(result).toBe(false);
    });
  });

  describe('selectErrorConnection', () => {
    it('should return error connection status true from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offer]: {
          offer: null,
          isLoadingOffer: false,
          isErrorConnectionOffer: true
        },
      });

      const result = selectErrorConnection(fakeState);

      expect(result).toBe(true);
    });

    it('should return error connection status false from state', () => {
      const fakeState = makeFakeStore({
        [NameSpace.Offer]: {
          offer: mockOffers[0],
          isLoadingOffer: false,
          isErrorConnectionOffer: false
        },
      });

      const result = selectErrorConnection(fakeState);

      expect(result).toBe(false);
    });
  });
});
