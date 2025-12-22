import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { CartProvider, useCart } from './cart-context';
import { isValidCartItemArray } from '../components/cart/types';

vi.mock('../components/cart/types', () => ({
  isValidCartItemArray: vi.fn(),
}));

const mockedIsValidCartItemArray = vi.mocked(isValidCartItemArray);

function CartConsumer() {
  const cart = useCart();

  return (
    <div>
      <div data-testid="cartCount">{cart.cartCount}</div>
      <div data-testid="totalQty">{cart.getTotalQuantity()}</div>
      <div data-testid="totalPrice">{cart.getTotalPrice()}</div>

      <div data-testid="inCart-1">{String(cart.isInCart(1))}</div>
      <div data-testid="qty-1">{cart.getItemQuantity(1)}</div>

      <button
        type="button"
        onClick={() => cart.addToCart(1, { price: 3500 } as never)}
      >
        add-1
      </button>

      <button
        type="button"
        onClick={() => cart.addToCart(1, { price: 3500 } as never, 2)}
      >
        add-1-plus2
      </button>

      <button
        type="button"
        onClick={() => cart.addToCart(2, { price: 1000 } as never)}
      >
        add-2
      </button>

      <button type="button" onClick={() => cart.updateQuantity(1, 5)}>
        set-1-to-5
      </button>

      <button type="button" onClick={() => cart.updateQuantity(1, 0)}>
        set-1-to-0
      </button>

      <button type="button" onClick={() => cart.removeFromCart(1)}>
        remove-1
      </button>

      <button type="button" onClick={() => cart.clearCart()}>
        clear
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <CartProvider>
      <CartConsumer />
    </CartProvider>
  );
}

describe('CartProvider / useCart', () => {
  const onCartUpdated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockedIsValidCartItemArray.mockReturnValue(false);

    window.addEventListener('cartUpdated', onCartUpdated);
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'getItem');
  });

  afterEach(() => {
    window.removeEventListener('cartUpdated', onCartUpdated);
    vi.restoreAllMocks();
  });

  it('throws if useCart used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const Broken = () => {
      useCart();
      return null;
    };

    expect(() => render(<Broken />)).toThrow(/useCart must be used within CartProvider/i);
    spy.mockRestore();
  });

  it('initializes from localStorage when data is valid', async () => {
    const saved = [
      { id: 1, quantity: 2, data: { price: 3500 } },
      { id: 2, quantity: 1, data: { price: 1000 } },
    ];

    localStorage.setItem('cart', JSON.stringify(saved));
    mockedIsValidCartItemArray.mockReturnValue(true);

    renderWithProvider();

    expect(screen.getByTestId('cartCount')).toHaveTextContent('2');
    expect(screen.getByTestId('totalQty')).toHaveTextContent('3');
    expect(screen.getByTestId('totalPrice')).toHaveTextContent(String(3500 * 2 + 1000 * 1));

    await waitFor(() => {
      expect(onCartUpdated).toHaveBeenCalled();
      expect(Storage.prototype.setItem).toHaveBeenCalled();
    });
  });

  it('falls back to empty cart if localStorage has invalid JSON', () => {
    localStorage.setItem('cart', '{bad json');
    mockedIsValidCartItemArray.mockReturnValue(true);

    renderWithProvider();

    expect(screen.getByTestId('cartCount')).toHaveTextContent('0');
    expect(screen.getByTestId('totalQty')).toHaveTextContent('0');
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('0');
  });

  it('addToCart adds new item and updates totals + localStorage + event', async () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: 'add-1' }));

    expect(screen.getByTestId('cartCount')).toHaveTextContent('1');
    expect(screen.getByTestId('totalQty')).toHaveTextContent('1');
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('3500');
    expect(screen.getByTestId('inCart-1')).toHaveTextContent('true');
    expect(screen.getByTestId('qty-1')).toHaveTextContent('1');

    await waitFor(() => {
      expect(onCartUpdated).toHaveBeenCalled();
      expect(Storage.prototype.setItem).toHaveBeenCalled();
    });
  });

  it('addToCart increments quantity if item already exists', async () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: 'add-1' })); // +1
    fireEvent.click(screen.getByRole('button', { name: 'add-1-plus2' })); // +2

    expect(screen.getByTestId('cartCount')).toHaveTextContent('1');
    expect(screen.getByTestId('qty-1')).toHaveTextContent('3');
    expect(screen.getByTestId('totalQty')).toHaveTextContent('3');
    expect(screen.getByTestId('totalPrice')).toHaveTextContent(String(3500 * 3));

    await waitFor(() => expect(Storage.prototype.setItem).toHaveBeenCalled());
  });

  it('updateQuantity sets quantity; if <=0 item is removed', async () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: 'add-1' }));
    fireEvent.click(screen.getByRole('button', { name: 'set-1-to-5' }));

    expect(screen.getByTestId('qty-1')).toHaveTextContent('5');
    expect(screen.getByTestId('totalQty')).toHaveTextContent('5');
    expect(screen.getByTestId('totalPrice')).toHaveTextContent(String(3500 * 5));

    fireEvent.click(screen.getByRole('button', { name: 'set-1-to-0' }));

    expect(screen.getByTestId('cartCount')).toHaveTextContent('0');
    expect(screen.getByTestId('inCart-1')).toHaveTextContent('false');
    expect(screen.getByTestId('qty-1')).toHaveTextContent('0');

    await waitFor(() => expect(onCartUpdated).toHaveBeenCalled());
  });

  it('removeFromCart removes item by id', async () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: 'add-1' }));
    fireEvent.click(screen.getByRole('button', { name: 'add-2' }));

    expect(screen.getByTestId('cartCount')).toHaveTextContent('2');

    fireEvent.click(screen.getByRole('button', { name: 'remove-1' }));

    expect(screen.getByTestId('cartCount')).toHaveTextContent('1');
    expect(screen.getByTestId('inCart-1')).toHaveTextContent('false');

    await waitFor(() => expect(Storage.prototype.setItem).toHaveBeenCalled());
  });

  it('clearCart clears everything', async () => {
    renderWithProvider();

    fireEvent.click(screen.getByRole('button', { name: 'add-1' }));
    fireEvent.click(screen.getByRole('button', { name: 'add-2' }));

    expect(screen.getByTestId('cartCount')).toHaveTextContent('2');

    fireEvent.click(screen.getByRole('button', { name: 'clear' }));

    expect(screen.getByTestId('cartCount')).toHaveTextContent('0');
    expect(screen.getByTestId('totalQty')).toHaveTextContent('0');
    expect(screen.getByTestId('totalPrice')).toHaveTextContent('0');

    await waitFor(() => expect(onCartUpdated).toHaveBeenCalled());
  });
});
