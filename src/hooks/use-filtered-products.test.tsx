import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredProducts } from './use-filtered-products';
import { useAppSelector } from '.';
import { selectOffers } from '../store/offers';
import { selectAllFilters } from '../store/filters';
import { selectSortType, selectSortOrder } from '../store/sort';
import { sortOffers } from '../components/sort/utils';
import { CategoryToKey } from '../const/const';
import type { FullOfferType } from '../const/type';
import { mockOffers } from '../mocks/mock-offers';

vi.mock('./', () => ({
  useAppSelector: vi.fn()
}));

vi.mock('../store/offers', () => ({
  selectOffers: vi.fn()
}));

vi.mock('../store/filters', () => ({
  selectAllFilters: vi.fn()
}));

vi.mock('../store/sort', () => ({
  selectSortType: vi.fn(),
  selectSortOrder: vi.fn()
}));

vi.mock('../components/sort/utils', () => ({
  sortOffers: vi.fn((offers: FullOfferType[]) => offers)
}));

const mockUseAppSelector = vi.mocked(useAppSelector);
const mockSortOffers = vi.mocked(sortOffers);

describe('useFilteredProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('filtering by category, type, and level', () => {
    it('should return all products when no filters applied', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(6);
      expect(result.current.filteredPriceRange).toEqual({ min: 8430, max: 149990 });
    });

    it('should filter products by category - videocamera', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: 'videocamera', type: [], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(2);
      expect(result.current.filteredProducts.every((product) =>
        CategoryToKey[product.category as keyof typeof CategoryToKey] === 'videocamera'
      )).toBe(true);
      expect(result.current.filteredProducts.map((p) => p.id)).toEqual([1, 5]);
    });

    it('should filter products by category - photocamera', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: 'photocamera', type: [], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(4);
      expect(result.current.filteredProducts.every((product) =>
        CategoryToKey[product.category as keyof typeof CategoryToKey] === 'photocamera'
      )).toBe(true);
    });

    it('should filter products by type - collection', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: ['collection'], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(2);
      expect(result.current.filteredProducts.every((product) =>
        product.type === 'Коллекционная'
      )).toBe(true);
      expect(result.current.filteredProducts.map((p) => p.id)).toEqual([1, 5]);
    });

    it('should filter products by level - zero', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: ['zero'], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].level).toBe('Нулевой');
      expect(result.current.filteredProducts[0].id).toBe(3);
    });

    it('should filter products by level - professional', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: ['professional'], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].level).toBe('Профессиональный');
      expect(result.current.filteredProducts[0].id).toBe(5);
    });
  });

  describe('filtering by price', () => {
    it('should filter products by min price', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: [], minPrice: 20000, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(2);
      expect(result.current.filteredProducts.every((product) => product.price >= 20000)).toBe(true);
      expect(result.current.filteredProducts.map((p) => p.id)).toEqual([1, 5]);
    });

    it('should filter products by max price', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: [], minPrice: null, maxPrice: 20000 };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(4);
      expect(result.current.filteredProducts.every((product) => product.price <= 20000)).toBe(true);
      expect(result.current.filteredProducts.map((p) => p.id).sort()).toEqual([2, 3, 4, 6]);
    });

    it('should filter products by price range', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: [], minPrice: 10000, maxPrice: 30000 };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(2);
      expect(result.current.filteredProducts.every((product) =>
        product.price >= 10000 && product.price <= 30000
      )).toBe(true);
      expect(result.current.filteredProducts.map((p) => p.id)).toEqual([2, 4]);
    });
  });

  describe('sorting', () => {
    it('should call sortOffers with correct parameters', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'desc';
        }
        return null;
      });

      renderHook(() => useFilteredProducts());

      expect(mockSortOffers).toHaveBeenCalledWith(mockOffers, 'price', 'desc');
    });
  });

  describe('price range calculation', () => {
    it('should calculate correct price range for all products', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredPriceRange).toEqual({ min: 8430, max: 149990 });
    });

    it('should calculate correct price range for filtered products', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: 'videocamera', type: [], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredPriceRange).toEqual({ min: 73450, max: 149990 });
    });

    it('should return zero range when no products match filters', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: 'nonexistent', type: [], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredPriceRange).toEqual({ min: 0, max: 0 });
    });
  });

  describe('edge cases', () => {
    it('should return empty array when no products', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return [];
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toEqual([]);
      expect(result.current.filteredPriceRange).toEqual({ min: 0, max: 0 });
    });

    it('should handle null products', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return null;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toEqual([]);
      expect(result.current.filteredPriceRange).toEqual({ min: 0, max: 0 });
    });

    it('should handle multiple filter combinations', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return {
            category: 'photocamera',
            type: ['film'],
            level: ['non-professional'],
            minPrice: 10000,
            maxPrice: 25000
          };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].id).toBe(4);
    });

    it('should handle empty arrays in filters', () => {
      mockUseAppSelector.mockImplementation((selector) => {
        if (selector === selectOffers) {
          return mockOffers;
        }
        if (selector === selectAllFilters) {
          return { category: '', type: [], level: [], minPrice: null, maxPrice: null };
        }
        if (selector === selectSortType) {
          return 'price';
        }
        if (selector === selectSortOrder) {
          return 'asc';
        }
        return null;
      });

      const { result } = renderHook(() => useFilteredProducts());

      expect(result.current.filteredProducts).toHaveLength(6);
    });
  });
});

