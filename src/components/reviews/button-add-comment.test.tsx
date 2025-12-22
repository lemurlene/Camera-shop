import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ButtonAddCommentMemo from './button-add-comment';
import { useModal } from '../../contexts';

vi.mock('../../contexts', () => ({
  useModal: vi.fn(),
}));

const mockedUseModal = vi.mocked(useModal);

describe('ButtonAddCommentMemo', () => {
  const openModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseModal.mockReturnValue({
      modalState: null,
      openModal,
      closeModal: vi.fn(),
    });
  });

  it('renders button text', () => {
    render(<ButtonAddCommentMemo />);
    expect(screen.getByRole('button', { name: /оставить свой отзыв/i })).toBeInTheDocument();
  });

  it('calls openModal("add-review") on click', () => {
    render(<ButtonAddCommentMemo />);

    fireEvent.click(screen.getByRole('button', { name: /оставить свой отзыв/i }));

    expect(openModal).toHaveBeenCalledTimes(1);
    expect(openModal).toHaveBeenCalledWith('add-review');
  });
});
