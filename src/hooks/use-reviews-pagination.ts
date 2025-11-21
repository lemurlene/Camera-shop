import { useState, useCallback } from 'react';
import { ReviewType } from '../const/type';
import { Setting } from '../const/const';

type UseReviewsPaginationProps = {
  comments: ReviewType[];
};

export function useReviewsPagination({ comments }: UseReviewsPaginationProps) {
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(Setting.MaxShowReviews);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hasMoreReviews = visibleReviewsCount < comments.length;

  const handleShowMore = useCallback(() => {
    if (isLoading || !hasMoreReviews) {
      return;
    }

    setIsLoading(true);

    const scrollYBefore = window.scrollY;
    const clientHeightBefore = document.documentElement.clientHeight;

    const remainingReviews = comments.length - visibleReviewsCount;
    const nextCount = remainingReviews >= Setting.MaxShowReviews
      ? visibleReviewsCount + Setting.MaxShowReviews
      : comments.length;

    setTimeout(() => {
      setVisibleReviewsCount(nextCount);

      setTimeout(() => {
        const clientHeightAfter = document.documentElement.clientHeight;
        const heightDiff = clientHeightAfter - clientHeightBefore;

        if (heightDiff > 0) {
          window.scrollTo({
            top: scrollYBefore,
            behavior: 'auto'
          });
        }

        setIsLoading(false);
      }, 50);
    }, 200);
  }, [visibleReviewsCount, comments.length, isLoading, hasMoreReviews]);

  return {
    visibleReviewsCount,
    isLoading,
    hasMoreReviews,
    handleShowMore,
    setVisibleReviewsCount
  };
}
