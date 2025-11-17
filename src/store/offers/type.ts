import { FullOfferType } from '../../const/type';

export type InitialStateType = {
  offers: FullOfferType[];
  isLoadingOffers: boolean;
  isErrorConnectionOffers: boolean;
};
