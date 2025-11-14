import { memo, useMemo } from 'react';
import cn from 'classnames';
import { ButtonBuyConfig } from './const';

type ButtonBuyProps = {
  isOffer?: boolean;
}

function ButtonBuy({ isOffer = false }: ButtonBuyProps): JSX.Element {

  const { buttonClass, buttonText, buttonIcon } = useMemo(() => (
    isOffer ? ButtonBuyConfig.Offer : ButtonBuyConfig.Card
  ), [isOffer]);

  const buttonClasses = cn(
    'btn btn--purple',
    {
      [buttonClass]: !isOffer && buttonClass
    }
  );

  return (
    <button
      className={buttonClasses}
      type="button"
    >
      {isOffer && buttonIcon}
      {buttonText}
    </button >
  );
}

const ButtonBuyMemo = memo(ButtonBuy);

export default ButtonBuyMemo;
