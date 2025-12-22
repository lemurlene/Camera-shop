import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Pagination from './pagination';

type UrlParams = Record<string, string | string[] | null>;
type SetParamsArg = Record<string, string | string[] | null>;

type UsePaginationArgs = { totalItems: number; itemsPerPage: number };

type UsePaginationReturn = {
  currentPage: number;
  totalPages: number;
  pages: number[];
  showPrev: boolean;
  showNext: boolean;
  prevTargetPage: number;
  nextTargetPage: number;
};

type UrlApi = {
  getAllParams: () => UrlParams;
  setParams: (params: SetParamsArg) => void;
};

const mocks = vi.hoisted(() => ({
  usePagination: vi.fn<[UsePaginationArgs], UsePaginationReturn>(),
  useUrl: vi.fn<[], UrlApi>(),
  getAllParams: vi.fn<[], UrlParams>(),
  setParams: vi.fn<[SetParamsArg], void>(),
}));

vi.mock('../../hooks', async () => {
  const { createAsyncThunk } = await import('@reduxjs/toolkit');

  return {
    usePagination: mocks.usePagination,
    createAppAsyncThunk: createAsyncThunk,

    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
  };
});

vi.mock('../../contexts', () => ({
  useUrl: mocks.useUrl,
}));

vi.mock('../../const/const', () => ({
  Setting: { MaxProductQuantity: 9 },
}));

vi.mock('./pagination-list', () => ({
  default: (props: {
    currentPage: number;
    pages: number[];
    showPrev: boolean;
    showNext: boolean;
    prevTargetPage: number;
    nextTargetPage: number;
    createPageUrl: (page: number) => string;
    onPageClick: (page: number) => void;
  }) => (
    <div
      data-testid="pagination-list"
      data-current={String(props.currentPage)}
      data-pages={JSON.stringify(props.pages)}
      data-show-prev={String(props.showPrev)}
      data-show-next={String(props.showNext)}
      data-prev={String(props.prevTargetPage)}
      data-next={String(props.nextTargetPage)}
      data-url-page1={props.createPageUrl(1)}
      data-url-page3={props.createPageUrl(3)}
    >
      <button type="button" data-testid="go-1" onClick={() => props.onPageClick(1)}>
        go-1
      </button>
      <button type="button" data-testid="go-3" onClick={() => props.onPageClick(3)}>
        go-3
      </button>
    </div>
  ),
}));

describe('Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useUrl.mockReturnValue({
      getAllParams: mocks.getAllParams,
      setParams: mocks.setParams,
    });
  });

  it('returns null when totalPages <= 1', () => {
    mocks.usePagination.mockReturnValue({
      currentPage: 1,
      totalPages: 1,
      pages: [1],
      showPrev: false,
      showNext: false,
      prevTargetPage: 1,
      nextTargetPage: 1,
    });

    render(<Pagination totalItems={9} itemsPerPage={9} />);

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagination-list')).not.toBeInTheDocument();
  });

  it('renders PaginationList and passes values from usePagination', () => {
    mocks.usePagination.mockReturnValue({
      currentPage: 4,
      totalPages: 10,
      pages: [4, 5, 6],
      showPrev: true,
      showNext: true,
      prevTargetPage: 3,
      nextTargetPage: 7,
    });

    mocks.getAllParams.mockReturnValue({});

    render(<Pagination totalItems={100} itemsPerPage={10} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();

    const list = screen.getByTestId('pagination-list');
    expect(list).toHaveAttribute('data-current', '4');
    expect(list).toHaveAttribute('data-pages', JSON.stringify([4, 5, 6]));
    expect(list).toHaveAttribute('data-show-prev', 'true');
    expect(list).toHaveAttribute('data-show-next', 'true');
    expect(list).toHaveAttribute('data-prev', '3');
    expect(list).toHaveAttribute('data-next', '7');
  });

  it('handlePageClick: sets page=null for page=1; sets page="N" for others', () => {
    mocks.usePagination.mockReturnValue({
      currentPage: 2,
      totalPages: 5,
      pages: [1, 2, 3],
      showPrev: false,
      showNext: true,
      prevTargetPage: 1,
      nextTargetPage: 4,
    });

    mocks.getAllParams.mockReturnValue({ sort: 'price' });

    render(<Pagination totalItems={50} itemsPerPage={10} />);

    fireEvent.click(screen.getByTestId('go-1'));
    expect(mocks.setParams).toHaveBeenCalledWith({ page: null });

    fireEvent.click(screen.getByTestId('go-3'));
    expect(mocks.setParams).toHaveBeenCalledWith({ page: '3' });
  });

  it('createPageUrl: preserves params; removes page for 1; sets page for others', () => {
    mocks.usePagination.mockReturnValue({
      currentPage: 2,
      totalPages: 5,
      pages: [1, 2, 3],
      showPrev: false,
      showNext: true,
      prevTargetPage: 1,
      nextTargetPage: 4,
    });

    mocks.getAllParams.mockReturnValue({
      sort: 'price',
      category: ['dslr', 'mirrorless'],
      page: '2',
    });

    render(<Pagination totalItems={50} itemsPerPage={10} />);

    const list = screen.getByTestId('pagination-list');

    expect(list).toHaveAttribute(
      'data-url-page1',
      '?sort=price&category=dslr&category=mirrorless'
    );

    expect(list).toHaveAttribute(
      'data-url-page3',
      '?sort=price&category=dslr&category=mirrorless&page=3'
    );
  });
});
