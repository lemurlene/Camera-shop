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
  const { openModal } = useModal();
  const { removeFromCart } = useCart();

  const handleClick = () => {
    removeFromCart(productId);
    openModal('success-add-cart');
  };

  return (
    <button
      className={buttonClass}
      type="button"
      onClick={handleClick}
    >
      {buttonIcon}
      {buttonText}
    </button>
  );
}

const ButtonDeleteFromBasketMemo = memo(ButtonDeleteFromBasket);

export default ButtonDeleteFromBasketMemo;
