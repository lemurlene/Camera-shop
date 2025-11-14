import { CardType } from '../../const/type';

export type InitialStateType = {
  offersSimilar: CardType[];
  isLoadingOffersSimilar: boolean;
  isErrorConnectionOffers: boolean;
};
