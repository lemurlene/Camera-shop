import { memo } from 'react';
import { ButtonAddBasketConfig } from './const';
import { useModal, useCart } from '../../../contexts';
import { FullOfferType } from '../../../const/type';

type ButtonAddBasketProps = {
  productId: number;
  productData: FullOfferType;
  quantity?: number;
}

function ButtonAddBasket({
  productId,
  productData,
  quantity = 1
}: ButtonAddBasketProps): JSX.Element {
  const { buttonText, buttonIcon, buttonClass } = ButtonAddBasketConfig.AddToCart;
  const { openModal } = useModal();
  const { addToCart, isInCart, updateQuantity, getItemQuantity } = useCart();

  const handleClick = () => {
    if (!isInCart(productId)) {
      addToCart(productId, productData, quantity);
    } else {
      const currentQuantity = getItemQuantity(productId);
      updateQuantity(productId, currentQuantity + quantity);
    } openModal('success-add-cart');
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

const ButtonAddBasketMemo = memo(ButtonAddBasket);

export default ButtonAddBasketMemo;
