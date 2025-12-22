import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { SuccessAddCartModal } from './success-add-cart-modal';

const {
  mockModal,
  mockUseModal,
  mockButtonContinueShoppingMemo,
  mockButtonGoBasketMemo,
} = vi.hoisted(() => ({
  mockModal: vi.fn(),
  mockUseModal: vi.fn(),
  mockButtonContinueShoppingMemo: vi.fn(),
  mockButtonGoBasketMemo: vi.fn(),
}));

vi.mock('./modal', () => ({
  Modal: mockModal,
}));

vi.mock('../buttons', () => ({
  ButtonContinueShoppingMemo: mockButtonContinueShoppingMemo,
  ButtonGoBasketMemo: mockButtonGoBasketMemo,
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

    mockModal.mockImplementation(
      ({ children, onClose, narrow }: { children: ReactNode; onClose: () => void; narrow?: boolean }) => (
        <div data-testid="modal" data-narrow={String(Boolean(narrow))}>
          <div data-testid="modal-content">{children}</div>
          <button onClick={onClose} data-testid="close-button">
            Close
          </button>
        </div>
      )
    );

    mockButtonContinueShoppingMemo.mockImplementation(() => (
      <button
        type="button"
        className="btn btn--transparent modal__btn"
        onClick={mockCloseModal}
      >
        Продолжить покупки
      </button>
    ));

    mockButtonGoBasketMemo.mockImplementation(() => (
      <button data-testid="go-basket-button">Перейти в корзину</button>
    ));
  });

  it('renders correctly with success message', () => {
    render(<SuccessAddCartModal />);

    expect(screen.getByText('Товар успешно добавлен в корзину')).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('renders continue shopping button that calls closeModal', () => {
    render(<SuccessAddCartModal />);

    const continueBtn = screen.getByRole('button', { name: 'Продолжить покупки' });
    expect(continueBtn).toBeInTheDocument();

    continueBtn.click();
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('renders ButtonGoBasketMemo', () => {
    render(<SuccessAddCartModal />);

    expect(screen.getByTestId('go-basket-button')).toBeInTheDocument();
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
});
