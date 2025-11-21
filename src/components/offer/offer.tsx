import { FullOfferType } from '../../const/type';
import { useOfferTabs } from './use-offer-tabs';
import { ProductImage } from './product-image';
import { ProductContent } from './product-content';
import { ProductTabs } from './product-tabs';

type OfferProps = {
  offer: FullOfferType;
};

function Offer({ offer }: OfferProps): JSX.Element {
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

  const { activeTab, setTab } = useOfferTabs();

  const handleTabChange = (tab: 'specs' | 'description') => {
    setTab(tab);
  };

  return (
    <section className="product">
      <div className="container">
        <ProductImage
          previewImg={previewImg}
          previewImg2x={previewImg2x}
          previewImgWebp={previewImgWebp}
          previewImgWebp2x={previewImgWebp2x}
          name={name}
        />
        <div className="product__content">
          <ProductContent
            name={name}
            rating={rating}
            reviewCount={reviewCount}
            price={price}
          />
          <ProductTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            vendorCode={vendorCode}
            category={category}
            type={type}
            level={level}
            description={description}
            id={id}
          />
        </div>
      </div>
    </section>
  );
}

export default Offer;
