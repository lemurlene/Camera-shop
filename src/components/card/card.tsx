import { Link } from 'react-router-dom';
import { memo } from 'react';
import { ButtonBuyMemo } from '../buttons';
import RateMemo from '../rate';
import { FullOfferType } from '../../const/type';
import { AppRoute } from '../../const/enum';

type CardProps = {
  card: FullOfferType;
  isSlide?: boolean;
}

function Card({ card, isSlide = false }: CardProps): JSX.Element {
  const {
    id,
    name,
    price,
    rating,
    reviewCount,
    previewImg,
    previewImg2x,
    previewImgWebp,
    previewImgWebp2x,
  } = card;

  const cardClassName = `product-card${isSlide ? ' is-active' : ''}`;

  return (
    <div className={cardClassName}>
      <div className="product-card__img">
        <Link to={`${AppRoute.Catalog}/${id}?tab=description`}>
          <picture>
            <source
              type="image/webp"
              srcSet={`${previewImgWebp}, ${previewImgWebp2x} 2x`}
            />
            <img
              src={previewImg}
              srcSet={`${previewImg2x} 2x`}
              width="280"
              height="240"
              alt={name}
              loading="lazy"
            />
          </picture>
        </Link>
      </div>
      <div className="product-card__info">
        <RateMemo rating={rating} reviewCount={reviewCount} classPrefix='product-card' />
        <p className="product-card__title">{name}</p>
        <p className="product-card__price">
          <span className="visually-hidden">
            Цена:
          </span>
          {price.toLocaleString()}&nbsp;&#8381;
        </p>
      </div>
      <div className="product-card__buttons">
        <ButtonBuyMemo product={card} />
        <Link className="btn btn--transparent" to={`${AppRoute.Catalog}/${id}`}>
          Подробнее
        </Link>
      </div>
    </div >
  );
}

const CardMemo = memo(Card);

export default CardMemo;
