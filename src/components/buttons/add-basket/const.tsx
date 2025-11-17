export const ButtonAddBasketConfig = {
  AddToCart: {
    buttonModalClass: ' modal__btn modal__btn--fit-width',
    buttonText: 'Добавить в корзину',
    buttonIcon: (
      <svg width="24" height="16" aria-hidden="true">
        <use xlinkHref="#icon-add-basket"> </use>
      </svg>
    ),
  },
  InCart: {
    buttonModalClass: ' modal__btn modal__btn--fit-width',
    buttonText: 'Перейти в корзину',
    buttonIcon: '',
  }
};
