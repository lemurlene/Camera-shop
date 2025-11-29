import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Rate from './rate';
import { Setting } from '../../const/const';

describe('Rate Component', () => {
  describe('rating display', () => {
    it('should render rating stars with correct rating value', () => {
      const rating = 4;
      const reviewCount = 10;
      const classPrefix = 'product';

      render(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      expect(screen.getByTestId('rating-stars')).toBeInTheDocument();
      expect(screen.getByText(`Рейтинг: ${rating}`)).toBeInTheDocument();
    });

    it('should render correct number of stars', () => {
      const rating = 3;
      const reviewCount = 5;
      const classPrefix = 'product';

      render(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      const starsContainer = screen.getByTestId('rating-stars');
      const svgElements = starsContainer.querySelectorAll('svg');
      expect(svgElements).toHaveLength(Setting.MaxRatingStars);
    });

    it('should display review count', () => {
      const rating = 4;
      const reviewCount = 25;
      const classPrefix = 'product';

      render(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      expect(screen.getByText(reviewCount.toString())).toBeInTheDocument();
      expect(screen.getByText('Всего оценок:')).toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should apply correct CSS classes', () => {
      const rating = 4;
      const reviewCount = 10;
      const classPrefix = 'product';

      render(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      const rateElement = screen.getByTestId('rating-stars');
      expect(rateElement).toHaveClass('rate');
      expect(rateElement).toHaveClass('product__rate');
    });

    it('should work with different class prefixes', () => {
      const testCases = [
        { classPrefix: 'product', expectedClass: 'product__rate' },
        { classPrefix: 'card', expectedClass: 'card__rate' },
        { classPrefix: 'offer', expectedClass: 'offer__rate' },
      ];

      testCases.forEach(({ classPrefix, expectedClass }) => {
        const { unmount } = render(
          <Rate rating={3} reviewCount={5} classPrefix={classPrefix} />
        );

        const rateElement = screen.getByTestId('rating-stars');
        expect(rateElement).toHaveClass('rate');
        expect(rateElement).toHaveClass(expectedClass);

        unmount();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper accessibility attributes for screen readers', () => {
      const rating = 4;
      const reviewCount = 10;
      const classPrefix = 'product';

      render(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      const ratingDescription = screen.getByText(`Рейтинг: ${rating}`);
      const totalReviewsDescription = screen.getByText('Всего оценок:');

      expect(ratingDescription).toHaveClass('visually-hidden');
      expect(totalReviewsDescription).toHaveClass('visually-hidden');

      const starsContainer = screen.getByTestId('rating-stars');
      const svgElements = starsContainer.querySelectorAll('svg');

      svgElements.forEach((svg) => {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('should provide alternative text for rating information', () => {
      const rating = 4;
      const reviewCount = 10;
      const classPrefix = 'product';

      render(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      expect(screen.getByText(`Рейтинг: ${rating}`)).toBeInTheDocument();
      expect(screen.getByText('Всего оценок:')).toBeInTheDocument();
    });
  });

  describe('SVG structure', () => {
    it('should render SVG elements with correct attributes', () => {
      const rating = 3;
      const reviewCount = 5;
      const classPrefix = 'product';

      render(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      const starsContainer = screen.getByTestId('rating-stars');
      const svgElements = starsContainer.querySelectorAll('svg');

      svgElements.forEach((svg) => {
        expect(svg).toHaveAttribute('width', '17');
        expect(svg).toHaveAttribute('height', '16');
        expect(svg).toHaveAttribute('aria-hidden', 'true');

        const useElement = svg.querySelector('use');
        expect(useElement).toBeInTheDocument();
        expect(useElement).toHaveAttribute('xlink:href');
      });
    });

    it('should render correct icon types based on rating', () => {
      const testCases = [
        { rating: 0, expectedFull: 0 },
        { rating: 3, expectedFull: 3 },
        { rating: 5, expectedFull: 5 },
      ];

      testCases.forEach(({ rating, expectedFull }) => {
        const { unmount } = render(
          <Rate rating={rating} reviewCount={5} classPrefix="product" />
        );

        const starsContainer = screen.getByTestId('rating-stars');
        const useElements = starsContainer.querySelectorAll('use');

        useElements.forEach((useElement, index) => {
          const href = useElement.getAttribute('xlink:href');
          if (index < expectedFull) {
            expect(href).toBe('#icon-full-star');
          } else {
            expect(href).toBe('#icon-star');
          }
        });

        unmount();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero rating', () => {
      const rating = 0;
      const reviewCount = 0;
      const classPrefix = 'product';

      render(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      expect(screen.getByText('Рейтинг: 0')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle maximum rating', () => {
      const rating = Setting.MaxRatingStars;
      const reviewCount = 100;
      const classPrefix = 'product';

      render(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      expect(screen.getByText(`Рейтинг: ${rating}`)).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should handle fractional rating', () => {
      const rating = 3.7;
      const reviewCount = 15;
      const classPrefix = 'product';

      render(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      expect(screen.getByText(`Рейтинг: ${rating}`)).toBeInTheDocument();
    });
  });

  describe('memo functionality', () => {
    it('should not re-render with same props', () => {
      const rating = 4;
      const reviewCount = 10;
      const classPrefix = 'product';

      const { rerender } = render(
        <Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />
      );

      const initialStarsContainer = screen.getByTestId('rating-stars');

      rerender(<Rate rating={rating} reviewCount={reviewCount} classPrefix={classPrefix} />);

      const updatedStarsContainer = screen.getByTestId('rating-stars');
      expect(updatedStarsContainer).toBe(initialStarsContainer);
    });

    it('should re-render when props change', () => {
      const { rerender } = render(
        <Rate rating={3} reviewCount={5} classPrefix="product" />
      );

      expect(screen.getByText('Рейтинг: 3')).toBeInTheDocument();

      rerender(<Rate rating={4} reviewCount={8} classPrefix="product" />);

      expect(screen.getByText('Рейтинг: 4')).toBeInTheDocument();
      expect(screen.queryByText('Рейтинг: 3')).not.toBeInTheDocument();
    });
  });
});
