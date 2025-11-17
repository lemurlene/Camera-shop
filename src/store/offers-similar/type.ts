import { FullOfferType } from '../../const/type';

export type InitialStateType = {
  offersSimilar: FullOfferType[];
  isLoadingOffersSimilar: boolean;
  isErrorConnectionOffers: boolean;
};
