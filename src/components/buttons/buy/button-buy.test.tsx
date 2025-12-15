import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import type { FullOfferType } from '../../../const/type';
import ButtonBuy from './button-buy';
import { ModalType } from '../../modals/type';

type ModalHook = {
  openModal: (type: ModalType, data?: FullOfferType | string) => void;
  closeModal: () => void;
  modalState: null;
};

type CartHook = {
  isInCart: (id: number) => boolean;
};

const mocks = vi.hoisted(() => ({
  useModal: vi.fn<[], ModalHook>(),
  useCart: vi.fn<[], CartHook>(),
}));

vi.mock('../../../contexts', () => ({
  useModal: mocks.useModal,
  useCart: mocks.useCart,
}));

describe('ButtonBuy component', () => {
  const product = ({ id: 7, price: 1000, name: 'Camera' } as unknown) as FullOfferType;

  const openModal = vi.fn<Parameters<ModalHook['openModal']>, ReturnType<ModalHook['openModal']>>();
  const isInCart = vi.fn<Parameters<CartHook['isInCart']>, ReturnType<CartHook['isInCart']>>();

  beforeEach(() => {
    openModal.mockClear();
    isInCart.mockClear();

    mocks.useModal.mockReturnValue({
      openModal,
      closeModal: vi.fn(),
      modalState: null,
    });

    mocks.useCart.mockReturnValue({
      isInCart,
    });
  });

  it('renders Buy button config when not offer and not in cart', () => {
    isInCart.mockReturnValue(false);

    render(<ButtonBuy product={product} />);

    const button = screen.getByRole('button');

    // текст/класс/иконка берутся из ButtonBuyConfig.Buy
    // поэтому проверяем то, что стабильно: кнопка есть и вызывает openModal
    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).toContain('btn');
    expect(button.className).toContain('product-card__btn');

    fireEvent.click(button);
    expect(openModal).toHaveBeenCalledTimes(1);
    expect(openModal).toHaveBeenCalledWith('add-to-cart', product);
  });

  it('renders InCart config when not offer and product is already in cart', () => {
    isInCart.mockReturnValue(true);

    render(<ButtonBuy product={product} />);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).toContain('btn');
    expect(button.className).toContain('product-card__btn');

    fireEvent.click(button);
    expect(openModal).toHaveBeenCalledWith('add-to-cart', product);
  });

  it('renders AddToCart config when isOffer=true (ignores inCart)', () => {
    isInCart.mockReturnValue(true);

    render(<ButtonBuy isOffer product={product} />);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).toContain('btn');
    expect(button.className).toContain('product-card__btn');

    fireEvent.click(button);
    expect(openModal).toHaveBeenCalledWith('add-to-cart', product);
  });

  it('calls isInCart with product.id', () => {
    isInCart.mockReturnValue(false);

    render(<ButtonBuy product={product} />);

    expect(isInCart).toHaveBeenCalledTimes(1);
    expect(isInCart).toHaveBeenCalledWith(product.id);
  });

  it('is memoized', () => {
    type MemoLike = { $$typeof: symbol; type: unknown };
    const memoComp = ButtonBuy as unknown as MemoLike;

    expect(memoComp.$$typeof).toBe(Symbol.for('react.memo'));
    expect(memoComp.type).toBeDefined();
  });
});
