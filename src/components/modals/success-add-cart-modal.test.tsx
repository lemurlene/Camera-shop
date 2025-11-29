import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SuccessAddCartModal } from './success-add-cart-modal';

const { mockModal, mockButtonAddBasketMemo, mockUseModal } = vi.hoisted(() => ({
  mockModal: vi.fn(),
  mockButtonAddBasketMemo: vi.fn(),
  mockUseModal: vi.fn(),
}));

vi.mock('./modal', () => ({
  Modal: mockModal,
}));

vi.mock('../buttons', () => ({
  ButtonAddBasketMemo: mockButtonAddBasketMemo,
}));

vi.mock('../../contexts', () => ({
  useModal: mockUseModal,
}));

describe('SuccessAddCartModal', () => {
  const mockCloseModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseModal.mockReturnValue({
      closeModal: mockCloseModal,
    });

    mockModal.mockImplementation(({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
      <div data-testid="modal">
        <div data-testid="modal-content">{children}</div>
        <button onClick={onClose} data-testid="close-button">Close</button>
      </div>
    ));

    mockButtonAddBasketMemo.mockImplementation(() => (
      <button data-testid="add-basket-button">Перейти в корзину</button>
    ));
  });

  it('renders correctly with success message and icon', () => {
    render(<SuccessAddCartModal />);

    expect(screen.getByText('Товар успешно добавлен в корзину')).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('renders success icon with correct attributes', () => {
    const { container } = render(<SuccessAddCartModal />);

    const svgIcon = container.querySelector('.modal__icon');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute('width', '86');
    expect(svgIcon).toHaveAttribute('height', '80');
    expect(svgIcon).toHaveAttribute('aria-hidden', 'true');

    const useElement = svgIcon?.querySelector('use');
    expect(useElement).toHaveAttribute('xlink:href', '#icon-success');
  });

  it('renders continue shopping button that calls closeModal', () => {
    render(<SuccessAddCartModal />);

    const continueButton = screen.getByText('Продолжить покупки');
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toHaveClass('btn', 'btn--transparent', 'modal__btn');

    continueButton.click();
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('renders ButtonAddBasketMemo with correct props', () => {
    render(<SuccessAddCartModal />);

    expect(screen.getByTestId('add-basket-button')).toBeInTheDocument();
    expect(mockButtonAddBasketMemo).toHaveBeenCalledWith(
      expect.objectContaining({
        isModal: true,
        isInCart: true,
      }),
      {}
    );
  });

  it('passes correct props to Modal component', () => {
    render(<SuccessAddCartModal />);

    expect(mockModal).toHaveBeenCalledWith(
      expect.objectContaining({
        narrow: true,
        onClose: mockCloseModal,
      }),
      {}
    );
  });

  it('calls useModal hook', () => {
    render(<SuccessAddCartModal />);

    expect(mockUseModal).toHaveBeenCalledTimes(1);
  });

  it('renders all required elements', () => {
    render(<SuccessAddCartModal />);

    expect(screen.getByText('Товар успешно добавлен в корзину')).toBeInTheDocument();
    expect(screen.getByText('Продолжить покупки')).toBeInTheDocument();
    expect(screen.getByTestId('add-basket-button')).toBeInTheDocument();
  });
});
