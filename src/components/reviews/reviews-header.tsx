import ButtonAddCommentMemo from './button-add-comment';

function ReviewsHeader(): JSX.Element {
  return (
    <div className="page-content__headed">
      <h2 className="title title--h3">Отзывы</h2>
      <ButtonAddCommentMemo />
    </div>
  );
}

export default ReviewsHeader;
