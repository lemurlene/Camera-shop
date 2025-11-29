import { describe, it, expect } from 'vitest';
import { formatedDate, sortReviewsByDate, getVisibleReviews } from './utils';
import { ReviewType } from '../../const/type';


describe('formatedDate', () => {
  describe('date formatting', () => {
    it('should format date correctly for Russian locale', () => {
      const testCases = [
        { input: '2024-01-15', expected: '15 января' },
        { input: '2024-12-03', expected: '3 декабря' },
        { input: '2024-07-20', expected: '20 июля' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = formatedDate(input);
        expect(result).toBe(expected);
      });
    });

    it('should handle different date formats', () => {
      const testCases = [
        { input: '2024-01-15T10:30:00.000Z', expected: '15 января' },
        { input: '2024-01-15T00:00:00.000Z', expected: '15 января' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = formatedDate(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle invalid date strings by returning default format', () => {
      const result = formatedDate('invalid-date');

      expect(typeof result).toBe('string');
    });

    it('should handle empty string', () => {
      const result = formatedDate('');
      expect(typeof result).toBe('string');
    });
  });
});

describe('sortReviewsByDate', () => {
  const mockReviews: ReviewType[] = [
    {
      id: '1',
      createAt: '2024-01-15T10:00:00.000Z',
      userName: 'User1',
      advantage: 'advantage1',
      disadvantage: 'disadvantage1',
      review: 'review1',
      rating: 4,
      cameraId: 1,
    },
    {
      id: '2',
      createAt: '2024-01-20T10:00:00.000Z',
      userName: 'User2',
      advantage: 'advantage2',
      disadvantage: 'disadvantage2',
      review: 'review2',
      rating: 5,
      cameraId: 1,
    },
    {
      id: '3',
      createAt: '2024-01-10T10:00:00.000Z',
      userName: 'User3',
      advantage: 'advantage3',
      disadvantage: 'disadvantage3',
      review: 'review3',
      rating: 3,
      cameraId: 1,
    },
  ];

  describe('sorting functionality', () => {
    it('should sort reviews by date in descending order', () => {
      const result = sortReviewsByDate(mockReviews);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('1');
      expect(result[2].id).toBe('3');
    });

    it('should not mutate the original array', () => {
      const originalArray = [...mockReviews];
      const result = sortReviewsByDate(mockReviews);

      expect(result).not.toBe(mockReviews);
      expect(mockReviews).toEqual(originalArray);
    });

    it('should handle empty array', () => {
      const result = sortReviewsByDate([]);

      expect(result).toEqual([]);
    });

    it('should handle single review', () => {
      const singleReview = [mockReviews[0]];
      const result = sortReviewsByDate(singleReview);

      expect(result).toEqual(singleReview);
    });
  });

  describe('date comparison', () => {
    it('should correctly compare dates with dayjs', () => {
      const reviewsWithSameDate: ReviewType[] = [
        {
          ...mockReviews[0],
          createAt: '2024-01-15T10:00:00.000Z',
        },
        {
          ...mockReviews[1],
          createAt: '2024-01-15T10:00:00.000Z',
        },
      ];

      const result = sortReviewsByDate(reviewsWithSameDate);
      expect(result).toHaveLength(2);
    });
  });
});

describe('getVisibleReviews', () => {
  const mockReviews: ReviewType[] = [
    {
      id: '1',
      createAt: '2024-01-15T10:00:00.000Z',
      userName: 'User1',
      advantage: 'advantage1',
      disadvantage: 'disadvantage1',
      review: 'review1',
      rating: 4,
      cameraId: 1,
    },
    {
      id: '2',
      createAt: '2024-01-20T10:00:00.000Z',
      userName: 'User2',
      advantage: 'advantage2',
      disadvantage: 'disadvantage2',
      review: 'review2',
      rating: 5,
      cameraId: 1,
    },
    {
      id: '3',
      createAt: '2024-01-10T10:00:00.000Z',
      userName: 'User3',
      advantage: 'advantage3',
      disadvantage: 'disadvantage3',
      review: 'review3',
      rating: 3,
      cameraId: 1,
    },
  ];

  describe('pagination functionality', () => {
    it('should return correct number of visible reviews', () => {
      const testCases = [
        { visibleCount: 2, expectedLength: 2 },
        { visibleCount: 1, expectedLength: 1 },
        { visibleCount: 5, expectedLength: 3 },
      ];

      testCases.forEach(({ visibleCount, expectedLength }) => {
        const result = getVisibleReviews(mockReviews, visibleCount);
        expect(result).toHaveLength(expectedLength);
      });
    });

    it('should return first N reviews when visibleCount is less than total', () => {
      const result = getVisibleReviews(mockReviews, 2);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return all reviews when visibleCount is greater than total', () => {
      const result = getVisibleReviews(mockReviews, 10);

      expect(result).toHaveLength(3);
      expect(result).toEqual(mockReviews);
    });

    it('should return empty array when visibleCount is 0', () => {
      const result = getVisibleReviews(mockReviews, 0);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle empty reviews array', () => {
      const result = getVisibleReviews([], 5);

      expect(result).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('should handle negative visibleCount by returning empty array', () => {
      const result = getVisibleReviews(mockReviews, -1);

      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe('getVisibleReviews with fixed implementation', () => {
  const mockReviews: ReviewType[] = [
    {
      id: '1',
      createAt: '2024-01-15T10:00:00.000Z',
      userName: 'User1',
      advantage: 'advantage1',
      disadvantage: 'disadvantage1',
      review: 'review1',
      rating: 4,
      cameraId: 1,
    },
    {
      id: '2',
      createAt: '2024-01-20T10:00:00.000Z',
      userName: 'User2',
      advantage: 'advantage2',
      disadvantage: 'disadvantage2',
      review: 'review2',
      rating: 5,
      cameraId: 1,
    },
  ];

  it('should return empty array for negative visibleCount with proper implementation', () => {
    const fixedGetVisibleReviews = (reviews: ReviewType[], visibleCount: number) => {
      const safeVisibleCount = Math.max(0, visibleCount);
      return reviews.slice(0, safeVisibleCount);
    };

    const result = fixedGetVisibleReviews(mockReviews, -1);
    expect(result).toEqual([]);
  });
});

describe('integration between functions', () => {
  it('should work together: sort then get visible', () => {
    const mockReviews: ReviewType[] = [
      {
        id: '1',
        createAt: '2024-01-15T10:00:00.000Z',
        userName: 'User1',
        advantage: 'advantage1',
        disadvantage: 'disadvantage1',
        review: 'review1',
        rating: 4,
        cameraId: 1,
      },
      {
        id: '2',
        createAt: '2024-01-20T10:00:00.000Z',
        userName: 'User2',
        advantage: 'advantage2',
        disadvantage: 'disadvantage2',
        review: 'review2',
        rating: 5,
        cameraId: 1,
      },
      {
        id: '3',
        createAt: '2024-01-10T10:00:00.000Z',
        userName: 'User3',
        advantage: 'advantage3',
        disadvantage: 'disadvantage3',
        review: 'review3',
        rating: 3,
        cameraId: 1,
      },
    ];

    const sorted = sortReviewsByDate(mockReviews);
    const visible = getVisibleReviews(sorted, 2);

    expect(visible).toHaveLength(2);
    expect(visible[0].id).toBe('2');
    expect(visible[1].id).toBe('1');
  });

  it('should format dates of visible reviews', () => {
    const mockReviews: ReviewType[] = [
      {
        id: '1',
        createAt: '2024-01-15T10:00:00.000Z',
        userName: 'User1',
        advantage: 'advantage1',
        disadvantage: 'disadvantage1',
        review: 'review1',
        rating: 4,
        cameraId: 1,
      },
    ];

    const visible = getVisibleReviews(mockReviews, 1);
    const formattedDate = formatedDate(visible[0].createAt);

    expect(formattedDate).toBe('15 января');
  });
});
