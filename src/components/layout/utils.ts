import { matchPath } from 'react-router-dom';
import { AppRoute } from '../../const/enum';

export const getLayoutState = (pathname: AppRoute) => {
  const isOfferPage = matchPath(AppRoute.Offer, pathname);

  let logoAriaLabel = 'Переход на главную';
  let correctStyle = {};
  let isRenderButtonUp = false;

  if (pathname === AppRoute.Root) {
    logoAriaLabel = 'Логотип';
    correctStyle = { pointerEvents: 'none', cursor: 'default' };
  } else if (isOfferPage) {
    isRenderButtonUp = true;
  }
  return { logoAriaLabel, correctStyle, isRenderButtonUp };
};

