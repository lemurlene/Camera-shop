import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ButtonGoBasket from './button-go-basket';
import type { FullOfferType } from '../../../const/type';
import { ModalType } from '../../modals/type';

type ModalHook = {
  openModal: (type: ModalType, data?: FullOfferType | string) => void;
  closeModal: () => void;
  modalState: null;
};

type NavigateFn = (to: string) => void;

const mocks = vi.hoisted(() => ({
  useModal: vi.fn<[], ModalHook>(),
  useNavigate: vi.fn<[], NavigateFn>(),
}));

vi.mock('../../../contexts', () => ({
  useModal: mocks.useModal,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: mocks.useNavigate,
  };
});

describe('ButtonGoBasket component', () => {
  const closeModal = vi.fn<[], void>();
  const openModal = vi.fn<[ModalType, (FullOfferType | string)?], void>();
  const navigate = vi.fn<[string], void>();

  beforeEach(() => {
    closeModal.mockClear();
    openModal.mockClear();
    navigate.mockClear();

    mocks.useModal.mockReturnValue({
      openModal,
      closeModal,
      modalState: null,
    });

    mocks.useNavigate.mockReturnValue(navigate);
  });

  it('renders button with correct attributes', () => {
    render(<ButtonGoBasket />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');

    expect(button.className.trim().length).toBeGreaterThan(0);
  });

  it('closes modal and navigates to basket when clicked', () => {
    render(<ButtonGoBasket />);

    fireEvent.click(screen.getByRole('button'));

    expect(closeModal).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/cart');
  });

  it('is memoized', () => {
    type MemoLike = { $$typeof: symbol; type: unknown };
    const memoComp = ButtonGoBasket as unknown as MemoLike;

    expect(memoComp.$$typeof).toBe(Symbol.for('react.memo'));
    expect(memoComp.type).toBeDefined();
  });
});
