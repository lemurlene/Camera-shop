import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { useInfiniteScroll } from './use-infinite-scroll';

describe('useInfiniteScroll', () => {
  let mockOnLoadMore: Mock;

  beforeEach(() => {
    mockOnLoadMore = vi.fn();
    vi.clearAllMocks();
    vi.useFakeTimers();

    Object.defineProperties(window, {
      innerHeight: {
        value: 1000,
        writable: true,
      },
      scrollY: {
        value: 0,
        writable: true,
      },
    });

    Object.defineProperties(document.documentElement, {
      scrollTop: {
        value: 0,
        writable: true,
      },
      scrollHeight: {
        value: 2000,
        writable: true,
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setScrollMetrics = (scrollTop: number, windowHeight: number, documentHeight: number) => {
    Object.defineProperty(window, 'scrollY', { value: scrollTop, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: scrollTop, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: windowHeight, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: documentHeight, writable: true });
  };

  const triggerScroll = () => {
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(150);
  };

  const shouldTriggerLoadMore = (scrollTop: number, windowHeight: number, documentHeight: number, threshold: number) => {
    const remaining = documentHeight - (scrollTop + windowHeight);
    return remaining < threshold;
  };

  it('should call onLoadMore when scrolled to threshold', () => {
    const threshold = 500;

    expect(shouldTriggerLoadMore(0, 1000, 1500, threshold)).toBe(false);

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
        threshold,
      })
    );

    setScrollMetrics(0, 1000, 1500);
    triggerScroll();

    expect(mockOnLoadMore).not.toHaveBeenCalled();

    setScrollMetrics(0, 1000, 1499); // 1499 - (0 + 1000) = 499 < 500
    triggerScroll();

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should call onLoadMore when scrolled below threshold', () => {
    const threshold = 500;

    expect(shouldTriggerLoadMore(100, 1000, 1500, threshold)).toBe(true); // 1500 - (100 + 1000) = 400 < 500

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
        threshold,
      })
    );

    setScrollMetrics(100, 1000, 1500);
    triggerScroll();

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should use custom threshold value', () => {
    const threshold = 1000;

    expect(shouldTriggerLoadMore(0, 1000, 2000, threshold)).toBe(false);

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
        threshold,
      })
    );

    setScrollMetrics(0, 1000, 2000);
    triggerScroll();

    expect(mockOnLoadMore).not.toHaveBeenCalled();

    setScrollMetrics(0, 1000, 1999); // 1999 - (0 + 1000) = 999 < 1000
    triggerScroll();

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should debounce scroll events', () => {
    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    setScrollMetrics(0, 1000, 1499); // Должно сработать

    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));

    expect(mockOnLoadMore).not.toHaveBeenCalled();

    vi.advanceTimersByTime(150);

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should handle zero threshold', () => {
    const threshold = 0;

    expect(shouldTriggerLoadMore(0, 1000, 1000, threshold)).toBe(false);

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
        threshold,
      })
    );

    setScrollMetrics(0, 1000, 1000);
    triggerScroll();

    expect(mockOnLoadMore).not.toHaveBeenCalled();

    setScrollMetrics(1, 1000, 1000); // 1000 - (1 + 1000) = -1 < 0
    triggerScroll();

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should update behavior when dependencies change', () => {
    const { rerender } = renderHook(
      (props) => useInfiniteScroll(props),
      {
        initialProps: {
          hasMore: true,
          isLoading: false,
          onLoadMore: mockOnLoadMore,
          threshold: 500,
        },
      }
    );

    setScrollMetrics(0, 1000, 1499);
    triggerScroll();
    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);

    mockOnLoadMore.mockClear();

    rerender({
      hasMore: true,
      isLoading: true,
      onLoadMore: mockOnLoadMore,
      threshold: 500,
    });

    setScrollMetrics(0, 1000, 1499);
    triggerScroll();
    expect(mockOnLoadMore).not.toHaveBeenCalled();

    rerender({
      hasMore: false,
      isLoading: false,
      onLoadMore: mockOnLoadMore,
      threshold: 500,
    });

    setScrollMetrics(0, 1000, 1499);
    triggerScroll();
    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it('should react to threshold changes', () => {
    const { rerender } = renderHook(
      (props) => useInfiniteScroll(props),
      {
        initialProps: {
          hasMore: true,
          isLoading: false,
          onLoadMore: mockOnLoadMore,
          threshold: 1000,
        },
      }
    );

    setScrollMetrics(0, 1000, 1999);
    triggerScroll();
    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);

    mockOnLoadMore.mockClear();

    rerender({
      hasMore: true,
      isLoading: false,
      onLoadMore: mockOnLoadMore,
      threshold: 500,
    });

    setScrollMetrics(0, 1000, 1999);
    triggerScroll();
    expect(mockOnLoadMore).not.toHaveBeenCalled();

    setScrollMetrics(0, 1000, 1499);
    triggerScroll();
    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should not call onLoadMore when hasMore is false', () => {
    renderHook(() =>
      useInfiniteScroll({
        hasMore: false,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    setScrollMetrics(0, 1000, 1499);
    triggerScroll();

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it('should not call onLoadMore when isLoading is true', () => {
    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: true,
        onLoadMore: mockOnLoadMore,
      })
    );

    setScrollMetrics(0, 1000, 1499);
    triggerScroll();

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it('should not call onLoadMore when far from bottom', () => {
    const threshold = 500;

    expect(shouldTriggerLoadMore(0, 1000, 2000, threshold)).toBe(false);

    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
        threshold,
      })
    );

    setScrollMetrics(0, 1000, 2000);
    triggerScroll();

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should clean up timeout on unmount', () => {
    const { unmount } = renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    window.dispatchEvent(new Event('scroll'));

    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('should work with window.scrollY', () => {
    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1400, writable: true });

    triggerScroll();

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should work with documentElement.scrollTop', () => {
    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1400, writable: true });

    triggerScroll();

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should handle different scroll positions', () => {
    renderHook(() =>
      useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
        threshold: 500,
      })
    );

    setScrollMetrics(500, 1000, 3000);
    triggerScroll();
    expect(mockOnLoadMore).not.toHaveBeenCalled();

    setScrollMetrics(2000, 1000, 3000); // 3000 - (2000 + 1000) = 0 < 500
    triggerScroll();
    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });
});
