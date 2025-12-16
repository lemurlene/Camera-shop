import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SuccessOrderModal } from './success-order-modal';

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
  Modal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal">{children}</div>
  ),
}));

vi.mock('../buttons', () => ({
  __esModule: true,
  ButtonContinueShoppingMemo: ({ isOrder }: { isOrder?: boolean }) => (
    <button data-testid="btn-continue" type="button">
      isOrder:{String(!!isOrder)}
    </button>
  ),
}));

describe('SuccessOrderModal component', () => {
  const closeModal = vi.fn<[], void>();

  beforeEach(() => {
    closeModal.mockClear();
    mocks.useModal.mockReturnValue({ closeModal });
  });

  it('renders title', () => {
    render(<SuccessOrderModal />);
    expect(screen.getByText(/спасибо за покупку/i)).toBeInTheDocument();
  });

  it('renders success icon', () => {
    render(<SuccessOrderModal />);

    const svg = document.querySelector('svg.modal__icon') ;
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('width')).toBe('80');
    expect(svg?.getAttribute('height')).toBe('78');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');

    const useEl = svg?.querySelector('use');
    const href = useEl?.getAttribute('xlink:href') ?? useEl?.getAttribute('href');
    expect(href).toBe('#icon-review-success');
  });

  it('renders continue shopping button with isOrder=true', () => {
    render(<SuccessOrderModal />);
    expect(screen.getByTestId('btn-continue')).toHaveTextContent('isOrder:true');
  });

  it('uses Modal component', () => {
    render(<SuccessOrderModal />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
