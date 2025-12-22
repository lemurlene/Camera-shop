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

  const advance = (ms: number) => {
    act(() => {
      vi.advanceTimersByTime(ms);
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, writable: true });

    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    expect(result.current.visibleReviewsCount).toBe(3);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMoreReviews).toBe(true);
    expect(typeof result.current.handleShowMore).toBe('function');
    expect(typeof result.current.setVisibleReviewsCount).toBe('function');
  });

  it('calculates hasMoreReviews correctly (no more reviews)', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments.slice(0, 3) }));
    expect(result.current.hasMoreReviews).toBe(false);
  });

  it('does not load more when no more reviews available', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments.slice(0, 3) }));
    const initialCount = result.current.visibleReviewsCount;

    act(() => {
      result.current.handleShowMore();
    });

    advance(500);

    expect(result.current.visibleReviewsCount).toBe(initialCount);
    expect(result.current.isLoading).toBe(false);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('increases visibleReviewsCount by MaxShowReviews after 200ms', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    expect(result.current.visibleReviewsCount).toBe(3);

    act(() => {
      result.current.handleShowMore();
    });

    expect(result.current.isLoading).toBe(true);

    advance(199);
    expect(result.current.visibleReviewsCount).toBe(3);

    advance(1);
    expect(result.current.visibleReviewsCount).toBe(6);
  });

  it('increases visibleReviewsCount to comments.length when remaining smaller MaxShowReviews', () => {
    const commentsWithFour = mockComments.slice(0, 4);
    const { result } = renderHook(() => useReviewsPagination({ comments: commentsWithFour }));

    expect(result.current.visibleReviewsCount).toBe(3);

    act(() => {
      result.current.handleShowMore();
    });

    advance(200);
    expect(result.current.visibleReviewsCount).toBe(4);
    expect(result.current.hasMoreReviews).toBe(false);
  });

  it('blocks repeated handleShowMore calls while loading', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => result.current.handleShowMore());
    expect(result.current.isLoading).toBe(true);

    act(() => result.current.handleShowMore());

    advance(250);

    expect(result.current.visibleReviewsCount).toBe(6);
  });

  it('sets isLoading to false after 200ms + 50ms', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => result.current.handleShowMore());
    expect(result.current.isLoading).toBe(true);

    advance(200);
    expect(result.current.visibleReviewsCount).toBe(6);
    expect(result.current.isLoading).toBe(true);

    advance(50);
    expect(result.current.isLoading).toBe(false);
  });

  it('does not scroll when clientHeightAfter does not increase', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => result.current.handleShowMore());

    advance(200);
    advance(50);

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls back when clientHeightAfter increases', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => result.current.handleShowMore());

    advance(200);

    Object.defineProperty(document.documentElement, 'clientHeight', { value: 900, writable: true });

    advance(50);

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 100,
      behavior: 'auto',
    });
  });

  it('allows manually setting visible reviews count', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments }));

    act(() => {
      result.current.setVisibleReviewsCount(5);
    });

    expect(result.current.visibleReviewsCount).toBe(5);
    expect(result.current.hasMoreReviews).toBe(true);
  });

  it('updates hasMoreReviews when manually setting count', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: mockComments.slice(0, 5) }));

    expect(result.current.hasMoreReviews).toBe(true);

    act(() => {
      result.current.setVisibleReviewsCount(5);
    });

    expect(result.current.hasMoreReviews).toBe(false);
  });

  it('handles empty comments array', () => {
    const { result } = renderHook(() => useReviewsPagination({ comments: [] }));

    expect(result.current.visibleReviewsCount).toBe(3);
    expect(result.current.hasMoreReviews).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});
