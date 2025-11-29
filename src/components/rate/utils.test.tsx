import { describe, it, expect } from 'vitest';
import { renderRatingStars } from './utils';
import { Setting } from '../../const/const';
import { render } from '@testing-library/react';

describe('renderRatingStars', () => {
  describe('rating stars rendering', () => {
    it('should render correct number of stars', () => {
      const stars = renderRatingStars(3);
      expect(stars).toHaveLength(Setting.MaxRatingStars);
    });

    it('should render correct star icons based on rating', () => {
      const testCases = [
        { rating: 0, expectedFull: 0 },
        { rating: 3, expectedFull: 3 },
        { rating: 5, expectedFull: 5 },
        { rating: 3.7, expectedFull: 3 },
        { rating: -2, expectedFull: 0 },
        { rating: 10, expectedFull: 5 },
      ];

      testCases.forEach(({ rating, expectedFull }) => {
        const stars = renderRatingStars(rating);

        stars.forEach((star, index) => {
          const { container } = render(star);
          const useElement = container.querySelector('use');
          const expectedHref = index < expectedFull ? '#icon-full-star' : '#icon-star';

          expect(useElement).toBeTruthy();
          expect(useElement?.getAttribute('xlink:href')).toBe(expectedHref);
        });
      });
    });
  });

  describe('star attributes', () => {
    it('should render stars with correct SVG attributes', () => {
      const stars = renderRatingStars(3);

      stars.forEach((star, index) => {
        const { container } = render(star);
        const svgElement = container.querySelector('svg');

        expect(svgElement).toBeTruthy();
        expect(svgElement?.getAttribute('width')).toBe('17');
        expect(svgElement?.getAttribute('height')).toBe('16');
        expect(svgElement?.getAttribute('aria-hidden')).toBe('true');
        expect(star.key).toBe((index + 1).toString());
      });
    });
  });

  describe('edge cases', () => {
    it('should render all empty stars when rating is 0', () => {
      const stars = renderRatingStars(0);

      stars.forEach((star) => {
        const { container } = render(star);
        const useElement = container.querySelector('use');
        expect(useElement?.getAttribute('xlink:href')).toBe('#icon-star');
      });
    });

    it('should render all full stars when rating is maximum', () => {
      const stars = renderRatingStars(Setting.MaxRatingStars);

      stars.forEach((star) => {
        const { container } = render(star);
        const useElement = container.querySelector('use');
        expect(useElement?.getAttribute('xlink:href')).toBe('#icon-full-star');
      });
    });

    it('should handle fractional rating correctly', () => {
      const stars = renderRatingStars(2.5);

      stars.forEach((star, index) => {
        const { container } = render(star);
        const useElement = container.querySelector('use');
        const expectedHref = index < 2 ? '#icon-full-star' : '#icon-star';
        expect(useElement?.getAttribute('xlink:href')).toBe(expectedHref);
      });
    });
  });
});
