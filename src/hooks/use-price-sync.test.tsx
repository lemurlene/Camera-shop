import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePriceSync } from './use-price-sync';
import { useAppSelector } from './';
import { useUrl } from '../contexts';
import { selectMinPrice, selectMaxPrice } from '../store/filters';

vi.mock('./', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../contexts', () => ({
  useUrl: vi.fn(),
}));

vi.mock('../store/filters', () => ({
  selectMinPrice: vi.fn(),
  selectMaxPrice: vi.fn(),
}));

const mockUseAppSelector = vi.mocked(useAppSelector);
const mockUseUrl = vi.mocked(useUrl);
const mockSelectMinPrice = vi.mocked(selectMinPrice);
const mockSelectMaxPrice = vi.mocked(selectMaxPrice);

describe('usePriceSync', () => {
  const mockSetParam = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUrl.mockReturnValue({
      setParam: mockSetParam,
      getParam: vi.fn(),
      getParamAll: vi.fn(),
      getAllParams: vi.fn(),
      setParams: vi.fn(),
    });
  });

  it('should sync min price to URL when min price changes', () => {
    mockSelectMinPrice.mockReturnValue(1000);
    mockSelectMaxPrice.mockReturnValue(null);
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === mockSelectMinPrice) {
        return 1000;
      }
      if (selector === mockSelectMaxPrice) {
        return null;
      }
      return undefined;
    });

    renderHook(() => usePriceSync());

    expect(mockSetParam).toHaveBeenCalledWith('price_min', '1000');
    expect(mockSetParam).toHaveBeenCalledWith('price_max', null);
  });

  it('should sync max price to URL when max price changes', () => {
    mockSelectMinPrice.mockReturnValue(null);
    mockSelectMaxPrice.mockReturnValue(5000);

    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === mockSelectMinPrice) {
        return null;
      }
      if (selector === mockSelectMaxPrice) {
        return 5000;
      }
      return undefined;
    });

    renderHook(() => usePriceSync());

    expect(mockSetParam).toHaveBeenCalledWith('price_min', null);
    expect(mockSetParam).toHaveBeenCalledWith('price_max', '5000');
  });

  it('should sync both min and max prices when both are present', () => {
    mockSelectMinPrice.mockReturnValue(1000);
    mockSelectMaxPrice.mockReturnValue(5000);

    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === mockSelectMinPrice) {
        return 1000;
      }
      if (selector === mockSelectMaxPrice) {
        return 5000;
      }
      return undefined;
    });

    renderHook(() => usePriceSync());

    expect(mockSetParam).toHaveBeenCalledWith('price_min', '1000');
    expect(mockSetParam).toHaveBeenCalledWith('price_max', '5000');
  });

  it('should set price_min to null when min price is null', () => {
    mockSelectMinPrice.mockReturnValue(null);
    mockSelectMaxPrice.mockReturnValue(null);

    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === mockSelectMinPrice) {
        return null;
      }
      if (selector === mockSelectMaxPrice) {
        return null;
      }
      return undefined;
    });

    renderHook(() => usePriceSync());

    expect(mockSetParam).toHaveBeenCalledWith('price_min', null);
    expect(mockSetParam).toHaveBeenCalledWith('price_max', null);
  });

  it('should set price_max to null when max price is null', () => {
    mockSelectMinPrice.mockReturnValue(1000);
    mockSelectMaxPrice.mockReturnValue(null);

    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === mockSelectMinPrice) {
        return 1000;
      }
      if (selector === mockSelectMaxPrice) {
        return null;
      }
      return undefined;
    });

    renderHook(() => usePriceSync());

    expect(mockSetParam).toHaveBeenCalledWith('price_min', '1000');
    expect(mockSetParam).toHaveBeenCalledWith('price_max', null);
  });

  it('should handle price value of 0 correctly', () => {
    mockSelectMinPrice.mockReturnValue(0);
    mockSelectMaxPrice.mockReturnValue(0);

    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === mockSelectMinPrice) {
        return 0;
      }
      if (selector === mockSelectMaxPrice) {
        return 0;
      }
      return undefined;
    });

    renderHook(() => usePriceSync());

    expect(mockSetParam).toHaveBeenCalledWith('price_min', '0');
    expect(mockSetParam).toHaveBeenCalledWith('price_max', '0');
  });

  it('should update URL when prices change', () => {
    let minPrice = 1000;
    let maxPrice = 5000;

    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === mockSelectMinPrice) {
        return minPrice;
      }
      if (selector === mockSelectMaxPrice) {
        return maxPrice;
      }
      return undefined;
    });

    const { rerender } = renderHook(() => usePriceSync());

    expect(mockSetParam).toHaveBeenCalledWith('price_min', '1000');
    expect(mockSetParam).toHaveBeenCalledWith('price_max', '5000');

    mockSetParam.mockClear();

    minPrice = 1500;
    maxPrice = 6000;

    rerender();

    expect(mockSetParam).toHaveBeenCalledWith('price_min', '1500');
    expect(mockSetParam).toHaveBeenCalledWith('price_max', '6000');
  });

  it('should use the same setParam function from useUrl', () => {
    mockSelectMinPrice.mockReturnValue(1000);
    mockSelectMaxPrice.mockReturnValue(5000);

    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === mockSelectMinPrice) {
        return 1000;
      }
      if (selector === mockSelectMaxPrice) {
        return 5000;
      }
      return undefined;
    });

    renderHook(() => usePriceSync());

    expect(mockSetParam).toHaveBeenCalledWith('price_min', '1000');
    expect(mockSetParam).toHaveBeenCalledWith('price_max', '5000');
  });
});
