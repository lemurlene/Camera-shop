import { useMemo, useEffect } from 'react';
import { useUrl } from '../contexts';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  siblingCount?: number;
}

export const usePagination = ({
  totalItems,
  itemsPerPage = 9,
  siblingCount = 1
}: UsePaginationProps) => {
  const { getParam, setParam } = useUrl();

  const rawCurrentPage = Number(getParam('page')) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentPage = useMemo(() => {
    if (totalPages === 0) {
      return 1;
    }
    return Math.min(rawCurrentPage, totalPages);
  }, [rawCurrentPage, totalPages]);

  const correctedPage = useMemo(() => {
    if (totalPages > 0 && rawCurrentPage > totalPages) {
      return totalPages;
    }
    return rawCurrentPage;
  }, [rawCurrentPage, totalPages]);

  useEffect(() => {
    if (correctedPage !== rawCurrentPage) {
      setParam('page', correctedPage === 1 ? null : correctedPage.toString());
    }
  }, [correctedPage, rawCurrentPage, setParam]);

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setParam('page', page === 1 ? null : page.toString());
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const paginationRange = useMemo(() => {
    if (totalPages <= 1) {
      return [];
    }

    const totalPageNumbers = siblingCount * 2 + 3;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [...Array.from({ length: leftItemCount }, (_, i) => i + 1), '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [1, '...', ...Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1)];
    }

    return [1, '...', ...Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i), '...', totalPages];
  }, [totalPages, currentPage, siblingCount]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  }, [currentPage, itemsPerPage]);

  return {
    currentPage,
    totalPages,
    setPage,
    nextPage,
    prevPage,
    paginationRange,
    itemsPerPage,
    ...currentItems
  };
};
