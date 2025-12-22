import { useMemo, useEffect } from 'react';
import { useUrl } from '../contexts';
import { Setting } from '../const/const';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
}

const maxPaginationLink = Setting.MaxPaginationLink;

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const usePagination = ({ totalItems, itemsPerPage = Setting.MaxProductQuantity }: UsePaginationProps) => {
  const { getParam, setParam } = useUrl();

  const rawCurrentPage = Number(getParam('page')) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentPage = useMemo(() => {
    if (totalPages <= 0) {
      return 1;
    }
    return clamp(rawCurrentPage, 1, totalPages);
  }, [rawCurrentPage, totalPages]);

  useEffect(() => {
    if (totalPages > 0 && rawCurrentPage > totalPages) {
      setParam('page', totalPages === 1 ? null : totalPages.toString());
    }
  }, [rawCurrentPage, totalPages, setParam]);

  const windowStart = useMemo(() => {
    if (totalPages <= maxPaginationLink) {
      return 1;
    }

    if (currentPage <= maxPaginationLink) {
      return 1;
    }

    const proposed = currentPage - 1;

    return clamp(proposed, 1, totalPages - 2);
  }, [currentPage, totalPages]);

  const pages = useMemo(() => {
    if (totalPages <= 0) {
      return [];
    }
    if (totalPages <= maxPaginationLink) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [windowStart, windowStart + 1, windowStart + 2];
  }, [totalPages, windowStart]);

  const showNext = totalPages > maxPaginationLink && windowStart + 2 < totalPages;
  const showPrev = totalPages > maxPaginationLink && windowStart > 1;

  const nextTargetPage = windowStart + maxPaginationLink;

  const prevTargetPage = windowStart - 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const setPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setParam('page', page === 1 ? null : page.toString());
  };

  return {
    currentPage,
    totalPages,
    pages,
    showPrev,
    showNext,
    prevTargetPage,
    nextTargetPage,
    setPage,
    itemsPerPage,
    startIndex,
    endIndex,
  };
};
