import { useModal } from '../../contexts';
import { Modal } from './modal';
import { ButtonContinueShoppingMemo, ButtonGoBasketMemo } from '../buttons';

export const SuccessAddCartModal: React.FC = () => {
  const { closeModal } = useModal();

  return (
    <Modal narrow onClose={closeModal}>
      <p className="title title--h4">Товар успешно добавлен в корзину</p>
      <svg className="modal__icon" width="86" height="80" aria-hidden="true">
        <use xlinkHref="#icon-success"></use>
      </svg>
      <div className="modal__buttons">
        <ButtonContinueShoppingMemo />
        <ButtonGoBasketMemo />
      </div>
    </Modal>
  );
};
