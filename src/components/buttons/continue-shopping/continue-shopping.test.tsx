import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ButtonContinueShopping from './continue-shopping';
import type { FullOfferType } from '../../../const/type';
import { ModalType } from '../../modals/type';

type ModalHook = {
  openModal: (type: ModalType, data?: FullOfferType | string) => void;
  closeModal: () => void;
  modalState: null;
};

type LocationLike = { pathname: string };
type NavigateFn = (to: string) => void;

const mocks = vi.hoisted(() => ({
  useModal: vi.fn<[], ModalHook>(),
  useLocation: vi.fn<[], LocationLike>(),
  useNavigate: vi.fn<[], NavigateFn>(),
}));

vi.mock('../../../contexts', () => ({
  useModal: mocks.useModal,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: mocks.useLocation,
    useNavigate: mocks.useNavigate,
  };
});

describe('ButtonContinueShopping component', () => {
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

  it('renders a button', () => {
    mocks.useLocation.mockReturnValue({ pathname: '/basket' });

    render(<ButtonContinueShopping />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('closes modal and navigates to catalog when not on catalog page', () => {
    mocks.useLocation.mockReturnValue({ pathname: '/basket' });

    render(<ButtonContinueShopping />);

    fireEvent.click(screen.getByRole('button'));

    expect(closeModal).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/catalog');
  });

  it('closes modal and does not navigate when already on catalog page', () => {
    mocks.useLocation.mockReturnValue({ pathname: '/catalog' });

    render(<ButtonContinueShopping />);

    fireEvent.click(screen.getByRole('button'));

    expect(closeModal).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('works with isOrder=true and still navigates', () => {
    mocks.useLocation.mockReturnValue({ pathname: '/basket' });

    render(<ButtonContinueShopping isOrder />);

    fireEvent.click(screen.getByRole('button'));

    expect(closeModal).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/catalog');
  });

  it('is memoized', () => {
    type MemoLike = { $$typeof: symbol; type: unknown };
    const memoComp = ButtonContinueShopping as unknown as MemoLike;

    expect(memoComp.$$typeof).toBe(Symbol.for('react.memo'));
    expect(memoComp.type).toBeDefined();
  });
});
