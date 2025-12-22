import { memo } from 'react';
import { ButtonDeleteFromBasketConfig } from './const';
import { useModal, useCart } from '../../../contexts';

type ButtonDeleteFromBasketProps = {
  productId: number;
}

function ButtonDeleteFromBasket({
  productId
}: ButtonDeleteFromBasketProps): JSX.Element {
  const { buttonText, buttonIcon, buttonClass } = ButtonDeleteFromBasketConfig.DeleteFromCart;
  const { closeModal } = useModal();
  const { removeFromCart } = useCart();

  const handleButtonClick = () => {
    removeFromCart(productId);
    closeModal();
  };

  return (
    <button
      className={buttonClass}
      type="button"
      onClick={handleButtonClick}
    >
      {buttonIcon}
      {buttonText}
    </button>
  );
}

const ButtonDeleteFromBasketMemo = memo(ButtonDeleteFromBasket);

export default ButtonDeleteFromBasketMemo;
