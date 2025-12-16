export enum AppRoute {
  Root = '/',
  Catalog = '/catalog',
  Offer = '/catalog/:offerId',
  Guarantees = '/guarantees',
  Delivery = '/delivery',
  About = '/about',
  Basket = '/cart',
  Loading = '/loading',
  Error404 = '*',
}

export enum APIRoute {
  Offers = '/cameras',
  OffersPromo = '/promo',
  Coupons = '/coupons',
  Orders = '/orders',
  Comments = '/reviews',
}
