import { useEffect } from 'react';
import { FullOfferType } from '../../const/type';
import { useTabUrl } from '../../hooks/use-tab-url';
import ButtonBuyMemo from '../buttons/buy';
import RateMemo from '../rate';

type GetOfferProps = {
  offer: FullOfferType;
}

function Offer({ offer }: GetOfferProps): JSX.Element {
  const {
    id,
    name,
    vendorCode,
    type,
    category,
    description,
    level,
    price,
    rating,
    reviewCount,
    previewImg,
    previewImg2x,
    previewImgWebp,
    previewImgWebp2x,
  } = offer;

  const { currentTab, setTab } = useTabUrl({
    paramName: 'tab',
    defaultTab: 'description'
  });

  useEffect(() => {
    if (!currentTab) {
      setTab('description');
    }
  }, [currentTab, setTab]);

  const activeTab = (currentTab === 'specs' || currentTab === 'description')
    ? currentTab
    : 'description';

  return (
    <section className="product">
      <div className="container">
        <div className="product__img">
          <picture>
            <source
              type="image/webp"
              srcSet={`${previewImgWebp}, ${previewImgWebp2x} 2x`}
            />
            <img
              src={previewImg}
              srcSet={`${previewImg2x} 2x`}
              width="560"
              height="480"
              alt={name}
            />
          </picture>
        </div>
        <div className="product__content">
          <h1 className="title title--h3">{name}</h1>

          <RateMemo rating={rating} reviewCount={reviewCount} classPrefix='product' />

          <p className="product__price">
            <span className="visually-hidden">Цена:</span>
            {price.toLocaleString()}&nbsp;&#8381;
          </p>

          <ButtonBuyMemo isOffer />

          <div className="tabs product__tabs">
            <div className="tabs__controls product__tabs-controls">
              <button
                className={`tabs__control ${activeTab === 'specs' ? 'is-active' : ''}`}
                type="button"
                onClick={() => setTab('specs')}
              >
                Характеристики
              </button>
              <button
                className={`tabs__control ${activeTab === 'description' ? 'is-active' : ''}`}
                type="button"
                onClick={() => setTab('description')}
              >
                Описание
              </button>
            </div>

            <div className="tabs__content">
              <div className={`tabs__element ${activeTab === 'specs' ? 'is-active' : ''}`}>
                <ul className="product__tabs-list">
                  <li className="item-list">
                    <span className="item-list__title">Артикул:</span>
                    <p className="item-list__text">{vendorCode}</p>
                  </li>
                  <li className="item-list">
                    <span className="item-list__title">Категория:</span>
                    <p className="item-list__text">{category}</p>
                  </li>
                  <li className="item-list">
                    <span className="item-list__title">Тип камеры:</span>
                    <p className="item-list__text">{type}</p>
                  </li>
                  <li className="item-list">
                    <span className="item-list__title">Уровень:</span>
                    <p className="item-list__text">{level}</p>
                  </li>
                </ul>
              </div>
              <div className={`tabs__element ${activeTab === 'description' ? 'is-active' : ''}`}>
                <div className="product__tabs-text">
                  {description
                    .split(/(?<=[.!?])\s+/)
                    .filter((sentence) => sentence.trim() !== '')
                    .map((sentence) => {
                      let hash = 0;
                      for (let i = 0; i < sentence.length; i++) {
                        const char = sentence.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash;
                      }
                      return (
                        <p key={`${id}-desc-${hash}`}>
                          {sentence}
                        </p>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Offer;
