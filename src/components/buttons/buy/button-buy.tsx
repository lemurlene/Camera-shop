import { memo, useMemo } from 'react';
import cn from 'classnames';
import { ButtonBuyConfig } from './const';
import { useModal } from '../../../contexts';
import { FullOfferType } from '../../../const/type';

type ButtonBuyProps = {
  isInCart?: boolean;
  product: FullOfferType;
}

function ButtonBuy({ isInCart = false, product }: ButtonBuyProps): JSX.Element {

  const { buttonClass, buttonText, buttonIcon } = useMemo(() => (
    isInCart ? ButtonBuyConfig.InCart : ButtonBuyConfig.Buy
  ), [isInCart]);

  const buttonClasses = cn(
    'btn product-card__btn',
    buttonClass
  );

  const { openModal } = useModal();

  const handleClick = () => {
    openModal('add-to-cart', product);
  };

  return (
    <button
      className={buttonClasses}
      type="button"
      onClick={handleClick}
    >
      {isInCart && buttonIcon}
      {buttonText}
    </button >
  );
}

const ButtonBuyMemo = memo(ButtonBuy);

export default ButtonBuyMemo;
