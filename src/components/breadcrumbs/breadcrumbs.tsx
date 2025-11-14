import { Link, useLocation, useParams } from 'react-router-dom';
import { AppRoute } from '../../const/enum';
import { RouteNames } from '../../const/const';

type BreadcrumbsProps = {
  productName?: string;
};

type BreadcrumbItem = {
  label: string;
  href: AppRoute | null;
};

const breadcrumbChains: Record<AppRoute, AppRoute[]> = {
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

function Breadcrumbs({ productName }: BreadcrumbsProps): JSX.Element {
  const { pathname } = useLocation();
  const { offerId } = useParams();

  const getCurrentRoute = (): AppRoute => {
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

  const currentRoute = getCurrentRoute();
  const chain = breadcrumbChains[currentRoute];

  const breadcrumbs: BreadcrumbItem[] = [
    ...chain.map((route) => ({
      label: RouteNames[route],
      href: route
    })),
    {
      label: productName || RouteNames[currentRoute],
      href: null
    }
  ];

  return (
    <div className="breadcrumbs">
      <div className="container">
        <ul className="breadcrumbs__list">
          {breadcrumbs.map((item) => (
            <li key={`${item.label}-${item.href || 'active'}`} className="breadcrumbs__item">
              {item.href ? (
                <Link className="breadcrumbs__link" to={item.href}>
                  {item.label}
                  <svg width="5" height="8" aria-hidden="true">
                    <use xlinkHref="#icon-arrow-mini"></use>
                  </svg>
                </Link>
              ) : (
                <span className="breadcrumbs__link breadcrumbs__link--active">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Breadcrumbs;
