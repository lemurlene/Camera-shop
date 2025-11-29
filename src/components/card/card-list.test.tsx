import { render, screen } from '@testing-library/react';
import CardList from './card-list';
import { FullOfferType } from '../../const/type';
import { mockOffers } from '../../mocks/mock-offers';

vi.mock('./card', () => ({
  __esModule: true,
  default: ({ card }: { card: FullOfferType }) => (
    <div data-testid="card" >
      {card.name}
    </div>
  ),
}));

describe('CardList component', () => {
  it('renders all offers when cardsCount is not provided', () => {
    render(<CardList offers={mockOffers} />);

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(mockOffers.length);
  });

  it('renders limited number of cards when cardsCount is provided', () => {
    render(<CardList offers={mockOffers} cardsCount={2} />);

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
  });

  it('renders all cards when cardsCount exceeds offers length', () => {
    render(<CardList offers={mockOffers} cardsCount={10} />);

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(mockOffers.length);
  });

  it('renders correct card information', () => {
    render(<CardList offers={mockOffers} />);

    mockOffers.forEach((offer) => {
      expect(screen.getByText(offer.name)).toBeInTheDocument();
    });
  });

  it('wraps each card in product-card div', () => {
    render(<CardList offers={mockOffers} cardsCount={2} />);

    const productCards = document.querySelectorAll('.product-card');
    expect(productCards).toHaveLength(2);

    productCards.forEach((card) => {
      expect(card.querySelector('[data-testid="card"]')).toBeInTheDocument();
    });
  });

  it('renders empty list when no offers', () => {
    render(<CardList offers={[]} />);

    const cards = screen.queryAllByTestId('card');
    expect(cards).toHaveLength(0);
  });

  it('handles zero cardsCount', () => {
    render(<CardList offers={mockOffers} cardsCount={0} />);

    const cards = screen.queryAllByTestId('card');
    expect(cards).toHaveLength(0);
  });

  it('slices offers correctly', () => {
    render(<CardList offers={mockOffers} cardsCount={3} />);

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(3);
  });
});
