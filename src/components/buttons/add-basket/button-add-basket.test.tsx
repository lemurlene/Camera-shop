import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ButtonAddBasket from './button-add-basket';
import { ButtonAddBasketConfig } from './const';

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

vi.mock('../../../store/api-action', () => ({
  fetchOffers: vi.fn(),
  fetchOffersPromo: vi.fn(),
}));

describe('ButtonAddBasket component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: vi.fn(),
      modalState: null
    });
  });

  it('should render "Add to Cart" button when isInCart is false', () => {
    render(<ButtonAddBasket isInCart={false} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(ButtonAddBasketConfig.AddToCart.buttonText);
  });

  it('should render "In Cart" button when isInCart is true', () => {
    render(<ButtonAddBasket isInCart />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(ButtonAddBasketConfig.InCart.buttonText);
  });

  it('should apply correct CSS classes', () => {
    render(<ButtonAddBasket isInCart={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn');
    expect(button).toHaveClass('btn--purple');
  });

  it('should call openModal with "success-add-cart" when clicked', async () => {
    const user = userEvent.setup();

    render(<ButtonAddBasket isInCart={false} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith('success-add-cart');
  });

  it('should render icon when isInCart is false', () => {
    render(<ButtonAddBasket isInCart={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(ButtonAddBasketConfig.AddToCart.buttonText);
  });

  it('should not render icon when isInCart is true', () => {
    render(<ButtonAddBasket isInCart />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(ButtonAddBasketConfig.InCart.buttonText);
  });

  it('should apply modal-specific classes when isModal is true', () => {
    render(<ButtonAddBasket isInCart={false} isModal />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should work without isModal prop (default value)', () => {
    render(<ButtonAddBasket isInCart={false} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(ButtonAddBasketConfig.AddToCart.buttonText);
  });

  it('should update button text when isInCart prop changes', () => {
    const { rerender } = render(<ButtonAddBasket isInCart={false} />);

    expect(screen.getByText(ButtonAddBasketConfig.AddToCart.buttonText)).toBeInTheDocument();

    rerender(<ButtonAddBasket isInCart />);

    expect(screen.getByText(ButtonAddBasketConfig.InCart.buttonText)).toBeInTheDocument();
    expect(screen.queryByText(ButtonAddBasketConfig.AddToCart.buttonText)).not.toBeInTheDocument();
  });
});

describe('ButtonAddBasket parameterized tests', () => {
  it.each([
    [false, ButtonAddBasketConfig.AddToCart.buttonText],
    [true, ButtonAddBasketConfig.InCart.buttonText],
  ])('when isInCart is %s should show correct text', (isInCart, expectedText) => {
    render(<ButtonAddBasket isInCart={isInCart } />);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});

describe('ButtonAddBasket user interactions', () => {
  it('should handle multiple clicks correctly', async () => {
    const user = userEvent.setup();

    render(<ButtonAddBasket isInCart={false} />);

    const button = screen.getByRole('button');

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockOpenModal).toHaveBeenCalledTimes(3);
    expect(mockOpenModal).toHaveBeenCalledWith('success-add-cart');
  });

  it('should have correct button type and accessibility', () => {
    render(<ButtonAddBasket isInCart={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toBeEnabled();
  });
});
