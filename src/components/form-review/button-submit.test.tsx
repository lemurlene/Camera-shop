import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ButtonSubmit from './button-submit';

describe('ButtonSubmit component', () => {
  it('should render correctly when enabled', () => {
    render(<ButtonSubmit isDisabled={false} />);

    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(screen.getByText(/Отправить отзыв/)).toBeInTheDocument();
  });

  it('should render correctly when disabled', () => {
    render(<ButtonSubmit isDisabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
