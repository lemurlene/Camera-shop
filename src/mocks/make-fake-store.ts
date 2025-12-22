import { State } from '../store/type';
import { DefaultSort } from '../components/sort/const';
import { LoadingStatus } from '../const/enum';

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
    commentsError: null,
    postCommentError: null,
  },
  ERROR: {
    error: null,
  },
  COUPON: {
    coupon: null,
    discount: 0,
    status: LoadingStatus.Idle,
    error: null,
  },
  ORDER: {
    status: LoadingStatus.Idle,
    error: null,
  },
  ...initialState,
});
