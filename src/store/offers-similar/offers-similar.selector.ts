import type { State } from '../type';
import { NameSpace } from '../const';
import { FullOfferType } from '../../const/type';

const selectOffersSimilar = (state: State):FullOfferType[] => state[NameSpace.OffersSimilar].offersSimilar;
const selectOffersSimilarLoading = (state: State):boolean => state[NameSpace.OffersSimilar].isLoadingOffersSimilar;
const selectErrorConnectionOffers = (state: State): boolean => state[NameSpace.OffersSimilar].isErrorConnectionOffers;

export { selectOffersSimilar, selectOffersSimilarLoading, selectErrorConnectionOffers };
