import { Link } from 'react-router-dom';
import { memo, useCallback, useMemo } from 'react';
import ButtonBuyMemo from '../buttons/buy';
import RateMemo from '../rate';
import { CardType } from '../../const/type';
import { AppRoute } from '../../const/enum';

type CardProps = {
  card: CardType;
  handleHover?: (id: number | null) => void;
}

function Card({ card, handleHover }: CardProps): JSX.Element {
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

  const handleMouseEnter = useCallback(() => {
    handleHover?.(id);
  }, [handleHover, id]);

  const handleMouseLeave = useCallback(() => {
    handleHover?.(null);
  }, [handleHover]);

  const eventHandlers = useMemo(() => (
    handleHover ? {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    } : {}
  ), [handleHover, handleMouseEnter, handleMouseLeave]);

  return (
    <div className="product-card"
      {...eventHandlers}
    >
      <div className="product-card__img">
        <Link to={`${AppRoute.Catalog}/${id}`}>
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
        <ButtonBuyMemo />
        <Link className="btn btn--transparent" to={`${AppRoute.Catalog}/${id}`}>
          Подробнее
        </Link>
      </div>
    </div>
  );
}

const CardMemo = memo(Card);

export default CardMemo;
