import { AppRoute } from '../../const/enum';

export const breadcrumbChains: Record<AppRoute, AppRoute[]> = {
  [AppRoute.Root]: [],
  [AppRoute.Catalog]: [AppRoute.Root],
  [AppRoute.Offer]: [AppRoute.Root, AppRoute.Catalog],
  [AppRoute.Guarantees]: [AppRoute.Root],
  [AppRoute.Delivery]: [AppRoute.Root],
  [AppRoute.About]: [AppRoute.Root],
  [AppRoute.Basket]: [AppRoute.Root, AppRoute.Catalog],
  [AppRoute.Loading]: [AppRoute.Root],
  [AppRoute.Error404]: [AppRoute.Root],
};
