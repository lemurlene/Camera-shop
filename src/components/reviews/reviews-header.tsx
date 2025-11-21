function ReviewsHeader(): JSX.Element {
  return (
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
  );
}

export default ReviewsHeader;
