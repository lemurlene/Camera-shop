import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { OfferPromoType } from '../../const/type';
import { AppRoute } from '../../const/enum';
import { Setting } from '../../const/const';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './style.css';

type BannerPromoProps = {
  offersPromo: OfferPromoType[];
}

function BannerPromo({ offersPromo }: BannerPromoProps): JSX.Element {
  const limitedOffers = offersPromo.slice(0, Setting.MaxShowPromo);
  const shouldShowPagination = limitedOffers.length > 1;

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={
        shouldShowPagination ? {
          delay: 3000,
          disableOnInteraction: false,
        } : false
      }
      pagination={
        shouldShowPagination ? {
          clickable: true,
        } : false
      }
      slidesPerView={1}
      spaceBetween={0}
      loop={shouldShowPagination}
      className="banner-swiper"
    >
      {limitedOffers.map((offer) => (
        <SwiperSlide key={offer.id}>
          <div className="banner">
            <picture>
              <source
                type="image/webp"
                srcSet={`${offer.previewImgWebp}, ${offer.previewImgWebp2x} 2x`}
              />
              <img
                src={offer.previewImg}
                srcSet={`${offer.previewImg2x} 2x`}
                width="280"
                height="240"
                alt={offer.name}
              />
            </picture>
            <p className="banner__info">
              <span className="banner__message">Новинка!</span>
              <span className="title title--h1">{offer.name}</span>
              <span className="banner__text">Профессиональная камера от&nbsp;известного производителя</span>
              <Link className="btn" to={`${AppRoute.Catalog}/${offer.id}`}>Подробнее</Link>
            </p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default BannerPromo;
