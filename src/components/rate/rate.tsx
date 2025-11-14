import { memo } from 'react';
import { renderRatingStars } from './utils.tsx';

type GetRatingStarsProps = {
  rating: number;
  reviewCount: number;
  classPrefix: string;
}

function Rate({ rating, reviewCount, classPrefix }: GetRatingStarsProps): JSX.Element {
  const ratingStars = renderRatingStars(rating);
  return (
    <div className={`rate ${classPrefix}__rate`} data-testid="rating-stars">
      {ratingStars}
      <p className="visually-hidden">Рейтинг: {rating}</p>
      <p className="rate__count">
        <span className="visually-hidden">
          Всего оценок:
        </span>
        {reviewCount}
      </p>
    </div >
  );
}

const RateMemo = memo(Rate);

export default RateMemo;
