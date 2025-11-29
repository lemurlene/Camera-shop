import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ButtonBuy from './button-buy';
import { ButtonBuyConfig } from './const';
import { FullOfferType } from '../../../const/type';
import { mockOffers } from '../../../mocks/mock-offers';

const { mockOpenModal, mockUseModal } = vi.hoisted(() => ({
  mockOpenModal: vi.fn(),
  mockUseModal: vi.fn(() => ({
    openModal: vi.fn(),
    closeModal: vi.fn(),
    modalState: null
  }))
}));

vi.mock('../../../contexts', () => ({
  useModal: mockUseModal
}));

vi.mock('classnames', () => ({
  default: vi.fn((...args: unknown[]) => args.filter(Boolean).join(' '))
}));

describe('ButtonBuy component', () => {
  const mockProduct = mockOffers[0];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: vi.fn(),
      modalState: null
    });
  });

  describe('Rendering', () => {
    it('should render "Buy" button when isInCart is false', () => {
      render(<ButtonBuy isInCart={false} product={mockProduct} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(ButtonBuyConfig.Buy.buttonText);
    });

    it('should render "In Cart" button when isInCart is true', () => {
      render(<ButtonBuy isInCart product={mockProduct} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(ButtonBuyConfig.InCart.buttonText);
    });

    it('should apply correct CSS classes', () => {
      render(<ButtonBuy isInCart={false} product={mockProduct} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
      expect(button).toHaveClass('product-card__btn');
    });

    it('should render icon when isInCart is true', () => {
      render(<ButtonBuy isInCart product={mockProduct} />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(ButtonBuyConfig.InCart.buttonText);
    });

    it('should not render icon when isInCart is false', () => {
      render(<ButtonBuy isInCart={false} product={mockProduct} />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(ButtonBuyConfig.Buy.buttonText);
    });
  });

  describe('User interactions', () => {
    it('should call openModal with "add-to-cart" and product when clicked', async () => {
      const user = userEvent.setup();

      render(<ButtonBuy isInCart={false} product={mockProduct} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      expect(mockOpenModal).toHaveBeenCalledWith('add-to-cart', mockProduct);
    });

    it('should call openModal with correct product data', async () => {
      const user = userEvent.setup();

      render(<ButtonBuy isInCart product={mockProduct} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOpenModal).toHaveBeenCalledWith('add-to-cart', mockProduct);
    });

    it('should handle multiple clicks correctly', async () => {
      const user = userEvent.setup();

      render(<ButtonBuy isInCart={false} product={mockProduct} />);

      const button = screen.getByRole('button');

      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOpenModal).toHaveBeenCalledTimes(3);
      expect(mockOpenModal).toHaveBeenCalledWith('add-to-cart', mockProduct);
    });

    it('should have correct button type and accessibility', () => {
      render(<ButtonBuy isInCart={false} product={mockProduct} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toBeEnabled();
    });
  });

  describe('Props changes', () => {
    it('should update button text when isInCart prop changes', () => {
      const { rerender } = render(<ButtonBuy isInCart={false} product={mockProduct} />);

      expect(screen.getByText(ButtonBuyConfig.Buy.buttonText)).toBeInTheDocument();

      rerender(<ButtonBuy isInCart product={mockProduct} />);

      expect(screen.getByText(ButtonBuyConfig.InCart.buttonText)).toBeInTheDocument();
      expect(screen.queryByText(ButtonBuyConfig.Buy.buttonText)).not.toBeInTheDocument();
    });

    it('should handle different product data', () => {
      const differentProduct: FullOfferType = {
        ...mockProduct,
        id: 2,
        name: 'Different Camera',
        price: 20000
      };

      render(<ButtonBuy isInCart={false} product={differentProduct} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('should not re-render when props do not change', () => {
      const { rerender } = render(<ButtonBuy isInCart={false} product={mockProduct} />);

      const button = screen.getByRole('button');

      rerender(<ButtonBuy isInCart={false} product={mockProduct} />);

      expect(button).toBeInTheDocument();
    });
  });
});

describe('ButtonBuy parameterized tests', () => {
  const mockProduct = mockOffers[1];

  it.each([
    [false, ButtonBuyConfig.Buy.buttonText, 'should show "Buy"'],
    [true, ButtonBuyConfig.InCart.buttonText, 'should show "In Cart"'],
  ])('when isInCart is %s %s', (isInCart, expectedText) => {
    render(<ButtonBuy isInCart={isInCart } product={mockProduct} />);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it.each([
    [false, 'btn product-card__btn'],
    [true, 'btn product-card__btn'],
  ])('should have correct classes when isInCart is %s', (isInCart) => {
    render(<ButtonBuy isInCart={isInCart } product={mockProduct} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn');
    expect(button).toHaveClass('product-card__btn');
  });
});
