type ProductImageProps = {
  previewImg: string;
  previewImg2x: string;
  previewImgWebp: string;
  previewImgWebp2x: string;
  name: string;
};

export const ProductImage = ({
  previewImg,
  previewImg2x,
  previewImgWebp,
  previewImgWebp2x,
  name
}: ProductImageProps): JSX.Element => (
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
);
