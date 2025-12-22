import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductContent } from './product-content';
import { mockOffers } from '../../mocks/mock-offers';
import type { FullOfferType } from '../../const/type';

const { mockRateMemo, mockButtonBuyMemo } = vi.hoisted(() => ({
  mockRateMemo: vi.fn(),
  mockButtonBuyMemo: vi.fn(),
}));

vi.mock('../rate', () => ({
  default: mockRateMemo,
}));

vi.mock('../buttons', () => ({
  ButtonBuyMemo: mockButtonBuyMemo,
}));

const priceRegex = (price: number) => {
  const s = price.toLocaleString();
  const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const flexibleSeparators = escaped.replace(/[ \u00A0,.]/g, '[\\s\\u00A0,.]');
  return new RegExp(`${flexibleSeparators}\\s*₽`);
};

describe('ProductContent', () => {
  const defaultProps: {
    name: string;
    rating: number;
    reviewCount: number;
    price: number;
    offer: FullOfferType;
  } = {
    name: 'Ретрокамера Dus Auge lV',
    rating: 3,
    reviewCount: 15,
    price: 73450,
    offer: mockOffers[0],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockRateMemo.mockImplementation(() => (
      <div data-testid="rate-component">Rate Component</div>
    ));

    mockButtonBuyMemo.mockImplementation(() => (
      <button data-testid="buy-button">Buy</button>
    ));
  });

  it('renders correctly with all elements', () => {
    render(<ProductContent {...defaultProps} />);

    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
    expect(screen.getByTestId('rate-component')).toBeInTheDocument();
    expect(screen.getByText(priceRegex(defaultProps.price))).toBeInTheDocument();
    expect(screen.getByTestId('buy-button')).toBeInTheDocument();
  });

  it('renders product name with correct heading level and classes', () => {
    render(<ProductContent {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(defaultProps.name);
    expect(heading).toHaveClass('title', 'title--h3');
  });

  it('renders price with correct formatting and hidden text', () => {
    const { container } = render(<ProductContent {...defaultProps} />);

    const priceElement = container.querySelector('.product__price');
    expect(priceElement).toBeInTheDocument();
    expect(priceElement?.textContent).toMatch(priceRegex(defaultProps.price));

    const hiddenText = screen.getByText('Цена:');
    expect(hiddenText).toHaveClass('visually-hidden');
  });

  it('formats price correctly with different values', () => {
    const { rerender } = render(<ProductContent {...defaultProps} price={5000} />);
    expect(screen.getByText(priceRegex(5000))).toBeInTheDocument();

    rerender(<ProductContent {...defaultProps} price={1234567} />);
    expect(screen.getByText(priceRegex(1234567))).toBeInTheDocument();
  });

  it('passes correct props to RateMemo component', () => {
    render(<ProductContent {...defaultProps} />);

    expect(mockRateMemo).toHaveBeenCalledTimes(1);
    const [rateProps] = mockRateMemo.mock.calls[0] as unknown as [
      { rating: number; reviewCount: number; classPrefix: string; children?: ReactNode }
    ];

    expect(rateProps).toMatchObject({
      rating: defaultProps.rating,
      reviewCount: defaultProps.reviewCount,
      classPrefix: 'product',
    });
  });

  it('passes correct props to ButtonBuyMemo component', () => {
    render(<ProductContent {...defaultProps} />);

    expect(mockButtonBuyMemo).toHaveBeenCalledTimes(1);
    const [buttonProps] = mockButtonBuyMemo.mock.calls[0] as unknown as [
      { isOffer: boolean; product: FullOfferType; children?: ReactNode }
    ];

    expect(buttonProps.isOffer).toBe(true);
    expect(buttonProps.product).toBe(defaultProps.offer);
  });

  it('renders with different product data', () => {
    const differentProps: typeof defaultProps = {
      name: 'Instaprinter P2',
      rating: 3,
      reviewCount: 13,
      price: 8430,
      offer: mockOffers[2],
    };

    render(<ProductContent {...differentProps} />);

    expect(screen.getByText(differentProps.name)).toBeInTheDocument();
    expect(screen.getByText(priceRegex(differentProps.price))).toBeInTheDocument();

    expect(mockRateMemo).toHaveBeenCalledTimes(1);
    const [rateProps] = mockRateMemo.mock.calls[0] as unknown as [
      { rating: number; reviewCount: number; classPrefix: string }
    ];
    expect(rateProps).toMatchObject({
      rating: differentProps.rating,
      reviewCount: differentProps.reviewCount,
      classPrefix: 'product',
    });
  });

  it('has correct semantic structure', () => {
    const { container } = render(<ProductContent {...defaultProps} />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    const priceElement = container.querySelector('.product__price');
    expect(priceElement).toBeInTheDocument();
    expect(priceElement?.textContent).toMatch(priceRegex(defaultProps.price));
  });
});
