import { describe, it, expect, vi, beforeEach, MockedFunction } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Reviews from './reviews';
import { ReviewType } from '../../const/type';
import { useReviewsPagination, useInfiniteScroll } from '../../hooks';
import { sortReviewsByDate, getVisibleReviews } from './utils';

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
        <div key={review.id} data-testid={`review-${review.id}`}>
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
  const mockComments: ReviewType[] = [
    {
      id: '1',
      createAt: '2024-01-15T10:00:00.000Z',
      userName: 'User1',
      advantage: 'advantage1',
      disadvantage: 'disadvantage1',
      review: 'review1',
      rating: 4,
      cameraId: 1,
    },
    {
      id: '2',
      createAt: '2024-01-20T10:00:00.000Z',
      userName: 'User2',
      advantage: 'advantage2',
      disadvantage: 'disadvantage2',
      review: 'review2',
      rating: 5,
      cameraId: 1,
    },
  ];

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
      render(<Reviews comments={mockComments} />);

      expect(screen.getByTestId('reviews-header')).toBeInTheDocument();
      expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
      expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
      expect(screen.getByTestId('scroll-sentinel')).toBeInTheDocument();
    });

    it('should render correct number of reviews', () => {
      render(<Reviews comments={mockComments} />);

      expect(screen.getByTestId('review-1')).toBeInTheDocument();
      expect(screen.getByTestId('review-2')).toBeInTheDocument();
    });

    it('should render section with correct class name', () => {
      render(<Reviews comments={mockComments} />);

      const section = screen.getByTestId('reviews-section');
      expect(section).toHaveClass('review-block');
    });
  });

  describe('hooks integration', () => {
    it('should call useReviewsPagination with correct arguments', () => {
      render(<Reviews comments={mockComments} />);

      expect(mockUseReviewsPagination).toHaveBeenCalledWith({
        comments: mockComments,
      });
    });

    it('should call useInfiniteScroll with correct arguments', () => {
      render(<Reviews comments={mockComments} />);

      expect(mockUseInfiniteScroll).toHaveBeenCalledWith({
        hasMore: defaultPaginationProps.hasMoreReviews,
        isLoading: defaultPaginationProps.isLoading,
        onLoadMore: defaultPaginationProps.handleShowMore,
        threshold: 500,
      });
    });

    it('should call sortReviewsByDate and getVisibleReviews with correct arguments', () => {
      const sortedReviews: ReviewType[] = [...mockComments].reverse();
      mockSortReviewsByDate.mockReturnValue(sortedReviews);

      render(<Reviews comments={mockComments} />);

      expect(mockSortReviewsByDate).toHaveBeenCalledWith(mockComments);
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

      render(<Reviews comments={mockComments} />);

      const loadMoreButton = screen.getByTestId('load-more-button');
      expect(loadMoreButton).not.toBeDisabled();
    });

    it('should disable load more button when hasMoreReviews is false', () => {
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        hasMoreReviews: false,
      });

      render(<Reviews comments={mockComments} />);

      const loadMoreButton = screen.getByTestId('load-more-button');
      expect(loadMoreButton).toBeDisabled();
    });

    it('should disable load more button when isLoading is true', () => {
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        isLoading: true,
      });

      render(<Reviews comments={mockComments} />);

      const loadMoreButton = screen.getByTestId('load-more-button');
      expect(loadMoreButton).toBeDisabled();
    });

    it('should call handleShowMore when load more button is clicked', () => {
      const mockHandleShowMore = vi.fn();
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        handleShowMore: mockHandleShowMore,
      });

      render(<Reviews comments={mockComments} />);

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

      render(<Reviews comments={mockComments} />);

      const scrollSentinel = screen.getByTestId('scroll-sentinel');
      expect(scrollSentinel).toHaveAttribute('data-visible', 'true');
    });

    it('should render scroll sentinel with correct props when hasMoreReviews is false', () => {
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        hasMoreReviews: false,
      });

      render(<Reviews comments={mockComments} />);

      const scrollSentinel = screen.getByTestId('scroll-sentinel');
      expect(scrollSentinel).toHaveAttribute('data-visible', 'false');
    });

    it('should call handleShowMore when scroll sentinel is clicked', () => {
      const mockHandleShowMore = vi.fn();
      mockUseReviewsPagination.mockReturnValue({
        ...defaultPaginationProps,
        handleShowMore: mockHandleShowMore,
      });

      render(<Reviews comments={mockComments} />);

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
      expect(screen.queryByTestId('review-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('review-2')).not.toBeInTheDocument();
    });

    it('should handle single review', () => {
      const singleComment: ReviewType[] = [mockComments[0]];
      const singlePaginationProps: PaginationReturnType = {
        visibleReviewsCount: 1,
        isLoading: false,
        hasMoreReviews: false,
        handleShowMore: vi.fn(),
        setVisibleReviewsCount: vi.fn(),
      };

      mockUseReviewsPagination.mockReturnValue(singlePaginationProps);
      mockGetVisibleReviews.mockReturnValue([mockComments[0]]);

      render(<Reviews comments={singleComment} />);

      expect(screen.getByTestId('review-1')).toBeInTheDocument();
      expect(screen.queryByTestId('review-2')).not.toBeInTheDocument();
    });
  });

  describe('integration with utility functions', () => {
    it('should pass sorted reviews to getVisibleReviews', () => {
      const sortedReviews: ReviewType[] = [...mockComments].reverse();
      mockSortReviewsByDate.mockReturnValue(sortedReviews);

      render(<Reviews comments={mockComments} />);

      expect(mockGetVisibleReviews).toHaveBeenCalledWith(
        sortedReviews,
        defaultPaginationProps.visibleReviewsCount
      );
    });

    it('should pass visible reviews to ReviewsList', () => {
      const visibleReviews: ReviewType[] = [mockComments[0]];
      mockGetVisibleReviews.mockReturnValue(visibleReviews);

      render(<Reviews comments={mockComments} />);

      expect(screen.getByTestId('review-1')).toBeInTheDocument();
      expect(screen.queryByTestId('review-2')).not.toBeInTheDocument();
    });
  });
});
