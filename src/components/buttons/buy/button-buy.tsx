import { memo, useMemo } from 'react';
import cn from 'classnames';
import { ButtonBuyConfig } from './const';
import { useModal, useCart } from '../../../contexts';
import { FullOfferType } from '../../../const/type';

type ButtonBuyProps = {
  isOffer?: boolean;
  product: FullOfferType;
}

function ButtonBuy({ isOffer = false, product }: ButtonBuyProps): JSX.Element {
  const { isInCart } = useCart();
  const inCart = isInCart(product.id);

  const buttonConfig = useMemo(() => {
    if (isOffer) {
      return ButtonBuyConfig.AddToCart;
    }

    if (inCart) {
      return ButtonBuyConfig.InCart;
    }

    return ButtonBuyConfig.Buy;
  }, [isOffer, inCart]);

  const { buttonClass, buttonText, buttonIcon } = buttonConfig;

  const buttonClasses = cn(
    'btn product-card__btn',
    buttonClass
  );

  const { openModal } = useModal();

  const handleButtonClick = () => {
    openModal('add-to-cart', product);
  };

  return (
    <button
      className={buttonClasses}
      type="button"
      onClick={handleButtonClick}
    >
      {buttonIcon}
      {buttonText}
    </button >
  );
}

const ButtonBuyMemo = memo(ButtonBuy);

export default ButtonBuyMemo;
