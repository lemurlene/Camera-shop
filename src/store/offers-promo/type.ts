import { OfferPromoType } from '../../const/type';

export type InitialStateType = {
  offersPromo: OfferPromoType[];
  isLoadingOffersPromo: boolean;
  isErrorConnectionOffers: boolean;
};
