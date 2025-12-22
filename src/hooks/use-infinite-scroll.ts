import { useEffect } from 'react';

type UseInfiniteScrollProps = {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
};

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 500
}: UseInfiniteScrollProps): void {
  useEffect(() => {
    if (!hasMore) {
      return;
    }

    const handlePageScroll = () => {
      if (isLoading) {
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (documentHeight - (scrollTop + windowHeight) < threshold) {
        onLoadMore();
      }
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handlePageScroll, 100);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);
}
