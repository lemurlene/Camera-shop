import { usePagination } from '../../hooks';
import { useUrl } from '../../contexts';
import PaginationList from './pagination-list';

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
}

function Pagination({ totalItems, itemsPerPage = 9 }: PaginationProps): JSX.Element | null {
  const {
    currentPage,
    totalPages,
    paginationRange
  } = usePagination({ totalItems, itemsPerPage });
  const { getAllParams, setParams } = useUrl();
  if (totalPages <= 1) {
    return null;
  }

  const createPageUrl = (page: number): string => {
    const currentParams = getAllParams();
    const newParams: Record<string, string | string[] | null> = { ...currentParams };
    if (page === 1) {
      delete newParams.page;
    } else {
      newParams.page = page.toString();
    }

    const searchParams = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.set(key, value);
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '?';
  };

  const handlePageClick = (page: number) => {
    if (page === 1) {
      setParams({ page: null });
    } else {
      setParams({ page: page.toString() });
    }
  };

  return (
    <div className="pagination" data-testid="pagination">
      <PaginationList
        currentPage={currentPage}
        totalPages={totalPages}
        paginationRange={paginationRange}
        createPageUrl={createPageUrl}
        onPageClick={handlePageClick}
      />
    </div>
  );
}

export default Pagination;
