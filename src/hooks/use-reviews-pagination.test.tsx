import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useReviewsPagination } from './use-reviews-pagination';
import type { ReviewType } from '../const/type';

vi.mock('../const/const', () => ({
  Setting: {
    MaxShowReviews: 3,
  },
}));

describe('useReviewsPagination', () => {
  const mockComments: ReviewType[] = [
    { id: '1', userName: 'User 1', advantage: 'advantage 1', disadvantage: 'disadvantage 1', review: 'review 1', rating: 5, createAt: '2023-01-01', cameraId: 1 },
    { id: '2', userName: 'User 2', advantage: 'advantage 2', disadvantage: 'disadvantage 2', review: 'review 2', rating: 4, createAt: '2023-01-02', cameraId: 1 },
    { id: '3', userName: 'User 3', advantage: 'advantage 3', disadvantage: 'disadvantage 3', review: 'review 3', rating: 3, createAt: '2023-01-03', cameraId: 1 },
    { id: '4', userName: 'User 4', advantage: 'advantage 4', disadvantage: 'disadvantage 4', review: 'review 4', rating: 5, createAt: '2023-01-04', cameraId: 1 },
    { id: '5', userName: 'User 5', advantage: 'advantage 5', disadvantage: 'disadvantage 5', review: 'review 5', rating: 4, createAt: '2023-01-05', cameraId: 1 },
    { id: '6', userName: 'User 6', advantage: 'advantage 6', disadvantage: 'disadvantage 6', review: 'review 6', rating: 3, createAt: '2023-01-06', cameraId: 1 },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, writable: true });

    const mockScrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', {
      value: mockScrollTo,
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    expect(result.current.visibleReviewsCount).toBe(3);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMoreReviews).toBe(true);
    expect(typeof result.current.handleShowMore).toBe('function');
    expect(typeof result.current.setVisibleReviewsCount).toBe('function');
  });

  it('should calculate hasMoreReviews correctly', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments.slice(0, 3) }));

    expect(result.current.hasMoreReviews).toBe(false);
  });

  it('should not load more reviews when no more reviews available', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments.slice(0, 3) }));

    const initialCount = result.current.visibleReviewsCount;

    act(() => {
      result.current.handleShowMore();
    });

    expect(result.current.visibleReviewsCount).toBe(initialCount);
  });

  it('should NOT change visibleReviewsCount when handleShowMore is called', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => {
      result.current.handleShowMore();
    });

    vi.advanceTimersByTime(250);

    expect(result.current.visibleReviewsCount).toBe(3);
  });

  it('should NOT change visibleReviewsCount when loading remaining reviews', () => {
    const commentsWithFour = mockComments.slice(0, 4);
    const { result } = renderHook(() => useReviewsPagination({ comments: commentsWithFour }));

    act(() => {
      result.current.handleShowMore();
    });

    vi.advanceTimersByTime(250);

    expect(result.current.visibleReviewsCount).toBe(3);
  });

  it('should NOT scroll when loading more reviews', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => {
      result.current.handleShowMore();
    });

    vi.advanceTimersByTime(250);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('should handle multiple show more clicks without changing count', () => {
    const manyComments: ReviewType[] = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      userName: `User ${i + 1}`,
      advantage: `advantage ${i + 1}`,
      disadvantage: `disadvantage ${i + 1}`,
      review: `review ${i + 1}`,
      rating: 5,
      createAt: `2023-01-${String(i + 1).padStart(2, '0')}`,
      cameraId: 1
    }));

    const { result } = renderHook(() => useReviewsPagination({ comments: manyComments }));

    act(() => {
      result.current.handleShowMore();
    });
    vi.advanceTimersByTime(250);
    expect(result.current.visibleReviewsCount).toBe(3);

    act(() => {
      result.current.handleShowMore();
    });
    vi.advanceTimersByTime(250);
    expect(result.current.visibleReviewsCount).toBe(3);

    act(() => {
      result.current.handleShowMore();
    });
    vi.advanceTimersByTime(250);
    expect(result.current.visibleReviewsCount).toBe(3);

    expect(result.current.hasMoreReviews).toBe(true);
  });

  it('should allow manually setting visible reviews count', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => {
      result.current.setVisibleReviewsCount(5);
    });

    expect(result.current.visibleReviewsCount).toBe(5);
  });

  it('should update hasMoreReviews when manually setting count', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments.slice(0, 5) }));

    expect(result.current.hasMoreReviews).toBe(true);

    act(() => {
      result.current.setVisibleReviewsCount(5);
    });

    expect(result.current.hasMoreReviews).toBe(false);
  });

  it('should handle empty comments array', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: [] }));

    expect(result.current.visibleReviewsCount).toBe(3);
    expect(result.current.hasMoreReviews).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle single review', () => {
    const singleComment = [mockComments[0]];
    const { result } = renderHook(() => useReviewsPagination({ comments: singleComment }));

    expect(result.current.visibleReviewsCount).toBe(3);
    expect(result.current.hasMoreReviews).toBe(false);
  });

  it('should set loading state during handleShowMore', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => {
      result.current.handleShowMore();
    });

    expect(result.current.isLoading).toBe(true);

    vi.advanceTimersByTime(250);
  });

  it('should not load more reviews during loading state', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => {
      result.current.handleShowMore();
    });

    expect(result.current.isLoading).toBe(true);

    const countDuringLoading = result.current.visibleReviewsCount;

    act(() => {
      result.current.handleShowMore();
    });

    expect(result.current.visibleReviewsCount).toBe(countDuringLoading);

    vi.advanceTimersByTime(250);
  });

  it('should have correct hasMoreReviews for different comment counts', () => {
    const { result: result6 } = renderHook(() => useReviewsPagination({ comments: mockComments.slice(0, 6) }));
    expect(result6.current.hasMoreReviews).toBe(true);

    const { result: result3 } = renderHook(() => useReviewsPagination({ comments: mockComments.slice(0, 3) }));
    expect(result3.current.hasMoreReviews).toBe(false);

    const { result: result2 } = renderHook(() => useReviewsPagination({ comments: mockComments.slice(0, 2) }));
    expect(result2.current.hasMoreReviews).toBe(false);
  });

  it('should correctly update when setVisibleReviewsCount is called', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => {
      result.current.setVisibleReviewsCount(1);
    });
    expect(result.current.visibleReviewsCount).toBe(1);

    act(() => {
      result.current.setVisibleReviewsCount(10);
    });
    expect(result.current.visibleReviewsCount).toBe(10);
  });
});
