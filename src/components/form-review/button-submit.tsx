type ButtonSubmitProps = {
  isDisabled: boolean;
}

function ButtonSubmit({ isDisabled }: ButtonSubmitProps): JSX.Element {
  return (
    <button
      className="btn btn--purple form-review__btn"
      type="submit"
      disabled={isDisabled}
    >
      Отправить отзыв
    </button>
  );
}

export default ButtonSubmit;
