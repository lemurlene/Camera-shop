import { AppRoute } from '../../../const/enum';

export const getLayoutState = (pathname: AppRoute) => {
  let logoAriaLabel = 'Переход на главную';
  let correctStyle = {};

  if (pathname === AppRoute.Root) {
    logoAriaLabel = 'Логотип';
    correctStyle = { pointerEvents: 'none', cursor: 'default' };
  }
  return { logoAriaLabel, correctStyle };
};

