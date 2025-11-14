import { FullOfferType } from '../../const/type';

export type InitialStateType = {
  offer: FullOfferType | null;
  isLoadingOffer: boolean;
  isErrorConnectionOffer: boolean;
};

