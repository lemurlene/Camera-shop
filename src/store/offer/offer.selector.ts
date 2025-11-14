import type { State } from '../type';
import { NameSpace } from '../const';
import { FullOfferType } from '../../const/type';

const selectOffer = (state: State):FullOfferType | null => state[NameSpace.Offer].offer;
const selectOfferLoading = (state: State):boolean => state[NameSpace.Offer].isLoadingOffer;
const selectErrorConnection = (state: State): boolean => state[NameSpace.Offer].isErrorConnectionOffer;

export {selectOffer, selectOfferLoading, selectErrorConnection};
