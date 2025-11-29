import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ScrollSentinel from './scroll-sentinel';

describe('ScrollSentinel', () => {
  beforeEach(() => {
    Object.defineProperty(global, 'IntersectionObserver', {
      value: vi.fn().mockReturnValue({
        observe: vi.fn(),
        disconnect: vi.fn(),
      }),
      writable: true,
    });
  });

  it('should not render when isVisible is false', () => {
    const { container } = render(
      <ScrollSentinel isVisible={false} onIntersect={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when isVisible is true', () => {
    const { container } = render(
      <ScrollSentinel isVisible onIntersect={vi.fn()} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render sentinel element with correct styles and attributes', () => {
    const { container } = render(
      <ScrollSentinel isVisible onIntersect={vi.fn()} />
    );

    const sentinel = container.firstChild as HTMLDivElement;
    expect(sentinel).toBeInTheDocument();
    expect(sentinel.getAttribute('aria-hidden')).toBe('true');
    expect(sentinel.style.height).toBe('1px');
    expect(sentinel.style.width).toBe('100%');
    expect(sentinel.style.opacity).toBe('0');
    expect(sentinel.style.pointerEvents).toBe('none');
  });

  it('should create IntersectionObserver when visible', () => {
    render(<ScrollSentinel isVisible onIntersect={vi.fn()} />);

    expect(global.IntersectionObserver).toHaveBeenCalledTimes(1);
    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.1,
      }
    );
  });

  it('should observe the sentinel element', () => {
    const observeMock = vi.fn();
    Object.defineProperty(global, 'IntersectionObserver', {
      value: vi.fn().mockReturnValue({
        observe: observeMock,
        disconnect: vi.fn(),
      }),
      writable: true,
    });

    render(<ScrollSentinel isVisible onIntersect={vi.fn()} />);

    expect(observeMock).toHaveBeenCalledTimes(1);
    expect(observeMock).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it('should disconnect observer on unmount', () => {
    const disconnectMock = vi.fn();
    Object.defineProperty(global, 'IntersectionObserver', {
      value: vi.fn().mockReturnValue({
        observe: vi.fn(),
        disconnect: disconnectMock,
      }),
      writable: true,
    });

    const { unmount } = render(
      <ScrollSentinel isVisible onIntersect={vi.fn()} />
    );

    unmount();
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });

  it('should disconnect observer when isVisible becomes false', () => {
    const disconnectMock = vi.fn();
    Object.defineProperty(global, 'IntersectionObserver', {
      value: vi.fn().mockReturnValue({
        observe: vi.fn(),
        disconnect: disconnectMock,
      }),
      writable: true,
    });

    const { rerender } = render(
      <ScrollSentinel isVisible onIntersect={vi.fn()} />
    );

    disconnectMock.mockClear();

    rerender(
      <ScrollSentinel isVisible={false} onIntersect={vi.fn()} />
    );

    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
