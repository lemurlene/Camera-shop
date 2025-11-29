import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../hooks', () => ({
  usePagination: vi.fn(),
}));

vi.mock('../../contexts', () => ({
  useUrl: vi.fn(),
}));

vi.mock('./pagination-list', () => ({
  default: vi.fn(),
}));

import Pagination from './pagination';

const { usePagination } = await import('../../hooks');
const { useUrl } = await import('../../contexts');
const { default: PaginationList } = await import('./pagination-list');

const mockUsePagination = vi.mocked(usePagination);
const mockUseUrl = vi.mocked(useUrl);
const mockPaginationList = vi.mocked(PaginationList);

describe('Pagination', () => {
  const defaultPaginationProps = {
    startIndex: 0,
    endIndex: 8,
    currentPage: 1,
    totalPages: 5,
    setPage: vi.fn(),
    nextPage: vi.fn(),
    prevPage: vi.fn(),
    paginationRange: [1, 2, 3, 4, 5],
    itemsPerPage: 9,
  };

  const defaultUrlProps = {
    getParam: vi.fn(),
    getParamAll: vi.fn(),
    getAllParams: vi.fn(() => ({})),
    setParam: vi.fn(),
    setParams: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePagination.mockReturnValue(defaultPaginationProps);
    mockUseUrl.mockReturnValue(defaultUrlProps);
    mockPaginationList.mockReturnValue(<div data-testid="pagination-list">PaginationList</div>);
  });

  it('should not render when only one page', () => {
    mockUsePagination.mockReturnValue({
      ...defaultPaginationProps,
      totalPages: 1,
    });

    const { container } = render(<Pagination totalItems={5} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when multiple pages', () => {
    render(<Pagination totalItems={50} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-list')).toBeInTheDocument();
  });

  it('should call usePagination with correct arguments', () => {
    render(<Pagination totalItems={50} itemsPerPage={10} />);
    expect(mockUsePagination).toHaveBeenCalledWith({
      totalItems: 50,
      itemsPerPage: 10,
    });
  });

  it('should create correct page URLs', () => {
    render(<Pagination totalItems={50} />);

    const calls = mockPaginationList.mock.calls;
    expect(calls).toHaveLength(1);

    const props = calls[0]![0];
    expect(props.createPageUrl(1)).toBe('?');
    expect(props.createPageUrl(2)).toBe('?page=2');
  });

  it('should handle page clicks correctly', () => {
    const setParams = vi.fn();
    mockUseUrl.mockReturnValue({
      ...defaultUrlProps,
      setParams,
    });

    render(<Pagination totalItems={50} />);

    const calls = mockPaginationList.mock.calls;
    expect(calls).toHaveLength(1);

    const props = calls[0]![0];
    props.onPageClick(1);
    expect(setParams).toHaveBeenCalledWith({ page: null });

    props.onPageClick(3);
    expect(setParams).toHaveBeenCalledWith({ page: '3' });
  });

  it('should use default itemsPerPage when not provided', () => {
    render(<Pagination totalItems={50} />);
    expect(mockUsePagination).toHaveBeenCalledWith({
      totalItems: 50,
      itemsPerPage: 9,
    });
  });
});
