import RateMemo from '../rate';
import { ButtonAddBasketMemo } from '../buttons';

type ProductContentProps = {
  name: string;
  rating: number;
  reviewCount: number;
  price: number;
};

export const ProductContent = ({
  name,
  rating,
  reviewCount,
  price
}: ProductContentProps): JSX.Element => (
  <>
    <h1 className="title title--h3">{name}</h1>
    <RateMemo rating={rating} reviewCount={reviewCount} classPrefix='product' />
    <p className="product__price">
      <span className="visually-hidden">Цена:</span>
      {price.toLocaleString()}&nbsp;&#8381;
    </p>
    <ButtonAddBasketMemo />
  </>
);
