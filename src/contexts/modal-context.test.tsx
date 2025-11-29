import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../components/modals/modal';

vi.mock('../../hooks', () => ({
  useModalFocus: vi.fn(() => ({ current: document.createElement('div') })),
}));

vi.mock('./utils', () => ({
  getFocusableElements: vi.fn(() => []),
}));

vi.mock('../store/api-action', () => ({}));
vi.mock('../store/offers', () => ({}));

describe('Modal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.classList.remove('scroll-lock');
  });

  it('should render modal when isActive is true', () => {
    render(
      <Modal onClose={mockOnClose} isActive>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Закрыть попап')).toBeInTheDocument();
  });

  it('should not render modal when isActive is false', () => {
    render(
      <Modal onClose={mockOnClose} isActive={false}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <Modal onClose={mockOnClose} isActive>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Закрыть попап');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should add narrow class when narrow prop is true', () => {
    render(
      <Modal onClose={mockOnClose} isActive narrow>
        <div>Modal Content</div>
      </Modal>
    );

    const modal = document.querySelector('.modal');
    expect(modal).toHaveClass('modal--narrow');
  });

  it('should not add narrow class when narrow prop is false', () => {
    render(
      <Modal onClose={mockOnClose} isActive narrow={false}>
        <div>Modal Content</div>
      </Modal>
    );

    const modal = document.querySelector('.modal');
    expect(modal).not.toHaveClass('modal--narrow');
  });

  it('should handle Escape key press', () => {
    render(
      <Modal onClose={mockOnClose} isActive>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should add scroll-lock class when modal is active', () => {
    render(
      <Modal onClose={mockOnClose} isActive>
        <div>Modal Content</div>
      </Modal>
    );

    expect(document.body.classList.contains('scroll-lock')).toBe(true);
  });

  it('should remove scroll-lock class when modal becomes inactive', () => {
    const { rerender } = render(
      <Modal onClose={mockOnClose} isActive>
        <div>Modal Content</div>
      </Modal>
    );

    expect(document.body.classList.contains('scroll-lock')).toBe(true);

    rerender(
      <Modal onClose={mockOnClose} isActive={false}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(document.body.classList.contains('scroll-lock')).toBe(false);
  });

  it('should call onClose when overlay is clicked', () => {
    render(
      <Modal onClose={mockOnClose} isActive>
        <div>Modal Content</div>
      </Modal>
    );

    const overlay = document.querySelector('.modal__overlay');
    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
