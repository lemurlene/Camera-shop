import PaginationItem from './pagination-item';
import PaginationNavButton from './pagination-nav-button';

interface PaginationListProps {
  currentPage: number;
  pages: number[];

  showPrev: boolean;
  showNext: boolean;
  prevTargetPage: number;
  nextTargetPage: number;

  createPageUrl: (page: number) => string;
  onPageClick: (page: number) => void;
}

function PaginationList({
  currentPage,
  pages,
  showPrev,
  showNext,
  prevTargetPage,
  nextTargetPage,
  createPageUrl,
  onPageClick,
}: PaginationListProps): JSX.Element {
  return (
    <ul className="pagination__list">
      {showPrev && (
        <PaginationNavButton
          type="prev"
          targetPage={prevTargetPage}
          createPageUrl={createPageUrl}
          onPageClick={onPageClick}
        />
      )}

      {pages.map((p) => (
        <PaginationItem
          key={`page-${p}`}
          page={p}
          currentPage={currentPage}
          createPageUrl={createPageUrl}
          onPageClick={onPageClick}
        />
      ))}

      {showNext && (
        <PaginationNavButton
          type="next"
          targetPage={nextTargetPage}
          createPageUrl={createPageUrl}
          onPageClick={onPageClick}
        />
      )}
    </ul>
  );
}

export default PaginationList;
