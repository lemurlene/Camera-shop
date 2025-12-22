import { usePagination } from '../../hooks';
import { useUrl } from '../../contexts';
import PaginationList from './pagination-list';
import { Setting } from '../../const/const';

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
}

function Pagination({ totalItems, itemsPerPage = Setting.MaxProductQuantity }: PaginationProps): JSX.Element | null {
  const {
    currentPage,
    totalPages,
    pages,
    showPrev,
    showNext,
    prevTargetPage,
    nextTargetPage,
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

    const sp = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((v) => sp.append(key, v));
      } else {
        sp.set(key, value);
      }
    });

    const qs = sp.toString();
    return qs ? `?${qs}` : '?';
  };

  const handlePageClick = (page: number) => {
    setParams({ page: page === 1 ? null : page.toString() });
  };

  return (
    <div className="pagination" data-testid="pagination">
      <PaginationList
        currentPage={currentPage}
        pages={pages}
        showPrev={showPrev}
        showNext={showNext}
        prevTargetPage={prevTargetPage}
        nextTargetPage={nextTargetPage}
        createPageUrl={createPageUrl}
        onPageClick={handlePageClick}
      />
    </div>
  );
}

export default Pagination;
