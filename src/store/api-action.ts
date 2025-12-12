import { AxiosError } from 'axios';
import { FullOfferType, OfferPromoType, ReviewType, OrderRequestData, ErrorResponse } from '../const/type';
import { APIRoute } from '../const/enum';
import { NameSpace } from './const';
import { createAppAsyncThunk } from '../hooks';

const fetchOffers = createAppAsyncThunk<FullOfferType[], undefined>(
  `${NameSpace.Offers}/fetchOffers`,
  async (_arg, { extra: api }) => {
    const { data } = await api.get<FullOfferType[]>(APIRoute.Offers);
    return data;
  }
);

const getOfferInfoById = createAppAsyncThunk<FullOfferType, string>(
  `${NameSpace.Offer}/getOfferInfo`,
  async (id, { extra: api }) => {
    const { data } = await api.get<FullOfferType>(`${APIRoute.Offers}/${id}`);
    return data;
  }
);

const fetchOffersPromo = createAppAsyncThunk<OfferPromoType[], undefined>(
  `${NameSpace.OffersPromo}/fetchPromoOffers`,
  async (_arg, { extra: api }) => {
    const { data } = await api.get<OfferPromoType[]>(APIRoute.OffersPromo);
    return data;
  }
);

const fetchOffersSimilar = createAppAsyncThunk<FullOfferType[], string>(
  `${NameSpace.OffersSimilar}/fetchNearbyOffers`,
  async (id, { extra: api }) => {
    const { data } = await api.get<FullOfferType[]>(`${APIRoute.Offers}/${id}/similar`);
    return data;
  }
);

const fetchOfferComments = createAppAsyncThunk<ReviewType[], string>(
  `${NameSpace.Reviews}/fetchOfferComments`,
  async (id, { extra: api }) => {
    const { data } = await api.get<ReviewType[]>(`${APIRoute.Offers}/${id}/reviews`);
    return data;
  }
);

const checkCoupon = createAppAsyncThunk<number, string>(
  `${NameSpace.Coupon}/checkCoupon`,
  async (coupon, { extra: api, rejectWithValue }) => {
    try {
      const cleanedCoupon = coupon.trim().replace(/\s/g, '');
      const { data } = await api.post<number>(APIRoute.Coupons, {
        coupon: cleanedCoupon
      });

      return data;
    } catch (error) {
      return rejectWithValue('Неверный промокод');
    }
  }
);

const sendOrder = createAppAsyncThunk<void, OrderRequestData>(
  `${NameSpace.Order}/sendOrder`,
  async (orderData, { extra: api, rejectWithValue }) => {
    try {
      let coupon = orderData.coupon;
      if (coupon) {
        coupon = coupon.trim().replace(/\s/g, '');
        const validCoupons = ['camera-333', 'camera-444', 'camera-555'] as const;
        if (!validCoupons.includes(coupon as typeof validCoupons[number])) {
          coupon = null;
        }
      }

      const requestData = {
        camerasIds: orderData.camerasIds,
        ...(coupon && { coupon })
      };
      await api.post(APIRoute.Orders, requestData);

    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = 'Ошибка при оформлении заказа';

      if (axiosError.response) {
        if (axiosError.response.data?.messages && Array.isArray(axiosError.response.data.messages)) {
          errorMessage = axiosError.response.data.messages[0] || errorMessage;
        } else if (axiosError.response.status === 400) {
          errorMessage = 'Некорректные данные заказа';
        }
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export {
  fetchOffers,
  getOfferInfoById,
  fetchOffersPromo,
  fetchOffersSimilar,
  fetchOfferComments,
  checkCoupon,
  sendOrder
};
