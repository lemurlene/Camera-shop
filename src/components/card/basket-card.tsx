import { memo, ReactNode } from 'react';
import { FullOfferType } from '../../const/type';

type BasketCardProps = {
  card: FullOfferType;
  isModal?: boolean;
  children?: ReactNode;
}

function BasketCard({ card, isModal = false, children }: BasketCardProps): JSX.Element {
  const {
    name,
    vendorCode,
    type,
    category,
    level,
    price,
    previewImg,
    previewImg2x,
    previewImgWebp,
    previewImgWebp2x,
  } = card;

  const blockPrice = (
    <p className="basket-item__price">
      <span className="visually-hidden">Цена:</span>
      {price.toLocaleString()}&nbsp;&#8381;
    </p>);

  return (
    <>
      <div className="basket-item__img">
        <picture>
          <source
            type="image/webp"
            srcSet={`${previewImgWebp}, ${previewImgWebp2x} 2x`}
          />
          <img
            src={previewImg}
            srcSet={`${previewImg2x} 2x`}
            width="140"
            height="120"
            alt={name}
            loading="lazy"
          />
        </picture>
      </div>
      <div className="basket-item__description">
        <p className="basket-item__title">{name}</p>
        <ul className="basket-item__list">
          <li className="basket-item__list-item">
            <span className="basket-item__article">Артикул:&nbsp;</span>
            <span className="basket-item__number">{vendorCode}</span>
          </li>
          <li className="basket-item__list-item">{type} {category.toLowerCase()}</li>
          <li className="basket-item__list-item">{level} уровень</li>
        </ul>
        {isModal && blockPrice}
      </div>
      {!isModal && blockPrice}
      {children}
    </>
  );
}

const BasketCardMemo = memo(BasketCard);

export default BasketCardMemo;
