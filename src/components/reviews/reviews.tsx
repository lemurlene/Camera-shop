import { useState } from 'react';
import dayjs from 'dayjs';
import Review from './review';
import { ReviewType } from '../../const/type';
import { Setting } from '../../const/const';

type GetReviewProps = {
  comments: ReviewType[];
}

function Reviews({ comments }: GetReviewProps): JSX.Element {
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(Setting.MaxShowReviews);

  const sortedReviews = [...comments].sort((a: ReviewType, b: ReviewType) =>
    dayjs(b.createAt).diff(dayjs(a.createAt))
  );

  const visibleReviews = sortedReviews.slice(0, visibleReviewsCount);
  const hasMoreReviews = visibleReviewsCount < comments.length;
  const handleShowMore = () => {
    const remainingReviews = comments.length - visibleReviewsCount;
    const nextCount = remainingReviews >= Setting.MaxShowReviews
      ? visibleReviewsCount + Setting.MaxShowReviews
      : comments.length;

    setVisibleReviewsCount(nextCount);
  };

  return (
    <section className="review-block">
      <div className="container">
        <div className="page-content__headed">
          <h2 className="title title--h3">Отзывы</h2>
          <button
            className="btn"
            type="button"
            disabled
          >
            Оставить свой отзыв
          </button>
        </div>
        <ul className="review-block__list">
          {visibleReviews.map((review) => (
            <Review key={review.id} {...review} />
          ))}
        </ul>
        {hasMoreReviews && (
          <div className="review-block__buttons">
            <button
              className="btn btn--purple"
              type="button"
              onClick={handleShowMore}
            >
              Показать больше отзывов
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Reviews;
