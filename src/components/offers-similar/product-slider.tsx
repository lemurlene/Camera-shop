import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FullOfferType } from '../../const/type';
import { Setting } from '../../const/const';
import { CardMemo } from '../card';
import NavigationButton from './navigation-button';
import 'swiper/css';
import 'swiper/css/navigation';

type ProductSliderProps = {
  offers: FullOfferType[];
}

function ProductSlider({ offers }: ProductSliderProps): JSX.Element {
  return (
    <div className="product-similar__slider">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.product-similar__slider .slider-controls--next',
          prevEl: '.product-similar__slider .slider-controls--prev',
          disabledClass: 'disabled'
        }}
        slidesPerView={Setting.ProductSimilarCount}
        slidesPerGroup={Setting.ProductSimilarCount}
        speed={500}
        watchOverflow
        className="product-similar__slider-list"
      >
        {offers.map((offer) => (
          <SwiperSlide key={offer.id}>
            <CardMemo
              data-testid="card"
              card={offer}
              isSlide
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <NavigationButton direction="prev" />
      <NavigationButton direction="next" />
    </div>
  );
}

export default ProductSlider;
