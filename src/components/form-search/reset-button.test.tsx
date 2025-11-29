import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResetButtonMemo } from './reset-button';

describe('ResetButtonMemo component', () => {
  const mockOnReset = vi.fn();

  const renderComponent = (searchValue = '') => {
    render(
      <ResetButtonMemo searchValue={searchValue} onReset={mockOnReset} />
    );
  };

  it('should not be in the document when searchValue is empty', () => {
    renderComponent('');

    const button = screen.queryByRole('button', { name: 'Сбросить поиск' });
    expect(button).not.toBeInTheDocument();
  });

  it('should be visible when searchValue is not empty', () => {
    renderComponent('test search');

    const button = screen.getByRole('button', { name: 'Сбросить поиск' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({ display: 'flex' });
  });

  it('should call onReset when clicked', () => {
    renderComponent('some value');

    const button = screen.getByRole('button', { name: 'Сбросить поиск' });
    fireEvent.click(button);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('should have correct type and aria-label attributes', () => {
    renderComponent('value');

    const button = screen.getByRole('button', { name: 'Сбросить поиск' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Сбросить поиск');
  });

  it('should render SVG icon', () => {
    renderComponent('value');

    const svg = screen.getByLabelText('Сбросить поиск').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '10');
    expect(svg).toHaveAttribute('height', '10');
  });
});
