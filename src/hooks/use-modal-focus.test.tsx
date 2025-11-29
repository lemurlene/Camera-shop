import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useModalFocus } from './use-modal-focus';
import { getFocusableElements } from '../components/modals/utils';

vi.mock('../components/modals/utils', () => ({
  getFocusableElements: vi.fn(),
}));

const mockGetFocusableElements = vi.mocked(getFocusableElements);

describe('useModalFocus', () => {
  let mockActiveElement: HTMLElement;
  let mockFocusableElement: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();

    mockActiveElement = document.createElement('button');
    mockActiveElement.focus = vi.fn();

    mockFocusableElement = document.createElement('button');
    mockFocusableElement.focus = vi.fn();

    Object.defineProperty(document, 'activeElement', {
      value: mockActiveElement,
      writable: true,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return a ref object', () => {
    const { result } = renderHook(() => useModalFocus(false));

    expect(result.current).toHaveProperty('current');
    expect(result.current.current).toBeNull();
  });

  it('should save previously focused element when modal becomes active', () => {
    const { rerender } = renderHook(({ isActive }) => useModalFocus(isActive), {
      initialProps: { isActive: false },
    });

    rerender({ isActive: true });

    expect(document.activeElement).toBe(mockActiveElement);
  });

  it('should restore focus to previously focused element when modal becomes inactive', () => {
    const { rerender } = renderHook(({ isActive }) => useModalFocus(isActive), {
      initialProps: { isActive: true },
    });

    rerender({ isActive: false });

    expect(mockActiveElement.focus).toHaveBeenCalledTimes(1);
  });

  it('should not restore focus when no previously focused element', () => {
    Object.defineProperty(document, 'activeElement', {
      value: null,
      writable: true,
    });

    const { rerender } = renderHook(({ isActive }) => useModalFocus(isActive), {
      initialProps: { isActive: true },
    });

    rerender({ isActive: false });

    expect(mockActiveElement.focus).not.toHaveBeenCalled();
  });

  it('should clear timeout on unmount when modal is active', () => {
    const { unmount } = renderHook(() => useModalFocus(true));

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('should handle rapid activation and deactivation', () => {
    const { rerender } = renderHook(({ isActive }) => useModalFocus(isActive), {
      initialProps: { isActive: false },
    });

    rerender({ isActive: true });
    rerender({ isActive: false });

    expect(mockActiveElement.focus).toHaveBeenCalledTimes(1);
  });
});

describe('useModalFocus with modal element', () => {
  let mockActiveElement: HTMLElement;
  let mockFocusableElement: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();

    mockActiveElement = document.createElement('button');
    mockActiveElement.focus = vi.fn();

    mockFocusableElement = document.createElement('button');
    mockFocusableElement.focus = vi.fn();

    Object.defineProperty(document, 'activeElement', {
      value: mockActiveElement,
      writable: true,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createTestHook = (modalElement: HTMLElement | null) => (isActive: boolean) => {
    const ref = useModalFocus(isActive);

    if (modalElement && ref.current === null) {
      Object.defineProperty(ref, 'current', {
        value: modalElement,
        writable: false,
      });
    }

    return ref;
  };

  it('should focus first focusable element when modal becomes active', () => {
    const modalElement = document.createElement('div');
    const useTestHook = createTestHook(modalElement);

    mockGetFocusableElements.mockReturnValue([mockFocusableElement]);

    const { rerender } = renderHook(({ isActive }) => useTestHook(isActive), {
      initialProps: { isActive: false },
    });

    rerender({ isActive: true });

    vi.advanceTimersByTime(50);

    expect(mockGetFocusableElements).toHaveBeenCalledWith(modalElement);
    expect(mockFocusableElement.focus).toHaveBeenCalledTimes(1);
  });

  it('should not focus anything when no focusable elements found', () => {
    const modalElement = document.createElement('div');
    const useTestHook = createTestHook(modalElement);

    mockGetFocusableElements.mockReturnValue([]);

    const { rerender } = renderHook(({ isActive }) => useTestHook(isActive), {
      initialProps: { isActive: false },
    });

    rerender({ isActive: true });

    vi.advanceTimersByTime(50);

    expect(mockGetFocusableElements).toHaveBeenCalledWith(modalElement);
    expect(mockFocusableElement.focus).not.toHaveBeenCalled();
  });

  it('should work with multiple focusable elements', () => {
    const modalElement = document.createElement('div');
    const useTestHook = createTestHook(modalElement);

    const mockFocusableElements = [
      document.createElement('button'),
      document.createElement('input'),
      document.createElement('a'),
    ];

    mockFocusableElements.forEach((element) => {
      element.focus = vi.fn();
    });

    mockGetFocusableElements.mockReturnValue(mockFocusableElements);

    const { rerender } = renderHook(({ isActive }) => useTestHook(isActive), {
      initialProps: { isActive: false },
    });

    rerender({ isActive: true });

    vi.advanceTimersByTime(50);

    expect(mockGetFocusableElements).toHaveBeenCalledWith(modalElement);
    expect(mockFocusableElements[0].focus).toHaveBeenCalledTimes(1);
    expect(mockFocusableElements[1].focus).not.toHaveBeenCalled();
    expect(mockFocusableElements[2].focus).not.toHaveBeenCalled();
  });

  it('should not attempt to focus when modal ref is null', () => {
    const useTestHook = createTestHook(null);

    mockGetFocusableElements.mockReturnValue([mockFocusableElement]);

    const { rerender } = renderHook(({ isActive }) => useTestHook(isActive), {
      initialProps: { isActive: false },
    });

    rerender({ isActive: true });

    vi.advanceTimersByTime(50);

    expect(mockGetFocusableElements).not.toHaveBeenCalled();
    expect(mockFocusableElement.focus).not.toHaveBeenCalled();
  });
});
