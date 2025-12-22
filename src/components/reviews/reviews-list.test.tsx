import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewsList from './reviews-list';
import { ReviewType } from '../../const/type';
import { mockReviews } from '../../mocks/mock-reviews';

vi.mock('./review', () => ({
  default: vi.fn((props: ReviewType) => (
    <li data-testid="review-item" data-review-id={props.id}>
      {props.userName}
    </li>
  ))
}));

import Review from './review';

describe('ReviewsList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('reviews rendering', () => {
    it('should render correct number of reviews', () => {
      render(<ReviewsList reviews={mockReviews} />);

      const reviewItems = screen.getAllByTestId('review-item');
      expect(reviewItems).toHaveLength(15);
    });

    it('should render all reviews with correct props', () => {
      render(<ReviewsList reviews={mockReviews} />);

      expect(Review).toHaveBeenCalledTimes(15);

      mockReviews.forEach((review, index) => {
        expect(Review).toHaveBeenNthCalledWith(index + 1, review, {});
      });
    });

    it('should pass correct key to each review', () => {
      render(<ReviewsList reviews={mockReviews} />);

      const reviewItems = screen.getAllByTestId('review-item');

      reviewItems.forEach((item, index) => {
        expect(item).toHaveAttribute('data-review-id', mockReviews[index].id);
      });
    });
  });

  describe('list structure', () => {
    it('should render ul element with correct class', () => {
      render(<ReviewsList reviews={mockReviews} />);

      const listElement = screen.getByRole('list');
      expect(listElement).toBeInTheDocument();
      expect(listElement).toHaveClass('review-block__list');
    });

    it('should render list items inside the ul', () => {
      const { container } = render(<ReviewsList reviews={mockReviews} />);

      const listElement = container.querySelector('ul.review-block__list');
      expect(listElement).toBeInTheDocument();

      const listItems = listElement?.querySelectorAll('li');
      expect(listItems).toHaveLength(15);
    });
  });

  describe('edge cases', () => {
    it('should handle empty reviews array', () => {
      render(<ReviewsList reviews={[]} />);

      const listElement = screen.getByRole('list');
      expect(listElement).toBeInTheDocument();

      const listItems = screen.queryAllByTestId('review-item');
      expect(listItems).toHaveLength(0);

      expect(Review).not.toHaveBeenCalled();
    });

    it('should handle single review', () => {
      const singleReview = [mockReviews[0]];

      render(<ReviewsList reviews={singleReview} />);

      const reviewItems = screen.getAllByTestId('review-item');
      expect(reviewItems).toHaveLength(1);
      expect(Review).toHaveBeenCalledTimes(1);
      expect(Review).toHaveBeenCalledWith(singleReview[0], {});
    });
  });

  describe('performance and best practices', () => {
    it('should use unique keys for each review', () => {
      render(<ReviewsList reviews={mockReviews} />);

      const reviewItems = screen.getAllByTestId('review-item');
      const uniqueIds = Array.from(new Set(reviewItems.map((item) => item.getAttribute('data-review-id'))));

      expect(uniqueIds).toHaveLength(mockReviews.length);
      expect(uniqueIds).toEqual(mockReviews.map((review) => review.id));
    });

    it('should re-render only when reviews prop changes', () => {
      const { rerender } = render(<ReviewsList reviews={[mockReviews[0]]} />);

      const initialCallCount = vi.mocked(Review).mock.calls.length;

      rerender(<ReviewsList reviews={[mockReviews[0]]} />);

      expect(vi.mocked(Review).mock.calls.length).toBeLessThanOrEqual(initialCallCount + 1);
    });

    it('should re-render when reviews prop changes', () => {
      const { rerender } = render(<ReviewsList reviews={[mockReviews[0]]} />);

      const initialCallCount = vi.mocked(Review).mock.calls.length;

      rerender(<ReviewsList reviews={[mockReviews[1]]} />);

      expect(vi.mocked(Review).mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });
});
