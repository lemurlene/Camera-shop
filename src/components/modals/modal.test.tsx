import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Modal } from './modal';

vi.mock('../../hooks', () => ({
  useModalFocus: vi.fn(() => ({ current: null })),
}));

vi.mock('../utils', () => ({
  getFocusableElements: vi.fn(() => []),
}));

describe('Modal Simplified', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children and close button', () => {
    render(
      <Modal onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Закрыть попап' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Modal onClose={mockOnClose}>Content</Modal>);

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть попап' }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Modal onClose={mockOnClose}>Content</Modal>);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isActive is false', () => {
    const { container } = render(
      <Modal onClose={mockOnClose} isActive={false}>
        Content
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies narrow class when narrow prop is true', () => {
    render(
      <Modal onClose={mockOnClose} narrow>
        Content
      </Modal>
    );

    const modal = screen.getByRole('button', { name: 'Закрыть попап' }).closest('.modal');
    expect(modal).toHaveClass('modal--narrow');
  });
});
