import React from 'react';
import { Modal } from './modal';
import { useModal } from '../../contexts';
import FormReview from '../form-review';

export const ReviewModal: React.FC = () => {
  const { closeModal } = useModal();

  return (
    <Modal onClose={closeModal}>
      <p className="title title--h4">Оставить отзыв</p>
      <FormReview />
    </Modal>
  );
};
