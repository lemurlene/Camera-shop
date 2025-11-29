import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useOfferTabs } from './use-offer-tabs';

type UseTabUrlParams = {
  paramName: string;
  defaultTab: string;
};

type UseTabUrlReturn = {
  currentTab: string | null;
  setTab: (tab: string) => void;
};

const mockUseTabUrl = vi.fn<[UseTabUrlParams], UseTabUrlReturn>();
vi.mock('../../hooks', () => ({
  useTabUrl: (params: UseTabUrlParams) => mockUseTabUrl(params),
}));

describe('useOfferTabs', () => {
  const mockSetTab = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseTabUrl.mockReturnValue({
      currentTab: 'description',
      setTab: mockSetTab,
    });
  });

  describe('initialization', () => {
    it('should call useTabUrl with correct parameters', () => {
      renderHook(() => useOfferTabs());

      expect(mockUseTabUrl).toHaveBeenCalledWith({
        paramName: 'tab',
        defaultTab: 'description',
      });
    });

    it('should set default tab when currentTab is null', () => {
      mockUseTabUrl.mockReturnValue({
        currentTab: null,
        setTab: mockSetTab,
      });

      renderHook(() => useOfferTabs());

      expect(mockSetTab).toHaveBeenCalledWith('description');
    });

    it('should not set default tab when currentTab is already set', () => {
      mockUseTabUrl.mockReturnValue({
        currentTab: 'specs',
        setTab: mockSetTab,
      });

      renderHook(() => useOfferTabs());

      expect(mockSetTab).not.toHaveBeenCalled();
    });
  });

  describe('active tab calculation', () => {
    it('should return description for valid description tab', () => {
      mockUseTabUrl.mockReturnValue({
        currentTab: 'description',
        setTab: mockSetTab,
      });

      const { result } = renderHook(() => useOfferTabs());

      expect(result.current.activeTab).toBe('description');
    });

    it('should return specs for valid specs tab', () => {
      mockUseTabUrl.mockReturnValue({
        currentTab: 'specs',
        setTab: mockSetTab,
      });

      const { result } = renderHook(() => useOfferTabs());

      expect(result.current.activeTab).toBe('specs');
    });

    it('should return description for invalid tab values', () => {
      const invalidTabs = ['', 'invalid', 'reviews', 'photos'];

      invalidTabs.forEach((tab) => {
        mockUseTabUrl.mockReturnValue({
          currentTab: tab,
          setTab: mockSetTab,
        });

        const { result } = renderHook(() => useOfferTabs());

        expect(result.current.activeTab).toBe('description');
      });
    });
  });

  describe('return values', () => {
    it('should return activeTab and setTab function', () => {
      const customSetTab = vi.fn();

      mockUseTabUrl.mockReturnValue({
        currentTab: 'specs',
        setTab: customSetTab,
      });

      const { result } = renderHook(() => useOfferTabs());

      expect(result.current.activeTab).toBe('specs');
      expect(result.current.setTab).toBe(customSetTab);
    });
  });
});
