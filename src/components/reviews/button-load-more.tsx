type ButtonLoadMoreProps = {
  hasMoreReviews: boolean;
  isLoading: boolean;
  onShowMore: () => void;
}

function ButtonLoadMore({
  hasMoreReviews,
  isLoading,
  onShowMore
}: ButtonLoadMoreProps): JSX.Element | null {
  if (!hasMoreReviews) {
    return null;
  }

  return (
    <div className="review-block__buttons">
      <button
        className={`btn btn--purple ${isLoading ? 'disabled' : ''}`}
        type="button"
        onClick={onShowMore}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            Загрузка...
          </>
        ) : (
          'Показать больше отзывов'
        )}
      </button>
    </div>
  );
}

export default ButtonLoadMore;
