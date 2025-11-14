import { Link } from 'react-router-dom';
import { OfferPromoType } from '../../const/type';
import { AppRoute } from '../../const/enum';

type BannerPromoProps = {
  offersPromo: OfferPromoType[];
}

function BannerPromo({ offersPromo }: BannerPromoProps): JSX.Element {
  const {
    id,
    name,
    previewImg,
    previewImg2x,
    previewImgWebp,
    previewImgWebp2x,
  } = offersPromo[0];

  return (
    <div className="banner">
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
      <p className="banner__info">
        <span className="banner__message">Новинка!</span>
        <span className="title title--h1">{name}</span>
        <span className="banner__text">Профессиональная камера от&nbsp;известного производителя</span>
        <Link className="btn" to={`${AppRoute.Catalog}/${id}`}>Подробнее</Link>
      </p>
    </div >
  );
}

export default BannerPromo;
