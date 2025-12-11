import RateMemo from '../rate';
import { ButtonBuyMemo } from '../buttons';
import { FullOfferType } from '../../const/type';

type ProductContentProps = {
  name: string;
  rating: number;
  reviewCount: number;
  price: number;
  offer: FullOfferType;
};

export const ProductContent = ({
  name,
  rating,
  reviewCount,
  price,
  offer
}: ProductContentProps): JSX.Element => (
  <>
    <h1 className="title title--h3">{name}</h1>
    <RateMemo rating={rating} reviewCount={reviewCount} classPrefix='product' />
    <p className="product__price">
      <span className="visually-hidden">Цена:</span>
      {price.toLocaleString()}&nbsp;&#8381;
    </p>
    <ButtonBuyMemo isOffer product={offer} />
  </>
);
