import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import type { FullOfferType } from '../../../const/type';
import ButtonAddBasket from './button-add-basket';
import { ModalType } from '../../modals/type';

type ModalHook = {
  openModal: (type: ModalType, data?: FullOfferType | string) => void;
  closeModal: () => void;
  modalState: null;
};

type CartHook = {
  addToCart: (id: number, data: FullOfferType, quantity?: number) => void;
  isInCart: (id: number) => boolean;
  updateQuantity: (id: number, quantity: number) => void;
  getItemQuantity: (id: number) => number;
};

const mocks = vi.hoisted(() => ({
  useModal: vi.fn<[], ModalHook>(),
  useCart: vi.fn<[], CartHook>(),
}));

vi.mock('../../../contexts', () => ({
  useModal: mocks.useModal,
  useCart: mocks.useCart,
}));

describe('ButtonAddBasket component', () => {
  const productId = 123;
  const productData = ({ id: productId, price: 1000 } as unknown) as FullOfferType;

  const openModal = vi.fn<Parameters<ModalHook['openModal']>, ReturnType<ModalHook['openModal']>>();
  const addToCart = vi.fn<Parameters<CartHook['addToCart']>, ReturnType<CartHook['addToCart']>>();
  const updateQuantity = vi.fn<Parameters<CartHook['updateQuantity']>, ReturnType<CartHook['updateQuantity']>>();
  const isInCart = vi.fn<Parameters<CartHook['isInCart']>, ReturnType<CartHook['isInCart']>>();
  const getItemQuantity = vi.fn<Parameters<CartHook['getItemQuantity']>, ReturnType<CartHook['getItemQuantity']>>();

  beforeEach(() => {
    openModal.mockClear();
    addToCart.mockClear();
    updateQuantity.mockClear();
    isInCart.mockClear();
    getItemQuantity.mockClear();

    mocks.useModal.mockReturnValue({
      openModal,
      closeModal: vi.fn(),
      modalState: null,
    });

    mocks.useCart.mockReturnValue({
      addToCart,
      isInCart,
      updateQuantity,
      getItemQuantity,
    });
  });

  it('renders button with correct attributes', () => {
    render(<ButtonAddBasket productId={productId} productData={productData} />);

    const button = screen.getByRole('button', { name: /добавить в корзину/i });
    expect(button).toHaveClass('btn btn--purple modal__btn modal__btn--fit-width');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders add-basket icon', () => {
    render(<ButtonAddBasket productId={productId} productData={productData} />);

    const button = screen.getByRole('button', { name: /добавить в корзину/i });
    const svg = button.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '16');
    expect(svg).toHaveAttribute('aria-hidden', 'true');

    const useEl = svg?.querySelector('use');
    const href = useEl?.getAttribute('xlink:href') ?? useEl?.getAttribute('href');
    expect(href).toBe('#icon-add-basket');
  });

  it('adds product to cart when it is not in cart, then opens success modal', () => {
    isInCart.mockReturnValue(false);

    render(<ButtonAddBasket productId={productId} productData={productData} quantity={2} />);

    fireEvent.click(screen.getByRole('button', { name: /добавить в корзину/i }));

    expect(isInCart).toHaveBeenCalledTimes(1);
    expect(isInCart).toHaveBeenCalledWith(productId);

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(productId, productData, 2);

    expect(updateQuantity).not.toHaveBeenCalled();
    expect(getItemQuantity).not.toHaveBeenCalled();

    expect(openModal).toHaveBeenCalledTimes(1);
    expect(openModal).toHaveBeenCalledWith('success-add-cart');
  });

  it('updates quantity when product is already in cart, then opens success modal', () => {
    isInCart.mockReturnValue(true);
    getItemQuantity.mockReturnValue(3);

    render(<ButtonAddBasket productId={productId} productData={productData} quantity={2} />);

    fireEvent.click(screen.getByRole('button', { name: /добавить в корзину/i }));

    expect(isInCart).toHaveBeenCalledWith(productId);

    expect(getItemQuantity).toHaveBeenCalledTimes(1);
    expect(getItemQuantity).toHaveBeenCalledWith(productId);

    expect(updateQuantity).toHaveBeenCalledTimes(1);
    expect(updateQuantity).toHaveBeenCalledWith(productId, 5);

    expect(addToCart).not.toHaveBeenCalled();

    expect(openModal).toHaveBeenCalledTimes(1);
    expect(openModal).toHaveBeenCalledWith('success-add-cart');
  });

  it('is memoized', () => {
    type MemoLike = { $$typeof: symbol; type: unknown };
    const memoComp = ButtonAddBasket as unknown as MemoLike;

    expect(memoComp.$$typeof).toBe(Symbol.for('react.memo'));
    expect(memoComp.type).toBeDefined();
  });
});
