import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Reviews from './reviews';
import { ReviewType } from '../../const/type';
import { useReviewsPagination, useInfiniteScroll } from '../../hooks';
import { sortReviewsByDate, getVisibleReviews } from './utils';
import { mockReviews } from '../../mocks/mock-reviews';

vi.mock('../../hooks', () => ({
  useReviewsPagination: vi.fn(),
  useInfiniteScroll: vi.fn(),
}));

vi.mock('./utils', () => ({
  sortReviewsByDate: vi.fn(),
  getVisibleReviews: vi.fn(),
}));

vi.mock('./reviews-list', () => ({
  default: vi.fn(({ reviews }: { reviews: ReviewType[] }) => (
    <div data-testid="reviews-list">
      {reviews.map((review: ReviewType) => (
        <div key={review.id} data-testid={review.id}>
          {review.userName}
        </div>
      ))}
    </div>
  )),
}));

vi.mock('./reviews-header', () => ({
  default: vi.fn(() => <div data-testid="reviews-header">Reviews Header</div>),
}));

vi.mock('./button-load-more', () => ({
  default: vi.fn(({
    hasMoreReviews,
    isLoading,
    onShowMore
  }: {
    hasMoreReviews: boolean;
    isLoading: boolean;
    onShowMore: () => void;
  }) => (
    <button
      data-testid="load-more-button"
      disabled={!hasMoreReviews || isLoading}
      onClick={onShowMore}
    >
      {isLoading ? 'Loading...' : 'Load More'}
    </button>
  )),
}));

vi.mock('./scroll-sentinel', () => ({
  default: vi.fn(({
    isVisible,
    onIntersect
  }: {
    isVisible: boolean;
    onIntersect: () => void;
  }) => (
    <div
      data-testid="scroll-sentinel"
      data-visible={isVisible}
      onClick={onIntersect}
    >
      Scroll Sentinel
    </div>
  )),
}));

const mockUseReviewsPagination = useReviewsPagination as MockedFunction<typeof useReviewsPagination>;
const mockUseInfiniteScroll = useInfiniteScroll as MockedFunction<typeof useInfiniteScroll>;
const mockSortReviewsByDate = sortReviewsByDate as MockedFunction<typeof sortReviewsByDate>;
const mockGetVisibleReviews = getVisibleReviews as MockedFunction<typeof getVisibleReviews>;

interface PaginationReturnType {
  visibleReviewsCount: number;
  isLoading: boolean;
  hasMoreReviews: boolean;
  handleShowMore: () => void;
  setVisibleReviewsCount: React.Dispatch<React.SetStateAction<number>>;
}

describe('Reviews', () => {
  const defaultPaginationProps: PaginationReturnType = {
    visibleReviewsCount: 2,
    isLoading: false,
    hasMoreReviews: true,
    handleShowMore: vi.fn(),
    setVisibleReviewsCount: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseReviewsPagination.mockReturnValue(defaultPaginationProps);
    mockUseInfiniteScroll.mockReturnValue(undefined);

    mockSortReviewsByDate.mockImplementation((reviews: ReviewType[]) =>
      [...reviews].sort((a, b) =>
        new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      )
    );

    mockGetVisibleReviews.mockImplementation((reviews: ReviewType[], count: number) =>
      reviews.slice(0, count)
    );
  });

  describe('component rendering', () => {
    it('should render all main components', () => {
      render(<Reviews comments={mockReviews} />);

      expect(screen.getByTestId('reviews-header')).toBeInTheDocument();
      expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
      expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
      expect(screen.getByTestId('scroll-sentinel')).toBeInTheDocument();
    });

    it('should render correct number of reviews', () => {

      render(<Reviews comments={[mockReviews[0], mockReviews[1]]} />);

      expect(screen.getByTestId('a0a22b2b-67e7-4d89-a696-6e3fb8cea5c7')).toBeInTheDocument();
      expect(screen.getByTestId('2fa729cc-8977-4e46-abd3-c326474a7480')).toBeInTheDocument();
    });

    it('should render section with correct class name', () => {
      render(<Reviews comments={mockReviews} />);

      const section = screen.getByTestId('reviews-section');
      expect(section).toHaveClass('review-block');
    });
  });

  describe('hooks integration', () => {
    it('should call useReviewsPagination with correct arguments', () => {
      render(<Reviews comments={mockReviews} />);

      expect(mockUseReviewsPagination).toHaveBeenCalledWith({
        comments: mockReviews,
      });
    });

    it('should call useInfiniteScroll with correct arguments', () => {
      render(<Reviews comments={mockReviews} />);

      expect(mockUseInfiniteScroll).toHaveBeenCalledWith({
        hasMore: defaultPaginationProps.hasMoreReviews,
        isLoading: defaultPaginationProps.isLoading,
        onLoadMore: defaultPaginationProps.handleShowMore,
        threshold: 500,
      });
    });

    it('should call sortReviewsByDate and getVisibleReviews with correct arguments', () => {
      const sortedReviews: ReviewType[] = [...mockReviews].reverse();
      mockSortReviewsByDate.mockReturnValue(sortedReviews);

      render(<Reviews comments={mockReviews} />);

      expect(mockSortReviewsByDate).toHaveBeenCalledWith(mockReviews);
      expect(mockGetVisibleReviews).toHaveBeenCalledWith(
        sortedReviews,
        defaultPaginationProps.visibleReviewsCount
      );
    });
  });

  describe('pagination functionality', () => {
    it('should show load more button when hasMoreReviews is true', () => {
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        hasMoreReviews: true,
      });

      render(<Reviews comments={mockReviews} />);

      const loadMoreButton = screen.getByTestId('load-more-button');
      expect(loadMoreButton).not.toBeDisabled();
    });

    it('should disable load more button when hasMoreReviews is false', () => {
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        hasMoreReviews: false,
      });

      render(<Reviews comments={mockReviews} />);

      const loadMoreButton = screen.getByTestId('load-more-button');
      expect(loadMoreButton).toBeDisabled();
    });

    it('should disable load more button when isLoading is true', () => {
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        isLoading: true,
      });

      render(<Reviews comments={mockReviews} />);

      const loadMoreButton = screen.getByTestId('load-more-button');
      expect(loadMoreButton).toBeDisabled();
    });

    it('should call handleShowMore when load more button is clicked', () => {
      const mockHandleShowMore = vi.fn();
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        handleShowMore: mockHandleShowMore,
      });

      render(<Reviews comments={mockReviews} />);

      const loadMoreButton = screen.getByTestId('load-more-button');
      fireEvent.click(loadMoreButton);

      expect(mockHandleShowMore).toHaveBeenCalledTimes(1);
    });
  });

  describe('scroll sentinel', () => {
    it('should render scroll sentinel with correct props when hasMoreReviews is true', () => {
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        hasMoreReviews: true,
      });

      render(<Reviews comments={mockReviews} />);

      const scrollSentinel = screen.getByTestId('scroll-sentinel');
      expect(scrollSentinel).toHaveAttribute('data-visible', 'true');
    });

    it('should render scroll sentinel with correct props when hasMoreReviews is false', () => {
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        hasMoreReviews: false,
      });

      render(<Reviews comments={mockReviews} />);

      const scrollSentinel = screen.getByTestId('scroll-sentinel');
      expect(scrollSentinel).toHaveAttribute('data-visible', 'false');
    });

    it('should call handleShowMore when scroll sentinel is clicked', () => {
      const mockHandleShowMore = vi.fn();
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        handleShowMore: mockHandleShowMore,
      });

      render(<Reviews comments={mockReviews} />);

      const scrollSentinel = screen.getByTestId('scroll-sentinel');
      fireEvent.click(scrollSentinel);

      expect(mockHandleShowMore).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should handle empty comments array', () => {
      const emptyPaginationProps: PaginationReturnType = {
        visibleReviewsCount: 0,
        isLoading: false,
        hasMoreReviews: false,
        handleShowMore: vi.fn(),
        setVisibleReviewsCount: vi.fn(),
      };

      mockUseReviewsPagination.mockReturnValue(emptyPaginationProps);
      mockGetVisibleReviews.mockReturnValue([]);

      render(<Reviews comments={[]} />);

      expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
      expect(screen.queryByTestId('a0a22b2b-67e7-4d89-a696-6e3fb8cea5c7')).not.toBeInTheDocument();
      expect(screen.queryByTestId('2fa729cc-8977-4e46-abd3-c326474a7480')).not.toBeInTheDocument();
    });

    it('should handle single review', () => {
      const singleComment: ReviewType[] = [mockReviews[0]];
      const singlePaginationProps: PaginationReturnType = {
        visibleReviewsCount: 1,
        isLoading: false,
        hasMoreReviews: false,
        handleShowMore: vi.fn(),
        setVisibleReviewsCount: vi.fn(),
      };

      mockUseReviewsPagination.mockReturnValue(singlePaginationProps);
      mockGetVisibleReviews.mockReturnValue([mockReviews[0]]);

      render(<Reviews comments={singleComment} />);

      expect(screen.getByTestId('a0a22b2b-67e7-4d89-a696-6e3fb8cea5c7')).toBeInTheDocument();
      expect(screen.queryByTestId('2fa729cc-8977-4e46-abd3-c326474a748')).not.toBeInTheDocument();
    });
  });

  describe('integration with utility functions', () => {
    it('should pass sorted reviews to getVisibleReviews', () => {
      const sortedReviews: ReviewType[] = [...mockReviews].reverse();
      mockSortReviewsByDate.mockReturnValue(sortedReviews);

      render(<Reviews comments={mockReviews} />);

      expect(mockGetVisibleReviews).toHaveBeenCalledWith(
        sortedReviews,
        defaultPaginationProps.visibleReviewsCount
      );
    });

    it('should pass visible reviews to ReviewsList', () => {
      const visibleReviews: ReviewType[] = [mockReviews[0]];
      mockGetVisibleReviews.mockReturnValue(visibleReviews);

      render(<Reviews comments={[mockReviews[0], mockReviews[1]]} />);

      expect(screen.getByTestId('a0a22b2b-67e7-4d89-a696-6e3fb8cea5c7')).toBeInTheDocument();
      expect(screen.queryByTestId('2fa729cc-8977-4e46-abd3-c326474a7480')).not.toBeInTheDocument();
    });
  });
});
