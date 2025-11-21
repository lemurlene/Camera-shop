import Review from './review';
import { ReviewType } from '../../const/type';

type ReviewsListProps = {
  reviews: ReviewType[];
}

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  return (
    <ul className="review-block__list">
      {reviews.map((review) => (
        <Review key={review.id} {...review} />
      ))}
    </ul>
  );
}

export default ReviewsList;
