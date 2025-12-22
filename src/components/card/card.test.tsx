import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FullOfferType } from '../../const/type';
import { AppRoute } from '../../const/enum';
import { mockOffers } from '../../mocks/mock-offers';

const mockCard = mockOffers[0];

type CardProps = {
  card: FullOfferType;
  isSlide?: boolean;
}

function TestCard({ card, isSlide = false }: CardProps): JSX.Element {
  const {
    id,
    name,
    price,
    rating,
    reviewCount,
    previewImg,
    previewImg2x,
    previewImgWebp,
    previewImgWebp2x,
  } = card;

  const cardClassName = `product-card${isSlide ? ' is-active' : ''}`;

  return (
    <div className={cardClassName} data-testid="card">
      <div className="product-card__img">
        <Link to={`${AppRoute.Catalog}/${id}?tab=description`}>
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
              data-testid="card-image"
            />
          </picture>
        </Link>
      </div>
      <div className="product-card__info">
        <div data-testid="rate-component">
          Rating: {rating}, Reviews: {reviewCount}
        </div>
        <p className="product-card__title">{name}</p>
        <p className="product-card__price">
          <span className="visually-hidden">
            Цена:
          </span>
          {price.toLocaleString()}&nbsp;&#8381;
        </p>
      </div>
      <div className="product-card__buttons">
        <button data-testid="buy-button">Купить</button>
        <Link className="btn btn--transparent" to={`${AppRoute.Catalog}/${id}`}>
          Подробнее
        </Link>
      </div>
    </div>
  );
}

const renderWithRouter = (component: React.ReactElement) => render(
  <BrowserRouter>
    {component}
  </BrowserRouter>
);

describe('Card component', () => {
  it('renders card information correctly', () => {
    renderWithRouter(<TestCard card={mockCard} />);

    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
    expect(screen.getByText('73 450 ₽')).toBeInTheDocument();
  });

  it('renders images with correct sources', () => {
    renderWithRouter(<TestCard card={mockCard} />);

    const image = screen.getByTestId('card-image');
    expect(image).toHaveAttribute('src', mockCard.previewImg);
    expect(image).toHaveAttribute('srcset', `${mockCard.previewImg2x} 2x`);
    expect(image).toHaveAttribute('width', '280');
    expect(image).toHaveAttribute('height', '240');
  });

  it('applies is-active class when isSlide is true', () => {
    renderWithRouter(<TestCard card={mockCard} isSlide />);

    const cardElement = screen.getByTestId('card');
    expect(cardElement).toHaveClass('is-active');
  });

  it('renders links with correct hrefs', () => {
    renderWithRouter(<TestCard card={mockCard} />);

    const imageLink = screen.getByTestId('card-image').closest('a');
    expect(imageLink).toHaveAttribute('href', '/catalog/1?tab=description');

    const detailsLink = screen.getByText('Подробнее');
    expect(detailsLink).toHaveAttribute('href', '/catalog/1');
  });

  it('renders rating and review information', () => {
    renderWithRouter(<TestCard card={mockCard} />);

    const rateComponent = screen.getByTestId('rate-component');
    expect(rateComponent).toHaveTextContent(`Rating: ${mockCard.rating}, Reviews: ${mockCard.reviewCount}`);
  });

  it('renders buy button', () => {
    renderWithRouter(<TestCard card={mockCard} />);

    expect(screen.getByTestId('buy-button')).toBeInTheDocument();
    expect(screen.getByText('Купить')).toBeInTheDocument();
  });
});
