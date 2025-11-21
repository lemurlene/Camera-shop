type NavigationButtonProps = {
  direction: 'prev' | 'next';
}

function NavigationButton({ direction }: NavigationButtonProps): JSX.Element {
  const label = direction === 'prev' ? 'Предыдущий слайд' : 'Следующий слайд';

  return (
    <button
      className={`slider-controls slider-controls--${direction}`}
      type="button"
      aria-label={label}
    >
      <svg width="7" height="12" aria-hidden="true">
        <use xlinkHref="#icon-arrow"></use>
      </svg>
    </button>
  );
}

export default NavigationButton;
