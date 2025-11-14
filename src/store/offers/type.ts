import { CardType } from '../../const/type';

export type InitialStateType = {
  offers: CardType[];
  isLoadingOffers: boolean;
  isErrorConnectionOffers: boolean;
};
