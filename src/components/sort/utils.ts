import { SortType, SortOrder } from './type';
import { CardType } from '../../const/type';

const sortBy = {
  Price: (offers: CardType[], order: SortOrder): CardType[] => {
    const sorted = [...offers].sort((a, b) => a.price - b.price);
    return order === 'desc' ? sorted.reverse() : sorted;
  },
  Popular: (offers: CardType[], order: SortOrder): CardType[] => {
    const sorted = [...offers].sort((a, b) => b.rating - a.rating);
    return order === 'desc' ? sorted.reverse() : sorted;
  },
};

export const sortOffers = (offers: CardType[], type: SortType, order: SortOrder): CardType[] =>
  sortBy[type](offers, order);
