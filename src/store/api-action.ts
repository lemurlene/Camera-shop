import { CardType, FullOfferType, OfferPromoType } from '../const/type';
import { APIRoute } from '../const/enum';
import { NameSpace } from './const';
import { createAppAsyncThunk } from '../hooks';

const fetchOffers = createAppAsyncThunk<CardType[], undefined>(
  `${NameSpace.Offers}/fetchOffers`,
  async (_arg, { extra: api }) => {
    const { data } = await api.get<CardType[]>(APIRoute.Offers);
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

const fetchOffersSimilar = createAppAsyncThunk<CardType[], string>(
  `${NameSpace.OffersSimilar}/fetchNearbyOffers`,
  async (id, { extra: api }) => {
    const { data } = await api.get<CardType[]>(`${APIRoute.Offers}/${id}/similar`);
    return data;
  }
);

export {
  fetchOffers,
  getOfferInfoById,
  fetchOffersPromo,
  fetchOffersSimilar
};
