import { State } from '../store/type';
import { DefaultSort } from '../components/sort/const';

export const makeFakeStore = (initialState?: Partial<State>): State => ({
  FILTERS: {
    category: null,
    level: [],
    type: [],
    minPrice: null,
    maxPrice: null,
  },
  SORT: {
    currentSortType: DefaultSort.type,
    currentSortOrder: DefaultSort.order,
  },
  OFFERS: {
    offers: [],
    isLoadingOffers: false,
    isErrorConnectionOffers: false,
  },
  OFFER: {
    offer: null,
    isLoadingOffer: false,
    isErrorConnectionOffer: false,
  },
  PROMO: {
    offersPromo: [],
    isLoadingOffersPromo: false,
    isErrorConnectionOffers: false,
  },
  SIMILAR: {
    offersSimilar: [],
    isLoadingOffersSimilar: false,
    isErrorConnectionOffers: false,
  },
  REVIEWS: {
    offerComments: [],
    isLoadingComments: false,
    isLoadingComment: false,
  },
  ERROR: {
    error: null,
  },
  ...initialState,
  COUPON: {
    coupon: null,
    discount: 0,
    status: 'idle',
    error: null,
  },
  ORDER: {
    status: 'idle',
    error: null,
  }
});
