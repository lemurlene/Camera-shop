import ProductSlider from './product-slider';
import { FullOfferType } from '../../const/type';
import './style.css';

type OffersSimilarProps = {
  offersSimilar: FullOfferType[];
};

function OffersSimilar({ offersSimilar }: OffersSimilarProps): JSX.Element {
  return (
    <div className="page-content__section" data-testid="offers-similar">
      <section className="product-similar">
        <div className="container">
          <h2 className="title title--h3">Похожие товары</h2>
          <ProductSlider offers={offersSimilar} />
        </div>
      </section>
    </div>
  );
}

export default OffersSimilar;

