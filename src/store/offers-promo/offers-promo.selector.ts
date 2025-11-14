import type { State } from '../type';
import { NameSpace } from '../const';
import { OfferPromoType } from '../../const/type';

const selectOffersPromo = (state: State): OfferPromoType[] => state[NameSpace.OffersPromo].offersPromo;
const selectOffersPromoLoading = (state: State): boolean => state[NameSpace.OffersPromo].isLoadingOffersPromo;
const selectErrorConnectionOffersPromo = (state: State): boolean => state[NameSpace.OffersPromo].isErrorConnectionOffers;

export { selectOffersPromo, selectOffersPromoLoading, selectErrorConnectionOffersPromo };
