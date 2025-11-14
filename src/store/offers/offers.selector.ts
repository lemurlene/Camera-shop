import type { State } from '../type';
import { NameSpace } from '../const';
import { CardType } from '../../const/type';

const selectOffers = (state: State):CardType[] => state[NameSpace.Offers].offers;
const selectOffersLoading = (state: State):boolean => state[NameSpace.Offers].isLoadingOffers;
const selectErrorConnectionOffers = (state: State): boolean => state[NameSpace.Offers].isErrorConnectionOffers;

export { selectOffers, selectOffersLoading, selectErrorConnectionOffers };
