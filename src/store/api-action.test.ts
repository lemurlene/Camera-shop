// api-action.test.ts
import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import type { Action } from 'redux';

import createApi from '../services/api';
import type { State } from './type';
import { AppThunkDispatch, extractActionsTypes } from '../mocks/mocks';

import {
  fetchOffers,
  getOfferInfoById,
  fetchOffersPromo,
  fetchOffersSimilar,
  fetchOfferComments,
  checkCoupon,
  sendOrder,
  postOfferComment,
} from './api-action';

import { APIRoute } from '../const/enum';
import { mockOffers } from '../mocks/mock-offers';
import { mockReviews } from '../mocks/mock-reviews';
import type { OrderRequestData, ReviewPostDto } from '../const/type';

const parseConfigData = (data: unknown): unknown => {
  if (typeof data !== 'string') {
    return null;
  }
  try {
    return JSON.parse(data) as unknown;
  } catch {
    return null;
  }
};

describe('Async actions', () => {
  const api = createApi();
  const mockAxiosAdapter = new MockAdapter(api);

  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);

  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    mockAxiosAdapter.reset();

    // state для этих thunk-ов не критичен; приводим к State через cast
    store = mockStoreCreator({} as unknown as State);
  });

  describe('fetchOffers', () => {
    it('dispatches pending and fulfilled when server responds 200', async () => {
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

      await store.dispatch(fetchOffers());

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const fulfilled = emitted.at(1) as ReturnType<typeof fetchOffers.fulfilled>;

      expect(types).toEqual([fetchOffers.pending.type, fetchOffers.fulfilled.type]);
      expect(fulfilled.payload).toEqual(mockOffers);
    });

    it('dispatches pending and rejected when server responds 400', async () => {
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(400, []);

      await store.dispatch(fetchOffers());

      expect(extractActionsTypes(store.getActions())).toEqual([
        fetchOffers.pending.type,
        fetchOffers.rejected.type,
      ]);
    });
  });

  describe('getOfferInfoById', () => {
    it('dispatches pending and fulfilled when server responds 200', async () => {
      const mockOffer = mockOffers[0];
      const offerId = String(mockOffer.id);

      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}`).reply(200, mockOffer);

      await store.dispatch(getOfferInfoById(offerId));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const fulfilled = emitted.at(1) as ReturnType<typeof getOfferInfoById.fulfilled>;

      expect(types).toEqual([getOfferInfoById.pending.type, getOfferInfoById.fulfilled.type]);
      expect(fulfilled.payload).toEqual(mockOffer);
    });

    it('dispatches pending and rejected when server responds 400', async () => {
      const mockOffer = mockOffers[0];
      const offerId = String(mockOffer.id);

      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}`).reply(400, null);

      await store.dispatch(getOfferInfoById(offerId));

      expect(extractActionsTypes(store.getActions())).toEqual([
        getOfferInfoById.pending.type,
        getOfferInfoById.rejected.type,
      ]);
    });
  });

  describe('fetchOffersPromo', () => {
    it('dispatches pending and fulfilled when server responds 200', async () => {
      const promoOffers = mockOffers.slice(0, 3);

      mockAxiosAdapter.onGet(APIRoute.OffersPromo).reply(200, promoOffers);

      await store.dispatch(fetchOffersPromo());

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const fulfilled = emitted.at(1) as ReturnType<typeof fetchOffersPromo.fulfilled>;

      expect(types).toEqual([fetchOffersPromo.pending.type, fetchOffersPromo.fulfilled.type]);
      expect(fulfilled.payload).toEqual(promoOffers);
    });

    it('dispatches pending and rejected when server responds 400', async () => {
      mockAxiosAdapter.onGet(APIRoute.OffersPromo).reply(400, []);

      await store.dispatch(fetchOffersPromo());

      expect(extractActionsTypes(store.getActions())).toEqual([
        fetchOffersPromo.pending.type,
        fetchOffersPromo.rejected.type,
      ]);
    });
  });

  describe('fetchOffersSimilar', () => {
    it('dispatches pending and fulfilled when server responds 200', async () => {
      const offerId = String(mockOffers[0].id);
      const similarOffers = mockOffers.slice(1, 3);

      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}/similar`).reply(200, similarOffers);

      await store.dispatch(fetchOffersSimilar(offerId));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const fulfilled = emitted.at(1) as ReturnType<typeof fetchOffersSimilar.fulfilled>;

      expect(types).toEqual([fetchOffersSimilar.pending.type, fetchOffersSimilar.fulfilled.type]);
      expect(fulfilled.payload).toEqual(similarOffers);
    });

    it('dispatches pending and rejected when server responds 400', async () => {
      const offerId = String(mockOffers[0].id);

      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}/similar`).reply(400, []);

      await store.dispatch(fetchOffersSimilar(offerId));

      expect(extractActionsTypes(store.getActions())).toEqual([
        fetchOffersSimilar.pending.type,
        fetchOffersSimilar.rejected.type,
      ]);
    });
  });

  describe('fetchOfferComments', () => {
    it('dispatches pending and fulfilled when server responds 200', async () => {
      const offerId = String(mockOffers[0].id);

      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}/reviews`).reply(200, mockReviews);

      await store.dispatch(fetchOfferComments(offerId));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const fulfilled = emitted.at(1) as ReturnType<typeof fetchOfferComments.fulfilled>;

      expect(types).toEqual([fetchOfferComments.pending.type, fetchOfferComments.fulfilled.type]);
      expect(fulfilled.payload).toEqual(mockReviews);
    });

    it('dispatches pending and rejected with rejectValue when request fails', async () => {
      const offerId = String(mockOffers[0].id);

      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}/reviews`).reply(400, []);

      await store.dispatch(fetchOfferComments(offerId));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const rejected = emitted.at(1) as ReturnType<typeof fetchOfferComments.rejected>;

      expect(types).toEqual([fetchOfferComments.pending.type, fetchOfferComments.rejected.type]);
      expect(rejected.payload).toBe('Не удалось загрузить отзывы');
    });
  });

  describe('checkCoupon', () => {
    it('dispatches pending and fulfilled when server responds 200; sends cleaned coupon in body', async () => {
      let receivedBody: unknown = null;

      mockAxiosAdapter.onPost(APIRoute.Coupons).reply((config) => {
        receivedBody = parseConfigData(config.data);
        return [200, 15];
      });

      await store.dispatch(checkCoupon(' cam era-333 '));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const fulfilled = emitted.at(1) as ReturnType<typeof checkCoupon.fulfilled>;

      expect(types).toEqual([checkCoupon.pending.type, checkCoupon.fulfilled.type]);
      expect(fulfilled.payload).toBe(15);
      expect(receivedBody).toEqual({ coupon: 'camera-333' });
    });

    it('dispatches pending and rejected with "Неверный промокод" when server responds 400', async () => {
      mockAxiosAdapter.onPost(APIRoute.Coupons).reply(400);

      await store.dispatch(checkCoupon('camera-xxx'));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const rejected = emitted.at(1) as ReturnType<typeof checkCoupon.rejected>;

      expect(types).toEqual([checkCoupon.pending.type, checkCoupon.rejected.type]);
      expect(rejected.payload).toBe('Неверный промокод');
    });

    it('dispatches pending and rejected with "Попробуйте ещё раз." when server responds 500', async () => {
      mockAxiosAdapter.onPost(APIRoute.Coupons).reply(500);

      await store.dispatch(checkCoupon('camera-333'));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const rejected = emitted.at(1) as ReturnType<typeof checkCoupon.rejected>;

      expect(types).toEqual([checkCoupon.pending.type, checkCoupon.rejected.type]);
      expect(rejected.payload).toBe('Попробуйте ещё раз.');
    });
  });

  describe('sendOrder', () => {
    it('dispatches pending and fulfilled when server responds 200; trims coupon and keeps camerasIds', async () => {
      let receivedBody: unknown = null;

      mockAxiosAdapter.onPost(APIRoute.Orders).reply((config) => {
        receivedBody = parseConfigData(config.data);
        return [200];
      });

      const orderData: OrderRequestData = {
        camerasIds: [1, 1, 2],
        coupon: ' cam era-333 ',
      };

      await store.dispatch(sendOrder(orderData));

      expect(extractActionsTypes(store.getActions())).toEqual([
        sendOrder.pending.type,
        sendOrder.fulfilled.type,
      ]);

      expect(receivedBody).toEqual({
        camerasIds: [1, 1, 2],
        coupon: 'camera-333',
      });
    });

    it('dispatches pending and fulfilled and does NOT send coupon when coupon is null', async () => {
      let receivedBody: unknown = null;

      mockAxiosAdapter.onPost(APIRoute.Orders).reply((config) => {
        receivedBody = parseConfigData(config.data);
        return [200];
      });

      const orderData: OrderRequestData = {
        camerasIds: [3, 4],
        coupon: null,
      };

      await store.dispatch(sendOrder(orderData));

      expect(extractActionsTypes(store.getActions())).toEqual([
        sendOrder.pending.type,
        sendOrder.fulfilled.type,
      ]);

      expect(receivedBody).toEqual({ camerasIds: [3, 4] });
    });

    it('dispatches pending and rejected with first message when response has messages[]', async () => {
      mockAxiosAdapter.onPost(APIRoute.Orders).reply(400, { messages: ['Текст ошибки сервера'] });

      await store.dispatch(sendOrder({ camerasIds: [1], coupon: null }));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const rejected = emitted.at(1) as ReturnType<typeof sendOrder.rejected>;

      expect(types).toEqual([sendOrder.pending.type, sendOrder.rejected.type]);
      expect(rejected.payload).toBe('Текст ошибки сервера');
    });

    it('dispatches pending and rejected with "Некорректные данные заказа" when status 400 and no messages[]', async () => {
      mockAxiosAdapter.onPost(APIRoute.Orders).reply(400, {});

      await store.dispatch(sendOrder({ camerasIds: [1], coupon: null }));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const rejected = emitted.at(1) as ReturnType<typeof sendOrder.rejected>;

      expect(types).toEqual([sendOrder.pending.type, sendOrder.rejected.type]);
      expect(rejected.payload).toBe('Некорректные данные заказа');
    });

    it('dispatches pending and rejected with default message on network error', async () => {
      mockAxiosAdapter.onPost(APIRoute.Orders).networkError();

      await store.dispatch(sendOrder({ camerasIds: [1], coupon: null }));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const rejected = emitted.at(1) as ReturnType<typeof sendOrder.rejected>;

      expect(types).toEqual([sendOrder.pending.type, sendOrder.rejected.type]);
      expect(rejected.payload).toBe('Ошибка при оформлении заказа');
    });
  });

  describe('postOfferComment', () => {
    it('dispatches pending and fulfilled when server responds 200; sends trimmed ReviewPostDto to APIRoute.Comments', async () => {
      const responseReview = mockReviews[0];

      let receivedBody: unknown = null;

      mockAxiosAdapter.onPost(APIRoute.Comments).reply((config) => {
        receivedBody = parseConfigData(config.data);
        return [200, responseReview];
      });

      const dto: ReviewPostDto = {
        cameraId: 1,
        userName: '  Кирилл  ',
        advantage: '  Недорогая  ',
        disadvantage: '  Странные звуки  ',
        review: '  Отличная камера  ',
        rating: 2,
      };

      await store.dispatch(postOfferComment(dto));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const fulfilled = emitted.at(1) as ReturnType<typeof postOfferComment.fulfilled>;

      expect(types).toEqual([postOfferComment.pending.type, postOfferComment.fulfilled.type]);
      expect(fulfilled.payload).toEqual(responseReview);

      expect(receivedBody).toEqual({
        cameraId: 1,
        userName: 'Кирилл',
        advantage: 'Недорогая',
        disadvantage: 'Странные звуки',
        review: 'Отличная камера',
        rating: 2,
      });
    });

    it('dispatches pending and rejected with rejectValue on failure', async () => {
      mockAxiosAdapter.onPost(APIRoute.Comments).reply(500);

      const dto: ReviewPostDto = {
        cameraId: 1,
        userName: 'Кирилл',
        advantage: 'Плюсы',
        disadvantage: 'Минусы',
        review: 'Комментарий',
        rating: 5,
      };

      await store.dispatch(postOfferComment(dto));

      const emitted = store.getActions();
      const types = extractActionsTypes(emitted);
      const rejected = emitted.at(1) as ReturnType<typeof postOfferComment.rejected>;

      expect(types).toEqual([postOfferComment.pending.type, postOfferComment.rejected.type]);
      expect(rejected.payload).toBe('Не удалось отправить отзыв. Попробуйте ещё раз.');
    });
  });
});
