import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewsHeader from './reviews-header';

const mockButtonAddCommentMemo = vi.fn<[Record<string, unknown>], void>();

vi.mock('./button-add-comment', () => ({
  default: (props: Record<string, unknown>) => {
    mockButtonAddCommentMemo(props);
    return <button data-testid="add-comment-button">Add comment</button>;
  },
}));

describe('ReviewsHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and add-comment button', () => {
    render(<ReviewsHeader />);

    expect(screen.getByRole('heading', { level: 2, name: 'Отзывы' })).toBeInTheDocument();
    expect(screen.getByTestId('add-comment-button')).toBeInTheDocument();
  });

  it('has correct wrapper class', () => {
    const { container } = render(<ReviewsHeader />);

    expect(container.querySelector('.page-content__headed')).toBeInTheDocument();
  });

  it('renders heading with correct classes', () => {
    render(<ReviewsHeader />);

    expect(screen.getByRole('heading', { level: 2, name: 'Отзывы' }))
      .toHaveClass('title', 'title--h3');
  });

  it('calls ButtonAddCommentMemo with empty props', () => {
    render(<ReviewsHeader />);

    expect(mockButtonAddCommentMemo).toHaveBeenCalledTimes(1);
    const [props] = mockButtonAddCommentMemo.mock.calls[0];
    expect(props).toEqual({});
  });
});
