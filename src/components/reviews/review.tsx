import { ReviewType } from '../../const/type';
import { formatedDate } from './utils';
import { renderRatingStars } from '../rate/utils';

function Review(coment: ReviewType): JSX.Element {
  const {
    createAt,
    userName,
    advantage,
    disadvantage,
    review,
    rating
  } = coment;
  return (
    <li className="review-card">
      <div className="review-card__head">
        <p className="title title--h4">{userName}</p>
        <time className="review-card__data"
          dateTime={createAt}
        >
          {formatedDate(createAt)}
        </time>
      </div>
      <div className="rate review-card__rate">
        {renderRatingStars(rating)}
      </div>
      <ul className="review-card__list">
        <li className="item-list"><span className="item-list__title">Достоинства:</span>
          <p className="item-list__text">{advantage}</p>
        </li>
        <li className="item-list"><span className="item-list__title">Недостатки:</span>
          <p className="item-list__text">{disadvantage}</p>
        </li>
        <li className="item-list"><span className="item-list__title">Комментарий:</span>
          <p className="item-list__text">{review}</p>
        </li>
      </ul>
    </li >
  );
}

export default Review;
