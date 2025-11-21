import dayjs from 'dayjs';
import { ReviewType } from '../../const/type';

export const formatedDate = (serverDate: string): string => {
  const date = new Date(serverDate);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long'
  });
};

export function sortReviewsByDate(reviews: ReviewType[]): ReviewType[] {
  return [...reviews].sort((a: ReviewType, b: ReviewType) =>
    dayjs(b.createAt).diff(dayjs(a.createAt))
  );
}

export function getVisibleReviews(
  reviews: ReviewType[],
  visibleCount: number
): ReviewType[] {
  return reviews.slice(0, visibleCount);
}
