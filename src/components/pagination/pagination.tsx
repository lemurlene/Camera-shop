import { Link } from 'react-router-dom';
import { usePagination } from '../../hooks';
import { useUrl } from '../../contexts';

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

  let dotsCounter = 0;

  return (
    <div className="pagination" data-testid="pagination">
      <ul className="pagination__list">
        {currentPage > 1 && (
          <li className="pagination__item">
            <Link
              className="pagination__link pagination__link--text"
              to={createPageUrl(currentPage - 1)}
              onClick={() => handlePageClick(currentPage - 1)}
            >
              Назад
            </Link>
          </li>
        )}
        {paginationRange.map((page) => {
          if (page === '...') {
            dotsCounter += 1;
            return (
              <li key={`dots-${dotsCounter}`} className="pagination__item">
                <span className="pagination__link pagination__link--text">...</span>
              </li>
            );
          }
          const pageNumber = page as number;
          return (
            <li key={`page-${pageNumber}`} className="pagination__item">
              <Link
                className={`pagination__link ${currentPage === pageNumber ? 'pagination__link--active' : ''}`}
                to={createPageUrl(pageNumber)}
                onClick={() => handlePageClick(pageNumber)}
              >
                {pageNumber}
              </Link>
            </li>
          );
        })}
        {currentPage < totalPages && (
          <li className="pagination__item">
            <Link
              className="pagination__link pagination__link--text"
              to={createPageUrl(currentPage + 1)}
              onClick={() => handlePageClick(currentPage + 1)}
            >
              Далее
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Pagination;
