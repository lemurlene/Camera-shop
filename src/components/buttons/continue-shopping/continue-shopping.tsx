import { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonContinueShoppingConfig } from './const';
import { AppRoute } from '../../../const/enum';
import { useModal } from '../../../contexts';

function ButtonContinueShopping(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { closeModal } = useModal();

  const catalogPath = AppRoute.Catalog;

  const { buttonText, buttonIcon, buttonClass } = ButtonContinueShoppingConfig.GoToCatalog;

  const handleClick = () => {
    closeModal();
    if (location.pathname !== catalogPath) {
      navigate(catalogPath);
    }
  };

  return (
    <button
      className={buttonClass}
      type="button"
      onClick={handleClick}
    >
      {buttonIcon}
      {buttonText}
    </button >
  );
}

const ButtonContinueShoppingMemo = memo(ButtonContinueShopping);

export default ButtonContinueShoppingMemo;
