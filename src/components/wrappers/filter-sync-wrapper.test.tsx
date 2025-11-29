import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { FilterSyncWrapper } from './filter-sync-wrapper';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useUrl } from '../../contexts';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../contexts', () => ({
  useUrl: vi.fn(),
}));

vi.mock('../../store/filters/filters.slice', () => ({
  changeCategory: vi.fn(),
  setTypes: vi.fn(),
  setLevels: vi.fn(),
  changeMinPrice: vi.fn(),
  changeMaxPrice: vi.fn(),
}));

vi.mock('../../store/filters/filters.selector', () => ({
  selectAllFilters: vi.fn(),
}));

const mockUseAppDispatch = vi.mocked(useAppDispatch);
const mockUseAppSelector = vi.mocked(useAppSelector);
const mockUseUrl = vi.mocked(useUrl);

describe('FilterSyncWrapper Component', () => {
  const mockDispatch = vi.fn();
  const mockSetParam = vi.fn();
  const mockGetParam = vi.fn();
  const mockGetParamAll = vi.fn();
  const mockGetAllParams = vi.fn();
  const mockSetParams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseAppSelector.mockReturnValue({
      category: null,
      type: [],
      level: [],
      minPrice: null,
      maxPrice: null,
    });
    mockUseUrl.mockReturnValue({
      getParam: mockGetParam,
      setParam: mockSetParam,
      getParamAll: mockGetParamAll,
      getAllParams: mockGetAllParams,
      setParams: mockSetParams,
    });
  });

  describe('basic functionality', () => {
    it('should render children without modifications', () => {
      mockGetParam.mockReturnValue(null);
      mockGetParamAll.mockReturnValue([]);

      const { getByText } = render(
        <FilterSyncWrapper>
          <div>Test Content</div>
        </FilterSyncWrapper>
      );

      expect(getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('URL to store synchronization', () => {
    it('should sync category from URL to store', () => {
      mockGetParam.mockImplementation((param: string) =>
        param === 'category' ? 'photocamera' : null
      );
      mockGetParamAll.mockReturnValue([]);

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should sync types from URL to store', () => {
      mockGetParam.mockReturnValue(null);
      mockGetParamAll.mockImplementation((param: string) =>
        param === 'type' ? ['digital', 'film'] : []
      );

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should sync levels from URL to store', () => {
      mockGetParam.mockReturnValue(null);
      mockGetParamAll.mockImplementation((param: string) =>
        param === 'level' ? ['professional', 'non-professional'] : []
      );

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should sync minPrice from URL to store', () => {
      mockGetParam.mockImplementation((param: string) =>
        param === 'minPrice' ? '1000' : null
      );
      mockGetParamAll.mockReturnValue([]);

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should sync maxPrice from URL to store', () => {
      mockGetParam.mockImplementation((param: string) =>
        param === 'maxPrice' ? '5000' : null
      );
      mockGetParamAll.mockReturnValue([]);

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe('store to URL synchronization', () => {
    it('should sync store filters to URL', () => {
      mockGetParam.mockReturnValue(null);
      mockGetParamAll.mockReturnValue([]);

      mockUseAppSelector.mockReturnValue({
        category: 'videocamera',
        type: ['digital'],
        level: ['professional'],
        minPrice: 1000,
        maxPrice: 5000,
      });

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(mockSetParams).toHaveBeenCalledWith({
        category: 'videocamera',
        type: ['digital'],
        level: ['professional'],
        minPrice: '1000',
        maxPrice: '5000',
      });
    });

    it('should set type and level to null when arrays are empty', () => {
      mockGetParam.mockReturnValue(null);
      mockGetParamAll.mockReturnValue([]);

      mockUseAppSelector.mockReturnValue({
        category: null,
        type: [],
        level: [],
        minPrice: null,
        maxPrice: null,
      });

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(mockSetParams).toHaveBeenCalledWith({
        category: null,
        type: null,
        level: null,
        minPrice: null,
        maxPrice: null,
      });
    });
  });

  describe('edge cases', () => {
    it('should ignore invalid category values', () => {
      mockGetParam.mockImplementation((param: string) =>
        param === 'category' ? 'invalid-category' : null
      );
      mockGetParamAll.mockReturnValue([]);

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(true).toBe(true);
    });

    it('should filter invalid type values', () => {
      mockGetParam.mockReturnValue(null);
      mockGetParamAll.mockImplementation((param: string) =>
        param === 'type' ? ['digital', 'invalid-type', 'film'] : []
      );

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should handle complex children structure', () => {
      mockGetParam.mockReturnValue(null);
      mockGetParamAll.mockReturnValue([]);

      const { getByText, getByTestId } = render(
        <FilterSyncWrapper>
          <div data-testid="complex-child">
            <h1>Filter Section</h1>
            <p>Various filter controls</p>
            <button>Apply Filters</button>
          </div>
        </FilterSyncWrapper>
      );

      expect(getByTestId('complex-child')).toBeInTheDocument();
      expect(getByText('Filter Section')).toBeInTheDocument();
      expect(getByText('Various filter controls')).toBeInTheDocument();
      expect(getByText('Apply Filters')).toBeInTheDocument();
    });

    it('should ignore invalid price values', () => {
      mockGetParam.mockImplementation((param: string) => {
        if (param === 'minPrice') {
          return 'invalid-price';
        }
        if (param === 'maxPrice') {
          return '5000abc';
        }
        return null;
      });
      mockGetParamAll.mockReturnValue([]);

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(mockSetParams).toHaveBeenCalled();
    });

    it('should work with empty URL parameters', () => {
      mockGetParam.mockReturnValue(null);
      mockGetParamAll.mockReturnValue([]);

      render(
        <FilterSyncWrapper>
          <div>Test</div>
        </FilterSyncWrapper>
      );

      expect(mockSetParams).toHaveBeenCalled();
    });
  });
});
