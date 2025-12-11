import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductContent } from './product-content';
import { mockOffers } from '../../mocks/mock-offers';

const { mockRateMemo, mockButtonAddBasketMemo } = vi.hoisted(() => ({
  mockRateMemo: vi.fn(),
  mockButtonAddBasketMemo: vi.fn(),
}));

vi.mock('../rate', () => ({
  default: mockRateMemo,
}));

vi.mock('../buttons', () => ({
  ButtonAddBasketMemo: mockButtonAddBasketMemo,
}));

describe('ProductContent', () => {
  const defaultProps = {
    name: 'Test Camera',
    rating: 4.5,
    reviewCount: 10,
    price: 100000,
    offer: mockOffers[0],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockRateMemo.mockImplementation(() => (
      <div data-testid="rate-component">Rate Component</div>
    ));

    mockButtonAddBasketMemo.mockImplementation(() => (
      <button data-testid="add-basket-button">Add to Basket</button>
    ));
  });

  it('renders correctly with all elements', () => {
    render(<ProductContent {...defaultProps} />);

    expect(screen.getByText('Test Camera')).toBeInTheDocument();
    expect(screen.getByTestId('rate-component')).toBeInTheDocument();
    expect(screen.getByText('100 000 ₽')).toBeInTheDocument();
    expect(screen.getByTestId('add-basket-button')).toBeInTheDocument();
  });

  it('renders product name with correct heading level and classes', () => {
    render(<ProductContent {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Test Camera');
    expect(heading).toHaveClass('title', 'title--h3');
  });

  it('renders price with correct formatting and hidden text', () => {
    render(<ProductContent {...defaultProps} />);

    const priceElement = screen.getByText('100 000 ₽');
    expect(priceElement).toBeInTheDocument();
    expect(priceElement).toHaveClass('product__price');

    const hiddenText = screen.getByText('Цена:');
    expect(hiddenText).toHaveClass('visually-hidden');
  });

  it('formats price correctly with different values', () => {
    const { rerender } = render(<ProductContent {...defaultProps} price={5000} />);
    expect(screen.getByText('5 000 ₽')).toBeInTheDocument();

    rerender(<ProductContent {...defaultProps} price={1234567} />);
    expect(screen.getByText('1 234 567 ₽')).toBeInTheDocument();
  });

  it('passes correct props to RateMemo component', () => {
    render(<ProductContent {...defaultProps} />);

    expect(mockRateMemo).toHaveBeenCalledWith(
      expect.objectContaining({
        rating: 4.5,
        reviewCount: 10,
        classPrefix: 'product',
      }),
      {}
    );
  });

  it('passes correct props to ButtonAddBasketMemo component', () => {
    render(<ProductContent {...defaultProps} />);

    expect(mockButtonAddBasketMemo).toHaveBeenCalledWith({}, {});
  });

  it('renders with different product data', () => {
    const differentProps = {
      name: 'Different Camera',
      rating: 3.2,
      reviewCount: 5,
      price: 75000,
      offer: mockOffers[2],
    };

    render(<ProductContent {...differentProps} />);

    expect(screen.getByText('Different Camera')).toBeInTheDocument();
    expect(screen.getByText('75 000 ₽')).toBeInTheDocument();

    expect(mockRateMemo).toHaveBeenCalledWith(
      expect.objectContaining({
        rating: 3.2,
        reviewCount: 5,
        classPrefix: 'product',
      }),
      {}
    );
  });

  it('has correct semantic structure', () => {
    const { container } = render(<ProductContent {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    const priceElement = container.querySelector('.product__price');
    expect(priceElement).toBeInTheDocument();
    expect(priceElement).toHaveTextContent('100 000 ₽');
  });
});
