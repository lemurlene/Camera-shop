import { memo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import cn from 'classnames';
import { ButtonContinueShoppingConfig } from './const';
import { AppRoute } from '../../../const/enum';
import { useModal } from '../../../contexts';

type ButtonContinueProps = {
  isHalfWidth?: boolean;
}


function ButtonContinueShopping({ isHalfWidth = false }: ButtonContinueProps): JSX.Element {
  const location = useLocation();
  const { closeModal } = useModal();

  const catalogPath = AppRoute.Catalog;

  const { buttonText, buttonIcon, buttonClass, buttonClassHalfWidth } = ButtonContinueShoppingConfig.GoToCatalog;

  const handleClick = () => {
    closeModal();
  };

  const targetPath = location.pathname !== catalogPath ? catalogPath : '';

  return (
    <Link
      to={targetPath}
      className={cn(buttonClass,
        { [buttonClassHalfWidth]: isHalfWidth })}
      onClick={handleClick}
    >
      {buttonIcon}
      {buttonText}
    </Link>
  );
}

const ButtonContinueShoppingMemo = memo(ButtonContinueShopping);

export default ButtonContinueShoppingMemo;
