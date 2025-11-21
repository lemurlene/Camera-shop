import { Link, useLocation, useParams } from 'react-router-dom';
import { getCurrentRoute, generateBreadcrumbs, BreadcrumbItem } from './utils';

type BreadcrumbsProps = {
  productName?: string;
};

function Breadcrumbs({ productName }: BreadcrumbsProps): JSX.Element {
  const { pathname } = useLocation();
  const { offerId } = useParams();
  const currentRoute = getCurrentRoute(pathname, offerId);
  const breadcrumbs: BreadcrumbItem[] = generateBreadcrumbs(currentRoute, productName);

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
