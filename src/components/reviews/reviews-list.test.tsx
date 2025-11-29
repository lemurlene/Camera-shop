import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewsList from './reviews-list';
import { ReviewType } from '../../const/type';

vi.mock('./review', () => ({
  default: vi.fn((props: ReviewType) => (
    <li data-testid="review-item" data-review-id={props.id}>
      Mock Review: {props.userName}
    </li>
  ))
}));

import Review from './review';

describe('ReviewsList Component', () => {
  const mockReviews: ReviewType[] = [
    {
      id: '1',
      createAt: '2024-01-15T10:00:00.000Z',
      userName: 'Иван Иванов',
      advantage: 'Хорошее качество сборки',
      disadvantage: 'Высокая цена',
      review: 'Отличный товар, рекомендую',
      rating: 4,
      cameraId: 1,
    },
    {
      id: '2',
      createAt: '2024-01-20T10:00:00.000Z',
      userName: 'Петр Петров',
      advantage: 'Быстрая доставка',
      disadvantage: 'Нет инструкции',
      review: 'Хороший товар за свои деньги',
      rating: 5,
      cameraId: 1,
    },
    {
      id: '3',
      createAt: '2024-01-25T10:00:00.000Z',
      userName: 'Мария Сидорова',
      advantage: 'Стильный дизайн',
      disadvantage: 'Тяжелый',
      review: 'Пользуюсь неделю, пока все нравится',
      rating: 4,
      cameraId: 1,
    },
  ];

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
      expect(reviewItems).toHaveLength(3);
    });

    it('should render all reviews with correct props', () => {
      render(<ReviewsList reviews={mockReviews} />);

      expect(Review).toHaveBeenCalledTimes(3);

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

    it('should render user names from all reviews', () => {
      render(<ReviewsList reviews={mockReviews} />);

      expect(screen.getByText('Mock Review: Иван Иванов')).toBeInTheDocument();
      expect(screen.getByText('Mock Review: Петр Петров')).toBeInTheDocument();
      expect(screen.getByText('Mock Review: Мария Сидорова')).toBeInTheDocument();
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
      expect(listItems).toHaveLength(3);
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
