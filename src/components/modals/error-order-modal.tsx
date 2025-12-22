import React from 'react';
import { Modal } from './modal';
import { useModal } from '../../contexts';
import { ButtonContinueShoppingMemo } from '../buttons';
import { resetOrder } from '../../store/order/order.slice';
import { useAppDispatch } from '../../hooks';

type ErrorOrderModalProps = {
  error: string;
};

export const ErrorOrderModal: React.FC<ErrorOrderModalProps> = ({ error }) => {
  const { closeModal } = useModal();
  const dispatch = useAppDispatch();

  const handleButtonRetry = () => {
    dispatch(resetOrder());
    closeModal();
  };


  return (
    <Modal onClose={closeModal}>
      <p className="title title--h4"> {error}</p>
      <div className="modal__buttons">
        <button
          className="btn btn--purple modal__btn"
          type="button"
          onClick={handleButtonRetry}
        >
          Попробовать снова
        </button>
        <ButtonContinueShoppingMemo />
      </div>
    </Modal>
  );
};
