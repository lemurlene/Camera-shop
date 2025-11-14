import type { State } from '../type';
import { NameSpace } from '../const';
import { CardType } from '../../const/type';

const selectOffersSimilar = (state: State):CardType[] => state[NameSpace.OffersSimilar].offersSimilar;
const selectOffersSimilarLoading = (state: State):boolean => state[NameSpace.OffersSimilar].isLoadingOffersSimilar;
const selectErrorConnectionOffers = (state: State): boolean => state[NameSpace.OffersSimilar].isErrorConnectionOffers;

export { selectOffersSimilar, selectOffersSimilarLoading, selectErrorConnectionOffers };
