import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Review from './review';
import { ReviewType } from '../../const/type';

vi.mock('./utils', () => ({
  formatedDate: vi.fn((date: string) => {
    const formattedDates: { [key: string]: string } = {
      '2024-01-15T10:00:00.000Z': '15 января',
      '2024-03-20T10:00:00.000Z': '20 марта'
    };
    return formattedDates[date] || date;
  })
}));

vi.mock('../rate/utils', () => ({
  renderRatingStars: vi.fn((rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <svg key={index + 1} width="17" height="16" aria-hidden="true" data-testid={`star-${index + 1}`}>
        <use xlinkHref={index < rating ? '#icon-full-star' : '#icon-star'}></use>
      </svg>
    ))
  )
}));

describe('Review Component', () => {
  const mockReview: ReviewType = {
    id: '1',
    createAt: '2024-01-15T10:00:00.000Z',
    userName: 'Иван Иванов',
    advantage: 'Хорошее качество сборки',
    disadvantage: 'Высокая цена',
    review: 'Отличный товар, рекомендую',
    rating: 4,
    cameraId: 1,
  };

  describe('review content rendering', () => {
    it('should render user name correctly', () => {
      render(<Review {...mockReview} />);

      expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
      expect(screen.getByText('Иван Иванов')).toHaveClass('title', 'title--h4');
    });

    it('should render formatted date correctly', () => {
      render(<Review {...mockReview} />);

      const timeElement = screen.getByText('15 января');
      expect(timeElement).toBeInTheDocument();
      expect(timeElement).toHaveClass('review-card__data');
      expect(timeElement).toHaveAttribute('datetime', '2024-01-15T10:00:00.000Z');
    });

    it('should render rating stars', () => {
      render(<Review {...mockReview} />);

      const stars = screen.getAllByTestId(/star-\d+/);
      expect(stars).toHaveLength(5);
    });
  });

  describe('review details list', () => {
    it('should render advantages correctly', () => {
      render(<Review {...mockReview} />);

      expect(screen.getByText('Достоинства:')).toBeInTheDocument();
      expect(screen.getByText('Хорошее качество сборки')).toBeInTheDocument();
      expect(screen.getByText('Хорошее качество сборки')).toHaveClass('item-list__text');
    });

    it('should render disadvantages correctly', () => {
      render(<Review {...mockReview} />);

      expect(screen.getByText('Недостатки:')).toBeInTheDocument();
      expect(screen.getByText('Высокая цена')).toBeInTheDocument();
      expect(screen.getByText('Высокая цена')).toHaveClass('item-list__text');
    });

    it('should render comment correctly', () => {
      render(<Review {...mockReview} />);

      expect(screen.getByText('Комментарий:')).toBeInTheDocument();
      expect(screen.getByText('Отличный товар, рекомендую')).toBeInTheDocument();
      expect(screen.getByText('Отличный товар, рекомендую')).toHaveClass('item-list__text');
    });
  });

  describe('CSS classes and structure', () => {
    it('should apply correct CSS classes to main container', () => {
      const { container } = render(<Review {...mockReview} />);

      const reviewCard = container.querySelector('.review-card');
      expect(reviewCard).toBeInTheDocument();
      expect(reviewCard).toHaveClass('review-card');
    });

    it('should render head section with correct classes', () => {
      const { container } = render(<Review {...mockReview} />);

      const headSection = container.querySelector('.review-card__head');
      expect(headSection).toBeInTheDocument();

      const userName = headSection?.querySelector('.title--h4');
      expect(userName).toHaveTextContent('Иван Иванов');

      const timeElement = headSection?.querySelector('.review-card__data');
      expect(timeElement).toHaveTextContent('15 января');
    });

    it('should render rate section with correct classes', () => {
      const { container } = render(<Review {...mockReview} />);

      const rateSection = container.querySelector('.rate.review-card__rate');
      expect(rateSection).toBeInTheDocument();

      const stars = rateSection?.querySelectorAll('[data-testid^="star-"]');
      expect(stars).toHaveLength(5);
    });

    it('should render list with correct classes and items', () => {
      const { container } = render(<Review {...mockReview} />);

      const reviewList = container.querySelector('.review-card__list');
      expect(reviewList).toBeInTheDocument();

      const listItems = reviewList?.querySelectorAll('.item-list');
      expect(listItems).toHaveLength(3);

      expect(listItems?.[0]).toHaveTextContent('Достоинства:');
      expect(listItems?.[0]).toHaveTextContent('Хорошее качество сборки');

      expect(listItems?.[1]).toHaveTextContent('Недостатки:');
      expect(listItems?.[1]).toHaveTextContent('Высокая цена');

      expect(listItems?.[2]).toHaveTextContent('Комментарий:');
      expect(listItems?.[2]).toHaveTextContent('Отличный товар, рекомендую');
    });
  });

  describe('edge cases', () => {
    it('should handle review with empty fields', () => {
      const emptyReview: ReviewType = {
        ...mockReview,
        advantage: '',
        disadvantage: '',
        review: '',
      };

      render(<Review {...emptyReview} />);

      expect(screen.getByText('Достоинства:')).toBeInTheDocument();
      expect(screen.getByText('Недостатки:')).toBeInTheDocument();
      expect(screen.getByText('Комментарий:')).toBeInTheDocument();

      const advantageText = screen.getByText('Достоинства:').closest('.item-list')?.querySelector('.item-list__text');
      expect(advantageText).toHaveTextContent('');
    });

    it('should handle different rating values', () => {
      const lowRatingReview: ReviewType = {
        ...mockReview,
        rating: 1,
      };

      render(<Review {...lowRatingReview} />);

      const stars = screen.getAllByTestId(/star-\d+/);
      expect(stars).toHaveLength(5);
    });

    it('should handle different date formats', () => {
      const differentDateReview: ReviewType = {
        ...mockReview,
        createAt: '2024-03-20T10:00:00.000Z',
      };

      render(<Review {...differentDateReview} />);

      expect(screen.getByText('20 марта')).toBeInTheDocument();
    });
  });
});
