import { SortType, SortOrder } from './type';
import { FullOfferType, OfferSearchType } from '../../const/type';

const sortBy = {
  Price: (offers: FullOfferType[], order: SortOrder): FullOfferType[] => {
    const sorted = [...offers].sort((a, b) => a.price - b.price);
    return order === 'desc' ? sorted.reverse() : sorted;
  },
  Popular: (offers: FullOfferType[], order: SortOrder): FullOfferType[] => {
    const sorted = [...offers].sort((a, b) => b.rating - a.rating);
    return order === 'desc' ? sorted.reverse() : sorted;
  },
};

export const sortOffers = (offers: FullOfferType[], type: SortType, order: SortOrder): FullOfferType[] =>
  sortBy[type](offers, order);

export const sortOffersSearch = (offers: OfferSearchType[]): OfferSearchType[] => (
  [...offers].sort((a, b) => a.name.localeCompare(b.name))
);
