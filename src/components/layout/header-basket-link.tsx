import { Link } from 'react-router-dom';
import { memo } from 'react';
import { AppRoute } from '../../const/enum';
import { useCart } from '../../contexts';

function HeaderBasketLink(): JSX.Element {
  const { getTotalQuantity } = useCart();
  const totalItems = getTotalQuantity();

  return (
    <Link className="header__basket-link" to={AppRoute.Basket}>
      <svg width="16" height="16" aria-hidden="true">
        <use xlinkHref="#icon-basket"></use>
      </svg>
      {totalItems > 0 && (
        <span className="header__basket-count">{totalItems}</span>
      )}
    </Link>
  );
}

const HeaderBasketLinkMemo = memo(HeaderBasketLink);

export default HeaderBasketLinkMemo;
