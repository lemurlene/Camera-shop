import { OfferListMemo } from '.';
import { CardType } from '../../const/type';
import { Setting } from '../../const/const';

type GetPlacesProps = {
  offersSimilar: CardType[];
}

function OffersSimilar({ offersSimilar }: GetPlacesProps): JSX.Element {
  const ProductSimilarCount = Setting.ProductSimilarCount;
  return (
    <section className="product-similar" data-testid="offers-near">
      <div className="container">
        <h2 className="title title&#45;&#45;h3">Похожие товары</h2>
        <div className="product-similar__slider">
          <div className="product-similar__slider-list">
            <OfferListMemo offers={offersSimilar} cardsCount={ProductSimilarCount} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default OffersSimilar;
