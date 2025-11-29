import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTabUrl } from './use-tab-url';
import { useUrlState } from './use-url-state';

vi.mock('./use-url-state', () => ({
  useUrlState: vi.fn(),
}));

const mockedUseUrlState = vi.mocked(useUrlState);

describe('useTabUrl', () => {
  const mockGetParam = vi.fn();
  const mockSetParam = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseUrlState.mockReturnValue({
      getParam: mockGetParam,
      setParam: mockSetParam,
      getParamAll: vi.fn(),
      setParams: vi.fn(),
      getAllParams: vi.fn(),
      searchParams: new URLSearchParams(),
    });
  });

  describe('basic functionality', () => {
    it('should return current tab from URL parameter', () => {
      mockGetParam.mockReturnValue('reviews');

      const { result } = renderHook(() => useTabUrl());

      expect(result.current.currentTab).toBe('reviews');
      expect(mockGetParam).toHaveBeenCalledWith('tab');
    });

    it('should return default tab when URL parameter is not set', () => {
      mockGetParam.mockReturnValue(null);

      const { result } = renderHook(() => useTabUrl());

      expect(result.current.currentTab).toBe('');
    });

    it('should use custom parameter name', () => {
      mockGetParam.mockReturnValue('specifications');

      const { result } = renderHook(() =>
        useTabUrl({ paramName: 'section' })
      );

      expect(result.current.currentTab).toBe('specifications');
      expect(mockGetParam).toHaveBeenCalledWith('section');
    });

    it('should use custom default tab', () => {
      mockGetParam.mockReturnValue(null);

      const { result } = renderHook(() =>
        useTabUrl({ defaultTab: 'description' })
      );

      expect(result.current.currentTab).toBe('description');
    });
  });

  describe('setTab functionality', () => {
    it('should set tab parameter in URL', () => {
      mockGetParam.mockReturnValue('');

      const { result } = renderHook(() => useTabUrl());

      act(() => {
        result.current.setTab('features');
      });

      expect(mockSetParam).toHaveBeenCalledWith('tab', 'features');
    });

    it('should set tab with custom parameter name', () => {
      mockGetParam.mockReturnValue('');

      const { result } = renderHook(() =>
        useTabUrl({ paramName: 'view' })
      );

      act(() => {
        result.current.setTab('grid');
      });

      expect(mockSetParam).toHaveBeenCalledWith('view', 'grid');
    });

    it('should update current tab after setting', () => {
      mockGetParam.mockReturnValue('');

      const { result } = renderHook(() => useTabUrl());

      act(() => {
        result.current.setTab('details');
      });

      expect(mockSetParam).toHaveBeenCalledWith('tab', 'details');
    });
  });

  describe('clearTab functionality', () => {
    it('should clear tab parameter from URL', () => {
      mockGetParam.mockReturnValue('reviews');

      const { result } = renderHook(() => useTabUrl());

      act(() => {
        result.current.clearTab();
      });

      expect(mockSetParam).toHaveBeenCalledWith('tab', null);
    });

    it('should clear tab with custom parameter name', () => {
      mockGetParam.mockReturnValue('preview');

      const { result } = renderHook(() =>
        useTabUrl({ paramName: 'display' })
      );

      act(() => {
        result.current.clearTab();
      });

      expect(mockSetParam).toHaveBeenCalledWith('display', null);
    });
  });

  describe('integration with URL state', () => {
    it('should reflect URL parameter changes', () => {
      mockGetParam.mockReturnValue(null);

      const { result, rerender } = renderHook(() => useTabUrl());

      expect(result.current.currentTab).toBe('');

      mockGetParam.mockReturnValue('specifications');
      rerender();

      expect(result.current.currentTab).toBe('specifications');
    });

    it('should handle multiple tab changes', () => {
      mockGetParam.mockReturnValue('');

      const { result } = renderHook(() => useTabUrl());

      act(() => {
        result.current.setTab('tab1');
      });

      act(() => {
        result.current.setTab('tab2');
      });

      act(() => {
        result.current.clearTab();
      });

      expect(mockSetParam).toHaveBeenCalledTimes(3);
      expect(mockSetParam).toHaveBeenCalledWith('tab', 'tab1');
      expect(mockSetParam).toHaveBeenCalledWith('tab', 'tab2');
      expect(mockSetParam).toHaveBeenCalledWith('tab', null);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string as tab value', () => {
      mockGetParam.mockReturnValue('');

      const { result } = renderHook(() => useTabUrl());

      expect(result.current.currentTab).toBe('');

      act(() => {
        result.current.setTab('');
      });

      expect(mockSetParam).toHaveBeenCalledWith('tab', '');
    });

    it('should handle special characters in tab names', () => {
      mockGetParam.mockReturnValue('');

      const { result } = renderHook(() => useTabUrl());

      const specialTab = 'tab-with-dash_and_underscore';

      act(() => {
        result.current.setTab(specialTab);
      });

      expect(mockSetParam).toHaveBeenCalledWith('tab', specialTab);
    });

    it('should work with numeric tab values as strings', () => {
      mockGetParam.mockReturnValue('1');

      const { result } = renderHook(() => useTabUrl());

      expect(result.current.currentTab).toBe('1');

      act(() => {
        result.current.setTab('2');
      });

      expect(mockSetParam).toHaveBeenCalledWith('tab', '2');
    });

    it('should handle config with both custom paramName and defaultTab', () => {
      mockGetParam.mockReturnValue(null);

      const { result } = renderHook(() =>
        useTabUrl({ paramName: 'activeTab', defaultTab: 'default' })
      );

      expect(result.current.currentTab).toBe('default');
      expect(mockGetParam).toHaveBeenCalledWith('activeTab');
    });
  });

  describe('callback dependencies', () => {
    it('should memoize setTab and clearTab functions', () => {
      mockGetParam.mockReturnValue('');

      const { result, rerender } = renderHook(() => useTabUrl());

      const firstSetTab = result.current.setTab;
      const firstClearTab = result.current.clearTab;

      rerender();

      const secondSetTab = result.current.setTab;
      const secondClearTab = result.current.clearTab;

      expect(firstSetTab).toBe(secondSetTab);
      expect(firstClearTab).toBe(secondClearTab);
    });

    it('should create new functions when dependencies change', () => {
      mockGetParam.mockReturnValue('');

      const { result, rerender } = renderHook(
        ({ paramName }) => useTabUrl({ paramName }),
        { initialProps: { paramName: 'tab1' } }
      );

      const firstSetTab = result.current.setTab;

      rerender({ paramName: 'tab2' });

      const secondSetTab = result.current.setTab;

      expect(firstSetTab).not.toBe(secondSetTab);
    });
  });
});
