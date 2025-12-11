import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonGoBasketConfig } from './const';
import { AppRoute } from '../../../const/enum';
import { useModal } from '../../../contexts';

function ButtonGoBasket(): JSX.Element {
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const { buttonText, buttonIcon, buttonClass } = ButtonGoBasketConfig.GoToCart;

  const handleClick = () => {
    closeModal();
    navigate(AppRoute.Basket);
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

const ButtonGoBasketMemo = memo(ButtonGoBasket);

export default ButtonGoBasketMemo;
