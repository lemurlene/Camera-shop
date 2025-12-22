import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';

const closeModalMock = vi.fn();

vi.mock('../../contexts', () => ({
  useModal: () => ({
    closeModal: closeModalMock,
  }),
}));

type ModalProps = {
  onClose: () => void;
  children?: ReactNode;
};

vi.mock('./modal', () => ({
  Modal: ({ onClose, children }: ModalProps) => (
    <div data-testid="modal">
      <button data-testid="modal-close" type="button" onClick={onClose}>
        close
      </button>
      <div data-testid="modal-content">{children}</div>
    </div>
  ),
}));

vi.mock('../buttons', () => ({
  ButtonContinueShoppingMemo: () => (
    <button data-testid="continue-shopping">Continue shopping</button>
  ),
}));

import { SuccessReviewModal } from './success-review-modal';

describe('SuccessReviewModal', () => {
  beforeEach(() => {
    closeModalMock.mockClear();
  });

  it('renders title, icon and continue shopping button', () => {
    render(<SuccessReviewModal />);

    const title = screen.getByText('Спасибо за отзыв');
    expect(title).toBeTruthy();
    expect((title).classList.contains('title')).toBe(true);
    expect((title).classList.contains('title--h4')).toBe(true);

    const modal = screen.getByTestId('modal');

    const svg = modal.querySelector('svg');
    expect(svg).not.toBeNull();
    if (!svg) {
      return;
    }

    expect(svg.classList.contains('modal__icon')).toBe(true);
    expect(svg.getAttribute('width')).toBe('80');
    expect(svg.getAttribute('height')).toBe('78');
    expect(svg.getAttribute('aria-hidden')).toBe('true');

    const useEl = svg.querySelector('use');
    expect(useEl).not.toBeNull();
    if (!useEl) {
      return;
    }

    const href =
      useEl.getAttribute('xlink:href') ??
      useEl.getAttribute('href') ??
      useEl.getAttribute('xlinkHref');

    expect(href).toBe('#icon-review-success');

    const btn = screen.getByTestId('continue-shopping');
    expect(btn).toBeTruthy();
  });

  it('calls closeModal when Modal onClose is triggered', () => {
    render(<SuccessReviewModal />);

    fireEvent.click(screen.getByTestId('modal-close'));
    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });
});
