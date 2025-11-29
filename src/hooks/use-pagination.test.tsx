import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './use-pagination';
import { useUrl } from '../contexts';

vi.mock('../store/api-action', () => ({}));
vi.mock('../store/offers', () => ({}));
vi.mock('../hooks', () => ({
  createAppAsyncThunk: vi.fn(),
}));

vi.mock('../contexts', () => ({
  useUrl: vi.fn(),
}));


const mockedUseUrl = vi.mocked(useUrl);

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

describe('usePagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should return correct pagination data for first page', () => {
      mockedUseUrl.mockReturnValue({
        getParam: () => null,
        setParam: () => undefined,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 100, itemsPerPage: 9 }),
        { wrapper: TestWrapper }
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(12);
      expect(result.current.startIndex).toBe(0);
      expect(result.current.endIndex).toBe(9);
      expect(result.current.itemsPerPage).toBe(9);
    });

    it('should return correct pagination data for specific page', () => {
      mockedUseUrl.mockReturnValue({
        getParam: () => '3',
        setParam: () => undefined,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 100, itemsPerPage: 10 }),
        { wrapper: TestWrapper }
      );

      expect(result.current.currentPage).toBe(3);
      expect(result.current.totalPages).toBe(10);
      expect(result.current.startIndex).toBe(20);
      expect(result.current.endIndex).toBe(30);
    });

    it('should handle zero total items', () => {
      mockedUseUrl.mockReturnValue({
        getParam: () => null,
        setParam: () => undefined,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 0 }),
        { wrapper: TestWrapper }
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.startIndex).toBe(0);
      expect(result.current.endIndex).toBe(9);
    });
  });

  describe('page navigation', () => {
    it('should set page correctly', () => {
      let setParamCalled = false;
      let setParamArgs: unknown[] = [];

      const mockSetParamSpy = (...args: unknown[]) => {
        setParamCalled = true;
        setParamArgs = args;
      };

      mockedUseUrl.mockReturnValue({
        getParam: () => '1',
        setParam: mockSetParamSpy,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 100 }),
        { wrapper: TestWrapper }
      );

      act(() => {
        result.current.setPage(5);
      });

      expect(setParamCalled).toBe(true);
      expect(setParamArgs).toEqual(['page', '5']);
    });

    it('should set page to null for first page', () => {
      let setParamArgs: unknown[] = [];

      const mockSetParamSpy = (...args: unknown[]) => {
        setParamArgs = args;
      };

      mockedUseUrl.mockReturnValue({
        getParam: () => '2',
        setParam: mockSetParamSpy,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 100 }),
        { wrapper: TestWrapper }
      );

      act(() => {
        result.current.setPage(1);
      });

      expect(setParamArgs).toEqual(['page', null]);
    });

    it('should not set page outside valid range', () => {
      let setParamCalled = false;

      const mockSetParamSpy = () => {
        setParamCalled = true;
      };

      mockedUseUrl.mockReturnValue({
        getParam: () => '1',
        setParam: mockSetParamSpy,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 100 }),
        { wrapper: TestWrapper }
      );

      act(() => {
        result.current.setPage(0);
      });

      act(() => {
        result.current.setPage(20);
      });

      expect(setParamCalled).toBe(false);
    });
  });

  describe('page correction', () => {
    it('should correct page when current page exceeds total pages', () => {
      let setParamArgs: unknown[] = [];

      const mockSetParamSpy = (...args: unknown[]) => {
        setParamArgs = args;
      };

      mockedUseUrl.mockReturnValue({
        getParam: () => '15',
        setParam: mockSetParamSpy,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 100, itemsPerPage: 10 }),
        { wrapper: TestWrapper }
      );

      expect(result.current.currentPage).toBe(10);
      expect(setParamArgs).toEqual(['page', '10']);
    });
  });

  describe('pagination range', () => {
    it('should return empty array for single page', () => {
      mockedUseUrl.mockReturnValue({
        getParam: () => '1',
        setParam: () => undefined,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 5, itemsPerPage: 10 }),
        { wrapper: TestWrapper }
      );

      expect(result.current.paginationRange).toEqual([]);
    });

    it('should test pagination range behavior', () => {
      mockedUseUrl.mockReturnValue({
        getParam: () => '1',
        setParam: () => undefined,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 30, itemsPerPage: 5 }),
        { wrapper: TestWrapper }
      );

      const range = result.current.paginationRange;

      expect(Array.isArray(range)).toBe(true);
      expect(range.length).toBeGreaterThan(0);
      expect(range).toContain(1);
      expect(range).toContain(6);
    });

    it('should show dots for large number of pages', () => {
      mockedUseUrl.mockReturnValue({
        getParam: () => '1',
        setParam: () => undefined,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 100, itemsPerPage: 5 }),
        { wrapper: TestWrapper }
      );

      const range = result.current.paginationRange;

      expect(range).toContain('...');
      expect(range[0]).toBe(1);
      expect(range[range.length - 1]).toBe(20);
    });

    it('should handle middle pages correctly', () => {
      mockedUseUrl.mockReturnValue({
        getParam: () => '10',
        setParam: () => undefined,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 100, itemsPerPage: 5 }),
        { wrapper: TestWrapper }
      );

      const range = result.current.paginationRange;

      expect(range[0]).toBe(1);
      expect(range).toContain('...');
      expect(range[range.length - 1]).toBe(20);
    });

    it('should handle last pages correctly', () => {
      mockedUseUrl.mockReturnValue({
        getParam: () => '18',
        setParam: () => undefined,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 100, itemsPerPage: 5 }),
        { wrapper: TestWrapper }
      );

      const range = result.current.paginationRange;

      expect(range[0]).toBe(1);
      expect(range).toContain('...');
      expect(range[range.length - 1]).toBe(20);
    });
  });

  describe('edge cases', () => {
    it('should handle invalid page parameter', () => {
      mockedUseUrl.mockReturnValue({
        getParam: () => 'invalid',
        setParam: () => undefined,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result } = renderHook(
        () => usePagination({ totalItems: 100 }),
        { wrapper: TestWrapper }
      );

      expect(result.current.currentPage).toBe(1);
    });

    it('should recalculate when dependencies change', () => {
      mockedUseUrl.mockReturnValue({
        getParam: () => '1',
        setParam: () => undefined,
        getParamAll: () => [],
        setParams: () => undefined,
        getAllParams: () => ({}),
      });

      const { result, rerender } = renderHook(
        ({ totalItems }) => usePagination({ totalItems }),
        {
          wrapper: TestWrapper,
          initialProps: { totalItems: 50 },
        }
      );

      expect(result.current.totalPages).toBe(6);

      rerender({ totalItems: 100 });

      expect(result.current.totalPages).toBe(12);
    });
  });
});
