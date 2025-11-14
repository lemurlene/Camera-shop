export const SortTypes = {
  Price: 'Price',
  Popular: 'Popular'
} as const;

export const SortOrders = {
  Asc: 'asc',
  Desc: 'desc'
} as const;

export const DefaultSort = {
  type: SortTypes.Price,
  order: SortOrders.Asc
} as const;
