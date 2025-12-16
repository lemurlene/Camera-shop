import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DeleteFromCartModal } from './delete-from-cart-modal';
import type { FullOfferType } from '../../const/type';

type ModalHook = {
  closeModal: () => void;
};

const mocks = vi.hoisted(() => ({
  useModal: vi.fn<[], ModalHook>(),
}));

vi.mock('../../contexts', () => ({
  useModal: mocks.useModal,
}));

vi.mock('./modal', () => ({
  __esModule: true,
  Modal: ({ children }: { children: React.ReactNode}) => (
    <div data-testid="modal">{children}</div>
  ),
}));

vi.mock('../card', () => ({
  __esModule: true,
  BasketCardMemo: ({ card, isModal, isHidePrice }: { card: unknown; isModal?: boolean; isHidePrice?: boolean }) => (
    <div
      data-testid="basket-card"
      data-modal={String(!!isModal)}
      data-hide-price={String(!!isHidePrice)}
    >
      {String(!!card)}
    </div>
  ),
}));

vi.mock('../buttons', () => ({
  __esModule: true,
  ButtonDeleteFromBasketMemo: ({ productId }: { productId: number }) => (
    <button data-testid="btn-delete" type="button">
      delete-{productId}
    </button>
  ),
  ButtonContinueShoppingMemo: ({ isHalfWidth }: { isHalfWidth?: boolean }) => (
    <button data-testid="btn-continue" type="button">
      continue-{String(!!isHalfWidth)}
    </button>
  ),
}));

describe('DeleteFromCartModal component', () => {
  const closeModal = vi.fn<[], void>();

  const productData = ({
    id: 42,
    name: 'Test camera',
    price: 1000,
  } as unknown) as FullOfferType;

  beforeEach(() => {
    closeModal.mockClear();
    mocks.useModal.mockReturnValue({ closeModal });
  });

  it('renders title', () => {
    render(<DeleteFromCartModal productData={productData} />);

    expect(screen.getByText(/удалить этот товар\?/i)).toBeInTheDocument();
  });

  it('renders BasketCardMemo in short basket wrapper and passes modal flags', () => {
    render(<DeleteFromCartModal productData={productData} />);

    const wrapper = document.querySelector('.basket-item.basket-item--short') ;
    expect(wrapper).not.toBeNull();

    const card = screen.getByTestId('basket-card');
    expect(card).toHaveAttribute('data-modal', 'true');
    expect(card).toHaveAttribute('data-hide-price', 'true');
  });

  it('renders delete button with product id', () => {
    render(<DeleteFromCartModal productData={productData} />);

    expect(screen.getByTestId('btn-delete')).toHaveTextContent(`delete-${productData.id}`);
  });

  it('renders continue shopping button as half width', () => {
    render(<DeleteFromCartModal productData={productData} />);

    expect(screen.getByTestId('btn-continue')).toHaveTextContent('continue-true');
  });

  it('uses Modal component', () => {
    render(<DeleteFromCartModal productData={productData} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
