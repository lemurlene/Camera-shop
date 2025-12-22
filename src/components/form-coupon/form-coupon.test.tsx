import type { ComponentType } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FormCouponMemo from './';
import { LoadingStatus } from '../../const/enum';

type Action = {
  type: string;
  payload?: string;
};

type Selector<T = unknown> = (state: unknown) => T;

type PromoState = {
  Coupon: string | null;
  discount: number;
  status: LoadingStatus;
  error: string | null;
};

type MemoLike = {
  $$typeof: symbol;
  type: ComponentType<Record<string, never>>;
};

const InnerFormCoupon = (FormCouponMemo as unknown as MemoLike).type;

const mocks = vi.hoisted(() => ({
  useAppDispatch: vi.fn<[], (action: Action) => unknown>(),
  useAppSelector: vi.fn<[Selector], unknown>(),

  selectCoupon: vi.fn<[unknown], string | null>(),
  selectDiscount: vi.fn<[unknown], number>(),
  selectCouponStatus: vi.fn<[unknown], LoadingStatus>(),
  selectCouponError: vi.fn<[unknown], string | null>(),

  resetCoupon: vi.fn<[], Action>(),
  checkCoupon: vi.fn<[string], Action>(),
}));

vi.mock('../../hooks', () => ({
  useAppDispatch: (): ((action: Action) => unknown) => mocks.useAppDispatch(),
  useAppSelector: (selector: Selector): unknown => mocks.useAppSelector(selector),
}));

vi.mock('../../store/coupon', () => ({
  resetCoupon: (): Action => mocks.resetCoupon(),
  selectCoupon: (state: unknown): string | null => mocks.selectCoupon(state),
  selectDiscount: (state: unknown): number => mocks.selectDiscount(state),
  selectCouponStatus: (state: unknown): LoadingStatus => mocks.selectCouponStatus(state),
  selectCouponError: (state: unknown): string | null => mocks.selectCouponError(state),
}));

vi.mock('../../store/api-action', () => ({
  checkCoupon: (code: string): Action => mocks.checkCoupon(code),
}));

describe('FormCoupon component', () => {
  const dispatch = vi.fn<[Action], unknown>();

  const setSelectors = (s: PromoState) => {
    mocks.selectCoupon.mockImplementation((state) => {
      void state;
      return s.Coupon;
    });
    mocks.selectDiscount.mockImplementation((state) => {
      void state;
      return s.discount;
    });
    mocks.selectCouponStatus.mockImplementation((state) => {
      void state;
      return s.status;
    });
    mocks.selectCouponError.mockImplementation((state) => {
      void state;
      return s.error;
    });

    mocks.useAppSelector.mockImplementation((selector) => selector({} as unknown));
  };

  beforeEach(() => {
    dispatch.mockClear();

    mocks.useAppDispatch.mockClear();
    mocks.useAppDispatch.mockReturnValue(dispatch);

    mocks.resetCoupon.mockClear();
    mocks.resetCoupon.mockReturnValue({ type: 'Coupon/reset' });

    mocks.checkCoupon.mockClear();
    mocks.checkCoupon.mockImplementation((code) => ({ type: 'Coupon/check', payload: code }));

    setSelectors({ Coupon: null, discount: 0, status: LoadingStatus.Idle, error: null });
  });

  it('renders input and submit button', () => {
    render(<InnerFormCoupon />);

    expect(screen.getByPlaceholderText(/введите промокод/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /применить/i })).toBeInTheDocument();
  });

  it('removes spaces on input change', () => {
    render(<FormCouponMemo />);

    const el = screen.getByPlaceholderText(/введите промокод/i);
    if (!(el instanceof HTMLInputElement)) {
      throw new Error('Promo code field is not an input');
    }

    fireEvent.change(el, { target: { value: 'cam era- 333' } });
    expect(el.value).toBe('camera-333');
  });

  it('does not dispatch checkCoupon if promo is empty and shows local error (submit by form)', async () => {
    render(<InnerFormCoupon />);

    const button = screen.getByRole('button', { name: /применить/i });
    const form = button.closest('form');
    if (!form) {
      throw new Error('Form element not found');
    }

    fireEvent.submit(form);

    expect(await screen.findByText(/введите промокод/i)).toBeInTheDocument();
    expect(dispatch).not.toHaveBeenCalled();
    expect(mocks.checkCoupon).not.toHaveBeenCalled();
  });

  it('dispatches checkCoupon with cleaned code on submit', () => {
    render(<InnerFormCoupon />);

    const input = screen.getByPlaceholderText(/введите промокод/i);
    fireEvent.change(input, { target: { value: ' camera-333 ' } });

    fireEvent.click(screen.getByRole('button', { name: /применить/i }));

    expect(mocks.checkCoupon).toHaveBeenCalledTimes(1);
    expect(mocks.checkCoupon).toHaveBeenCalledWith('camera-333');

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'Coupon/check', payload: 'camera-333' });
  });

  it('dispatches resetCoupon on input change when Coupon/discount already applied', () => {
    setSelectors({ Coupon: 'camera-333', discount: 15, status: LoadingStatus.Success, error: null });

    render(<InnerFormCoupon />);

    const input = screen.getByPlaceholderText(/введите промокод/i);
    fireEvent.change(input, { target: { value: 'camera-444' } });

    expect(mocks.resetCoupon).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'Coupon/reset' });
  });

  it('disables input and shows "Проверка..." when status is loading', () => {
    setSelectors({ Coupon: null, discount: 0, status: LoadingStatus.Loading, error: null });

    render(<InnerFormCoupon />);

    expect(screen.getByPlaceholderText(/введите промокод/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /проверка/i })).toBeDisabled();
  });

  it('shows success message when status becomes succeeded (after rerender)', async () => {
    setSelectors({ Coupon: null, discount: 0, status: LoadingStatus.Idle, error: null });
    const { rerender } = render(<InnerFormCoupon />);

    setSelectors({ Coupon: 'camera-333', discount: 15, status: LoadingStatus.Success, error: null });
    rerender(<InnerFormCoupon />);

    expect(await screen.findByText(/промокод принят!/i)).toBeInTheDocument();

    const wrapper = document.querySelector('.custom-input') as HTMLElement;
    expect(wrapper.className).toContain('is-valid');
  });

  it('shows error message when status becomes failed (after rerender)', async () => {
    setSelectors({ Coupon: null, discount: 0, status: LoadingStatus.Idle, error: null });
    const { rerender } = render(<InnerFormCoupon />);

    setSelectors({
      Coupon: null,
      discount: 0,
      status: LoadingStatus.Error,
      error: 'Не удалось проверить промокод',
    });
    rerender(<InnerFormCoupon />);

    expect(await screen.findByText(/не удалось проверить промокод/i)).toBeInTheDocument();

    const wrapper = document.querySelector('.custom-input') as HTMLElement;
    expect(wrapper.className).toContain('is-invalid');
  });

  it('is memoized', () => {
    const memoComp = FormCouponMemo as unknown as MemoLike;

    expect(memoComp.$$typeof).toBe(Symbol.for('react.memo'));
    expect(memoComp.type).toBeDefined();
  });
});
