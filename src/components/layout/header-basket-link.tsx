import { Link } from 'react-router-dom';
import { memo } from 'react';
import { AppRoute } from '../../const/enum';

function HeaderBasketLink(): JSX.Element {
  return (
    <Link className="header__basket-link" to={AppRoute.Basket}>
      <svg width="16" height="16" aria-hidden="true">
        <use xlinkHref="#icon-basket"></use>
      </svg>
    </Link>
  );
}

const HeaderBasketLinkMemo = memo(HeaderBasketLink);

export default HeaderBasketLinkMemo;
