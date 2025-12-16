import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ErrorOrderModal } from './error-order-modal';

type ModalHook = {
  closeModal: () => void;
};

type Action = { type: string };

const mocks = vi.hoisted(() => ({
  useModal: vi.fn<[], ModalHook>(),
  useAppDispatch: vi.fn<[], (action: Action) => unknown>(),
  resetOrder: vi.fn<[], Action>(),
}));

vi.mock('../../contexts', () => ({
  useModal: mocks.useModal,
}));

vi.mock('../../hooks', () => ({
  useAppDispatch: mocks.useAppDispatch,
}));

vi.mock('../../store/order/order.slice', () => ({
  resetOrder: mocks.resetOrder,
}));

vi.mock('./modal', () => ({
  __esModule: true,
  Modal: ({ children }: { children: React.ReactNode}) => (
    <div data-testid="modal">{children}</div>
  ),
}));

vi.mock('../buttons', () => ({
  __esModule: true,
  ButtonContinueShoppingMemo: () => (
    <button data-testid="btn-continue" type="button">
      continue
    </button>
  ),
}));

describe('ErrorOrderModal component', () => {
  const closeModal = vi.fn<[], void>();
  const dispatch = vi.fn<[Action], unknown>();

  beforeEach(() => {
    closeModal.mockClear();
    dispatch.mockClear();

    mocks.useModal.mockReturnValue({ closeModal });
    mocks.useAppDispatch.mockReturnValue(dispatch);

    mocks.resetOrder.mockClear();
    mocks.resetOrder.mockReturnValue({ type: 'order/reset' });
  });

  it('renders error text', () => {
    render(<ErrorOrderModal error="Ошибка оформления" />);

    expect(screen.getByText(/ошибка оформления/i)).toBeInTheDocument();
  });

  it('renders retry button with correct text and classes', () => {
    render(<ErrorOrderModal error="Ошибка" />);

    const retryBtn = screen.getByRole('button', { name: /попробовать снова/i });
    expect(retryBtn).toHaveAttribute('type', 'button');
    expect(retryBtn.className).toContain('btn');
    expect(retryBtn.className).toContain('btn--purple');
    expect(retryBtn.className).toContain('modal__btn');
  });

  it('dispatches resetOrder and closes modal on retry click', () => {
    render(<ErrorOrderModal error="Ошибка" />);

    fireEvent.click(screen.getByRole('button', { name: /попробовать снова/i }));

    expect(mocks.resetOrder).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'order/reset' });

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it('renders continue shopping button', () => {
    render(<ErrorOrderModal error="Ошибка" />);

    expect(screen.getByTestId('btn-continue')).toBeInTheDocument();
  });

  it('uses Modal component', () => {
    render(<ErrorOrderModal error="Ошибка" />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
