import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import BasketPage from './basket-page';
import { LoadingStatusEnum } from '../../const/type';
import { LoadingStatus } from '../../const/enum';

type Action = {
  type: string;
  payload?: unknown;
};

type Selector<T = unknown> = (state: unknown) => T;

type StoreMock = {
  Coupon: string | null;
  discount: number;
  isCouponLoading: boolean;

  orderError: string | null;
  isOrderLoading: boolean;
  isOrderSucceeded: boolean;
  isOrderFailed: boolean;

  CouponStatus: LoadingStatusEnum;
  CouponError: string | null;
};

const mocks = vi.hoisted(() => ({
  useAppDispatch: vi.fn<[], (action: Action) => unknown>(),
  useAppSelector: vi.fn<[Selector], unknown>(),

  useCart: vi.fn<
    [],
    {
      cartItems: Array<{ id: number; quantity: number; data: { price: number } }>;
      getTotalPrice: () => number;
      clearCart: () => void;
    }
  >(),
  useModal: vi.fn<[], { openModal: (type: string, data?: string) => void }>(),

  selectCoupon: vi.fn<[unknown], string | null>(),
  selectDiscount: vi.fn<[unknown], number>(),
  selectIsCouponLoading: vi.fn<[unknown], boolean>(),
  setCoupon: vi.fn<[string], Action>(),
  setDiscount: vi.fn<[number], Action>(),
  resetCoupon: vi.fn<[], Action>(),

  selectOrderError: vi.fn<[unknown], string | null>(),
  selectIsOrderLoading: vi.fn<[unknown], boolean>(),
  selectIsOrderSucceeded: vi.fn<[unknown], boolean>(),
  selectIsOrderFailed: vi.fn<[unknown], boolean>(),
  resetOrder: vi.fn<[], Action>(),

  sendOrder: vi.fn<
    [
      {
        camerasIds: number[];
        Coupon: string | null;
      }
    ],
    Action
  >(),
}));

vi.mock('../../hooks', () => ({
  useAppDispatch: mocks.useAppDispatch,
  useAppSelector: mocks.useAppSelector,
}));

vi.mock('../../contexts', () => ({
  useCart: mocks.useCart,
  useModal: mocks.useModal,
}));

vi.mock('../../store/promo-code', () => ({
  selectCoupon: mocks.selectCoupon,
  selectDiscount: mocks.selectDiscount,
  selectIsCouponLoading: mocks.selectIsCouponLoading,
  setCoupon: mocks.setCoupon,
  setDiscount: mocks.setDiscount,
  resetCoupon: mocks.resetCoupon,
}));

vi.mock('../../store/order', () => ({
  selectOrderError: mocks.selectOrderError,
  selectIsOrderLoading: mocks.selectIsOrderLoading,
  selectIsOrderSucceeded: mocks.selectIsOrderSucceeded,
  selectIsOrderFailed: mocks.selectIsOrderFailed,
  resetOrder: mocks.resetOrder,
}));

vi.mock('../../store/api-action', () => ({
  sendOrder: mocks.sendOrder,
}));

vi.mock('../../components/breadcrumbs', () => ({
  __esModule: true,
  default: () => <nav data-testid="breadcrumbs" />,
}));

vi.mock('../../components/cart', () => ({
  CartItem: ({ item }: { item: { id: number } }) => <li data-testid="cart-item">{item.id}</li>,
}));

vi.mock('../../components/loader-overlay', () => ({
  __esModule: true,
  default: () => <div data-testid="loader" />,
}));

vi.mock('../../components/form-promo-code', () => ({
  __esModule: true,
  default: () => <div data-testid="promo-form" />,
}));

describe('BasketPage', () => {
  let store: StoreMock;

  const dispatch = vi.fn<[Action], unknown>();
  const clearCart = vi.fn<[], void>();
  const openModal = vi.fn<[string, (string | undefined)?], void>();

  const setStore = (patch: Partial<StoreMock>) => {
    store = { ...store, ...patch };

    mocks.selectCoupon.mockImplementation((state) => {
      void state;
      return store.Coupon;
    });
    mocks.selectDiscount.mockImplementation((state) => {
      void state;
      return store.discount;
    });
    mocks.selectIsCouponLoading.mockImplementation((state) => {
      void state;
      return store.isCouponLoading;
    });

    mocks.selectOrderError.mockImplementation((state) => {
      void state;
      return store.orderError;
    });
    mocks.selectIsOrderLoading.mockImplementation((state) => {
      void state;
      return store.isOrderLoading;
    });
    mocks.selectIsOrderSucceeded.mockImplementation((state) => {
      void state;
      return store.isOrderSucceeded;
    });
    mocks.selectIsOrderFailed.mockImplementation((state) => {
      void state;
      return store.isOrderFailed;
    });

    mocks.useAppSelector.mockImplementation((selector) => selector({} as unknown));
  };

  const setCart = (items: Array<{ id: number; quantity: number; price: number }>) => {
    const cartItems = items.map((x) => ({ id: x.id, quantity: x.quantity, data: { price: x.price } }));
    const total = cartItems.reduce((sum, it) => sum + it.quantity * it.data.price, 0);

    mocks.useCart.mockReturnValue({
      cartItems,
      clearCart,
      getTotalPrice: () => total,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.body.className = '';

    store = {
      Coupon: null,
      discount: 0,
      isCouponLoading: false,

      orderError: null,
      isOrderLoading: false,
      isOrderSucceeded: false,
      isOrderFailed: false,

      CouponStatus: LoadingStatus.Idle,
      CouponError: null,
    };

    mocks.useAppDispatch.mockReturnValue(dispatch);
    mocks.useModal.mockReturnValue({ openModal });

    mocks.setCoupon.mockImplementation((Coupon) => ({ type: 'Coupon/setCoupon', payload: Coupon }));
    mocks.setDiscount.mockImplementation((d) => ({ type: 'Coupon/setDiscount', payload: d }));
    mocks.resetCoupon.mockImplementation(() => ({ type: 'Coupon/reset' }));

    mocks.resetOrder.mockImplementation(() => ({ type: 'order/reset' }));

    mocks.sendOrder.mockImplementation((payload) => ({ type: 'order/send', payload }));

    setStore({});
    setCart([
      { id: 1, quantity: 2, price: 1000 },
      { id: 2, quantity: 1, price: 5000 },
    ]);
  });

  it('renders basket page, breadcrumbs, promo form and cart items', () => {
    render(<BasketPage />);

    expect(screen.getByTestId('basket-page')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('promo-form')).toBeInTheDocument();

    const items = screen.getAllByTestId('cart-item');
    expect(items).toHaveLength(2);
  });

  it('shows correct totals with discount', () => {
    setStore({ discount: 10 });
    render(<BasketPage />);

    const totalPrice = 7000;
    const discountAmount = Math.round((totalPrice * 10) / 100);
    const finalPrice = totalPrice - discountAmount;

    const getDigits = (el: Element | null) => (el?.textContent ?? '').replace(/\D/g, '');

    const totalEl = screen.getByText(/всего:/i).closest('p')?.querySelector('.basket__summary-value') ?? null;
    const discountEl =
      screen.getByText(/скидка:/i).closest('p')?.querySelector('.basket__summary-value--bonus') ?? null;
    const finalEl =
      screen.getByText(/к оплате:/i).closest('p')?.querySelector('.basket__summary-value--total') ?? null;

    expect(totalEl).not.toBeNull();
    expect(discountEl).not.toBeNull();
    expect(finalEl).not.toBeNull();

    expect(getDigits(totalEl)).toBe(String(totalPrice));
    expect(getDigits(discountEl)).toBe(String(discountAmount));
    expect(getDigits(finalEl)).toBe(String(finalPrice));
    expect(totalEl).toHaveTextContent(/₽/);
    expect(discountEl).toHaveTextContent(/₽/);
    expect(finalEl).toHaveTextContent(/₽/);
  });

  it('disables order button when basket is empty', () => {
    setCart([]);
    render(<BasketPage />);

    const btn = screen.getByRole('button', { name: /оформить заказ/i });
    expect(btn).toBeDisabled();
  });

  it('dispatches sendOrder with camerasIds and Coupon on order submit', () => {
    setStore({ Coupon: 'camera-333' });
    render(<BasketPage />);

    const btn = screen.getByRole('button', { name: /оформить заказ/i });
    fireEvent.click(btn);
    expect(mocks.sendOrder).toHaveBeenCalledTimes(1);
    expect(mocks.sendOrder).toHaveBeenCalledWith({
      camerasIds: [1, 1, 2],
      coupon: 'camera-333',
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'order/send',
      payload: { camerasIds: [1, 1, 2], coupon: 'camera-333' },
    });
  });

  it('shows loader and locks scroll when loading', () => {
    setStore({ isOrderLoading: true });
    const { unmount } = render(<BasketPage />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(document.body.classList.contains('scroll-lock')).toBe(true);

    unmount();
    expect(document.body.classList.contains('scroll-lock')).toBe(false);
  });

  it('on success: clears cart, resets Coupon & order and opens success modal', async () => {
    setStore({ isOrderSucceeded: true });

    render(<BasketPage />);

    await waitFor(() => {
      expect(clearCart).toHaveBeenCalledTimes(1);
      expect(openModal).toHaveBeenCalledWith('success-order');
      expect(dispatch).toHaveBeenCalledWith({ type: 'Coupon/reset' });
      expect(dispatch).toHaveBeenCalledWith({ type: 'order/reset' });
    });
  });

  it('on failure: opens error modal with server error text', async () => {
    setStore({ isOrderFailed: true, orderError: 'Сервер недоступен' });

    render(<BasketPage />);

    await waitFor(() => {
      expect(openModal).toHaveBeenCalledWith('error-order', 'Сервер недоступен');
    });
  });

  it('reads saved Coupon/discount from localStorage and dispatches setCoupon/setDiscount', async () => {
    localStorage.setItem('appliedCoupon', 'camera-444');
    localStorage.setItem('CouponDiscount', '15');

    setStore({ Coupon: 'camera-444', discount: 15 });

    render(<BasketPage />);

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: 'Coupon/setCoupon', payload: 'camera-444' });
      expect(dispatch).toHaveBeenCalledWith({ type: 'Coupon/setDiscount', payload: 15 });
    });
  });
});

