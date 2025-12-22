import { render, screen } from '@testing-library/react';
import BasketCard from './basket-card';
import { mockOffers } from '../../mocks/mock-offers';

const mockCard = mockOffers[0];

describe('BasketCard component', () => {
  it('renders card information correctly', () => {
    render(<BasketCard card={mockCard} />);

    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
    expect(screen.getByText(mockCard.vendorCode)).toBeInTheDocument();
    expect(screen.getByText(`${mockCard.type} ${mockCard.category.toLowerCase()}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockCard.level} уровень`)).toBeInTheDocument();
    expect(screen.getByText('73 450 ₽')).toBeInTheDocument();
  });

  it('renders images with correct sources', () => {
    render(<BasketCard card={mockCard} />);

    const image = screen.getByAltText(mockCard.name);
    expect(image).toHaveAttribute('src', mockCard.previewImg);
    expect(image).toHaveAttribute('srcset', `${mockCard.previewImg2x} 2x`);
    expect(image).toHaveAttribute('width', '140');
    expect(image).toHaveAttribute('height', '120');
    expect(image).toHaveAttribute('loading', 'lazy');

    const picture = image.closest('picture');
    const source = picture?.querySelector('source');
    expect(source).toHaveAttribute('type', 'image/webp');
    expect(source).toHaveAttribute('srcset', `${mockCard.previewImgWebp}, ${mockCard.previewImgWebp2x} 2x`);
  });

  it('renders price in modal when isModal is true', () => {
    render(<BasketCard card={mockCard} isModal />);

    const description = screen.getByText(mockCard.name).closest('.basket-item__description');
    const priceInDescription = description?.querySelector('.basket-item__price');
    expect(priceInDescription).toBeInTheDocument();
  });

  it('renders price separately when isModal is false', () => {
    render(<BasketCard card={mockCard} isModal={false} />);

    const description = screen.getByText(mockCard.name).closest('.basket-item__description');
    const priceInDescription = description?.querySelector('.basket-item__price');
    expect(priceInDescription).not.toBeInTheDocument();

    expect(screen.getByText('73 450 ₽')).toBeInTheDocument();
  });

  it('renders vendor code with correct formatting', () => {
    render(<BasketCard card={mockCard} />);

    expect(screen.getByText('Артикул:')).toBeInTheDocument();
    expect(screen.getByText(mockCard.vendorCode)).toBeInTheDocument();
  });

  it('renders category in lowercase', () => {
    render(<BasketCard card={mockCard} />);

    expect(screen.getByText(`${mockCard.type} ${mockCard.category.toLowerCase()}`)).toBeInTheDocument();
  });

  it('formats price with thousand separators', () => {
    const expensiveCard = {
      ...mockCard,
      price: 1_000_000,
    };

    render(<BasketCard card={expensiveCard} />);

    expect(screen.getByText('1 000 000 ₽')).toBeInTheDocument();
  });

  it('has visually hidden text for price', () => {
    render(<BasketCard card={mockCard} />);

    const visuallyHidden = screen.getByText('Цена:');
    expect(visuallyHidden).toHaveClass('visually-hidden');
  });

  it('is memoized component', () => {
    expect(typeof BasketCard).toBe('object');
    expect(BasketCard).toHaveProperty('$$typeof');
  });
});
