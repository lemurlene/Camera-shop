import axios, { AxiosError } from 'axios';
import { FullOfferType, OfferPromoType, ReviewType, OrderRequestData, ErrorResponse, ReviewPostDto } from '../const/type';
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

const fetchOfferComments = createAppAsyncThunk<
  ReviewType[],
  string,
  { rejectValue: string }
>(
  `${NameSpace.Reviews}/fetchOfferComments`,
  async (id, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<ReviewType[]>(`${APIRoute.Offers}/${id}/reviews`);
      return data;
    } catch {
      return rejectWithValue('Не удалось загрузить отзывы');
    }
  }
);

const checkCoupon = createAppAsyncThunk<number, string, { rejectValue: string }>(
  `${NameSpace.Coupon}/checkCoupon`,
  async (coupon, { extra: api, rejectWithValue }) => {
    const cleanedCoupon = coupon.trim().replace(/\s/g, '');

    try {
      const { data } = await api.post<number>(APIRoute.Coupons, { coupon: cleanedCoupon });
      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 400) {
          return rejectWithValue('Неверный промокод');
        }
        return rejectWithValue('Попробуйте ещё раз.');
      }
      return rejectWithValue('Попробуйте ещё раз.');
    }
  }
);

const sendOrder = createAppAsyncThunk<void, OrderRequestData>(
  `${NameSpace.Order}/sendOrder`,
  async (orderData, { extra: api, rejectWithValue }) => {
    try {
      const coupon = orderData.coupon ? orderData.coupon.trim().replace(/\s/g, '') : null;
      const requestData = {
        camerasIds: orderData.camerasIds,
        ...(coupon ? { coupon } : {}),
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


const postOfferComment = createAppAsyncThunk<
  ReviewType,
  ReviewPostDto,
  { rejectValue: string }
>(
  `${NameSpace.Reviews}/postOfferComment`,
  async (dto, { extra: api, rejectWithValue }) => {
    try {
      const payload: ReviewPostDto = {
        cameraId: dto.cameraId,
        userName: dto.userName.trim(),
        advantage: dto.advantage.trim(),
        disadvantage: dto.disadvantage.trim(),
        review: dto.review.trim(),
        rating: dto.rating,
      };

      const { data } = await api.post<ReviewType>(APIRoute.Comments, payload);
      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue('Не удалось отправить отзыв. Попробуйте ещё раз.');
      }
      return rejectWithValue('Не удалось отправить отзыв. Попробуйте ещё раз.');
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
  sendOrder,
  postOfferComment
};
