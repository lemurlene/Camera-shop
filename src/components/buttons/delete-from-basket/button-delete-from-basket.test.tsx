import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ButtonDeleteFromBasket from './button-delete-from-basket';
import type { FullOfferType } from '../../../const/type';
import { ModalType } from '../../modals/type';

type ModalHook = {
  openModal: (type: ModalType, data?: FullOfferType | string) => void;
  closeModal: () => void;
  modalState: null;
};

type CartHook = {
  removeFromCart: (id: number) => void;
};

const mocks = vi.hoisted(() => ({
  useModal: vi.fn<[], ModalHook>(),
  useCart: vi.fn<[], CartHook>(),
}));

vi.mock('../../../contexts', () => ({
  useModal: mocks.useModal,
  useCart: mocks.useCart,
}));

describe('ButtonDeleteFromBasket component', () => {
  const productId = 111;

  const closeModal = vi.fn<[], void>();
  const openModal = vi.fn<[ModalType, (FullOfferType | string)?], void>();
  const removeFromCart = vi.fn<[number], void>();

  beforeEach(() => {
    closeModal.mockClear();
    openModal.mockClear();
    removeFromCart.mockClear();

    mocks.useModal.mockReturnValue({
      openModal,
      closeModal,
      modalState: null,
    });

    mocks.useCart.mockReturnValue({
      removeFromCart,
    });
  });

  it('renders button with correct attributes', () => {
    render(<ButtonDeleteFromBasket productId={productId} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');

    expect(button.className.trim().length).toBeGreaterThan(0);
  });

  it('calls removeFromCart with productId and closes modal when clicked', () => {
    render(<ButtonDeleteFromBasket productId={productId} />);

    fireEvent.click(screen.getByRole('button'));

    expect(removeFromCart).toHaveBeenCalledTimes(1);
    expect(removeFromCart).toHaveBeenCalledWith(productId);

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it('not renders icon if no buttonIcon', () => {
    render(<ButtonDeleteFromBasket productId={productId} />);

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');

    expect(svg).not.toBeInTheDocument();
  });

  it('is memoized', () => {
    type MemoLike = { $$typeof: symbol; type: unknown };
    const memoComp = ButtonDeleteFromBasket as unknown as MemoLike;

    expect(memoComp.$$typeof).toBe(Symbol.for('react.memo'));
    expect(memoComp.type).toBeDefined();
  });
});
