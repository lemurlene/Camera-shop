import { useMemo, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { ButtonContinueShoppingConfig } from './const';
import { AppRoute } from '../../../const/enum';
import { useModal } from '../../../contexts';

type ButtonContinueProps = {
  isHalfWidth?: boolean;
  isOrder?: boolean;
}

function ButtonContinueShopping({ isHalfWidth = false, isOrder = false }: ButtonContinueProps): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const catalogPath = AppRoute.Catalog;

  const buttonConfig = useMemo(() => {
    if (isOrder) {
      return ButtonContinueShoppingConfig.BackToCatalog;
    }
    return ButtonContinueShoppingConfig.GoToCatalog;
  }, [isOrder]);

  const { buttonText, buttonIcon, buttonClass, buttonClassHalfWidth } = buttonConfig;

  const handleButtonClick = () => {
    closeModal();
    if (location.pathname !== catalogPath) {
      navigate(catalogPath);
    }
  };

  return (
    <button
      className={cn(buttonClass,
        { [buttonClassHalfWidth]: isHalfWidth })}
      onClick={handleButtonClick}
    >
      {buttonIcon}
      {buttonText}
    </button>
  );
}

const ButtonContinueShoppingMemo = memo(ButtonContinueShopping);

export default ButtonContinueShoppingMemo;
