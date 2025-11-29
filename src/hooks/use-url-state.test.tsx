import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUrlState } from './use-url-state';

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
}));

import { useSearchParams } from 'react-router-dom';

const mockedUseSearchParams = vi.mocked(useSearchParams);

describe('useUrlState', () => {
  const mockSetSearchParams = vi.fn();
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockedUseSearchParams.mockReturnValue([mockSearchParams, mockSetSearchParams]);
  });

  describe('getParam functionality', () => {
    it('should get parameter value', () => {
      mockSearchParams.set('page', '2');

      const { result } = renderHook(() => useUrlState());

      expect(result.current.getParam('page')).toBe('2');
    });

    it('should return null for non-existent parameter', () => {
      const { result } = renderHook(() => useUrlState());

      expect(result.current.getParam('nonexistent')).toBeNull();
    });
  });

  describe('getParamAll functionality', () => {
    it('should get all values for parameter', () => {
      mockSearchParams.append('category', 'electronics');
      mockSearchParams.append('category', 'phones');

      const { result } = renderHook(() => useUrlState());

      expect(result.current.getParamAll('category')).toEqual(['electronics', 'phones']);
    });

    it('should return empty array for non-existent parameter', () => {
      const { result } = renderHook(() => useUrlState());

      expect(result.current.getParamAll('nonexistent')).toEqual([]);
    });
  });

  describe('setParam functionality', () => {
    it('should call setSearchParams when setting parameter', () => {
      const { result } = renderHook(() => useUrlState());

      act(() => {
        result.current.setParam('sort', 'price');
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), { replace: true });
    });

    it('should call setSearchParams when setting array parameter', () => {
      const { result } = renderHook(() => useUrlState());

      act(() => {
        result.current.setParam('category', ['electronics', 'phones']);
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), { replace: true });
    });

    it('should call setSearchParams when deleting parameter', () => {
      mockSearchParams.set('filter', 'active');

      const { result } = renderHook(() => useUrlState());

      act(() => {
        result.current.setParam('filter', null);
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), { replace: true });
    });
  });

  describe('setParams functionality', () => {
    it('should call setSearchParams when setting multiple parameters', () => {
      const { result } = renderHook(() => useUrlState());

      act(() => {
        result.current.setParams({
          page: '1',
          sort: 'name',
          category: ['electronics', 'computers'],
        });
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), { replace: true });
    });

    it('should call setSearchParams when handling mixed values', () => {
      mockSearchParams.set('old', 'value');

      const { result } = renderHook(() => useUrlState());

      act(() => {
        result.current.setParams({
          new: 'value',
          old: null,
          array: ['item1', 'item2'],
        });
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), { replace: true });
    });
  });

  describe('getAllParams functionality', () => {
    it('should return all parameters as object', () => {
      mockSearchParams.set('page', '1');
      mockSearchParams.set('sort', 'price');
      mockSearchParams.append('category', 'electronics');
      mockSearchParams.append('category', 'phones');

      const { result } = renderHook(() => useUrlState());

      const allParams = result.current.getAllParams();

      expect(allParams).toEqual({
        page: '1',
        sort: 'price',
        category: ['electronics', 'phones'],
      });
    });

    it('should return empty object when no parameters', () => {
      const { result } = renderHook(() => useUrlState());

      expect(result.current.getAllParams()).toEqual({});
    });

    it('should handle single value arrays as strings', () => {
      mockSearchParams.append('category', 'electronics');

      const { result } = renderHook(() => useUrlState());

      const allParams = result.current.getAllParams();

      expect(allParams.category).toBe('electronics');
    });
  });

  describe('configuration', () => {
    it('should use replace behavior by default', () => {
      const { result } = renderHook(() => useUrlState());

      act(() => {
        result.current.setParam('test', 'value');
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), { replace: true });
    });

    it('should use push behavior when replace is false', () => {
      const { result } = renderHook(() => useUrlState({ replace: false }));

      act(() => {
        result.current.setParam('test', 'value');
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), { replace: false });
    });
  });

  describe('memoization', () => {
    it('should memoize return value', () => {
      const { result, rerender } = renderHook(() => useUrlState());

      const firstResult = result.current;

      rerender();

      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it('should return new object when searchParams change', () => {
      const { result, rerender } = renderHook(() => useUrlState());

      const firstResult = result.current;

      const newSearchParams = new URLSearchParams('page=2');
      mockedUseSearchParams.mockReturnValue([newSearchParams, mockSetSearchParams]);

      rerender();

      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
      expect(secondResult.getParam('page')).toBe('2');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string values', () => {
      const { result } = renderHook(() => useUrlState());

      act(() => {
        result.current.setParam('search', '');
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), { replace: true });
    });

    it('should handle multiple operations in sequence', () => {
      const { result } = renderHook(() => useUrlState());

      act(() => {
        result.current.setParam('page', '1');
      });

      act(() => {
        result.current.setParam('sort', 'price');
      });

      act(() => {
        result.current.setParam('page', null);
      });

      expect(mockSetSearchParams).toHaveBeenCalledTimes(3);
    });
  });
});
