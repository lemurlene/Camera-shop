import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

import { usePagination } from './use-pagination';
import { useUrl } from '../contexts';
import { Setting } from '../const/const';

vi.mock('../contexts', () => ({
  useUrl: vi.fn(),
}));

const mockedUseUrl = vi.mocked(useUrl);

type UrlAllParams = Record<string, string | string[]>;
type UrlSetParams = Record<string, string | string[] | null>;

describe('usePagination', () => {
  const getParam = vi.fn<[string], string | null>();
  const getParamAll = vi.fn<[string], string[]>();
  const setParam = vi.fn<[string, string | string[] | null], void>();
  const setParams = vi.fn<[UrlSetParams], void>();
  const getAllParams = vi.fn<[], UrlAllParams>(() => ({}));

  const itemsPerPage = Setting.MaxProductQuantity;
  const maxLinks = Setting.MaxPaginationLink;

  beforeEach(() => {
    vi.clearAllMocks();

    getParam.mockReturnValue(null);
    getParamAll.mockReturnValue([]);

    mockedUseUrl.mockReturnValue({
      getParam,
      getParamAll,
      setParam,
      setParams,
      getAllParams,
    });
  });

  it('returns currentPage=1 and empty pages when totalItems=0', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 0, itemsPerPage }));

    expect(result.current.totalPages).toBe(0);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pages).toEqual([]);
    expect(result.current.showPrev).toBe(false);
    expect(result.current.showNext).toBe(false);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(itemsPerPage);
  });

  it('when totalPages <= maxLinks: shows all pages (example 3 pages)', () => {
    const totalItems = itemsPerPage * 3;

    const { result } = renderHook(() => usePagination({ totalItems, itemsPerPage }));

    expect(result.current.totalPages).toBe(3);
    expect(result.current.pages).toEqual([1, 2, 3]);
    expect(result.current.showPrev).toBe(false);
    expect(result.current.showNext).toBe(false);
  });

  it('when totalPages > maxLinks and currentPage=1: pages [1,2,3], showNext=true', () => {
    const totalPages = maxLinks + 1;
    const totalItems = totalPages * itemsPerPage;

    getParam.mockImplementation((key) => (key === 'page' ? '1' : null));

    const { result } = renderHook(() => usePagination({ totalItems, itemsPerPage }));

    expect(result.current.totalPages).toBe(totalPages);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pages).toEqual([1, 2, 3]);
    expect(result.current.showPrev).toBe(false);
    expect(result.current.showNext).toBe(true);
    expect(result.current.nextTargetPage).toBe(1 + maxLinks);
  });

  it('middle window: currentPage=4 => pages [3,4,5], showPrev=true, showNext=true', () => {
    const totalPages = 10;
    const totalItems = totalPages * itemsPerPage;

    getParam.mockImplementation((key) => (key === 'page' ? '4' : null));

    const { result } = renderHook(() => usePagination({ totalItems, itemsPerPage }));

    expect(result.current.totalPages).toBe(10);
    expect(result.current.currentPage).toBe(4);
    expect(result.current.pages).toEqual([3, 4, 5]);
    expect(result.current.showPrev).toBe(true);
    expect(result.current.showNext).toBe(true);

    expect(result.current.prevTargetPage).toBe(2);
    expect(result.current.nextTargetPage).toBe(6);

    expect(result.current.startIndex).toBe((4 - 1) * itemsPerPage);
    expect(result.current.endIndex).toBe((4 - 1) * itemsPerPage + itemsPerPage);
  });

  it('last window: currentPage=totalPages => pages [totalPages-2,totalPages-1,totalPages], showNext=false', () => {
    const totalPages = 10;
    const totalItems = totalPages * itemsPerPage;

    getParam.mockImplementation((key) => (key === 'page' ? String(totalPages) : null));

    const { result } = renderHook(() => usePagination({ totalItems, itemsPerPage }));

    expect(result.current.currentPage).toBe(10);
    expect(result.current.pages).toEqual([8, 9, 10]);
    expect(result.current.showPrev).toBe(true);
    expect(result.current.showNext).toBe(false);
  });

  it('clamps raw page if too large and calls setParam in effect', async () => {
    const totalPages = 5;
    const totalItems = totalPages * itemsPerPage;

    getParam.mockImplementation((key) => (key === 'page' ? '999' : null));

    renderHook(() => usePagination({ totalItems, itemsPerPage }));

    await waitFor(() => {
      expect(setParam).toHaveBeenCalledWith('page', String(totalPages));
    });
  });

  it('setPage: page=1 => null; page=2 => "2"; invalid pages do nothing', () => {
    const totalPages = 5;
    const totalItems = totalPages * itemsPerPage;

    const { result } = renderHook(() => usePagination({ totalItems, itemsPerPage }));

    act(() => result.current.setPage(1));
    expect(setParam).toHaveBeenCalledWith('page', null);

    act(() => result.current.setPage(2));
    expect(setParam).toHaveBeenCalledWith('page', '2');

    const callsBefore = setParam.mock.calls.length;

    act(() => {
      result.current.setPage(0);
      result.current.setPage(999);
    });

    expect(setParam.mock.calls.length).toBe(callsBefore);
  });
});
