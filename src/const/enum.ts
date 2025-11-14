export enum AppRoute {
  Root = '/',
  Catalog = '/catalog',
  Offer = '/catalog/:offerId',
  Guarantees = '/guarantees',
  Delivery = '/delivery',
  About = '/about',
  Basket = '/basket',
  Loading = '/loading',
  Error404 = '*',
}

export enum LoadingStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR'
}

export enum APIRoute {
  Offers = '/cameras',
  OffersPromo = '/promo',
}
