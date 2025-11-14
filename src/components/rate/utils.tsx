import { Setting } from '../../const/const';

export const renderRatingStars = (ratingValue: number) =>
  Array.from({ length: Setting.MaxRatingStars }, (_, index) => {
    const starNumber = index + 1;
    const isFullStar = starNumber <= ratingValue;
    const icon = isFullStar ? '#icon-full-star' : '#icon-star';

    return (
      <svg key={starNumber} width="17" height="16" aria-hidden="true">
        <use xlinkHref={icon}></use>
      </svg>
    );
  });
