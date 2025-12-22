import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from './const';
import { filtersSlice } from './filters/filters.slice';
import { sortSlice } from './sort/sort.slice';
import { errorSlice } from './error/error.slice';
import { offersSlice } from './offers/offers.slice';
import { offerSlice } from './offer/offer.slice';
import { offersPromoSlice } from './offers-promo/offers-promo.slice';
import { offersSimilarSlice } from './offers-similar/offers-similar.slice';
import reviewsSlice from './reviews/reviews.slice';
import { couponSlice } from './coupon/coupon.slice';
import { orderSlice } from './order/order.slice';

const rootReducer = combineReducers({
  [NameSpace.Filters]: filtersSlice.reducer,
  [NameSpace.Sort]: sortSlice.reducer,
  [NameSpace.Error]: errorSlice.reducer,
  [NameSpace.Offers]: offersSlice.reducer,
  [NameSpace.Offer]: offerSlice.reducer,
  [NameSpace.OffersPromo]: offersPromoSlice.reducer,
  [NameSpace.OffersSimilar]: offersSimilarSlice.reducer,
  [NameSpace.Reviews]: reviewsSlice.reducer,
  [NameSpace.Coupon]: couponSlice.reducer,
  [NameSpace.Order]: orderSlice.reducer,
});

export default rootReducer;
