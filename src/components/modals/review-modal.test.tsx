import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ReviewModal } from './review-modal';
import { useModal } from '../../contexts';

vi.mock('../../contexts', () => ({
  useModal: vi.fn(),
}));

vi.mock('./modal', () => ({
  Modal: ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <div data-testid="modal">
      <button type="button" onClick={onClose}>
        close
      </button>
      {children}
    </div>
  ),
}));

vi.mock('../form-review', () => ({
  default: () => <div data-testid="form-review">FormReview</div>,
}));

const mockedUseModal = vi.mocked(useModal);

describe('ReviewModal', () => {
  const closeModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseModal.mockReturnValue({
      modalState: null,
      openModal: vi.fn(),
      closeModal,
    });
  });

  it('renders title and FormReview inside Modal', () => {
    render(<ReviewModal />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText(/оставить отзыв/i)).toBeInTheDocument();
    expect(screen.getByTestId('form-review')).toBeInTheDocument();
  });
});
