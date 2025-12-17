import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import InputRating from './input-rating';

describe('InputRating component', () => {
  const mockOnChange = vi.fn();
  const props = {
    ratingValue: 5,
    title: 'perfect',
    onChange: mockOnChange,
    isDisabled: false,
    checked: false
  };

  it('should render correctly', () => {
    render(<InputRating {...props} />);

    expect(screen.getByRole('radio')).toBeInTheDocument();
    expect(screen.getByTitle('perfect')).toBeInTheDocument();
  });

  it('should call onChange when clicked', async () => {
    render(<InputRating {...props} />);

    const radio = screen.getByRole('radio');
    await userEvent.click(radio);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should be disabled when isDisabled is true', () => {
    render(<InputRating {...props} isDisabled />);

    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('should be checked when checked is true', () => {
    render(<InputRating {...props} checked />);

    expect(screen.getByRole('radio')).toBeChecked();
  });
});
