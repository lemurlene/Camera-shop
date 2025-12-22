import { memo } from 'react';
import { useModal } from '../../contexts';

function ButtonAddComment(): JSX.Element {

  const { openModal } = useModal();

  const handleButtonClick = () => {
    openModal('add-review');
  };

  return (
    <button
      className='btn'
      type="button"
      onClick={handleButtonClick}
    >
      Оставить свой отзыв
    </button>
  );
}

const ButtonAddCommentMemo = memo(ButtonAddComment);

export default ButtonAddCommentMemo;
