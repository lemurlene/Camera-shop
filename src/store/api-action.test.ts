import { configureMockStore } from '@jedmao/redux-mock-store';
import createApi from '../services/api';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { Action } from 'redux';
import { AppThunkDispatch, extractActionsTypes } from '../mocks/mocks';
import { State } from './type';
import {
  fetchOffers,
  getOfferInfoById,
  fetchOffersPromo,
  fetchOffersSimilar,
  fetchOfferComments
} from './api-action';
import { APIRoute } from '../const/enum';
import { mockOffers } from '../mocks/mock-offers';
import { mockReviews } from '../mocks/mock-reviews';

describe('Async actions', () => {
  const axios = createApi();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({
      OFFERS: {
        offers: [],
        isLoadingOffers: false,
        isErrorConnectionOffers: false,
      },
    });
  });

  describe('fetchOffers', () => {
    it('should dispatch "fetchOffers.pending" and "fetchOffers.fulfilled" when server response 200', async () => {
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

      await store.dispatch(fetchOffers());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOffersFulfilled = emittedActions.at(1) as ReturnType<typeof fetchOffers.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchOffers.pending.type,
        fetchOffers.fulfilled.type,
      ]);

      expect(fetchOffersFulfilled.payload).toEqual(mockOffers);
    });

    it('should dispatch "fetchOffers.pending" and "fetchOffers.rejected" when server response 400', async () => {
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(400, []);

      await store.dispatch(fetchOffers());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchOffers.pending.type,
        fetchOffers.rejected.type,
      ]);
    });
  });

  describe('getOfferInfoById', () => {
    it('should dispatch "getOfferInfoById.pending" and "getOfferInfoById.fulfilled" when server response 200', async () => {
      const mockOffer = mockOffers[0];
      const offerId = String(mockOffer.id);
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}`).reply(200, mockOffer);

      await store.dispatch(getOfferInfoById(offerId));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const getOfferInfoByIdFulfilled = emittedActions.at(1) as ReturnType<typeof getOfferInfoById.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        getOfferInfoById.pending.type,
        getOfferInfoById.fulfilled.type,
      ]);

      expect(getOfferInfoByIdFulfilled.payload).toEqual(mockOffer);
    });

    it('should dispatch "getOfferInfoById.pending" and "getOfferInfoById.rejected" when server response 400', async () => {
      const mockOffer = mockOffers[0];
      const offerId = String(mockOffer.id);
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}`).reply(400, null);

      await store.dispatch(getOfferInfoById(offerId));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        getOfferInfoById.pending.type,
        getOfferInfoById.rejected.type,
      ]);
    });
  });

  describe('fetchOffersPromo', () => {
    it('should dispatch "fetchOffersPromo.pending" and "fetchOffersPromo.fulfilled" when server response 200', async () => {
      const mockPromoOffers = mockOffers.slice(0, 3);
      mockAxiosAdapter.onGet(APIRoute.OffersPromo).reply(200, mockPromoOffers);

      await store.dispatch(fetchOffersPromo());

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOffersPromoFulfilled = emittedActions.at(1) as ReturnType<typeof fetchOffersPromo.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchOffersPromo.pending.type,
        fetchOffersPromo.fulfilled.type,
      ]);

      expect(fetchOffersPromoFulfilled.payload).toEqual(mockPromoOffers);
    });

    it('should dispatch "fetchOffersPromo.pending" and "fetchOffersPromo.rejected" when server response 400', async () => {
      mockAxiosAdapter.onGet(APIRoute.OffersPromo).reply(400, []);

      await store.dispatch(fetchOffersPromo());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchOffersPromo.pending.type,
        fetchOffersPromo.rejected.type,
      ]);
    });
  });

  describe('fetchOffersSimilar', () => {
    it('should dispatch "fetchOffersSimilar.pending" and "fetchOffersSimilar.fulfilled" when server response 200', async () => {
      const mockOffer = mockOffers[0];
      const similarOffers = mockOffers.slice(1, 3);
      const offerId = String(mockOffer.id);
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}/similar`).reply(200, similarOffers);

      await store.dispatch(fetchOffersSimilar(offerId));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOffersSimilarFulfilled = emittedActions.at(1) as ReturnType<typeof fetchOffersSimilar.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchOffersSimilar.pending.type,
        fetchOffersSimilar.fulfilled.type,
      ]);

      expect(fetchOffersSimilarFulfilled.payload).toEqual(similarOffers);
    });

    it('should dispatch "fetchOffersSimilar.pending" and "fetchOffersSimilar.rejected" when server response 400', async () => {
      const mockOffer = mockOffers[0];
      const offerId = String(mockOffer.id);
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}/similar`).reply(400, []);

      await store.dispatch(fetchOffersSimilar(offerId));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchOffersSimilar.pending.type,
        fetchOffersSimilar.rejected.type,
      ]);
    });
  });

  describe('fetchOfferComments', () => {
    it('should dispatch "fetchOfferComments.pending" and "fetchOfferComments.fulfilled" when server response 200', async () => {
      const mockOffer = mockOffers[0];
      const offerId = String(mockOffer.id);
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}/reviews`).reply(200, mockReviews);

      await store.dispatch(fetchOfferComments(offerId));

      const emittedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emittedActions);
      const fetchOfferCommentsFulfilled = emittedActions.at(1) as ReturnType<typeof fetchOfferComments.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        fetchOfferComments.pending.type,
        fetchOfferComments.fulfilled.type,
      ]);

      expect(fetchOfferCommentsFulfilled.payload).toEqual(mockReviews);
    });

    it('should dispatch "fetchOfferComments.pending" and "fetchOfferComments.rejected" when server response 400', async () => {
      const mockOffer = mockOffers[0];
      const offerId = String(mockOffer.id);
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}/reviews`).reply(400, []);

      await store.dispatch(fetchOfferComments(offerId));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchOfferComments.pending.type,
        fetchOfferComments.rejected.type,
      ]);
    });
  });
});
