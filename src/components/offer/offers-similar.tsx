import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FullOfferType } from '../../const/type';
import { Setting } from '../../const/const';
import CardMemo from './card';
import 'swiper/css';
import 'swiper/css/navigation';
import './style.css';

type OffersSimilarProps = {
  offersSimilar: FullOfferType[];
}

function OffersSimilar({ offersSimilar }: OffersSimilarProps): JSX.Element {
  return (
    <div className="page-content__section" data-testid="offers-similar">
      <section className="product-similar">
        <div className="container">
          <h2 className="title title--h3">Похожие товары</h2>
          <div className="product-similar__slider">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.slider-controls--next',
                prevEl: '.slider-controls--prev',
                disabledClass: 'disabled'
              }}
              slidesPerView={Setting.ProductSimilarCount}
              slidesPerGroup={Setting.ProductSimilarCount}
              speed={500}
              watchOverflow
              className="product-similar__slider-list"
            >
              {offersSimilar.map((offer) => (
                <SwiperSlide key={offer.id}>
                  <CardMemo
                    data-testid="card"
                    card={offer}
                    isSlide
                  />
                </SwiperSlide>
              ))}
              <button
                className="slider-controls slider-controls--prev"
                type="button"
                aria-label="Предыдущий слайд"
              >
                <svg width="7" height="12" aria-hidden="true">
                  <use xlinkHref="#icon-arrow"></use>
                </svg>
              </button>
              <button
                className="slider-controls slider-controls--next"
                type="button"
                aria-label="Следующий слайд"
              >
                <svg width="7" height="12" aria-hidden="true">
                  <use xlinkHref="#icon-arrow"></use>
                </svg>
              </button>
            </Swiper>
          </div>
        </div>
      </section >
    </div >
  );
}

export default OffersSimilar;
