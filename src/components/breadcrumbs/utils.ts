import { AppRoute } from '../../const/enum';
import { RouteNames } from '../../const/const';
import { breadcrumbChains } from './const';

export type BreadcrumbItem = {
  label: string;
  href: AppRoute | null;
};

export const getCurrentRoute = (pathname: string, offerId?: string): AppRoute => {
  if (offerId) {
    return AppRoute.Offer;
  }
  const exactMatch = Object.values(AppRoute).find((route) => route === pathname);
  if (exactMatch) {
    return exactMatch;
  }
  if (pathname.startsWith('/catalog/')) {
    return AppRoute.Offer;
  }
  return AppRoute.Root;
};

export const generateBreadcrumbs = (
  currentRoute: AppRoute,
  productName?: string
): BreadcrumbItem[] => {
  const chain = breadcrumbChains[currentRoute];
  return [
    ...chain.map((route) => ({
      label: RouteNames[route],
      href: route
    })),
    {
      label: productName || RouteNames[currentRoute],
      href: null
    }
  ];
};
