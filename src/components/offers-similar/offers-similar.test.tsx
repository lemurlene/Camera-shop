import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OffersSimilar from './offers-similar';
import type { FullOfferType } from '../../const/type';
import { mockOffers } from '../../mocks/mock-offers';

type ProductSliderProps = {
  offers: FullOfferType[];
};

const mockProductSlider = vi.fn<ProductSliderProps[], JSX.Element>();
vi.mock('./product-slider', () => ({
  default: (props: ProductSliderProps) => mockProductSlider(props),
}));

describe('OffersSimilar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProductSlider.mockReturnValue(<div data-testid="product-slider" />);
  });

  describe('rendering', () => {
    it('renders the similar offers section', () => {
      render(<OffersSimilar offersSimilar={mockOffers} />);

      expect(screen.getByTestId('offers-similar')).toBeInTheDocument();
    });

    it('renders the correct section title', () => {
      render(<OffersSimilar offersSimilar={mockOffers} />);

      const title = screen.getByText('Похожие товары');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('title', 'title--h3');
    });

    it('renders the ProductSlider component', () => {
      render(<OffersSimilar offersSimilar={mockOffers} />);

      expect(screen.getByTestId('product-slider')).toBeInTheDocument();
    });
  });

  describe('props passing', () => {
    it('passes offers to ProductSlider', () => {
      render(<OffersSimilar offersSimilar={mockOffers} />);

      expect(mockProductSlider).toHaveBeenCalledWith({
        offers: mockOffers,
      });
    });

    it('passes empty array when no similar offers', () => {
      const emptyOffers: FullOfferType[] = [];

      render(<OffersSimilar offersSimilar={emptyOffers} />);

      expect(mockProductSlider).toHaveBeenCalledWith({
        offers: emptyOffers,
      });
    });
  });

  describe('structure', () => {
    it('has correct CSS class structure', () => {
      const { container } = render(<OffersSimilar offersSimilar={mockOffers} />);

      expect(container.querySelector('.page-content__section')).toBeInTheDocument();
      expect(container.querySelector('.product-similar')).toBeInTheDocument();
      expect(container.querySelector('.container')).toBeInTheDocument();
    });
  });
});
