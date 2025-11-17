import type { State } from '../type';
import { NameSpace } from '../const';
import { FullOfferType } from '../../const/type';

const selectOffers = (state: State):FullOfferType[] => state[NameSpace.Offers].offers;
const selectOffersLoading = (state: State):boolean => state[NameSpace.Offers].isLoadingOffers;
const selectErrorConnectionOffers = (state: State): boolean => state[NameSpace.Offers].isErrorConnectionOffers;

export { selectOffers, selectOffersLoading, selectErrorConnectionOffers };
