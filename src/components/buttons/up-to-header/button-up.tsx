import { memo } from 'react';

function ButtonUp() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <a
      className="up-btn"
      href="#header"
      onClick={(e) => {
        e.preventDefault();
        scrollToTop();
      }}
    >
      <svg width="12" height="18" aria-hidden="true">
        <use xlinkHref="#icon-arrow2"></use>
      </svg>
    </a>
  );
}

const ButtonUpMemo = memo(ButtonUp);

export default ButtonUpMemo;
