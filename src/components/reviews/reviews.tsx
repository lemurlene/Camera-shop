import { ReviewType } from '../../const/type';
import ReviewsList from './reviews-list';
import ReviewsHeader from './reviews-header';
import ButtonLoadMore from './button-load-more';
import ScrollSentinel from './scroll-sentinel';
import { useReviewsPagination, useInfiniteScroll } from '../../hooks';
import { sortReviewsByDate, getVisibleReviews } from './utils';

type GetReviewProps = {
  comments: ReviewType[];
}

function Reviews({ comments }: GetReviewProps): JSX.Element {
  const {
    visibleReviewsCount,
    isLoading,
    hasMoreReviews,
    handleShowMore
  } = useReviewsPagination({ comments });

  useInfiniteScroll({
    hasMore: hasMoreReviews,
    isLoading,
    onLoadMore: handleShowMore,
    threshold: 500
  });

  const sortedReviews = sortReviewsByDate(comments);
  const visibleReviews = getVisibleReviews(sortedReviews, visibleReviewsCount);

  return (
    <section className="review-block" data-testid="reviews-section">
      <div className="container">
        <ReviewsHeader />
        <ReviewsList reviews={visibleReviews} />
        <ScrollSentinel isVisible={hasMoreReviews} onIntersect={handleShowMore} />
        <ButtonLoadMore
          hasMoreReviews={hasMoreReviews}
          isLoading={isLoading}
          onShowMore={handleShowMore}
        />
      </div>
    </section>
  );
}

export default Reviews;
