import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ButtonLoadMore from './button-load-more';

describe('ButtonLoadMore', () => {
  const mockOnShowMore = vi.fn();

  it('should not render when hasMoreReviews is false', () => {
    const { container } = render(
      <ButtonLoadMore
        hasMoreReviews={false}
        isLoading={false}
        onShowMore={mockOnShowMore}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when hasMoreReviews is true', () => {
    render(
      <ButtonLoadMore
        hasMoreReviews
        isLoading={false}
        onShowMore={mockOnShowMore}
      />
    );

    expect(screen.getByText('Показать больше отзывов')).toBeInTheDocument();
  });

  it('should display loading text when isLoading is true', () => {
    render(
      <ButtonLoadMore
        hasMoreReviews
        isLoading
        onShowMore={mockOnShowMore}
      />
    );

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    expect(screen.queryByText('Показать больше отзывов')).not.toBeInTheDocument();
  });

  it('should display normal text when isLoading is false', () => {
    render(
      <ButtonLoadMore
        hasMoreReviews
        isLoading={false}
        onShowMore={mockOnShowMore}
      />
    );

    expect(screen.getByText('Показать больше отзывов')).toBeInTheDocument();
    expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
  });

  it('should call onShowMore when button is clicked', () => {
    render(
      <ButtonLoadMore
        hasMoreReviews
        isLoading={false}
        onShowMore={mockOnShowMore}
      />
    );

    const button = screen.getByText('Показать больше отзывов');
    fireEvent.click(button);

    expect(mockOnShowMore).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when isLoading is true', () => {
    render(
      <ButtonLoadMore
        hasMoreReviews
        isLoading
        onShowMore={mockOnShowMore}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not be disabled when isLoading is false', () => {
    render(
      <ButtonLoadMore
        hasMoreReviews
        isLoading={false}
        onShowMore={mockOnShowMore}
      />
    );

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should have correct CSS classes', () => {
    render(
      <ButtonLoadMore
        hasMoreReviews
        isLoading={false}
        onShowMore={mockOnShowMore}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn--purple');
  });

  it('should have disabled class when isLoading is true', () => {
    render(
      <ButtonLoadMore
        hasMoreReviews
        isLoading
        onShowMore={mockOnShowMore}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn--purple', 'disabled');
  });

  it('should have correct container class', () => {
    const { container } = render(
      <ButtonLoadMore
        hasMoreReviews
        isLoading={false}
        onShowMore={mockOnShowMore}
      />
    );

    const containerDiv = container.querySelector('.review-block__buttons');
    expect(containerDiv).toBeInTheDocument();
  });

  it('should have correct button type', () => {
    render(
      <ButtonLoadMore
        hasMoreReviews
        isLoading={false}
        onShowMore={mockOnShowMore}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
