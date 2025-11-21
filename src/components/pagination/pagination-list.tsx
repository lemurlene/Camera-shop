import PaginationItem from './pagination-item';
import PaginationNavButton from './pagination-nav-button';

interface PaginationListProps {
  currentPage: number;
  totalPages: number;
  paginationRange: (number | string)[];
  createPageUrl: (page: number) => string;
  onPageClick: (page: number) => void;
}

function PaginationList({
  currentPage,
  totalPages,
  paginationRange,
  createPageUrl,
  onPageClick
}: PaginationListProps): JSX.Element {
  let dotsCounter = 0;

  return (
    <ul className="pagination__list">
      {currentPage > 1 && (
        <PaginationNavButton
          type="prev"
          targetPage={currentPage - 1}
          createPageUrl={createPageUrl}
          onPageClick={onPageClick}
        />
      )}

      {paginationRange.map((page) => {
        if (page === '...') {
          dotsCounter += 1;
        }

        return (
          <PaginationItem
            key={page === '...' ? `dots-${dotsCounter}` : `page-${page}`}
            page={page}
            currentPage={currentPage}
            createPageUrl={createPageUrl}
            onPageClick={onPageClick}
          />
        );
      })}

      {currentPage < totalPages && (
        <PaginationNavButton
          type="next"
          targetPage={currentPage + 1}
          createPageUrl={createPageUrl}
          onPageClick={onPageClick}
        />
      )}
    </ul>
  );
}

export default PaginationList;
