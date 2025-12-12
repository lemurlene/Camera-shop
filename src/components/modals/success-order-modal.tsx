import React from 'react';
import { Modal } from './modal';
import { useModal } from '../../contexts';
import { ButtonContinueShoppingMemo } from '../buttons';

export const SuccessOrderModal: React.FC = () => {
  const { closeModal } = useModal();

  return (
    <Modal onClose={closeModal}>
      <p className="title title--h4">Спасибо за покупку</p>
      <svg className="modal__icon" width="80" height="78" aria-hidden="true">
        <use xlinkHref="#icon-review-success"></use>
      </svg>
      <div className="modal__buttons">
        <ButtonContinueShoppingMemo />
      </div>
    </Modal>
  );
};
