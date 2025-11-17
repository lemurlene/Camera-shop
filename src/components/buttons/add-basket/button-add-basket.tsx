import { memo, useMemo } from 'react';
import cn from 'classnames';
import { ButtonAddBasketConfig } from './const';
import { useModal } from '../../../contexts';

type ButtonAddBasketProps = {
  isInCart?: boolean;
  isModal?: boolean;
}

function ButtonAddBasket({ isInCart = false, isModal = false }: ButtonAddBasketProps): JSX.Element {

  const { buttonText, buttonIcon, buttonModalClass } = useMemo(() => (
    isInCart ? ButtonAddBasketConfig.InCart : ButtonAddBasketConfig.AddToCart
  ), [isInCart]);

  const buttonClasses = cn(
    'btn btn--purple',
    {
      [buttonModalClass]: isModal && buttonModalClass
    }
  );

  const { openModal } = useModal();

  const handleClick = () => {
    openModal('success-add-cart');
  };

  return (
    <button
      className={buttonClasses}
      type="button"
      onClick={handleClick}
    >
      {!isInCart && buttonIcon}
      {buttonText}
    </button >
  );
}

const ButtonAddBasketMemo = memo(ButtonAddBasket);

export default ButtonAddBasketMemo;
