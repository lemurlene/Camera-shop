import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { CartItem } from './cart-item'; // <-- поправь путь под свой файл
import type { CartItem as CartItemType } from './types';
import type { FullOfferType } from '../../const/type';
import { Setting } from '../../const/const';
import { ModalType } from '../modals/type';

type ModalHook = {
  openModal: (type: ModalType, data?: FullOfferType | string) => void;
};

type CartHook = {
  updateQuantity: (id: number, quantity: number) => void;
};

const mocks = vi.hoisted(() => ({
  useModal: vi.fn<[], ModalHook>(),
  useCart: vi.fn<[], CartHook>(),
}));

vi.mock('../../contexts', () => ({
  useModal: mocks.useModal,
  useCart: mocks.useCart,
}));

vi.mock('../card/basket-card', () => ({
  __esModule: true,
  default: ({ card }: { card: unknown }) => <div data-testid="basket-card">{String(!!card)}</div>,
}));

describe('CartItem component', () => {
  const openModal = vi.fn<[ModalType, (FullOfferType | string)?], void>();
  const updateQuantity = vi.fn<[number, number], void>();

  const productData = ({
    id: 10,
    price: 1000,
    name: 'Test camera',
  } as unknown) as FullOfferType;

  const makeItem = (quantity: number): CartItemType =>
    ({
      id: 10,
      quantity,
      data: productData,
    } as unknown) as CartItemType;

  const getQtyInput = (): HTMLInputElement =>
    screen.getByLabelText(/количество товара/i);

  beforeEach(() => {
    openModal.mockClear();
    updateQuantity.mockClear();

    mocks.useModal.mockReturnValue({ openModal });
    mocks.useCart.mockReturnValue({ updateQuantity });
  });

  it('renders basket card, quantity input and total price', () => {
    const item = makeItem(2);
    render(<CartItem item={item} />);

    expect(screen.getByTestId('basket-card')).toBeInTheDocument();

    const input = getQtyInput();
    expect(input.value).toBe('2');

    const priceBlock = document.querySelector('.basket-item__total-price') as HTMLElement;
    const text = priceBlock.textContent ?? '';
    expect(text).toMatch(/2\s*000\s*₽/);
  });

  it('decrement button is disabled when quantity is 1', () => {
    render(<CartItem item={makeItem(1)} />);

    expect(screen.getByRole('button', { name: /уменьшить количество/i })).toBeDisabled();
  });

  it('increment button is disabled when quantity equals MaxProductQuantity', () => {
    render(<CartItem item={makeItem(Setting.MaxProductQuantity)} />);

    expect(screen.getByRole('button', { name: /увеличить количество/i })).toBeDisabled();
  });

  it('increments quantity and calls updateQuantity', () => {
    const item = makeItem(1);
    render(<CartItem item={item} />);

    fireEvent.click(screen.getByRole('button', { name: /увеличить количество/i }));

    expect(updateQuantity).toHaveBeenCalledTimes(1);
    expect(updateQuantity).toHaveBeenCalledWith(item.id, 2);

    expect(getQtyInput().value).toBe('2');
  });

  it('decrements quantity and calls updateQuantity', () => {
    const item = makeItem(3);
    render(<CartItem item={item} />);

    fireEvent.click(screen.getByRole('button', { name: /уменьшить количество/i }));

    expect(updateQuantity).toHaveBeenCalledTimes(1);
    expect(updateQuantity).toHaveBeenCalledWith(item.id, 2);

    expect(getQtyInput().value).toBe('2');
  });

  it('changes quantity via input within bounds and calls updateQuantity', () => {
    const item = makeItem(1);
    render(<CartItem item={item} />);

    const input = getQtyInput();
    fireEvent.change(input, { target: { value: '5' } });

    expect(updateQuantity).toHaveBeenCalledTimes(1);
    expect(updateQuantity).toHaveBeenCalledWith(item.id, 5);
    expect(getQtyInput().value).toBe('5');
  });

  it('does not change quantity via input when out of bounds', () => {
    render(<CartItem item={makeItem(2)} />);

    const input = getQtyInput();
    fireEvent.change(input, { target: { value: String(Setting.MaxProductQuantity + 1) } });

    expect(updateQuantity).not.toHaveBeenCalled();
    expect(getQtyInput().value).toBe('2');
  });

  it('opens delete-from-cart modal with item.data when remove clicked', () => {
    const item = makeItem(1);
    render(<CartItem item={item} />);

    fireEvent.click(screen.getByRole('button', { name: /удалить товар/i }));

    expect(openModal).toHaveBeenCalledTimes(1);
    expect(openModal).toHaveBeenCalledWith('delete-from-cart', item.data);
  });
});
