import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TabsControls } from './tabs-controls';

describe('TabsControls', () => {
  const mockOnTabChange = vi.fn();

  const defaultProps = {
    activeTab: 'specs' as const,
    onTabChange: mockOnTabChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with both tabs', () => {
    render(<TabsControls {...defaultProps} />);

    expect(screen.getByText('Характеристики')).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Характеристики' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Описание' })).toBeInTheDocument();
  });

  it('has correct CSS classes on container', () => {
    const { container } = render(<TabsControls {...defaultProps} />);

    const tabsContainer = container.querySelector('.tabs__controls');
    expect(tabsContainer).toBeInTheDocument();
    expect(tabsContainer).toHaveClass('tabs__controls', 'product__tabs-controls');
  });

  it('applies active class to specs tab when activeTab is "specs"', () => {
    render(<TabsControls {...defaultProps} activeTab="specs" />);

    const specsButton = screen.getByRole('button', { name: 'Характеристики' });
    const descriptionButton = screen.getByRole('button', { name: 'Описание' });

    expect(specsButton).toHaveClass('tabs__control', 'is-active');
    expect(descriptionButton).toHaveClass('tabs__control');
    expect(descriptionButton).not.toHaveClass('is-active');
  });

  it('applies active class to description tab when activeTab is "description"', () => {
    render(<TabsControls {...defaultProps} activeTab="description" />);

    const specsButton = screen.getByRole('button', { name: 'Характеристики' });
    const descriptionButton = screen.getByRole('button', { name: 'Описание' });

    expect(descriptionButton).toHaveClass('tabs__control', 'is-active');
    expect(specsButton).toHaveClass('tabs__control');
    expect(specsButton).not.toHaveClass('is-active');
  });

  it('calls onTabChange with "specs" when specs button is clicked', async () => {
    const user = userEvent.setup();
    render(<TabsControls {...defaultProps} activeTab="description" />);

    const specsButton = screen.getByRole('button', { name: 'Характеристики' });
    await user.click(specsButton);

    expect(mockOnTabChange).toHaveBeenCalledTimes(1);
    expect(mockOnTabChange).toHaveBeenCalledWith('specs');
  });

  it('calls onTabChange with "description" when description button is clicked', async () => {
    const user = userEvent.setup();
    render(<TabsControls {...defaultProps} activeTab="specs" />);

    const descriptionButton = screen.getByRole('button', { name: 'Описание' });
    await user.click(descriptionButton);

    expect(mockOnTabChange).toHaveBeenCalledTimes(1);
    expect(mockOnTabChange).toHaveBeenCalledWith('description');
  });

  it('has correct button types', () => {
    render(<TabsControls {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('renders with different activeTab values', () => {
    const { rerender } = render(<TabsControls {...defaultProps} activeTab="specs" />);

    expect(screen.getByRole('button', { name: 'Характеристики' })).toHaveClass('is-active');

    rerender(<TabsControls {...defaultProps} activeTab="description" />);

    expect(screen.getByRole('button', { name: 'Описание' })).toHaveClass('is-active');
    expect(screen.getByRole('button', { name: 'Характеристики' })).not.toHaveClass('is-active');
  });
});
