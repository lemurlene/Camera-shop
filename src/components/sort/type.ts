import { SortTypes, SortOrders } from './const';

export type SortType = typeof SortTypes[keyof typeof SortTypes];
export type SortOrder = typeof SortOrders[keyof typeof SortOrders];

export type SortState = {
  type: SortType;
  order: SortOrder;
};
